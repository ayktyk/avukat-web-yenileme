import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const SITE = "https://vegahukukistanbul.com";

const readFrontmatter = (filePath) => {
  const raw = readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = {};
  const body = match[1];
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
    fm[key] = value;
  }
  return fm;
};

const collect = (dir) => {
  const folder = join(root, "src", "content", dir);
  try {
    return readdirSync(folder)
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        const fm = readFrontmatter(join(folder, f));
        const preferHeading = dir === "services";
        const title = preferHeading
          ? (fm.heading || fm.title || "").trim()
          : (fm.title || fm.heading || "").trim();
        return {
          slug: (fm.slug || "").trim(),
          title,
          description: (fm.description || fm.excerpt || "").trim(),
          publishedAt: (fm.publishedAt || "").trim(),
          orderIndex: parseInt(fm.orderIndex || "99", 10),
        };
      })
      .filter((x) => x.slug);
  } catch {
    return [];
  }
};

const services = collect("services").sort((a, b) => a.orderIndex - b.orderIndex);
const blog = collect("blog").sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
const legal = collect("legal-updates").sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));

const truncate = (s, n) => {
  if (!s) return "";
  const clean = s.replace(/\s+/g, " ").trim();
  return clean.length > n ? clean.slice(0, n - 1).trimEnd() + "…" : clean;
};

const lines = [];
lines.push("# Vega Hukuk İstanbul");
lines.push("");
lines.push("> Kadıköy merkezli hukuk bürosu. İş, ceza, icra-iflas, kira-gayrimenkul,");
lines.push("> miras-aile, sözleşmeler, ticaret ve tüketici-sigorta hukuku alanlarında");
lines.push("> hukuki danışmanlık ve dava takibi. Kurucu avukat: Av. Aykut Yeşilkaya");
lines.push("> (İstanbul Barosu sicil no: 61223).");
lines.push("");
lines.push(`Site: ${SITE}`);
lines.push("Adres: Osmanağa Mah., Karadut Sok. No:14/10, Kadıköy/İstanbul");
lines.push("Telefon: +90 551 981 4937");
lines.push("E-posta: vegalaw.contact@gmail.com");
lines.push("");
lines.push("## Hizmetler");
lines.push("");
for (const s of services) {
  lines.push(`- [${s.title}](${SITE}/hizmetler/${s.slug}): ${truncate(s.description, 180)}`);
}
lines.push("");
lines.push("## Hesaplama Araçları");
lines.push("");
lines.push(
  `- [İşçilik Alacakları Hesaplama](${SITE}/hesaplamalar/iscilik-alacaklari): Kıdem, ihbar, fazla mesai, UBGT, hafta tatili ve yıllık izin alacaklarını dönem bazlı tavan ve kademeli vergi kurallarıyla hesaplama aracı.`,
);
lines.push(
  `- [Vekalet Ücreti Hesaplama](${SITE}/hesaplamalar/vekalet-ucreti): 2026 yılı AAÜT tarifesine göre nispi ve maktu vekalet ücretini; mahkeme türü, dava aşaması ve seri dava indirimiyle hesaplama aracı.`,
);
lines.push(
  `- [Arabuluculuk Ücreti Hesaplama](${SITE}/hesaplamalar/arabuluculuk-ucreti): Arabuluculuk Asgari Ücret Tarifesi uyarınca saatlik ve nispi ücretten yüksek olanı, KDV ve stopaj hesabıyla net ödeme tutarını gösteren araç.`,
);
lines.push(
  `- [Faiz Hesaplama](${SITE}/hesaplamalar/faiz): 3095 sayılı Kanun kapsamında yasal, ticari (TCMB avans) veya özel oran üzerinden dönem değişikliklerini dikkate alan kümülatif faiz hesaplama aracı.`,
);
lines.push(
  `- [Harç ve Gider Avansı Hesaplama](${SITE}/hesaplamalar/harc): 492 sayılı Harçlar Kanunu ve Gider Avansı Tarifesi kapsamında başvurma harcı, peşin harç, vekalet ve gider avansını topluca hesaplama aracı.`,
);
lines.push(
  `- [Kira Süreleri ve Artış Hesaplama](${SITE}/hesaplamalar/kira-sureleri): TBK m.315-352 tahliye nedenleri için ihtar, dava ve fesih sürelerini; m.344 kapsamında TÜFE ortalamasına göre kira artış üst sınırını hesaplama aracı.`,
);
lines.push(
  `- [Kaza (Maluliyet) Tazminatı Hesaplama](${SITE}/hesaplamalar/kaza-tazminati): Trafik ve iş kazalarında TRH2010 ömür tablosu ve %10 progresif rant yöntemiyle sürekli maluliyet tazminatını aktif-pasif dönem ayrımıyla hesaplama aracı.`,
);
lines.push(
  `- [İnfaz Hesaplama](${SITE}/hesaplamalar/infaz): 5275/7242/7456 sayılı Kanunlar kapsamında koşullu salıverilme, denetimli serbestlik, açık cezaevi ve bihakkin tahliye tarihlerini hesaplama aracı.`,
);
lines.push(
  `- [Miras Payı Hesaplama](${SITE}/hesaplamalar/miras-payi): Türk Medeni Kanunu zümre sistemine göre mirasçı paylarını ve saklı pay oranlarını hesaplama aracı (yakında).`,
);
lines.push("");
lines.push("## Blog");
lines.push("");
for (const b of blog) {
  lines.push(`- [${b.title}](${SITE}/blog/${b.slug}): ${truncate(b.description, 180)}`);
}
lines.push("");
lines.push("## Güncel Hukuk Gündemi");
lines.push("");
for (const l of legal) {
  lines.push(`- [${l.title}](${SITE}/guncel-hukuk-gundemi/${l.slug}): ${truncate(l.description, 180)}`);
}
lines.push("");
lines.push("## Ekip");
lines.push("");
lines.push(`- [Av. Aykut Yeşilkaya](${SITE}/ekip/aykut-yesilkaya) — Kurucu avukat, İstanbul Barosu sicil no: 61223. İş, kira, miras-aile, tüketici ve sigorta uyuşmazlıkları odaklı uygulamacı.`);
lines.push(`- [Av. Mücahit İslam Keskün](${SITE}/ekip/mucahit-islam-keskun) — Kurucu avukat. Ceza hukuku ağırlıklı dosya yönetimi; soruşturma, kovuşturma, istinaf ve temyiz süreçlerinde müdafilik.`);
lines.push(`- [Av. Büşra Yeşilkaya](${SITE}/ekip/busra-yesilkaya) — Miras, aile ve gayrimenkul hukuku ağırlıklı dosya yönetimi; sözleşmeler hukuku danışmanlığı.`);
lines.push("");
lines.push("## Yasal");
lines.push("");
lines.push(`- [KVKK Aydınlatma Metni](${SITE}/kvkk-aydinlatma)`);
lines.push(`- [Çerez Politikası](${SITE}/cerez-politikasi)`);
lines.push(`- [Hukuki Uyarı](${SITE}/hukuki-uyari)`);
lines.push("");
lines.push("## Ödeme");
lines.push("");
lines.push(
  `- [E-Tahsilat](${SITE}/e-tahsilat): Kredi kartı ile güvenli online ödeme sayfası. Moka POS altyapısı (BDDK lisanslı) üzerinden vekâlet ücreti, danışmanlık bedeli ve yargılama gideri avansı tahsilatı.`,
);
lines.push("");
lines.push("## İletişim");
lines.push("");
lines.push(`- Randevu: ${SITE}/#iletisim`);
lines.push("- Telefon: +90 551 981 4937");
lines.push("- E-posta: vegalaw.contact@gmail.com");
lines.push("- Çalışma saatleri: Pazartesi–Cuma 09:00–18:00");
lines.push("");
lines.push("## Teknik");
lines.push("");
lines.push(`- Sitemap: ${SITE}/sitemap.xml`);
lines.push(`- Kanonik alan: ${SITE}`);
lines.push("- İçerik dili: Türkçe (tr-TR)");
lines.push("- Lisans: © Vega Hukuk İstanbul. Alıntı için kaynak gösterilmelidir.");
lines.push("");

writeFileSync(join(root, "public", "llms.txt"), lines.join("\n"), "utf-8");
console.log(
  `llms.txt generated: ${services.length} services, ${blog.length} blog posts, ${legal.length} legal updates`,
);
