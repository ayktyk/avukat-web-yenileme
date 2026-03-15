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

const parseListBlock = (lines: string[]) => {
  const items: Array<string | Record<string, string>> = [];
  let currentObject: Record<string, string> | null = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/^\s{2}/, "");

    if (!line.trim()) {
      continue;
    }

    const listItemMatch = line.match(/^-\s+(.*)$/);
    if (listItemMatch) {
      const value = listItemMatch[1].trim();
      const objectEntryMatch = value.match(/^([A-Za-z0-9_]+):(.*)$/);

      if (objectEntryMatch) {
        currentObject = {};
        const nestedValue = stripMatchingQuotes(objectEntryMatch[2].trim());
        if (nestedValue) {
          currentObject[objectEntryMatch[1]] = nestedValue;
        }
        items.push(currentObject);
        continue;
      }

      currentObject = null;
      const normalizedValue = stripMatchingQuotes(value);
      if (normalizedValue) {
        items.push(normalizedValue);
      }
      continue;
    }

    const nestedMatch = line.match(/^\s+([A-Za-z0-9_]+):(.*)$/);
    if (nestedMatch && currentObject) {
      const nestedValue = stripMatchingQuotes(nestedMatch[2].trim());
      if (nestedValue) {
        currentObject[nestedMatch[1]] = nestedValue;
      }
    }
  }

  return items;
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

    if (initialValue === ">" || initialValue === "|") {
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

      const value = foldBlockScalar(blockLines, initialValue);
      if (value) {
        data[key] = value as T[keyof T];
      }
      continue;
    }

    if (!initialValue) {
      const listLines: string[] = [];
      let lookaheadIndex = index + 1;

      while (lookaheadIndex < lines.length) {
        const currentLine = lines[lookaheadIndex];
        if (!currentLine.trim()) {
          listLines.push(currentLine);
          lookaheadIndex += 1;
          continue;
        }

        if (!/^\s/.test(currentLine) && isFrontmatterKeyLine(currentLine)) {
          break;
        }

        if (/^\s/.test(currentLine)) {
          listLines.push(currentLine);
          lookaheadIndex += 1;
          continue;
        }

        break;
      }

      const parsedList = parseListBlock(listLines);
      if (parsedList.length > 0) {
        data[key] = parsedList as T[keyof T];
        index = lookaheadIndex;
        continue;
      }
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

    const value = stripMatchingQuotes(initialValue);
    if (value) {
      data[key] = value as T[keyof T];
    }

    index += 1;
  }

  return data;
};

export const parseMarkdownDocument = <T extends Record<string, unknown>>(raw: string) => {
  const normalizedRaw = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

  if (!normalizedRaw.startsWith("---\n")) {
    return { data: {} as Partial<T>, content: normalizedRaw.trim() };
  }

  const endIndex = normalizedRaw.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return { data: {} as Partial<T>, content: normalizedRaw.trim() };
  }

  const frontmatterBlock = normalizedRaw.slice(4, endIndex);
  const content = normalizedRaw.slice(endIndex + 5).trim();

  return {
    data: parseFrontmatterBlock<T>(frontmatterBlock),
    content,
  };
};
