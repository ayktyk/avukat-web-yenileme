import { describe, expect, it } from "vitest";
import { getSuggestedSearchDocuments, searchSiteDocuments } from "@/lib/site-search";
import type { SearchDocument } from "@/types/search";

const documents: SearchDocument[] = [
  {
    id: "practice-is-hukuku",
    title: "İş Hukuku",
    description: "İşe iade ve fazla mesai uyuşmazlıkları.",
    href: "/#calisma-alanlari",
    type: "practice-area",
    keywords: ["işe iade", "fazla mesai"],
  },
  {
    id: "blog-menfi-tespit",
    title: "Menfi Tespit Davasında İspat Yükü",
    description: "Menfi tespit davasında ispat yüküne dair açıklamalar.",
    href: "/blog/menfi-tespit-davasinda-ispat-yuku",
    type: "blog",
    badge: "Blog",
    searchText: "İcra takibi ve menfi tespit ilişkisi değerlendirilir.",
    publishedAt: "2026-03-10",
  },
  {
    id: "contact",
    title: "İletişim",
    description: "Telefon ve e-posta bilgileri.",
    href: "/#iletisim",
    type: "section",
    featured: true,
  },
];

describe("site search", () => {
  it("matches Turkish characters with ASCII queries", () => {
    const results = searchSiteDocuments(documents, "is hukuku");

    expect(results[0]?.id).toBe("practice-is-hukuku");
  });

  it("matches content text as well as titles", () => {
    const results = searchSiteDocuments(documents, "icra takibi");

    expect(results[0]?.id).toBe("blog-menfi-tespit");
  });

  it("prioritizes featured suggestions when query is empty", () => {
    const results = getSuggestedSearchDocuments(documents, 2);

    expect(results[0]?.id).toBe("contact");
    expect(results).toHaveLength(2);
  });
});
