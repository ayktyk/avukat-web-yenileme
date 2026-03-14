import { staticSearchDocuments } from "@/data/search-content";
import { listBlogPosts } from "@/lib/blog-repository";
import { listLegalUpdates } from "@/lib/legal-updates-repository";
import type { SearchDocument } from "@/types/search";

const typeWeight: Record<SearchDocument["type"], number> = {
  section: 60,
  "practice-area": 52,
  team: 48,
  faq: 44,
  blog: 40,
  "legal-update": 40,
  page: 34,
};

const turkishCharMap: Record<string, string> = {
  c: "c",
  C: "c",
  ç: "c",
  Ç: "c",
  g: "g",
  G: "g",
  ğ: "g",
  Ğ: "g",
  i: "i",
  I: "i",
  İ: "i",
  ı: "i",
  o: "o",
  O: "o",
  ö: "o",
  Ö: "o",
  s: "s",
  S: "s",
  ş: "s",
  Ş: "s",
  u: "u",
  U: "u",
  ü: "u",
  Ü: "u",
};

const normalizeSearchText = (value: string) =>
  value
    .replace(/[cCçÇgGğĞiIİıoOöÖsSşŞuUüÜ]/g, (char) => turkishCharMap[char] ?? char)
    .toLocaleLowerCase("tr-TR")
    .replace(/&/g, " ve ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const dateWeight = (publishedAt?: string) => {
  if (!publishedAt) {
    return 0;
  }

  const timestamp = new Date(publishedAt).getTime();
  if (Number.isNaN(timestamp)) {
    return 0;
  }

  const ageInDays = Math.max(0, (Date.now() - timestamp) / 86_400_000);
  return Math.max(0, 24 - ageInDays / 14);
};

const buildHaystack = (document: SearchDocument) =>
  normalizeSearchText(
    [
      document.title,
      document.description,
      document.badge,
      document.searchText,
      ...(document.keywords ?? []),
    ]
      .filter(Boolean)
      .join(" "),
  );

const buildTitle = (document: SearchDocument) => normalizeSearchText(document.title);

const scoreDocument = (document: SearchDocument, query: string) => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return 0;
  }

  const terms = normalizedQuery.split(" ").filter(Boolean);
  const normalizedTitle = buildTitle(document);
  const haystack = buildHaystack(document);

  if (terms.some((term) => !haystack.includes(term))) {
    return -1;
  }

  let score = typeWeight[document.type] + dateWeight(document.publishedAt);

  if (normalizedTitle === normalizedQuery) {
    score += 160;
  } else if (normalizedTitle.startsWith(normalizedQuery)) {
    score += 120;
  } else if (normalizedTitle.includes(normalizedQuery)) {
    score += 80;
  }

  for (const term of terms) {
    if (normalizedTitle.startsWith(term)) {
      score += 32;
    } else if (normalizedTitle.includes(term)) {
      score += 22;
    }

    const keywordText = normalizeSearchText((document.keywords ?? []).join(" "));
    if (keywordText.includes(term)) {
      score += 14;
    }

    if (normalizeSearchText(document.description).includes(term)) {
      score += 8;
    }
  }

  if (document.featured) {
    score += 10;
  }

  return score;
};

const toBlogSearchDocument = (post: Awaited<ReturnType<typeof listBlogPosts>>[number]): SearchDocument => ({
  id: `blog-${post.slug}`,
  title: post.title,
  description: post.excerpt,
  href: `/blog/${post.slug}`,
  type: "blog",
  badge: "Blog",
  keywords: [post.category, post.author],
  searchText: post.content,
  publishedAt: post.updatedAt ?? post.publishedAt,
});

const toLegalUpdateSearchDocument = (item: Awaited<ReturnType<typeof listLegalUpdates>>[number]): SearchDocument => ({
  id: `legal-update-${item.slug}`,
  title: item.title,
  description: item.excerpt,
  href: `/guncel-hukuk-gundemi/${item.slug}`,
  type: "legal-update",
  badge: "Hukuk Gündemi",
  keywords: [item.category],
  searchText: item.content,
  publishedAt: item.updatedAt ?? item.publishedAt,
});

export const buildSiteSearchDocuments = async (): Promise<SearchDocument[]> => {
  const [posts, updates] = await Promise.all([listBlogPosts(), listLegalUpdates()]);

  return [
    ...staticSearchDocuments,
    ...posts.map(toBlogSearchDocument),
    ...updates.map(toLegalUpdateSearchDocument),
  ];
};

export const searchSiteDocuments = (documents: SearchDocument[], query: string, limit = 12): SearchDocument[] => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return [];
  }

  return documents
    .map((document) => ({
      document,
      score: scoreDocument(document, normalizedQuery),
    }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      const dateA = a.document.publishedAt ? new Date(a.document.publishedAt).getTime() : 0;
      const dateB = b.document.publishedAt ? new Date(b.document.publishedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, limit)
    .map((entry) => entry.document);
};

export const getSuggestedSearchDocuments = (documents: SearchDocument[], limit = 8): SearchDocument[] =>
  [...documents]
    .sort((a, b) => {
      if (Boolean(b.featured) !== Boolean(a.featured)) {
        return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      }

      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, limit);

export const getSearchGroupLabel = (type: SearchDocument["type"]) => {
  switch (type) {
    case "blog":
      return "Blog";
    case "legal-update":
      return "Hukuk Gündemi";
    case "faq":
      return "Sık Sorulan Sorular";
    case "team":
      return "Ekip";
    case "practice-area":
      return "Çalışma Alanları";
    case "page":
      return "Yasal Sayfalar";
    default:
      return "Site Bölümleri";
  }
};
