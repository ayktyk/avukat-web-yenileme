import { describe, expect, it } from "vitest";
import { autoLinkRelatedContent, resolveContentReferenceLinks } from "@/lib/internal-linking";

describe("internal linking", () => {
  it("resolves title or slug based shortcut links without forcing slug-only authoring", () => {
    const content = resolveContentReferenceLinks(
      [
        "Detay için [[Menfi Tespit Davasında İspat Yükü]].",
        "Alternatif olarak [[tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari|tahliye rehberi]] okunabilir.",
      ].join("\n"),
      [
        {
          slug: "menfi-tespit-davasinda-ispat-yuku",
          title: "Menfi Tespit Davasında İspat Yükü",
          href: "/blog/menfi-tespit-davasinda-ispat-yuku",
        },
        {
          slug: "tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari",
          title: "Tahliye Taahhüdünün Geçerlilik Şartları",
          href: "/guncel-hukuk-gundemi/tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari",
        },
      ],
    );

    expect(content).toContain("[Menfi Tespit Davasında İspat Yükü](/blog/menfi-tespit-davasinda-ispat-yuku)");
    expect(content).toContain("[tahliye rehberi](/guncel-hukuk-gundemi/tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari)");
  });

  it("auto links related content while preserving code fences and existing markdown links", () => {
    const content = autoLinkRelatedContent(
      {
        slug: "ornek-yazi",
        title: "Örnek Yazı",
        excerpt: "Kira uyarlama ve tahliye süreci",
        href: "/blog/ornek-yazi",
        content: [
          "Bkz. [Kira uyarlama davası](/manuel-link).",
          "",
          "```md",
          "Tahliye taahhüdü",
          "```",
          "",
          "Tahliye taahhüdü sonradan ayrıca değerlendirilmelidir.",
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
          title: "Tahliye Taahhüdünün Geçerlilik Şartları",
          href: "/guncel-hukuk-gundemi/tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari",
        },
      ],
    );

    expect(content).toContain("[Kira uyarlama davası](/manuel-link)");
    expect(content).toContain("```md\nTahliye taahhüdü\n```");
    expect(content).toContain(
      "[Tahliye taahhüdü](/guncel-hukuk-gundemi/tahliye-taahhudu-gecerlilik-sartlari-yargitay-kararlari) sonradan ayrıca değerlendirilmelidir.",
    );
  });
});
