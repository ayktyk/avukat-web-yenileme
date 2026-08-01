type FrontmatterRecord = Record<string, string>;

const stripMatchingQuotes = (value: string) => {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
};

const isFrontmatterKeyLine = (line: string) => /^[A-Za-z0-9_]+:\s*/.test(line);

const isQuotedValueClosed = (value: string) => {
  if (value.length < 2) {
    return false;
  }

  const quote = value[0];
  if (quote !== '"' && quote !== "'") {
    return false;
  }

  let backslashCount = 0;
  for (let index = value.length - 2; index >= 0 && value[index] === "\\"; index -= 1) {
    backslashCount += 1;
  }

  return value.endsWith(quote) && backslashCount % 2 === 0;
};

const normalizeWrappedQuotedValue = (value: string) =>
  stripMatchingQuotes(value.replace(/\s*\n\s*/g, " ").replace(/\s+/g, " ").trim()).trim();

const foldBlockScalar = (lines: string[], mode: ">" | "|") => {
  const cleanedLines = lines.map((line) => line.replace(/^\s{2}/, ""));

  if (mode === "|") {
    return cleanedLines.join("\n").trim();
  }

  const paragraphs: string[] = [];
  let currentParagraph: string[] = [];

  cleanedLines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(" "));
        currentParagraph = [];
      }
      return;
    }

    currentParagraph.push(trimmed);
  });

  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(" "));
  }

  return paragraphs.join("\n\n").trim();
};

const parseFrontmatterBlock = <T extends Record<string, unknown>>(block: string): Partial<T> => {
  const data = {} as Partial<T>;
  const lines = block.split("\n");

  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    const keyMatch = line.match(/^([A-Za-z0-9_]+):(.*)$/);

    if (!keyMatch) {
      index += 1;
      continue;
    }

    const key = keyMatch[1] as keyof T;
    const initialValue = keyMatch[2].trim();

    const blockScalarMatch = initialValue.match(/^([>|])[-+]?$/);
    if (blockScalarMatch) {
      const mode = blockScalarMatch[1] as ">" | "|";
      const blockLines: string[] = [];
      index += 1;

      while (index < lines.length) {
        const currentLine = lines[index];
        if (currentLine.trim() === "") {
          blockLines.push("");
          index += 1;
          continue;
        }

        if (!/^\s/.test(currentLine) && isFrontmatterKeyLine(currentLine)) {
          break;
        }

        if (/^\s/.test(currentLine)) {
          blockLines.push(currentLine);
          index += 1;
          continue;
        }

        break;
      }

      const value = foldBlockScalar(blockLines, mode);
      if (value) {
        data[key] = value as T[keyof T];
      }
      continue;
    }

    if ((initialValue.startsWith('"') || initialValue.startsWith("'")) && !isQuotedValueClosed(initialValue)) {
      const wrappedLines = [initialValue];
      index += 1;

      while (index < lines.length) {
        wrappedLines.push(lines[index]);
        if (isQuotedValueClosed(wrappedLines.join("\n").trim())) {
          index += 1;
          break;
        }
        index += 1;
      }

      const value = normalizeWrappedQuotedValue(wrappedLines.join("\n"));
      if (value) {
        data[key] = value as T[keyof T];
      }
      continue;
    }

    // YAML "plain scalar" birden fazla satira yayilabilir: deger anahtar satirinda
    // baslar ve daha girintili satirlarla devam eder. Onceki surum yalnizca ilk
    // satiri aliyor, devamini sessizce dusuruyordu; bu yuzden excerpt/seoDescription/
    // title alanlari cumle ortasinda kesiliyor ve Google'a yarim meta description
    // gidiyordu. Liste ogeleri (`- deger`) plain scalar degildir, dokunulmaz.
    const plainLines = [initialValue];
    index += 1;

    if (initialValue) {
      while (index < lines.length) {
        const nextLine = lines[index];
        if (!nextLine.trim()) break;
        if (!/^\s/.test(nextLine)) break;
        if (/^\s*-\s/.test(nextLine)) break;

        plainLines.push(nextLine.trim());
        index += 1;
      }
    }

    const value = stripMatchingQuotes(plainLines.join(" ").replace(/\s+/g, " ").trim());
    if (value) {
      data[key] = value as T[keyof T];
    }
  }

  return data;
};

// Decap CMS'in zengin metin editoru, markdown'a geri seri hale getirirken
// syntax karakterlerini asiri escape eder. Kullanici panele `**kalin**`
// yapistirdiginda editor bunu `\*\*kalin\*\*` olarak kaydeder; bu da
// yayinda goru­nu­r yildiz isaretleri olarak kalir. Asagidaki yardimci,
// yalnizca markdown syntax karakterlerinin tek basli escape'lerini geri
// alir; `\\` (literal backslash) ve satir sonu hard break'leri olan `\`
// karakterleri listede olmadigi icin korunur.
const OVER_ESCAPED_MARKDOWN_RE = /\\([*_#>+\-.!`~|[\]()])/g;

export const unescapeOverEscapedMarkdown = (content: string): string =>
  content.replace(OVER_ESCAPED_MARKDOWN_RE, "$1");

// Karsilastirma icin basligi sadelestirir: kucuk harf, noktalama ve fazla bosluk atilir.
const normalizeHeadingForCompare = (value: string) =>
  value
    .toLocaleLowerCase("tr")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

/**
 * Markdown govdesinin basindaki, sayfa basligini tekrarlayan `# Baslik` satirini kaldirir.
 * Detay sayfalari kendi H1'ini render ettigi icin bu satir ikinci bir H1 (bozuk baslik
 * hiyerarsisi) ve ekranda gorunur bir tekrar uretiyordu.
 * Yalnizca govdenin ilk ogesi H1 ise ve metin sayfa basligiyla ortusuyorsa silinir;
 * baslik farkliysa icerik korunur.
 */
export const stripDuplicateLeadingH1 = (content: string, title?: string): string => {
  const trimmed = content.trimStart();
  const match = /^#\s+(.+?)\s*$/m.exec(trimmed);
  if (!match || match.index !== 0) return content;

  const heading = normalizeHeadingForCompare(match[1]);
  if (!heading) return content;

  if (title) {
    const normalizedTitle = normalizeHeadingForCompare(title);
    const overlaps = normalizedTitle.startsWith(heading) || heading.startsWith(normalizedTitle);
    if (!overlaps) return content;
  }

  return trimmed.slice(match[0].length).trimStart();
};

export const parseMarkdownDocument = <T extends Record<string, unknown>>(raw: string) => {
  const normalizedRaw = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

  if (!normalizedRaw.startsWith("---\n")) {
    return { data: {} as Partial<T>, content: unescapeOverEscapedMarkdown(normalizedRaw.trim()) };
  }

  const endIndex = normalizedRaw.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return { data: {} as Partial<T>, content: unescapeOverEscapedMarkdown(normalizedRaw.trim()) };
  }

  const frontmatterBlock = normalizedRaw.slice(4, endIndex);
  const content = normalizedRaw.slice(endIndex + 5).trim();

  return {
    data: parseFrontmatterBlock<T>(frontmatterBlock),
    content: unescapeOverEscapedMarkdown(content),
  };
};
