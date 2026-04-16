import { describe, expect, it } from "vitest";
import { parseMarkdownDocument, unescapeOverEscapedMarkdown } from "@/lib/markdown-frontmatter";

type TestFrontmatter = {
  title?: string;
  excerpt?: string;
  publishedAt?: string;
};

describe("markdown frontmatter parser", () => {
  it("parses wrapped quoted values and folded block scalars", () => {
    const raw = `---
title: "Yargıtay'dan Emsal Karar: Kira Sözleşmelerinde 'Çekilmezlik Hali' ve
  Olağanüstü Fesih"
excerpt: >
  Karar özeti ilk satırdır.

  İkinci paragraf açıklaması burada devam eder.
publishedAt: 2026-03-14
---
İçerik gövdesi.`;

    const { data, content } = parseMarkdownDocument<TestFrontmatter>(raw);

    expect(data.title).toBe(
      "Yargıtay'dan Emsal Karar: Kira Sözleşmelerinde 'Çekilmezlik Hali' ve Olağanüstü Fesih",
    );
    expect(data.excerpt).toBe("Karar özeti ilk satırdır.\n\nİkinci paragraf açıklaması burada devam eder.");
    expect(data.publishedAt).toBe("2026-03-14");
    expect(content).toBe("İçerik gövdesi.");
  });

  it("Decap CMS tarafindan asiri escape edilen markdown syntaxini temizler", () => {
    const raw = `---
title: Test
excerpt: Ozet
publishedAt: 2026-04-16
---
\\# Baslik

> \\*\\*Kisa Yanit:\\*\\* Icerik.

\\*"Italik alinti."\\*

\\*\\*1- Liste maddesi\\*\\*`;

    const { content } = parseMarkdownDocument<TestFrontmatter>(raw);

    expect(content).toBe(
      [
        "# Baslik",
        "",
        "> **Kisa Yanit:** Icerik.",
        "",
        '*"Italik alinti."*',
        "",
        "**1- Liste maddesi**",
      ].join("\n"),
    );
  });

  it("literal backslash (\\\\) ve satir sonu hard break'lerini korur", () => {
    const input = "Satir sonu hard break\\\nDevam\n\nIcinde \\\\ literal backslash kalir.";

    expect(unescapeOverEscapedMarkdown(input)).toBe(input);
  });
});
