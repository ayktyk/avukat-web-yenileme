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

let count = 0;

const writeMd = (relPath, content) => {
  const target = join(distDir, relPath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, "utf-8");
  count++;
};

const fm = (data) => {
  const lines = ["---"];
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue;
    const value = typeof v === "string" && (v.includes(":") || v.includes("\n")) ? `"${v.replace(/"/g, '\\"')}"` : v;
    lines.push(`${k}: ${value}`);
  }
  lines.push("---");
  lines.push("");
  return lines.join("\n");
};

const readFm = (filePath) => {
  const raw = readFileSync(filePath, "utf-8").replace(/^﻿/, "");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    out[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
  }
  return out;
};

const collectContent = (dir) => {
  const folder = join(root, "src", "content", dir);
  if (!existsSync(folder)) return [];
  return readdirSync(folder)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const filePath = join(folder, f);
      const raw = readFileSync(filePath, "utf-8").replace(/^﻿/, "");
      const meta = readFm(filePath);
      return { file: f, raw, meta };
    })
    .filter((x) => x.meta.slug);
};

// 1) Mevcut markdown content'i dist'e kopyala (frontmatter + body — orijinal halleri zaten temiz)
const blogPosts = collectContent("blog");
for (const p of blogPosts) {
  writeMd(`blog/${p.meta.slug}.md`, p.raw);
}

const legalPosts = collectContent("legal-updates");
for (const p of legalPosts) {
  writeMd(`guncel-hukuk-gundemi/${p.meta.slug}.md`, p.raw);
}

const services = collectContent("services");
for (const p of services) {
  writeMd(`hizmetler/${p.meta.slug}.md`, p.raw);
}

// 2) Hub sayfaları (listeler)
const blogHub = [
  fm({
    url: `${SITE}/blog`,
    title: "Blog | Vega Hukuk İstanbul",
    description: "Türk hukuku blog yazıları arşivi: iş, ceza, kira, miras, tüketici, sigorta, sözleşmeler ve gayrimenkul hukukuna dair güncel rehber içerikler.",
    type: "list",
    items: blogPosts.length,
  }),
  "# Blog Yazıları",
  "",
  "Vega Hukuk İstanbul tarafından kaleme alınmış güncel hukuki rehber yazılar. Her yazı yürürlükteki mevzuat ve Yargıtay içtihatları ışığında hazırlanmıştır.",
  "",
];
for (const p of blogPosts.sort((a, b) => (b.meta.publishedAt || "").localeCompare(a.meta.publishedAt || ""))) {
  blogHub.push(`- [${p.meta.title}](${SITE}/blog/${p.meta.slug}) — ${p.meta.excerpt || p.meta.description || ""}`);
}
writeMd("blog.md", blogHub.join("\n") + "\n");

const legalHub = [
  fm({
    url: `${SITE}/guncel-hukuk-gundemi`,
    title: "Güncel Hukuk Gündemi | Vega Hukuk İstanbul",
    description: "Yargıtay kararları ve mevzuat değişikliklerine ilişkin güncel analizler.",
    type: "list",
    items: legalPosts.length,
  }),
  "# Güncel Hukuk Gündemi",
  "",
  "Yargıtay kararları, içtihat değişiklikleri ve güncel mevzuat gelişmelerine ilişkin analiz yazıları.",
  "",
];
for (const p of legalPosts.sort((a, b) => (b.meta.publishedAt || "").localeCompare(a.meta.publishedAt || ""))) {
  legalHub.push(`- [${p.meta.title}](${SITE}/guncel-hukuk-gundemi/${p.meta.slug}) — ${p.meta.excerpt || p.meta.description || ""}`);
}
writeMd("guncel-hukuk-gundemi.md", legalHub.join("\n") + "\n");

const servicesHub = [
  fm({
    url: `${SITE}/hizmetler`,
    title: "Hizmet Alanları | Vega Hukuk İstanbul",
    description: "İş, ceza, icra-iflas, kira-gayrimenkul, miras-aile, sözleşmeler, ticaret ve tüketici-sigorta hukuku alanlarında danışmanlık ve dava takibi.",
    type: "list",
    items: services.length,
  }),
  "# Hizmet Alanları",
  "",
  "Vega Hukuk İstanbul'un sekiz ana hukuk alanında sunduğu hizmetler. Her alanda hem hukuki danışmanlık hem dava takibi yapılır.",
  "",
];
for (const s of services.sort((a, b) => parseInt(a.meta.orderIndex || "99") - parseInt(b.meta.orderIndex || "99"))) {
  servicesHub.push(`- [${s.meta.heading || s.meta.title}](${SITE}/hizmetler/${s.meta.slug}) — ${s.meta.description || ""}`);
}
writeMd("hizmetler.md", servicesHub.join("\n") + "\n");

// 3) Ekip sayfaları (team-data.ts'in özetinden — manuel template çünkü TypeScript)
const teamMembers = [
  {
    slug: "aykut-yesilkaya",
    name: "Av. Aykut Yeşilkaya",
    jobTitle: "Kurucu Avukat",
    baroSicilNo: "61223",
    baro: "İstanbul Barosu",
    role: "Kurucu Avukat • Arabulucu • Özel Hukuk",
    short: "İş hukuku, kira ve gayrimenkul, miras ve aile hukuku, tüketici ve sigorta alanlarında hukuki danışmanlık ve dava takibi.",
    long: [
      "Av. Aykut Yeşilkaya, İstanbul Barosu'na kayıtlı (sicil no: 61223) kurucu avukat olarak Vega Hukuk İstanbul bünyesinde görev yapar. İş hukuku, kira ve gayrimenkul, miras ve aile hukuku ile tüketici ve sigorta uyuşmazlıkları odaklı uygulamacıdır.",
      "Büro stratejisi, dosyaların sadece mahkeme sonrası değil; uyuşmazlık doğmadan önceki sözleşme, arabuluculuk ve ihtarname aşamasında da proaktif yönetilmesine dayanır. Müvekkil iletişiminde resmi fakat erişilebilir bir dil benimser; her dosyada karar ve mevzuat referanslı değerlendirme yapılır.",
      "Yazılı çalışmalar ve Vega Hukuk blog sayfasındaki makaleler, güncel Yargıtay içtihadı ve mevzuat takibiyle üretilir. Yayınlanan tüm içerikler avukat tarafından gözden geçirilmektedir.",
    ],
    knowsAbout: ["İş Hukuku", "Kira Hukuku", "Gayrimenkul Hukuku", "Miras Hukuku", "Aile Hukuku", "Tüketici Hukuku", "Sigorta Hukuku", "Arabuluculuk", "İcra ve İflas Hukuku"],
  },
  {
    slug: "mucahit-islam-keskun",
    name: "Av. Mücahit İslam Keskün",
    jobTitle: "Kurucu Avukat",
    baro: "İstanbul Barosu",
    role: "Kurucu Avukat · Ceza Hukuku",
    short: "Ceza davalarında savunma, soruşturma ve kovuşturma süreçlerinde etkin temsil ve stratejik savunma hizmeti.",
    long: [
      "Av. Mücahit İslam Keskün, Vega Hukuk İstanbul'un kurucu avukatlarındandır. Ceza hukuku ağırlıklı dosya yönetimi yürütür; soruşturma aşamasından istinaf ve temyize uzanan kovuşturma sürecinin her aşamasında müvekkil temsili sağlar.",
      "Dosya stratejisi; delil değerlendirmesi, tutukluluk ve adli kontrol incelemeleri, uzlaştırma kurumunun doğru yönetilmesi ve mağdur-müşteki müdafiliği gibi ceza yargılamasının kritik eşiklerinde yoğunlaşır.",
    ],
    knowsAbout: ["Ceza Hukuku", "Ceza Muhakemesi", "Tutukluluk", "Adli Kontrol", "Uzlaştırma", "Sözleşmeler Hukuku"],
  },
  {
    slug: "busra-yesilkaya",
    name: "Av. Büşra Yeşilkaya",
    jobTitle: "Avukat",
    baro: "İstanbul Barosu",
    role: "Sözleşmeler Hukuku · Miras · Aile",
    short: "Miras, aile ve gayrimenkul hukuku ağırlıklı dosya yönetimi; sözleşme tasarımı ve uyuşmazlık çözümünde detay odaklı hukuki destek.",
    long: [
      "Av. Büşra Yeşilkaya, Vega Hukuk İstanbul ekibinde miras, aile ve gayrimenkul hukuku ağırlıklı dosyaları yönetir. Sözleşme tasarımı, müzakeresi ve uyuşmazlık çözümünde titiz bir yaklaşım benimser.",
      "Dosyalarda müvekkil ile düzenli iletişim ve delil seti yönetimi önceliklidir. Her dosyada yargı kararlarına atıflı stratejik değerlendirme yapılır.",
    ],
    knowsAbout: ["Miras Hukuku", "Aile Hukuku", "Gayrimenkul Hukuku", "Sözleşmeler Hukuku", "Sözleşme Tasarımı", "Uyuşmazlık Çözümü"],
  },
];

for (const m of teamMembers) {
  const sicil = m.baroSicilNo ? `\n${m.baro} sicil no: **${m.baroSicilNo}**` : `\n${m.baro}`;
  const knowsAbout = m.knowsAbout.map((k) => `- ${k}`).join("\n");
  const longBio = m.long.map((p) => p).join("\n\n");
  const body = `# ${m.name}

${m.role}${sicil}

## Özet

${m.short}

## Biyografi

${longBio}

## Uzmanlık Alanları

${knowsAbout}

## İletişim

- Telefon: +90 551 981 4937
- E-posta: vegalaw.contact@gmail.com
- Adres: Osmanağa Mah., Karadut Sok. No:14/10, Kadıköy/İstanbul
`;

  writeMd(
    `ekip/${m.slug}.md`,
    fm({
      url: `${SITE}/ekip/${m.slug}`,
      title: `${m.name} | Vega Hukuk İstanbul`,
      description: m.short,
      type: "person",
      jobTitle: m.jobTitle,
    }) + body,
  );
}

// Ekip listesi
const teamHub = [
  fm({
    url: `${SITE}/ekip`,
    title: "Ekibimiz | Vega Hukuk İstanbul",
    description: "Vega Hukuk İstanbul ekibi: Av. Aykut Yeşilkaya (sicil 61223), Av. Mücahit İslam Keskün ve Av. Büşra Yeşilkaya. Kadıköy merkezli hukuk bürosu.",
    type: "list",
    items: teamMembers.length,
  }),
  "# Ekibimiz",
  "",
  "Vega Hukuk İstanbul, Kadıköy merkezli bir hukuk bürosudur. Üç avukatlı ekibimiz; iş, ceza, kira, gayrimenkul, miras, aile, tüketici, sigorta, sözleşmeler ve icra-iflas alanlarında hukuki danışmanlık ve dava takibi sağlar.",
  "",
];
for (const m of teamMembers) {
  teamHub.push(`- [${m.name}](${SITE}/ekip/${m.slug}) — ${m.role}. ${m.short}`);
}
writeMd("ekip.md", teamHub.join("\n") + "\n");

// 4) Hesaplayıcı sayfaları
const calculators = [
  { slug: "iscilik-alacaklari", title: "İşçilik Alacakları Hesaplama", desc: "Kıdem, ihbar, fazla mesai, UBGT, hafta tatili ve yıllık izin alacaklarını dönem bazlı tavan ve kademeli vergi kurallarıyla hesaplar." },
  { slug: "vekalet-ucreti", title: "Vekalet Ücreti Hesaplama", desc: "2026 yılı AAÜT tarifesine göre nispi ve maktu vekalet ücretini; mahkeme türü, dava aşaması ve seri dava indirimiyle hesaplar." },
  { slug: "arabuluculuk-ucreti", title: "Arabuluculuk Ücreti Hesaplama", desc: "Arabuluculuk Asgari Ücret Tarifesi uyarınca saatlik ve nispi ücretten yüksek olanı, KDV ve stopaj hesabıyla net ödeme tutarını gösterir." },
  { slug: "faiz", title: "Faiz Hesaplama", desc: "3095 sayılı Kanun kapsamında yasal, ticari (TCMB avans) veya özel oran üzerinden dönem değişikliklerini dikkate alan kümülatif faiz hesaplar." },
  { slug: "harc", title: "Harç ve Gider Avansı Hesaplama", desc: "492 sayılı Harçlar Kanunu ve Gider Avansı Tarifesi kapsamında başvurma harcı, peşin harç, vekalet ve gider avansını topluca hesaplar." },
  { slug: "kira-sureleri", title: "Kira Süreleri ve Artış Hesaplama", desc: "TBK m.315-352 tahliye nedenleri için ihtar, dava ve fesih sürelerini; m.344 kapsamında TÜFE ortalamasına göre kira artış üst sınırını hesaplar." },
  { slug: "kaza-tazminati", title: "Kaza (Maluliyet) Tazminatı Hesaplama", desc: "Trafik ve iş kazalarında TRH2010 ömür tablosu ve %10 progresif rant yöntemiyle sürekli maluliyet tazminatını aktif-pasif dönem ayrımıyla hesaplar." },
  { slug: "infaz", title: "İnfaz Hesaplama", desc: "5275/7242/7456 sayılı Kanunlar kapsamında koşullu salıverilme, denetimli serbestlik, açık cezaevi ve bihakkin tahliye tarihlerini hesaplar." },
  { slug: "miras-payi", title: "Miras Payı Hesaplama", desc: "Türk Medeni Kanunu zümre sistemine göre mirasçı paylarını ve saklı pay oranlarını hesaplar." },
];

for (const c of calculators) {
  const body = `# ${c.title}

${c.desc}

## Hesaplama Aracına Erişim

Hesaplama aracı tarayıcı tabanlı interaktif bir uygulamadır. Tam işlevli kullanım için: ${SITE}/hesaplamalar/${c.slug}

Embed (iframe) versiyonu: ${SITE}/embed/${c.slug}

## Hukuki Çerçeve

Bu hesaplama aracı yürürlükteki Türk mevzuatına uygun şekilde hazırlanmıştır ve bilgilendirme amaçlıdır. Spesifik dosyanız için profesyonel hukuki danışmanlık alınmalıdır.

## İletişim

- Telefon: +90 551 981 4937
- E-posta: vegalaw.contact@gmail.com
- Randevu: ${SITE}/#iletisim
`;
  writeMd(
    `hesaplamalar/${c.slug}.md`,
    fm({
      url: `${SITE}/hesaplamalar/${c.slug}`,
      title: `${c.title} | Vega Hukuk İstanbul`,
      description: c.desc,
      type: "tool",
      embedUrl: `${SITE}/embed/${c.slug}`,
    }) + body,
  );
}

const calcHub = [
  fm({
    url: `${SITE}/hesaplamalar`,
    title: "Hesaplama Araçları | Vega Hukuk İstanbul",
    description: "Türk hukukuna uygun ücretsiz hesaplama araçları: işçilik alacakları, vekalet ücreti, arabuluculuk, faiz, harç, kira, kaza tazminatı, infaz ve miras.",
    type: "list",
    items: calculators.length,
  }),
  "# Hesaplama Araçları",
  "",
  "Türk hukukuna uygun, ücretsiz, tarayıcı tabanlı hesaplama araçları. Hiçbiri kişisel veri toplamaz; tüm hesaplamalar yerel olarak yapılır.",
  "",
];
for (const c of calculators) {
  calcHub.push(`- [${c.title}](${SITE}/hesaplamalar/${c.slug}) — ${c.desc}`);
}
writeMd("hesaplamalar.md", calcHub.join("\n") + "\n");

// 5) Hakkımızda
const hakkimizdaBody = `# Vega Hukuk İstanbul Hakkında

Vega Hukuk İstanbul, Kadıköy merkezli bir hukuk bürosudur. Av. Aykut Yeşilkaya ve Av. Mücahit İslam Keskün tarafından kurulan büromuz; iş, ceza, kira ve gayrimenkul, miras ve aile, tüketici ve sigorta, sözleşmeler ile icra-iflas hukuku alanlarında müvekkillerine hukuki danışmanlık ve dava takibi sağlar.

Yaklaşımımızın temelinde uyuşmazlığı doğmadan önce öngörmek ve sözleşme, ihtarname, arabuluculuk gibi erken müdahale araçlarıyla zaman ve maliyet kaybını en aza indirmek vardır. Dosya açıldıktan sonra ise güncel Yargıtay içtihadı ve mevzuat takibiyle desteklenen, delil-ekonomi ilkesine uygun bir savunma yürütürüz.

## İlkelerimiz

### Misyon
Vaka-özel strateji, disiplinli süreç yönetimi ve güçlü müzakere ile müvekkillerimizin zamanını ve maliyetini optimize eden çözümler üretmek.

### Yaklaşım
Uyuşmazlığı erken safhada analiz ediyor, delil-ekonomi ilkesi ve güncel içtihat dengesiyle en rasyonel yolu öneriyoruz. Dosya açılmadan önce de yanınızdayız.

### Teknoloji
Hukuki araştırma ve belge otomasyonunda yapay zeka destekli araçlar kullanıyor; süreç şeffaflığı için müvekkillerimize düzenli raporlama yapıyoruz.

### Etik
Avukatlık Kanunu ve TBB Meslek Kuralları'na sıkı bağlılık. Müvekkil sırrı ve menfaat çatışması ilkelerini istisnasız uyguluyoruz.

## 4 Adımlı Süreç

1. **Görüşme** — Ücretsiz ön değerlendirme
2. **Analiz** — Dosya ve risk analizi
3. **Strateji** — Yol haritası belirleme
4. **Çözüm** — Sonuç odaklı takip

## Ekibimiz

- **Av. Aykut Yeşilkaya** — Kurucu Avukat (İstanbul Barosu sicil no: 61223). İş, kira, miras-aile, tüketici ve sigorta uyuşmazlıkları odaklı uygulamacı.
- **Av. Mücahit İslam Keskün** — Kurucu Avukat. Ceza hukuku ağırlıklı dosya yönetimi.
- **Av. Büşra Yeşilkaya** — Avukat. Miras, aile ve gayrimenkul hukuku ağırlıklı dosya yönetimi.

## Çalışma Alanları

1. İş Hukuku
2. Ceza Hukuku
3. İcra ve İflas
4. Kira ve Gayrimenkul
5. Miras ve Aile
6. Sözleşmeler Hukuku
7. Ticaret ve Sözleşmeler
8. Tüketici ve Sigorta

## İletişim

- **Adres**: Osmanağa Mah., Karadut Sok. No:14/10, Kadıköy/İstanbul
- **Telefon**: +90 551 981 4937
- **E-posta**: vegalaw.contact@gmail.com
- **Çalışma saatleri**: Pazartesi–Cuma 09:00–18:00
- **Randevu**: ${SITE}/#iletisim
- **WhatsApp**: https://wa.me/905519814937
`;
writeMd(
  "hakkimizda.md",
  fm({
    url: `${SITE}/hakkimizda`,
    title: "Hakkımızda | Vega Hukuk İstanbul",
    description: "Vega Hukuk İstanbul, Kadıköy merkezli bir hukuk bürosudur. İş, ceza, kira, miras, aile, tüketici, sigorta, sözleşmeler ve icra-iflas alanlarında danışmanlık ve dava takibi.",
    type: "corporate",
  }) + hakkimizdaBody,
);

// 6) Index (kök sayfa)
const indexBody = `# Vega Hukuk İstanbul

Kadıköy merkezli hukuk bürosu. İş, ceza, icra-iflas, kira-gayrimenkul, miras-aile, sözleşmeler, ticaret ve tüketici-sigorta hukuku alanlarında hukuki danışmanlık ve dava takibi.

**Kurucu avukat:** Av. Aykut Yeşilkaya — İstanbul Barosu sicil no: 61223

**Kurucu avukat:** Av. Mücahit İslam Keskün — Ceza hukuku

## İletişim

- **Adres**: Osmanağa Mah., Karadut Sok. No:14/10, Kadıköy/İstanbul
- **Telefon**: +90 551 981 4937
- **E-posta**: vegalaw.contact@gmail.com
- **WhatsApp**: https://wa.me/905519814937

## Hizmet Alanları

8 ana hukuk alanında dosya yönetimi: ${SITE}/hizmetler

Tüm alanların detaylı listesi ve içerikleri: ${SITE}/hizmetler.md

## Hesaplama Araçları

9 ücretsiz hesaplayıcı: işçilik alacakları, vekalet ücreti, arabuluculuk ücreti, faiz, harç, kira süreleri, kaza tazminatı, infaz ve miras payı.

Tüm hesaplayıcılar: ${SITE}/hesaplamalar.md

## Blog ve Hukuk Gündemi

- Blog (${blogPosts.length} yazı): ${SITE}/blog.md
- Güncel hukuk gündemi (${legalPosts.length} analiz): ${SITE}/guncel-hukuk-gundemi.md

## Ekip

3 avukat: ${SITE}/ekip.md

## Kurum

Hakkımızda sayfası: ${SITE}/hakkimizda.md

## Agent-Friendly

- Sitemap: ${SITE}/sitemap.xml
- llms.txt: ${SITE}/llms.txt
- Agent skills: ${SITE}/.well-known/agent-skills.json
- Markdown alternate: Her sayfa için \`.md\` URL veya \`Accept: text/markdown\` header
- Kanonik alan: ${SITE}
- İçerik dili: tr-TR
- Lisans: © Vega Hukuk İstanbul. Alıntı için kaynak gösterilmelidir.
`;
writeMd(
  "index.md",
  fm({
    url: `${SITE}/`,
    title: "Vega Hukuk İstanbul | Hukuk Bürosu ve Danışmanlık",
    description: "İstanbul Kadıköy'de iş, ceza, kira, miras, tüketici ve sigorta alanında hukuki danışmanlık ve dava takibi. Randevu için iletişime geçin.",
    type: "homepage",
  }) + indexBody,
);

// 7) Yasal sayfalar (kısa template)
const legalPages = [
  { slug: "kvkk-aydinlatma", title: "KVKK Aydınlatma Metni", desc: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni." },
  { slug: "cerez-politikasi", title: "Çerez Politikası", desc: "Vega Hukuk İstanbul web sitesi çerez kullanım politikası." },
  { slug: "hukuki-uyari", title: "Hukuki Uyarı", desc: "Site içeriklerinin bilgilendirme amaçlı olduğuna dair yasal uyarı." },
];
for (const lp of legalPages) {
  const body = `# ${lp.title}

${lp.desc}

Tam metin için web sitesini ziyaret edin: ${SITE}/${lp.slug}

## İletişim

Veri koruma sorumlusu / hukuki sorularınız için:
- E-posta: vegalaw.contact@gmail.com
- Telefon: +90 551 981 4937
`;
  writeMd(
    `${lp.slug}.md`,
    fm({
      url: `${SITE}/${lp.slug}`,
      title: `${lp.title} | Vega Hukuk İstanbul`,
      description: lp.desc,
      type: "legal",
    }) + body,
  );
}

// 8) E-Tahsilat
const eTahsilatBody = `# E-Tahsilat

Kredi kartı ile güvenli online ödeme sayfası. Moka POS altyapısı (BDDK lisanslı) üzerinden vekâlet ücreti, danışmanlık bedeli ve yargılama gideri avansı tahsilatı yapılır.

## Ödeme Süreci

1. Avukatınızla görüşüp ödeme tutarı, dosya numarası ve açıklamayı netleştirin
2. ${SITE}/e-tahsilat sayfasına gidin
3. Tutar, ad-soyad, dosya numarası ve açıklamayı girin
4. Kredi kartı bilgilerinizi BDDK lisanslı 3D Secure altyapısı üzerinden girin
5. Ödeme onayı SMS ve e-posta ile tarafınıza ulaşır

## Güvenlik

- Moka POS — BDDK tarafından lisanslı ödeme kuruluşu
- 3D Secure ile kart doğrulama
- TLS şifreli iletişim
- Kart bilgileri site sunucusunda saklanmaz

## İletişim

- Telefon: +90 551 981 4937
- E-posta: vegalaw.contact@gmail.com
`;
writeMd(
  "e-tahsilat.md",
  fm({
    url: `${SITE}/e-tahsilat`,
    title: "E-Tahsilat | Vega Hukuk İstanbul",
    description: "Kredi kartı ile güvenli online ödeme — Moka POS (BDDK lisanslı) altyapısı. Vekâlet ücreti, danışmanlık bedeli ve yargılama gideri avansı tahsilatı.",
    type: "payment",
  }) + eTahsilatBody,
);

console.log(`Markdown versions generated: ${count} files`);
