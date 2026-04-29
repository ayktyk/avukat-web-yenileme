import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");
const SITE = "https://vegahukukistanbul.com";

if (!existsSync(distDir)) {
  console.log("dist/ does not exist — run `vite-react-ssg build` first");
  process.exit(0);
}

const writeJson = (relPath, data) => {
  const target = join(distDir, relPath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify(data, null, 2), "utf-8");
};

const readFm = (filePath) => {
  const raw = readFileSync(filePath, "utf-8").replace(/^﻿/, "");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out = {};
  const body = m[1];
  const lines = body.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let value = kv[2].trim();
    if (value === ">" || value === "|" || value === ">-" || value === "|-") {
      const buf = [];
      let j = i + 1;
      while (j < lines.length && /^\s+/.test(lines[j])) {
        buf.push(lines[j].trim());
        j++;
      }
      value = buf.join(" ").replace(/\s+/g, " ").trim();
      i = j - 1;
    } else {
      value = value.replace(/^["']|["']$/g, "");
    }
    out[key] = value;
  }
  return out;
};

const collect = (dir) => {
  const folder = join(root, "src", "content", dir);
  if (!existsSync(folder)) return [];
  return readdirSync(folder)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readFm(join(folder, f)))
    .filter((m) => m.slug);
};

const blog = collect("blog").sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
const legal = collect("legal-updates").sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
const services = collect("services").sort((a, b) => parseInt(a.orderIndex || "99") - parseInt(b.orderIndex || "99"));

// 1) Agent Skills (capabilities card) — sitenin agent'lara sunduğu yetenekler
const calculators = [
  {
    name: "iscilik-alacaklari-hesaplama",
    title: "İşçilik Alacakları Hesaplama",
    description: "Kıdem, ihbar, fazla mesai, UBGT, hafta tatili ve yıllık izin alacaklarını dönem bazlı tavan ve kademeli vergi kurallarıyla hesaplar.",
    inputs: ["iseGiris", "istenCikis", "sonNetUcret", "yemekYardimi", "servisYardimi", "fesihTuru", "fazlaMesaiSaat", "ubgtCalismasi", "haftaTatiliCalismasi", "kullandirilmamisIzinGun"],
    outputs: ["kidemTazminati", "ihbarTazminati", "fazlaMesai", "ubgt", "haftaTatili", "yillikIzin", "toplamBrut", "toplamNet"],
  },
  {
    name: "vekalet-ucreti-hesaplama",
    title: "Vekalet Ücreti Hesaplama",
    description: "2026 yılı AAÜT tarifesine göre nispi ve maktu vekalet ücretini hesaplar.",
    inputs: ["mahkemeTuru", "davaAsamasi", "davaTuru", "davaDegeri", "seriDava"],
    outputs: ["vekaletUcreti", "kdv", "stopaj", "netOdeme"],
  },
  {
    name: "arabuluculuk-ucreti-hesaplama",
    title: "Arabuluculuk Ücreti Hesaplama",
    description: "Arabuluculuk Asgari Ücret Tarifesi uyarınca saatlik ve nispi ücretten yüksek olanı hesaplar.",
    inputs: ["uyusmazlikTuru", "uyusmazlikTutari", "saatSayisi", "tarafSayisi"],
    outputs: ["arabuluculukUcreti", "kdv", "stopaj", "netOdeme"],
  },
  {
    name: "faiz-hesaplama",
    title: "Faiz Hesaplama",
    description: "3095 sayılı Kanun kapsamında yasal, ticari (TCMB avans) veya özel oran üzerinden kümülatif faiz hesaplar.",
    inputs: ["anaPara", "baslangicTarihi", "bitisTarihi", "faizTuru", "ozelOran"],
    outputs: ["faizTutari", "toplamBorc", "donemDetay"],
  },
  {
    name: "harc-hesaplama",
    title: "Harç ve Gider Avansı Hesaplama",
    description: "492 sayılı Harçlar Kanunu kapsamında dava açma harçları ve gider avansını topluca hesaplar.",
    inputs: ["davaTuru", "davaDegeri", "tarafSayisi"],
    outputs: ["basvurmaHarci", "pesinHarc", "vekaletHarci", "giderAvansi", "toplam"],
  },
  {
    name: "kira-sureleri-hesaplama",
    title: "Kira Süreleri ve Artış Hesaplama",
    description: "TBK m.315-352 tahliye sürelerini ve m.344 kira artış üst sınırını hesaplar.",
    inputs: ["islemTuru", "kiraBaslangic", "mevcutKira", "tufeArtisOrani"],
    outputs: ["yeniKira", "ihtarTarihi", "fesihTarihi", "davaTarihi"],
  },
  {
    name: "kaza-tazminati-hesaplama",
    title: "Kaza (Maluliyet) Tazminatı Hesaplama",
    description: "TRH2010 ömür tablosu ve %10 progresif rant yöntemiyle sürekli maluliyet tazminatı hesaplar.",
    inputs: ["yas", "cinsiyet", "maluliyetOrani", "kusurOrani", "aylikGelir", "kazaTarihi"],
    outputs: ["aktifDonem", "pasifDonem", "toplamTazminat"],
  },
  {
    name: "infaz-hesaplama",
    title: "İnfaz Hesaplama",
    description: "5275/7242/7456 sayılı Kanunlar kapsamında koşullu salıverilme, denetimli serbestlik ve bihakkin tahliye tarihlerini hesaplar.",
    inputs: ["sucTuru", "verilenCeza", "tutuklamaTarihi", "yas"],
    outputs: ["kosulluSaliverilme", "denetimliSerbestlik", "acikCezaevi", "bihakkinTahliye"],
  },
  {
    name: "miras-payi-hesaplama",
    title: "Miras Payı Hesaplama",
    description: "Türk Medeni Kanunu zümre sistemine göre mirasçı paylarını ve saklı pay oranlarını hesaplar.",
    inputs: ["miras", "mirasciDurumu"],
    outputs: ["mirasPayi", "sakliPay", "tasarrufNisabi"],
  },
];

const agentSkills = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Vega Hukuk İstanbul — Agent Skills",
  url: SITE,
  description: "Vega Hukuk İstanbul'un agent'lara sunduğu yetenekler: 9 hukuki hesaplama aracı, 8 hizmet alanı kataloğu, blog ve içtihat arşivi feed'leri.",
  publisher: {
    "@type": "LegalService",
    "@id": `${SITE}/#legalservice`,
    name: "Vega Hukuk İstanbul",
    url: SITE,
  },
  schemaVersion: "0.1",
  capabilities: {
    discovery: {
      sitemap: `${SITE}/sitemap.xml`,
      llmsTxt: `${SITE}/llms.txt`,
      apiCatalog: `${SITE}/.well-known/api-catalog`,
    },
    contentNegotiation: {
      markdownAlternate: true,
      acceptHeader: "text/markdown",
      urlSuffix: ".md",
      example: `${SITE}/hakkimizda.md`,
    },
    feeds: [
      { name: "blog", url: `${SITE}/blog.json`, count: blog.length, description: "Türk hukuku blog yazıları arşivi" },
      { name: "legal-updates", url: `${SITE}/guncel-hukuk-gundemi.json`, count: legal.length, description: "Yargıtay kararı ve mevzuat değişikliği analizleri" },
      { name: "services", url: `${SITE}/hizmetler.json`, count: services.length, description: "Sekiz hukuk alanında hizmet katalogu" },
      { name: "team", url: `${SITE}/ekip.json`, count: 3, description: "Avukat ekibi profilleri" },
    ],
  },
  skills: [
    ...calculators.map((c) => ({
      "@type": "Action",
      name: c.name,
      description: c.description,
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/hesaplamalar/${c.name.replace("-hesaplama", "")}`,
        embedTemplate: `${SITE}/embed/${c.name.replace("-hesaplama", "")}`,
        markdownTemplate: `${SITE}/hesaplamalar/${c.name.replace("-hesaplama", "")}.md`,
        contentType: ["text/html", "text/markdown"],
      },
      input: c.inputs,
      output: c.outputs,
      inLanguage: "tr-TR",
    })),
    {
      "@type": "Action",
      name: "search-blog-posts",
      description: "Blog yazıları arşivinde kategorize edilmiş içeriklere erişim.",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/blog`,
        feedUrl: `${SITE}/blog.json`,
        contentType: ["text/html", "application/json", "text/markdown"],
      },
      inLanguage: "tr-TR",
    },
    {
      "@type": "Action",
      name: "search-legal-updates",
      description: "Güncel Yargıtay kararı analizleri ve mevzuat değişikliği özetleri.",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/guncel-hukuk-gundemi`,
        feedUrl: `${SITE}/guncel-hukuk-gundemi.json`,
        contentType: ["text/html", "application/json", "text/markdown"],
      },
      inLanguage: "tr-TR",
    },
    {
      "@type": "Action",
      name: "browse-services",
      description: "Hukuk hizmetleri kataloğu — 8 alan: iş, ceza, icra-iflas, kira-gayrimenkul, miras-aile, sözleşmeler, ticaret, tüketici-sigorta.",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/hizmetler`,
        feedUrl: `${SITE}/hizmetler.json`,
        contentType: ["text/html", "application/json", "text/markdown"],
      },
      inLanguage: "tr-TR",
    },
    {
      "@type": "Action",
      name: "request-consultation",
      description: "Hukuki danışmanlık randevusu talebi. Telefon, e-posta veya WhatsApp üzerinden ulaşılabilir.",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/#iletisim`,
        contactType: ["telephone", "email", "whatsapp"],
        telephone: "+905519814937",
        email: "vegalaw.contact@gmail.com",
        whatsapp: "https://wa.me/905519814937",
      },
      inLanguage: "tr-TR",
    },
  ],
};

writeJson(".well-known/agent-skills.json", agentSkills);

// 2) API Catalog (RFC 9727)
const apiCatalog = {
  "@context": "https://www.rfc-editor.org/rfc/rfc9727",
  linkset: [
    {
      anchor: SITE + "/",
      "service-desc": [
        {
          href: `${SITE}/.well-known/agent-skills.json`,
          type: "application/json",
          title: "Vega Hukuk Agent Skills",
        },
      ],
      "service-doc": [
        {
          href: `${SITE}/llms.txt`,
          type: "text/plain",
          title: "LLM-friendly site overview",
        },
      ],
      "service-meta": [
        {
          href: `${SITE}/sitemap.xml`,
          type: "application/xml",
          title: "Sitemap",
        },
      ],
    },
  ],
};
writeJson(".well-known/api-catalog", apiCatalog);

// 3) Feeds
const blogFeed = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${SITE}/blog#blog`,
  name: "Vega Hukuk İstanbul Blog",
  url: `${SITE}/blog`,
  inLanguage: "tr-TR",
  publisher: { "@id": `${SITE}/#legalservice` },
  blogPost: blog.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt || p.description || p.seoDescription,
    url: `${SITE}/blog/${p.slug}`,
    markdownUrl: `${SITE}/blog/${p.slug}.md`,
    datePublished: p.publishedAt,
    author: p.author || "Vega Hukuk",
    inLanguage: "tr-TR",
  })),
};
writeJson("blog.json", blogFeed);

const legalFeed = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE}/guncel-hukuk-gundemi#feed`,
  name: "Güncel Hukuk Gündemi — Vega Hukuk İstanbul",
  url: `${SITE}/guncel-hukuk-gundemi`,
  inLanguage: "tr-TR",
  publisher: { "@id": `${SITE}/#legalservice` },
  itemListElement: legal.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Article",
      headline: p.title,
      description: p.excerpt || p.description || p.seoDescription,
      url: `${SITE}/guncel-hukuk-gundemi/${p.slug}`,
      markdownUrl: `${SITE}/guncel-hukuk-gundemi/${p.slug}.md`,
      datePublished: p.publishedAt,
      inLanguage: "tr-TR",
    },
  })),
};
writeJson("guncel-hukuk-gundemi.json", legalFeed);

const servicesFeed = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE}/hizmetler#feed`,
  name: "Hizmet Alanları — Vega Hukuk İstanbul",
  url: `${SITE}/hizmetler`,
  inLanguage: "tr-TR",
  publisher: { "@id": `${SITE}/#legalservice` },
  itemListElement: services.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.heading || s.title,
      description: s.description,
      url: `${SITE}/hizmetler/${s.slug}`,
      markdownUrl: `${SITE}/hizmetler/${s.slug}.md`,
      provider: { "@id": `${SITE}/#legalservice` },
      inLanguage: "tr-TR",
    },
  })),
};
writeJson("hizmetler.json", servicesFeed);

const teamFeed = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE}/ekip#feed`,
  name: "Ekip — Vega Hukuk İstanbul",
  url: `${SITE}/ekip`,
  inLanguage: "tr-TR",
  publisher: { "@id": `${SITE}/#legalservice` },
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Person",
        "@id": `${SITE}/ekip/aykut-yesilkaya#person`,
        name: "Av. Aykut Yeşilkaya",
        jobTitle: "Kurucu Avukat",
        url: `${SITE}/ekip/aykut-yesilkaya`,
        markdownUrl: `${SITE}/ekip/aykut-yesilkaya.md`,
        identifier: { "@type": "PropertyValue", propertyID: "TBB Sicil", value: "61223" },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Person",
        "@id": `${SITE}/ekip/mucahit-islam-keskun#person`,
        name: "Av. Mücahit İslam Keskün",
        jobTitle: "Kurucu Avukat",
        url: `${SITE}/ekip/mucahit-islam-keskun`,
        markdownUrl: `${SITE}/ekip/mucahit-islam-keskun.md`,
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Person",
        "@id": `${SITE}/ekip/busra-yesilkaya#person`,
        name: "Av. Büşra Yeşilkaya",
        jobTitle: "Avukat",
        url: `${SITE}/ekip/busra-yesilkaya`,
        markdownUrl: `${SITE}/ekip/busra-yesilkaya.md`,
      },
    },
  ],
};
writeJson("ekip.json", teamFeed);

console.log(`Agent feeds generated: agent-skills.json, api-catalog, 4 feed.json files`);
