# Ubermensch Briefing — Vega Hukuk İstanbul

> Bu doküman Ubermensch içerik fabrikasına, site altyapısındaki son durumu ve
> bundan sonraki içeriklerde uyulması gereken kuralları özetler. Her yazı
> üretiminden önce bu dosyayı oku.
>
> Kaynak: `BLOG_FRONTMATTER_SPEC.md`, `STYLE_GUIDE.md`, `BULLETPROOFSEO.md`.
> Son güncelleme: 2026-04-19.

---

## Bölüm A — Site Altyapısı (Ne Hazır?)

Site, 2026-04 itibarıyla tam SSR-safe SEO altyapısına sahip. Yazdığın her yazı,
tarayıcı JavaScript çalıştırmadan da crawl edilen HTML'de görünür. Bu, Google'a
ek olarak **GPTBot, ClaudeBot, PerplexityBot, Google-Extended** gibi AI
ajanlarının içeriğine erişimi için önemli. Senin üretimini hafife alamazsın:
yazdığın her paragraf bu botların cevap kaynağına girme potansiyeline sahip.

### A.1 Prerender

- Tech: `vite-react-ssg` — 8 statik sayfa build sırasında HTML'e dökülüyor.
- Blog yazıları dahil tüm içerik build zamanında prerender ediliyor.
- Her yazının `<title>`, meta tag'leri, canonical'i, JSON-LD şemaları **HTML
  kaynağında** yer alıyor (JS bağımsız).

### A.2 Schema Pipeline

Her yazıda otomatik enjekte edilen schemalar:

| Schema | Kaynak | Ne işe yarar |
|---|---|---|
| `BreadcrumbList` | Tüm sayfalar | Google breadcrumb rich snippet |
| `Article` / `BlogPosting` | Blog yazıları | Rich result + AI citation |
| `FAQPage` | Frontmatter `faqJson` | Google FAQ accordion, AI answer |
| `Person` (author) | `/ekip/[slug]#person` | E-E-A-T author entity |
| `LegalService` | index.html + hizmet sayfaları | Yerel işletme kimliği |

Frontmatter'da eksik veri varsa ilgili schema **sessizce düşer**. Bu senin
hatan sayılır, build uyarı verir.

### A.3 E-E-A-T Sinyalleri

Site, Av. Aykut Yeşilkaya'nın **İstanbul Barosu Sicil No: 61223** kimliğini
Person schema'sının `identifier` alanında yayınlar. Her T3 blog yazısının
altında bu sicil numarası ve "review tarihi" rozeti görünür. **Yazılarında bu
sicil numarasını gereksiz yere tekrarlama** — zaten sistem otomatik basıyor.

### A.4 AI Bot Erişimi

- `/robots.txt` → GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot,
  Google-Extended, Anthropic-ai whitelist'te.
- `/llms.txt` → AI ajanları için site özet haritası; her build'de otomatik
  yenileniyor.
- Bu iki dosya senin çıktın için "AI keşfedilebilirlik katmanı" sağlıyor.

### A.5 Performans

- Kapak görselleri `.webp` formatında (LCP için).
- Hero görsel `fetchpriority="high"`.
- Diğer görseller lazy-load.

---

## Bölüm B — Senden Beklenenler (Yazı Başına Kontrol Listesi)

Her yazı PR olarak geldiğinde pre-publish hook şu kontrolleri yapacak.
**Herhangi birinde fail → merge engellenir, yazı `quarantine/`'e alınır.**

### B.1 Frontmatter — Zorunlu Alanlar

Eski yazılar bu alanların bir kısmına sahip değil. Seninki sahip olmak zorunda:

```yaml
---
# Kimlik
slug: kebab-case-ascii-only          # Türkçe karakter YASAK (ı→i, ş→s, ç→c, ğ→g, ü→u, ö→o)
title: "Max 100 karakter"
seoTitle: "Max 60 karakter | Vega Hukuk İstanbul"
seoDescription: "150-160 karakter, CTA verb içer"
excerpt: "150-180 karakter"

# Taksonomi
type: blog                            # blog | legal-update | service | tool | cell | karar
tier: T3                              # T3 = 1000-1500 kelime standart blog
intent: I1                            # I1=info, I2=nasıl, I3=X mi Y mi, I4=emsal, I5=avukat ara
topics:
  - is-hukuku
pillars:
  p1: /hizmetler/is-hukuku            # Her T3 mutlaka bir pillar'a işaret eder

# Yayın
publishedAt: 2026-04-19
updatedAt: 2026-04-19
reviewedBy: aykut-yesilkaya           # /ekip/aykut-yesilkaya ile eşleşir
reviewedAt: 2026-04-19
nextReviewAt: 2026-07-18              # +90 gün

# Author (Person entity bağı)
author:
  slug: aykut-yesilkaya
  ref: "/ekip/aykut-yesilkaya#person"

# TL;DR (40-60 kelime SERT SINIR)
tldr: >
  İlk cümle direkt cevap (evet/hayır + koşul).
  İkinci cümle Yargıtay karar referansı.

# FAQ (min 5 — AEO için kritik)
faqJson: |
  [
    {"question":"Tam cümle soru", "answer":"40-80 kelime, ilk cümle direkt cevap"},
    ...
  ]

# Citation
related_laws:
  - { code: "4857", madde: "17", title: "İhbar öneli" }
related_cases:
  - daire: "9. HD"
    esas: "2024/1234"
    karar: "2024/5678"
    date: 2024-03-15
    summary: "İki cümle karar özeti"

# Hero
hero:
  src: /hero/konu-adi.webp
  alt: "Açıklayıcı alt text (keyword stuffing YASAK)"
  width: 1600
  height: 900
  fetchPriority: high

ogImage: /og/blog/konu-adi.webp
ogImageAlt: "Vega Hukuk İstanbul — [konu]"
canonical: https://vegahukukistanbul.com/blog/[slug]
status: published                     # draft | reviewing | published | quarantine
noindex: false
---
```

### B.2 İçerik Yapısı (T3 Blog — 1000-1500 kelime)

```markdown
# H1: Primary query + modifier (title'dan biraz farklı, daha açık)

<aside class="tldr">
40-60 kelime direkt cevap. İlk cümle evet/hayır. İkinci cümle karar referansı.
</aside>

## H2: Doğal dil soru formatında — "X durumunda Y alır mı?"

İçerik. Her H2 AI'ın alıntılayabileceği tek cevap paragrafıyla açılır.

## H2: İkinci soru formatında H2

...

## Sık Sorulan Sorular
(Min 5 Q&A — frontmatter faqJson ile aynı içerik, okuyucu için render edilir)

---

**Hukuki uyarı:** Bu içerik yalnızca bilgilendirme amaçlıdır, hukuki tavsiye
niteliği taşımaz. Somut olaya özgü değerlendirme için avukata başvurulmalıdır.

**Gözden geçirme:** Av. Aykut Yeşilkaya (İstanbul Barosu sicil no: 61223)
tarafından [YYYY-MM-DD] itibariyle incelenmiştir.
```

### B.3 Yasak İfadeler (TBB Reklam Yasağı)

Build gate bunları otomatik tarar, bulursa merge engel:

- "en iyi avukat"
- "kesin kazanırız" / "garantili sonuç" / "%100 başarı"
- "Türkiye'nin önde gelen" / "lider hukuk bürosu" / "sektörün en deneyimli"
- "hiç kaybetmediğimiz" / "rakipsiz" / "benzersiz başarı"

**Yerine:** Somut ve ölçülebilir ifadeler. "Yargıtay 9. HD 2024/1234 E.
kararı ışığında…" veya "4857 sayılı Kanun m. 24 kapsamında…" gibi.

### B.4 Marka Sesi

- Kişi: "büromuz" (biz değil), "siz" (sen değil).
- 1. tekil şahıs yasak. "Ben savunurum" ❌ → "Bu durumda şu argüman geçerlidir" ✅
- Abartılı sıfat yasak: "çığır açıcı", "muazzam", "devrim niteliğinde" ❌
- Her iddia bir karar veya kanuna dayanır.

### B.5 Narrative Hook (Her Yazıda Biri)

1. **Karar-anchor (yazıların %60'ı):** "Yargıtay 9. HD, 15.03.2024 tarihli
   2023/12345 E., 2024/5678 K. sayılı kararında bu meseleyi şöyle çözdü: …"
2. **Pratik sonuç (%30):** "Bu durumda yapılması gereken, fesih bildiriminden
   itibaren 30 gün içinde arabulucuya başvurmaktır."
3. **Yanılsama çürütme (%10):** "Çoğunlukla sanılır ki bordronun imzalanması
   her türlü alacağı ibra eder. Ancak 9. HD 2024/… kararı gösteriyor ki…"

### B.6 Citation Formatı

**Karar referansı (tam künye şart):**
```
Yargıtay [Daire]. HD, [GG.AA.YYYY] tarihli [YYYY/NNNNN] E., [YYYY/NNNN] K.
```
Örnek: `Yargıtay 9. HD, 12.02.2024 tarihli 2023/15234 E., 2024/3021 K.`

**Kanun referansı (tam künye şart):**
```
[Kanun no] sayılı [Kanun adı] m. [Madde no]
```
Örnek: `4857 sayılı İş Kanunu m. 17`

### B.7 İç Link Zorunluluğu

Her T3 yazı en az şu linkleri içerir:
- **1 pillar link** → `/hizmetler/[ilgili-modul]`
- **1 cluster link** → ilgili başka blog yazısı (varsa)
- **Author link** → `/ekip/aykut-yesilkaya` (genellikle yazı sonunda review satırında)

### B.8 Görsel Kuralları

- Format: `.webp` (PNG/JPG gönderme)
- Kapak: `/uploads/blog/[slug].webp` veya `/hero/[slug].webp`
- Width/height explicit (CLS sıfır olsun)
- Alt text açıklayıcı, **keyword stuffing yasak**
- Above-fold → `fetchpriority="high"`, diğerleri `loading="lazy"`

---

## Bölüm C — Long-Tail Keyword Stratejisi

Site genç, backlink yok. **Rekabetçi short-tail terimlerde (ör. "istanbul
avukat") ranking 12+ ay ister.** Sen bu yüzden long-tail'e odaklan:

| Yapma | Yap |
|---|---|
| "boşanma davası" | "anlaşmalı boşanma protokolü şart edilecek mal paylaşımı" |
| "kıdem tazminatı" | "ibra sözleşmesi 1 ay şartı ne zaman geçersiz" |
| "kira artışı" | "TÜFE üstü kira artırımı TBK 344 değişiklik 2024" |

**Keyword kaynağı:**
1. Yargı MCP'den son 6 ay bozma kararları (her karar bir yazı fikri).
2. Google "People Also Ask" (konu sorgusundan harvest).
3. AnswerThePublic tipi araçlarla soru formatında sorgular.

---

## Bölüm D — Mevcut Yazılarla İlişki

Şu an `src/content/blog/` altında 12, `src/content/legal-updates/` altında 6
yazı var. **Bunlar eski şemaya göre yazılmış** ve bu spec'e tam uymuyor
(eksik `type`, `tier`, `intent`, `tldr`, `faqJson`, `related_cases` vb.).

**Senin görevin:**
1. **Yeni yazılarında bu spec'in tamamına uy.** Eskileri taklit etme.
2. Eski yazıların backfill görevi seninle değil Av. Aykut ile — karıştırma.
3. **Eski yazılarla iç link kur** ama eski slug'ları birebir referans vermeden
   önce kontrol et (frontmatter `slug` alanı gerçek URL'yi belirliyor,
   dosya adı değil).

---

## Bölüm E — Yazı Üretim Akışı

```
1. Aykut konu başlığı + kritik hukuki mesele verir
2. Ubermensch:
   a. Yargı MCP'den ilgili kararları çeker (son 2 yıl ağırlıklı)
   b. Mevzuat MCP'den ilgili madde metinlerini çeker
   c. Vega ontology'sinden topic + pillar eşleştirir
   d. Frontmatter'ı spec'e göre doldurur
   e. 1000-1500 kelime gövde yazar
   f. faqJson'u min 5 soruyla doldurur
   g. TL;DR'i 40-60 kelimeye sığdırır
   h. Citation'ları tam künyeyle ekler
   i. .md dosyası olarak PR açar
3. Pre-publish hook validasyon yapar
4. Aykut insan onayı verir
5. Merge → build → prerender → yayın
```

---

## Bölüm F — Hızlı Sanity Check

Yazıyı göndermeden önce kendin kontrol et:

- [ ] Frontmatter tüm zorunlu alanları içeriyor (Bölüm B.1 listesi)
- [ ] seoTitle ≤ 60 karakter, seoDescription 150-160 karakter
- [ ] TL;DR 40-60 kelime (sayacı çalıştır)
- [ ] Min 5 FAQ soru-cevap, her cevap 40-80 kelime
- [ ] Min 1 Yargıtay karar tam künyesiyle referans verildi
- [ ] Min 1 kanun tam künyesiyle referans verildi
- [ ] Her H2 doğal dil soru formatında
- [ ] Hukuki uyarı disclaimer'ı ve review rozeti yazı sonunda
- [ ] Yasak ifade listesinden hiçbiri kullanılmadı (Bölüm B.3)
- [ ] Slug ASCII, Türkçe karakter yok
- [ ] Kapak görseli `.webp`, width/height explicit
- [ ] En az 1 pillar + 1 cluster iç linki var

---

## Bölüm G — Sapma Olunca Ne Olur?

- **Frontmatter eksik:** Build gate fail → PR merge edilmez, quarantine.
- **Yasak ifade bulundu:** Aynı — otomatik red, Aykut manuel inceler.
- **Citation eksik veya format bozuk:** Quarantine.
- **TL;DR kelime sayısı aşıldı:** Quarantine.
- **FAQ < 5:** Quarantine.
- **Schema validation fail:** Quarantine.

Quarantine'a giren yazı `src/content/quarantine/` klasöründe bekler,
Ubermensch'e revize PR talebi açılır.

---

## Bölüm H — Güncellemeler ve Refresh

- Bu spec güncellenirse Ubermensch system prompt'u **derhal yeniden yüklenir**.
- Mevcut yayınlar için 90/180/365 gün review döngüsü var —
  `nextReviewAt` geldiğinde Ubermensch otomatik refresh PR açar.
- Refresh **full rewrite değildir**. Sadece: yeni karar inject, `reviewedAt`
  güncelle, FAQ'ya yeni soru ekle, iç link rebalance.

---

## Özet — Tek Cümle

**Her yazıda: tam frontmatter + 40-60 kelime TL;DR + min 5 FAQ +
min 1 tam künye Yargıtay kararı + min 1 tam künye kanun + doğal dil soru
formatında H2'ler + disclaimer + review rozeti. Yasak ifadelerden uzak dur.
Long-tail keyword'e odaklan. WebP kullan.**

Soru veya ambiguity olursa `BLOG_FRONTMATTER_SPEC.md` > `STYLE_GUIDE.md` >
`BULLETPROOFSEO.md` hiyerarşisinde cevap ara.
