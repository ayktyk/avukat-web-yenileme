import { describe, expect, it } from "vitest";
import { parseMarkdownDocument, stripDuplicateLeadingH1, unescapeOverEscapedMarkdown } from "@/lib/markdown-frontmatter";

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

  it("cok satirli tirnaksiz (plain scalar) degerleri tam olarak okur", () => {
    const raw = `---
title: Emekli Olup Çalışmaya Devam Edenlerin Sigorta Günleri Eksik Bildirilirse
  Ne Olur?
excerpt: Kıdem tazminatı çıplak maaş üzerinden değil, yemek ve yol gibi ödemeleri
  de içeren giydirilmiş brüt ücret üzerinden hesaplanır. Adım adım formül,
  tavan kontrolü ve örnek hesap bu rehberde.
publishedAt: 2026-07-22
---
Gövde.`;

    const { data, content } = parseMarkdownDocument<TestFrontmatter>(raw);

    expect(data.title).toBe("Emekli Olup Çalışmaya Devam Edenlerin Sigorta Günleri Eksik Bildirilirse Ne Olur?");
    expect(data.excerpt).toBe(
      "Kıdem tazminatı çıplak maaş üzerinden değil, yemek ve yol gibi ödemeleri de içeren giydirilmiş brüt ücret üzerinden hesaplanır. Adım adım formül, tavan kontrolü ve örnek hesap bu rehberde.",
    );
    expect(data.publishedAt).toBe("2026-07-22");
    expect(content).toBe("Gövde.");
  });

  it("liste degerlerini plain scalar devami sanmaz", () => {
    const raw = `---
title: Test
topics:
  - is-hukuku
  - kidem-tazminati
excerpt: Ozet
publishedAt: 2026-01-01
---
Gövde.`;

    const { data } = parseMarkdownDocument<TestFrontmatter & { topics?: string }>(raw);

    expect(data.title).toBe("Test");
    expect(data.excerpt).toBe("Ozet");
    expect(data.publishedAt).toBe("2026-01-01");
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

describe("stripDuplicateLeadingH1", () => {
  it("sayfa basligini tekrarlayan bastaki H1'i kaldirir", () => {
    const content = "# Kıdem Tazminatı Nasıl Hesaplanır?\n\nGövde metni.";

    expect(stripDuplicateLeadingH1(content, "Kıdem Tazminatı Nasıl Hesaplanır?")).toBe("Gövde metni.");
  });

  it("baslik sayfa basliginin kisaltilmis hali olsa da kaldirir", () => {
    const content = "# Trafik Kazası Sonrası Yapılacaklar: A'dan Z'ye Rehber\n\nGövde.";

    expect(stripDuplicateLeadingH1(content, "Trafik Kazası Sonrası Yapılacaklar: A'dan Z'ye Rehber 2026")).toBe(
      "Gövde.",
    );
  });

  it("farkli bir H1'i korur", () => {
    const content = "# Tamamen Başka Bir Başlık\n\nGövde.";

    expect(stripDuplicateLeadingH1(content, "Kıdem Tazminatı Nasıl Hesaplanır?")).toBe(content);
  });

  it("govde H1 ile baslamiyorsa icerige dokunmaz", () => {
    const content = "Giriş paragrafı.\n\n# Sonradan Gelen Başlık";

    expect(stripDuplicateLeadingH1(content, "Giriş paragrafı.")).toBe(content);
  });

  it("H2 ile baslayan icerigi degistirmez", () => {
    const content = "## Alt Başlık\n\nGövde.";

    expect(stripDuplicateLeadingH1(content, "Alt Başlık")).toBe(content);
  });
});
