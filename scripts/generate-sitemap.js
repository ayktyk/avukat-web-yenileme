import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const SITE = "https://vegahukukistanbul.com";
const today = new Date().toISOString().slice(0, 10);

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const parseMarkdown = (raw) => {
  const normalized = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return { data: {}, content: normalized.trim() };
  }

  const endIndex = normalized.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return { data: {}, content: normalized.trim() };
  }

  const frontmatterBlock = normalized.slice(4, endIndex);
  const content = normalized.slice(endIndex + 5).trim();
  const data = frontmatterBlock.split("\n").reduce((acc, line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      return acc;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");

    if (value) {
      acc[key] = value;
    }

    return acc;
  }, {});

  return { data, content };
};

const markdownToText = (value) =>
  value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[#>*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const collectEntries = (dir, prefix, defaults) => {
  const folder = join(root, "src", "content", dir);

  try {
    return readdirSync(folder)
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const raw = readFileSync(join(folder, file), "utf-8");
        const { data, content } = parseMarkdown(raw);
        const slug = data.slug ?? file.replace(/\.md$/, "");
        const title = data.title ?? slug;
        const excerpt = data.seoDescription ?? data.excerpt ?? markdownToText(content).slice(0, 220);
        const date = data.updatedAt ?? data.publishedAt ?? today;

        return {
          loc: `${SITE}/${prefix}/${slug}`,
          title,
          description: excerpt,
          date,
          changefreq: defaults.changefreq,
          priority: defaults.priority,
        };
      });
  } catch {
    return [];
  }
};

const staticPages = [
  { loc: `${SITE}/`, title: "Vega Hukuk İstanbul", description: "Ana sayfa", date: today, changefreq: "weekly", priority: "1.0" },
  { loc: `${SITE}/blog`, title: "Blog", description: "Hukuki blog yazıları", date: today, changefreq: "weekly", priority: "0.8" },
  {
    loc: `${SITE}/muvekkil-yorumlari`,
    title: "Müvekkil Yorumları",
    description: "Google yorumları ve değerlendirmeler",
    date: today,
    changefreq: "daily",
    priority: "0.8",
  },
  {
    loc: `${SITE}/guncel-hukuk-gundemi`,
    title: "Güncel Hukuk Gündemi",
    description: "Güncel hukuk içerikleri",
    date: today,
    changefreq: "daily",
    priority: "0.8",
  },
  { loc: `${SITE}/kvkk-aydinlatma`, title: "KVKK Aydınlatma", description: "KVKK aydınlatma metni", date: today, changefreq: "monthly", priority: "0.3" },
  { loc: `${SITE}/cerez-politikasi`, title: "Çerez Politikası", description: "Çerez politikası", date: today, changefreq: "monthly", priority: "0.3" },
  { loc: `${SITE}/hukuki-uyari`, title: "Hukuki Uyarı", description: "Hukuki uyarı", date: today, changefreq: "monthly", priority: "0.3" },
];

const blogEntries = collectEntries("blog", "blog", { changefreq: "monthly", priority: "0.7" });
const legalEntries = collectEntries("legal-updates", "guncel-hukuk-gundemi", { changefreq: "monthly", priority: "0.7" });
const allPages = [...staticPages, ...blogEntries, ...legalEntries];
const rssEntries = [...blogEntries, ...legalEntries]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 50);

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${escapeXml(page.loc)}</loc>
    <lastmod>${escapeXml(page.date)}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Vega Hukuk İçerik Akışı</title>
    <link>${SITE}</link>
    <description>Blog yazıları ve güncel hukuk gündemi içerikleri</description>
    <language>tr-TR</language>
${rssEntries
  .map(
    (entry) => `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${escapeXml(entry.loc)}</link>
      <guid>${escapeXml(entry.loc)}</guid>
      <pubDate>${new Date(entry.date).toUTCString()}</pubDate>
      <description>${escapeXml(entry.description)}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

writeFileSync(join(root, "public", "sitemap.xml"), sitemapXml, "utf-8");
writeFileSync(join(root, "public", "rss.xml"), rssXml, "utf-8");

console.log(`Sitemap generated: ${allPages.length} URLs`);
console.log(`RSS generated: ${rssEntries.length} items`);
