import type { InternalLinkRule } from "@/types/internal-links";

export type LinkableContent = {
  slug: string;
  title: string;
  href: string;
  excerpt?: string;
  content?: string;
  category?: string;
  internalLinkPriority?: string[];
  internalLinkMatches?: InternalLinkRule[];
};

export type RelatedContentSuggestion = LinkableContent & {
  aliases: string[];
  relevance: number;
  isManual: boolean;
};

type SearchIndex = {
  normalized: string;
  charMap: number[];
};

const STOPWORDS = new Set([
  "ve",
  "veya",
  "ile",
  "icin",
  "gibi",
  "daha",
  "en",
  "bir",
  "bu",
  "da",
  "de",
  "mi",
  "mu",
  "mü",
  "muvekkil",
  "guncel",
  "yeni",
  "kritik",
  "notlar",
  "notlari",
  "rehber",
  "detayli",
  "yaklasimi",
  "degerlendirme",
  "degerlendirmesi",
  "haritasi",
  "sartlari",
  "karari",
  "kararlari",
]);

const CHAR_FOLD_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  I: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
};

const INLINE_PROTECTED_PATTERN = /(`[^`]*`|\[[^\]]+\]\([^)]+\))/g;
const INLINE_PROTECTED_SEGMENT_PATTERN = /^(`[^`]*`|\[[^\]]+\]\([^)]+\))$/;

const foldChar = (char: string) => CHAR_FOLD_MAP[char] ?? char.toLowerCase();

const normalizeWithMap = (value: string): SearchIndex => {
  let normalized = "";
  const charMap: number[] = [];

  for (let index = 0; index < value.length; index += 1) {
    const folded = foldChar(value[index] ?? "");

    for (const char of folded) {
      normalized += char;
      charMap.push(index);
    }
  }

  return { normalized, charMap };
};

const normalizeForSearch = (value: string) => normalizeWithMap(value).normalized;

const normalizeTargetKey = (value: string) => normalizeForSearch(value.trim().replace(/^\/+/, ""));

const isWordChar = (char: string | undefined) => Boolean(char && /[a-z0-9]/.test(char));

const hasWordBoundary = (normalizedText: string, start: number, end: number) =>
  !isWordChar(normalizedText[start - 1]) && !isWordChar(normalizedText[end]);

const tokenize = (value: string) =>
  normalizeForSearch(value)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));

const unique = <T,>(items: T[]) => [...new Set(items)];

const buildAliases = (target: LinkableContent) => {
  const slugTokens = target.slug
    .split("-")
    .map((token) => normalizeForSearch(token).trim())
    .filter((token) => token.length > 1);

  const aliases: Array<{ phrase: string; score: number }> = [];

  for (let size = Math.min(5, slugTokens.length); size >= 1; size -= 1) {
    for (let start = 0; start <= slugTokens.length - size; start += 1) {
      const window = slugTokens.slice(start, start + size);
      const significantCount = window.filter((token) => !STOPWORDS.has(token) && token.length >= 4).length;
      const phrase = window.join(" ").trim();

      if (!phrase) {
        continue;
      }

      if (size === 1 && phrase.length < 10) {
        continue;
      }

      if (size > 1 && (phrase.length < 10 || significantCount === 0)) {
        continue;
      }

      aliases.push({
        phrase,
        score: size * 20 + phrase.length - start,
      });
    }
  }

  return unique(
    aliases
      .sort((left, right) => right.score - left.score)
      .map((alias) => alias.phrase),
  );
};

const findFirstAliasMatch = (sourceIndex: SearchIndex, aliases: string[]) => {
  for (const alias of aliases) {
    let cursor = 0;

    while (cursor >= 0) {
      const start = sourceIndex.normalized.indexOf(alias, cursor);
      if (start === -1) {
        break;
      }

      const end = start + alias.length;
      if (hasWordBoundary(sourceIndex.normalized, start, end)) {
        return {
          alias,
          start,
          end,
          matchLength: alias.length,
        };
      }

      cursor = start + alias.length;
    }
  }

  return null;
};

const findCandidateByTarget = (target: string, candidates: LinkableContent[]) => {
  const normalizedTarget = normalizeTargetKey(target);

  return (
    candidates.find((candidate) => normalizeTargetKey(candidate.href) === normalizedTarget) ??
    candidates.find((candidate) => normalizeForSearch(candidate.slug) === normalizedTarget) ??
    candidates.find((candidate) => normalizeTargetKey(candidate.href).endsWith(`/${normalizedTarget}`))
  );
};

const getPriorityBonus = (source: LinkableContent, candidate: LinkableContent) => {
  const priorities = source.internalLinkPriority ?? [];
  const candidateSlug = normalizeForSearch(candidate.slug);
  const candidateHref = normalizeTargetKey(candidate.href);

  const matchIndex = priorities.findIndex((priority) => {
    const normalizedPriority = normalizeTargetKey(priority);
    return normalizedPriority === candidateHref || normalizedPriority === candidateSlug || candidateHref.endsWith(`/${normalizedPriority}`);
  });

  return matchIndex === -1 ? 0 : 500 - matchIndex * 40;
};

const rankAutoCandidates = (source: LinkableContent, candidates: LinkableContent[]) => {
  const sourceTokens = new Set(tokenize(`${source.title} ${source.excerpt ?? ""} ${source.content ?? ""}`));
  const sourceContentIndex = normalizeWithMap(source.content ?? "");

  return candidates
    .filter((candidate) => candidate.href !== source.href)
    .map((candidate) => {
      const aliases = buildAliases(candidate);
      const aliasMatch = findFirstAliasMatch(sourceContentIndex, aliases);

      if (!aliasMatch) {
        return null;
      }

      const candidateTokens = tokenize(`${candidate.title} ${candidate.excerpt ?? ""}`);
      const commonTokenCount = candidateTokens.filter((token) => sourceTokens.has(token)).length;

      return {
        ...candidate,
        aliases,
        isManual: false,
        relevance: aliasMatch.matchLength + commonTokenCount * 8 + getPriorityBonus(source, candidate),
      } satisfies RelatedContentSuggestion;
    })
    .filter((candidate): candidate is RelatedContentSuggestion => candidate !== null);
};

const rankManualCandidates = (source: LinkableContent, candidates: LinkableContent[]) => {
  const sourceContentIndex = normalizeWithMap(source.content ?? "");

  return (source.internalLinkMatches ?? [])
    .map((rule, index) => {
      const candidate = findCandidateByTarget(rule.target, candidates);
      if (!candidate || candidate.href === source.href) {
        return null;
      }

      const aliases = [normalizeForSearch(rule.phrase).trim()].filter(Boolean);
      const aliasMatch = findFirstAliasMatch(sourceContentIndex, aliases);

      if (!aliasMatch) {
        return null;
      }

      return {
        ...candidate,
        aliases,
        isManual: true,
        relevance: 1000 - index * 25 + getPriorityBonus(source, candidate),
      } satisfies RelatedContentSuggestion;
    })
    .filter((candidate): candidate is RelatedContentSuggestion => candidate !== null);
};

const rankCandidates = (source: LinkableContent, candidates: LinkableContent[]) => {
  const ranked = [...rankManualCandidates(source, candidates), ...rankAutoCandidates(source, candidates)];
  const deduped = new Map<string, RelatedContentSuggestion>();

  for (const candidate of ranked) {
    const existing = deduped.get(candidate.href);
    if (!existing || candidate.relevance > existing.relevance) {
      deduped.set(candidate.href, candidate);
    }
  }

  return [...deduped.values()].sort((left, right) => right.relevance - left.relevance);
};

const canProcessLine = (line: string) => {
  const trimmed = line.trim();

  if (!trimmed) {
    return false;
  }

  return !/^(#{1,6}\s|>|[-*]\s|\d+\.\s|\|)/.test(trimmed);
};

const replaceAliasInSegment = (segment: string, aliases: string[], href: string) => {
  const sourceIndex = normalizeWithMap(segment);
  const match = findFirstAliasMatch(sourceIndex, aliases);

  if (!match) {
    return segment;
  }

  const originalStart = sourceIndex.charMap[match.start] ?? 0;
  const originalEndIndex = sourceIndex.charMap[match.end - 1];
  const originalEnd = typeof originalEndIndex === "number" ? originalEndIndex + 1 : segment.length;
  const matchedText = segment.slice(originalStart, originalEnd);

  if (!matchedText) {
    return segment;
  }

  return `${segment.slice(0, originalStart)}[${matchedText}](${href})${segment.slice(originalEnd)}`;
};

const replaceFirstLinkInLine = (line: string, candidate: RelatedContentSuggestion) => {
  const parts = line.split(INLINE_PROTECTED_PATTERN);

  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index] ?? "";
    if (!part || INLINE_PROTECTED_SEGMENT_PATTERN.test(part)) {
      continue;
    }

    const updated = replaceAliasInSegment(part, candidate.aliases, candidate.href);
    if (updated !== part) {
      parts[index] = updated;
      return parts.join("");
    }
  }

  return line;
};

export const getRelatedContentSuggestions = (
  source: LinkableContent & { content: string },
  candidates: LinkableContent[],
  limit = 3,
) => rankCandidates(source, candidates).slice(0, limit);

export const autoLinkRelatedContent = (
  source: LinkableContent & { content: string },
  candidates: LinkableContent[],
  maxLinks = 3,
) => {
  const rankedCandidates = rankCandidates(source, candidates).slice(0, maxLinks * 2);
  const lines = source.content.split("\n");
  const linkedTargets = new Set<string>();
  let inCodeFence = false;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex] ?? "";

    if (line.trim().startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }

    if (inCodeFence || !canProcessLine(line) || linkedTargets.size >= maxLinks) {
      continue;
    }

    for (const candidate of rankedCandidates) {
      if (linkedTargets.has(candidate.href)) {
        continue;
      }

      const updatedLine = replaceFirstLinkInLine(line, candidate);

      if (updatedLine !== line) {
        lines[lineIndex] = updatedLine;
        linkedTargets.add(candidate.href);
        break;
      }
    }
  }

  return lines.join("\n");
};
