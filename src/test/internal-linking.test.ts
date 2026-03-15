import { describe, expect, it } from "vitest";
import { autoLinkRelatedContent, getRelatedContentSuggestions } from "@/lib/internal-linking";

describe("internal linking", () => {
  it("injects related internal links into matching article text", () => {
    const content = autoLinkRelatedContent(
      {
        slug: "ornek-yazi",
        title: "Örnek Yazı",
        excerpt: "Kira ve tahliye süreçleri",
        href: "/blog/ornek-yazi",
        content:
          "Kira uyarlama davası hazırlığında emsal veriler önemlidir.\n\nTahliye taahhüdü değerlendirilirken düzenleme tarihi ayrıca incelenmelidir.",
      },
      [
        {
          slug: "kira-uyarlama-davasi-yol-haritasi",
          title: "Kira Uyarlama Davası İçin Yol Haritası",
          excerpt: "Kira uyarlama talepleri",
          href: "/blog/kira-uyarlama-davasi-yol-haritasi",
        },
        {
          slug: "tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari",
          title: "Tahliye Taahhüdünün Geçerlilik Şartları ve Güncel Yargıtay Kararları",
          excerpt: "Tahliye taahhüdü şartları",
          href: "/guncel-hukuk-gundemi/tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari",
        },
      ],
    );

    expect(content).toContain("[Kira uyarlama davası](/blog/kira-uyarlama-davasi-yol-haritasi)");
    expect(content).toContain(
      "[Tahliye taahhüdü](/guncel-hukuk-gundemi/tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari)",
    );
  });

  it("respects manual rules, priorities, existing links and code fences", () => {
    const suggestions = getRelatedContentSuggestions(
      {
        slug: "ornek-yazi",
        title: "Örnek Yazı",
        href: "/blog/ornek-yazi",
        internalLinkPriority: ["menfi-tespit-davasinda-ispat-yuku"],
        internalLinkMatches: [
          {
            phrase: "tahliye taahhüdü",
            target: "tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari",
          },
        ],
        content: [
          "Bkz. [Kira uyarlama davası](/manuel-link).",
          "",
          "```md",
          "Tahliye taahhüdü",
          "```",
          "",
          "Tahliye taahhüdü sonradan ayrıca değerlendirilmelidir.",
          "Menfi tespit davasında ispat yükü de ayrıca incelenmelidir.",
        ].join("\n"),
      },
      [
        {
          slug: "kira-uyarlama-davasi-yol-haritasi",
          title: "Kira Uyarlama Davası İçin Yol Haritası",
          href: "/blog/kira-uyarlama-davasi-yol-haritasi",
        },
        {
          slug: "tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari",
          title: "Tahliye Taahhüdünün Geçerlilik Şartları ve Güncel Yargıtay Kararları",
          href: "/guncel-hukuk-gundemi/tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari",
        },
        {
          slug: "menfi-tespit-davasinda-ispat-yuku",
          title: "Menfi Tespit Davasında İspat Yükü",
          href: "/blog/menfi-tespit-davasinda-ispat-yuku",
        },
      ],
    );

    const content = autoLinkRelatedContent(
      {
        slug: "ornek-yazi",
        title: "Örnek Yazı",
        href: "/blog/ornek-yazi",
        internalLinkPriority: ["menfi-tespit-davasinda-ispat-yuku"],
        internalLinkMatches: [
          {
            phrase: "tahliye taahhüdü",
            target: "tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari",
          },
        ],
        content: [
          "Bkz. [Kira uyarlama davası](/manuel-link).",
          "",
          "```md",
          "Tahliye taahhüdü",
          "```",
          "",
          "Tahliye taahhüdü sonradan ayrıca değerlendirilmelidir.",
          "Menfi tespit davasında ispat yükü de ayrıca incelenmelidir.",
        ].join("\n"),
      },
      [
        {
          slug: "kira-uyarlama-davasi-yol-haritasi",
          title: "Kira Uyarlama Davası İçin Yol Haritası",
          href: "/blog/kira-uyarlama-davasi-yol-haritasi",
        },
        {
          slug: "tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari",
          title: "Tahliye Taahhüdünün Geçerlilik Şartları ve Güncel Yargıtay Kararları",
          href: "/guncel-hukuk-gundemi/tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari",
        },
        {
          slug: "menfi-tespit-davasinda-ispat-yuku",
          title: "Menfi Tespit Davasında İspat Yükü",
          href: "/blog/menfi-tespit-davasinda-ispat-yuku",
        },
      ],
    );

    expect(suggestions[0]?.href).toBe("/guncel-hukuk-gundemi/tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari");
    expect(suggestions[1]?.href).toBe("/blog/menfi-tespit-davasinda-ispat-yuku");
    expect(content).toContain("[Kira uyarlama davası](/manuel-link)");
    expect(content).toContain("```md\nTahliye taahhüdü\n```");
    expect(content).toContain(
      "[Tahliye taahhüdü](/guncel-hukuk-gundemi/tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari) sonradan ayrıca değerlendirilmelidir.",
    );
    expect(content).toContain("[Menfi tespit davasında ispat yükü](/blog/menfi-tespit-davasinda-ispat-yuku)");
  });
});
