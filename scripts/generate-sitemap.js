import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const SITE = "https://vegahukukistanbul.com";

const extractField = (raw, field) => {
  const match = raw.match(new RegExp(`^${field}:\\s*"?([^"\\n]+)"?\\s*$`, "m"));
  return match ? match[1].trim() : null;
};

const normalizeDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
};

const collectEntries = (dir, prefix) => {
  const folder = join(root, "src", "content", dir);
  try {
    return readdirSync(folder)
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        const raw = readFileSync(join(folder, f), "utf-8").replace(/^﻿/, "");
        const slug = extractField(raw, "slug");
        if (!slug) return null;
        const lastmod =
          normalizeDate(extractField(raw, "updatedAt")) ?? normalizeDate(extractField(raw, "publishedAt"));
        return { loc: `${SITE}/${prefix}/${slug}`, lastmod };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
};

// Statik sayfalarda lastmod atlanir — her build'de bugunun tarihini yazmak
// Google'in lastmod sinyaline guvenini dusurur.
const staticPages = [
  { loc: `${SITE}/`, changefreq: "weekly", priority: "1.0" },
  { loc: `${SITE}/hakkimizda`, changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE}/hizmetler`, changefreq: "monthly", priority: "0.9" },
  { loc: `${SITE}/e-tahsilat`, changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE}/hesaplamalar`, changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE}/hesaplamalar/iscilik-alacaklari`, changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE}/hesaplamalar/vekalet-ucreti`, changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE}/hesaplamalar/arabuluculuk-ucreti`, changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE}/hesaplamalar/faiz`, changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE}/hesaplamalar/harc`, changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE}/hesaplamalar/kira-sureleri`, changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE}/hesaplamalar/kaza-tazminati`, changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE}/hesaplamalar/miras-payi`, changefreq: "monthly", priority: "0.6" },
  { loc: `${SITE}/hesaplamalar/infaz`, changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE}/blog`, changefreq: "weekly", priority: "0.8" },
  { loc: `${SITE}/guncel-hukuk-gundemi`, changefreq: "daily", priority: "0.8" },
  { loc: `${SITE}/ekip`, changefreq: "monthly", priority: "0.6" },
  { loc: `${SITE}/ekip/aykut-yesilkaya`, changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE}/ekip/mucahit-islam-keskun`, changefreq: "monthly", priority: "0.6" },
  { loc: `${SITE}/ekip/busra-yesilkaya`, changefreq: "monthly", priority: "0.6" },
  { loc: `${SITE}/kvkk-aydinlatma`, changefreq: "monthly", priority: "0.3" },
  { loc: `${SITE}/cerez-politikasi`, changefreq: "monthly", priority: "0.3" },
  { loc: `${SITE}/hukuki-uyari`, changefreq: "monthly", priority: "0.3" },
];

const blogUrls = collectEntries("blog", "blog").map((entry) => ({
  ...entry,
  changefreq: "monthly",
  priority: "0.7",
}));

const legalUrls = collectEntries("legal-updates", "guncel-hukuk-gundemi").map((entry) => ({
  ...entry,
  changefreq: "monthly",
  priority: "0.7",
}));

const serviceUrls = collectEntries("services", "hizmetler").map((entry) => ({
  ...entry,
  changefreq: "monthly",
  priority: "0.9",
}));

const allPages = [...staticPages, ...serviceUrls, ...blogUrls, ...legalUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map((p) => {
    const lines = [`    <loc>${p.loc}</loc>`];
    if (p.lastmod) lines.push(`    <lastmod>${p.lastmod}</lastmod>`);
    lines.push(`    <changefreq>${p.changefreq}</changefreq>`);
    lines.push(`    <priority>${p.priority}</priority>`);
    return `  <url>\n${lines.join("\n")}\n  </url>`;
  })
  .join("\n")}
</urlset>
`;

writeFileSync(join(root, "public", "sitemap.xml"), xml, "utf-8");
console.log(`Sitemap generated: ${allPages.length} URLs`);
