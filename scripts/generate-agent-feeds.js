import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { createHash } from "crypto";
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

const writeText = (relPath, content) => {
  const target = join(distDir, relPath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, "utf-8");
};

const sha256 = (content) => createHash("sha256").update(content, "utf-8").digest("hex");

const sha256OfFile = (relPath) => {
  const file = join(distDir, relPath);
  if (!existsSync(file)) return null;
  return sha256(readFileSync(file, "utf-8"));
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

// 1b) Agent Skills Discovery RFC v0.2.0 — /.well-known/agent-skills/index.json
// https://github.com/cloudflare/agent-skills-discovery-rfc
const skillsIndex = {
  $schema: "https://raw.githubusercontent.com/cloudflare/agent-skills-discovery-rfc/main/schemas/v0.2.0/index.json",
  version: "0.2.0",
  publisher: {
    name: "Vega Hukuk İstanbul",
    url: SITE,
    contact: "vegalaw.contact@gmail.com",
  },
  skills: [
    ...calculators.map((c) => {
      const slug = c.name.replace("-hesaplama", "");
      const mdPath = `hesaplamalar/${slug}.md`;
      const hash = sha256OfFile(mdPath);
      return {
        name: c.name,
        type: "calculator",
        description: c.description,
        url: `${SITE}/hesaplamalar/${slug}.md`,
        htmlUrl: `${SITE}/hesaplamalar/${slug}`,
        embedUrl: `${SITE}/embed/${slug}`,
        inputSchema: {
          type: "object",
          properties: Object.fromEntries(c.inputs.map((i) => [i, { type: "string" }])),
        },
        outputSchema: {
          type: "object",
          properties: Object.fromEntries(c.outputs.map((o) => [o, { type: "number" }])),
        },
        sha256: hash || sha256(c.description),
        inLanguage: "tr-TR",
      };
    }),
    ...services.map((s) => {
      const mdPath = `hizmetler/${s.slug}.md`;
      const hash = sha256OfFile(mdPath);
      return {
        name: `service-${s.slug}`,
        type: "knowledge",
        description: s.description || s.heading,
        url: `${SITE}/hizmetler/${s.slug}.md`,
        htmlUrl: `${SITE}/hizmetler/${s.slug}`,
        sha256: hash || sha256(s.description || ""),
        inLanguage: "tr-TR",
      };
    }),
    {
      name: "blog-feed",
      type: "feed",
      description: `Vega Hukuk blog yazıları arşivi (${blog.length} yazı).`,
      url: `${SITE}/blog.json`,
      htmlUrl: `${SITE}/blog`,
      markdownUrl: `${SITE}/blog.md`,
      sha256: sha256OfFile("blog.json") || sha256("blog-feed"),
      inLanguage: "tr-TR",
    },
    {
      name: "legal-updates-feed",
      type: "feed",
      description: `Güncel Yargıtay kararı analizleri (${legal.length} yazı).`,
      url: `${SITE}/guncel-hukuk-gundemi.json`,
      htmlUrl: `${SITE}/guncel-hukuk-gundemi`,
      markdownUrl: `${SITE}/guncel-hukuk-gundemi.md`,
      sha256: sha256OfFile("guncel-hukuk-gundemi.json") || sha256("legal-feed"),
      inLanguage: "tr-TR",
    },
    {
      name: "team-feed",
      type: "feed",
      description: "Üç avukatlı ekip profilleri (Aykut Yeşilkaya, Mücahit İslam Keskün, Büşra Yeşilkaya).",
      url: `${SITE}/ekip.json`,
      htmlUrl: `${SITE}/ekip`,
      markdownUrl: `${SITE}/ekip.md`,
      sha256: sha256OfFile("ekip.json") || sha256("team-feed"),
      inLanguage: "tr-TR",
    },
  ],
};
writeJson(".well-known/agent-skills/index.json", skillsIndex);

// 1c) MCP Server Card — /.well-known/mcp/server-card.json
// https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127
// Note: This site does not run an MCP server endpoint; we publish a discovery card
// with capabilities pointing to the agent-skills index for compatibility.
const mcpServerCard = {
  schemaVersion: "0.1",
  serverInfo: {
    name: "vega-hukuk-istanbul",
    version: "0.1.0",
    title: "Vega Hukuk İstanbul",
    description: "Türk hukuku alanında 9 hesaplama aracı, hizmet katalogu ve içerik feed'leri sunan hukuk bürosu.",
    homepage: SITE,
    contact: "vegalaw.contact@gmail.com",
  },
  transport: {
    type: "static",
    note: "This site does not currently expose a live MCP transport. Discovery via agent-skills index and markdown content negotiation.",
    discoveryUrl: `${SITE}/.well-known/agent-skills/index.json`,
  },
  capabilities: {
    tools: {
      listChanged: false,
      count: 9,
      indexUrl: `${SITE}/.well-known/agent-skills/index.json`,
    },
    resources: {
      listChanged: false,
      indexUrl: `${SITE}/.well-known/agent-skills/index.json`,
      formats: ["text/html", "text/markdown", "application/json"],
    },
    prompts: {
      listChanged: false,
      count: 0,
    },
    logging: false,
    completion: false,
  },
  meta: {
    license: "© Vega Hukuk İstanbul. Bilgilendirme amaçlıdır.",
    inLanguage: "tr-TR",
  },
};
writeJson(".well-known/mcp/server-card.json", mcpServerCard);

// 1d) OAuth/OIDC Discovery — minimal "no-auth" metadata
// While this site does not host protected APIs, declarative metadata signals
// that no OAuth flow is required for content access.
const openidConfig = {
  issuer: SITE,
  authorization_endpoint: `${SITE}/.well-known/oauth-not-required`,
  token_endpoint: `${SITE}/.well-known/oauth-not-required`,
  jwks_uri: `${SITE}/.well-known/jwks.json`,
  response_types_supported: [],
  subject_types_supported: ["public"],
  id_token_signing_alg_values_supported: ["none"],
  grant_types_supported: [],
  scopes_supported: ["openid"],
  service_documentation: `${SITE}/.well-known/agent-skills/index.json`,
  note: "This site does not host protected APIs. Public content is freely accessible via HTML/markdown without authentication.",
};
writeJson(".well-known/openid-configuration", openidConfig);
writeJson(".well-known/oauth-authorization-server", openidConfig);

// 1e) OAuth Protected Resource Metadata (RFC 9728)
const protectedResource = {
  resource: SITE,
  authorization_servers: [],
  scopes_supported: [],
  bearer_methods_supported: [],
  resource_documentation: `${SITE}/.well-known/agent-skills/index.json`,
  resource_signing_alg_values_supported: ["none"],
  note: "Public content — no authentication required. Agent capabilities described in /.well-known/agent-skills/index.json.",
};
writeJson(".well-known/oauth-protected-resource", protectedResource);

// 1f) JWKS — empty key set (Web Bot Auth informational only)
const jwks = {
  keys: [],
  note: "Vega Hukuk İstanbul does not currently sign outbound bot/agent requests. This empty JWKS satisfies discovery requirements.",
};
writeJson(".well-known/jwks.json", jwks);
writeJson(".well-known/http-message-signatures-directory", jwks);

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
