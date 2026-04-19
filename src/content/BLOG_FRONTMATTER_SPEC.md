# Blog Frontmatter Specification — Vega Hukuk

> Tüm `src/content/blog/*.md` ve `src/content/legal-updates/*.md` dosyaları
> bu spec'e uymak zorundadır. Build pipeline bu alanları doğrular; eksik veya
> geçersiz frontmatter `quarantine/` dizinine alınır ve yayın engellenir.
>
> Referans: `BULLETPROOFSEO.md` Bölüm 6 (sayfa tipolojisi), Bölüm 8 (on-page),
> `STYLE_GUIDE.md` (editoryal kurallar).

---

## 1. Tam Şablon (T3 Blog — Cluster Content)

```yaml
---
# Kimlik
slug: kidem-tazminati-istifa-haklı-fesih-yargıtay-2024
title: "İstifa Eden İşçi Kıdem Tazminatı Alabilir mi? Haklı Fesih Kriterleri"
heading: "İstifa ve Haklı Fesih: Kıdem Tazminatı Hakkı"
excerpt: "Ödenmemiş fazla mesai veya mobbing gibi durumlarda istifa eden işçi, 4857 sayılı Kanun 24. madde kapsamında haklı fesih sayılarak kıdem tazminatına hak kazanabilir."

# SEO
seoTitle: "İstifa Eden İşçi Kıdem Alır mı? 2026 Yargıtay Rehberi | Vega Hukuk İstanbul"
seoDescription: "İstifa belgesi imzalayan işçinin kıdem tazminatı alma koşulları: haklı fesih, ödenmemiş alacak, mobbing kriterleri ve güncel Yargıtay kararları. Av. Aykut onayıyla."

# Taksonomi
type: blog                    # blog | legal-update | service | tool | cell | karar
tier: T3                      # T1 | T2 | T3 | T4 | T5 | T6
intent: I1                    # I1 | I2 | I3 | I4 | I5
topics:
  - is-hukuku
  - kidem-tazminati
  - hakli-fesih
pillars:
  p1: /hizmetler/is-hukuku
  p2: /hizmetler/is-hukuku/kidem-tazminati

# Yayın
publishedAt: 2026-04-18
updatedAt: 2026-04-18
reviewedBy: aykut-yesilkaya    # /ekip/[slug] ile eşleşir
reviewedAt: 2026-04-18
nextReviewAt: 2026-07-17       # refresh cycle (90/180/365 gün)

# Author (Person entity — Schema.org bağı)
author:
  slug: aykut-yesilkaya
  ref: "/ekip/aykut-yesilkaya#person"

# Citation
related_laws:
  - { code: "4857", madde: "17", title: "İhbar öneli" }
  - { code: "4857", madde: "24", title: "İşçinin haklı fesih nedenleri" }
  - { code: "1475", madde: "14", title: "Kıdem tazminatı" }

related_cases:
  - daire: "9. HD"
    esas: "2024/1234"
    karar: "2024/5678"
    date: 2024-03-15
    yargiMcpId: "ym_12345abc"
    summary: "Ödenmemiş fazla mesai nedeniyle istifa — haklı fesih sayıldı."

# Hero görsel
hero:
  src: /hero/kidem-tazminati.webp
  alt: "İstanbul'da iş hukuku davası süreci"
  width: 1600
  height: 900
  fetchPriority: high

# TL;DR Box (40-60 kelime sert sınır)
tldr: >
  İstifa eden işçi, ödenmemiş ücret, fazla mesai veya mobbing gibi hallerde
  4857 sayılı Kanun m. 24 uyarınca haklı fesih yapmış sayılarak kıdem
  tazminatına hak kazanabilir. Yargıtay 9. HD 2024/1234 E. kararı, bordro
  imzalı olsa dahi ödenmemiş alacak varsa istifanın haklı fesih olarak
  nitelendirileceğini teyit etmiştir.

# FAQ (min 5 — AEO için kritik)
faqJson: |
  [
    {
      "question": "İstifa dilekçesi veren işçi kıdem tazminatı alabilir mi?",
      "answer": "Evet, 4857 sayılı İş Kanunu 24. madde kapsamında haklı fesih halleri varsa istifa eden işçi de kıdem tazminatına hak kazanır. Ödenmemiş ücret, fazla mesai, sigorta eksik bildirimi, mobbing gibi haller bu kapsamdadır."
    }
  ]

# Open Graph
ogImage: /og/blog/kidem-tazminati-istifa.webp
ogImageAlt: "Vega Hukuk İstanbul — Kıdem tazminatı rehberi"

# Canonical
canonical: https://vegahukukistanbul.com/blog/kidem-tazminati-istifa-haklı-fesih-yargıtay-2024

# Durum
status: published              # draft | reviewing | published | quarantine
noindex: false
---

# İçerik (markdown body)
```

---

## 2. Zorunlu Alanlar (Tüm içerik tipleri)

| Alan | Tip | Kural |
|------|-----|-------|
| `slug` | string | Kebab-case, ASCII (Türkçe karakter yok), benzersiz |
| `title` | string | Max 100 karakter, H1 değildir |
| `seoTitle` | string | **Max 60 karakter**, format: `{query} \| {modifier} \| Vega Hukuk İstanbul` |
| `seoDescription` | string | **150–160 karakter**, CTA verb içerir |
| `excerpt` | string | 150–180 karakter, sosyal paylaşım özeti |
| `type` | enum | `blog \| legal-update \| service \| tool \| cell \| karar` |
| `tier` | enum | `T1 \| T2 \| T3 \| T4 \| T5 \| T6` |
| `intent` | enum | `I1 \| I2 \| I3 \| I4 \| I5` |
| `publishedAt` | date | `YYYY-MM-DD` formatı |
| `updatedAt` | date | `YYYY-MM-DD` |
| `reviewedBy` | string | `/ekip/[slug]` ile eşleşmeli (şu an `aykut-yesilkaya`) |
| `reviewedAt` | date | `YYYY-MM-DD` — boş olamaz |
| `author.slug` | string | `/ekip/[slug]` ile eşleşmeli |
| `author.ref` | string | `/ekip/[slug]#person` formatı (Schema.org @id) |

---

## 3. T3 Blog İçin Ek Zorunlu Alanlar

| Alan | Kural |
|------|-------|
| `topics[]` | Min 1, max 5 ontoloji key'i (`src/data/vega-legal-ontology.json`'dan) |
| `pillars.p1` | T3 yazısı mutlaka bir P1 pillar sayfasına işaret eder |
| `pillars.p2` | Varsa ilgili P2 (sub-topic) pillar |
| `related_laws[]` | Min 1 kanun referansı |
| `related_cases[]` | Min 1 Yargıtay karar künyesi (Yargı MCP ID tercih edilir) |
| `tldr` | 40–60 kelime sert sınır |
| `faqJson` | Min 5 Q&A, `FAQPage` schema'ya dönüştürülür |
| `nextReviewAt` | `publishedAt + (90\|180\|365 gün)` |

---

## 4. T4 Karar Analizi İçin Ek Alanlar

```yaml
decision:
  court: "Yargıtay"
  chamber: "9. HD"
  esasNo: "2024/1234"
  kararNo: "2024/5678"
  decisionDate: 2024-03-15
  yargiMcpId: "ym_12345abc"
  publicUrl: "https://.../yargi-link"   # opsiyonel
  outcome: "bozma"                       # onama | bozma | düzeltme | ek karar
  precedentValue: high                   # high | medium | low
  authorIsCounsel: false                 # Aykut'un davası ise true
```

---

## 5. T5 Tool/Hesaplayıcı İçin Ek Alanlar

```yaml
tool:
  name: "Kıdem Tazminatı Hesaplayıcı"
  component: KidemCalculator             # src/components/tools/
  embedUrl: /embed/kidem-tazminati-hesaplama
  inputs:
    - { name: "startDate", type: date, required: true }
    - { name: "endDate", type: date, required: true }
    - { name: "lastGrossSalary", type: number, required: true }
  outputs:
    - { name: "compensation", type: money }
  legalBasis:
    - { code: "1475", madde: "14" }
```

---

## 6. T6 Programmatic Cell İçin Ek Alanlar + Quality Gate

```yaml
cell:
  il: "istanbul"
  hizmet: "is-hukuku"
  intent: "nasil"                        # nasil | ne-kadar | emsal | avukat
  localData:
    mahkemeler: ["İstanbul Anadolu 1. İş Mahkemesi", ...]
    adliye: "İstanbul Anadolu Adliyesi"
  qualityGate:
    min_words: 800
    min_citations: 3
    schema_complete: true
    unique_local_data: true
    faq_count_min: 5
```

**Quality gate fail olursa:**
- `status: quarantine`
- `noindex: true`
- `src/content/quarantine/` dizinine taşınır
- ubermensch'e revize PR talebi

---

## 7. Alan Validasyon Kuralları

Build pipeline (`scripts/validate-frontmatter.js` — Task gelecek) şunları kontrol eder:

1. **Enum alanları** — `type`, `tier`, `intent`, `status` sadece tanımlı değerler
2. **Tarih alanları** — geçerli `YYYY-MM-DD`
3. **Kelime sayıları**
   - `seoTitle` ≤ 60 karakter
   - `seoDescription` 150–160 karakter
   - `tldr` 40–60 kelime
   - Markdown body tier'a göre min kelime sayısı
4. **Zorunlu alan varlığı** — tipine göre (T3 için `related_cases` min 1 vb.)
5. **Referans tutarlılığı**
   - `author.slug` → `/ekip/[slug]` dosyası mevcut
   - `pillars.p1` → hizmet sayfası mevcut
   - `topics[]` → ontoloji key'leri mevcut
6. **Yasak ifade taraması** (`STYLE_GUIDE.md` Bölüm 3)
7. **Schema dry-run** — FAQ + Article + Citation schema validator
8. **Canonical çakışma** — aynı `canonical` başka bir sayfada var mı?

Fail durumunda build kırılır, PR merge edilemez.

---

## 8. Taksonomi Referansı

### type
- `blog` — `/blog/[slug]` (T3 cluster content)
- `legal-update` — `/guncel-hukuk-gundemi/[slug]` (T4 karar analizi + haber)
- `service` — `/hizmetler/[slug]` (T1 overview pillar)
- `tool` — `/araclar/[slug]` (T5 hesaplayıcı)
- `cell` — programmatic SEO hücresi (T6)
- `karar` — detay karar analizi (T4)

### tier
- `T1` — 2500–4000 kelime, P1 overview pillar
- `T2` — 1500–2500 kelime, P2 sub-topic pillar
- `T3` — 1000–1500 kelime, P3 blog/cluster
- `T4` — 800–1200 kelime, karar analizi
- `T5` — 600–800 kelime + interaktif, hesaplayıcı
- `T6` — 800–1200 kelime, programmatic cell

### intent
- `I1` — Informational (ne/nedir)
- `I2` — Transactional-info (nasıl hesaplanır)
- `I3` — Comparative (X mi Y mi)
- `I4` — Emsal/Authority (karar emsal)
- `I5` — Transactional (avukat ara)

---

## 9. Ubermensch Sözleşmesi

ubermensch içerik fabrikası bu spec'i yazı üretim öncesi sistem prompt'una yükler.
Her ürettiği yazı:

1. Tam frontmatter ile PR olarak gelir.
2. Pre-publish hook validasyonu geçer.
3. `STYLE_GUIDE.md` banned words taramasından geçer.
4. Aykut insan onayı verir (T3 için full review, T6 için batch approval).

Spec güncellenirse ubermensch system prompt'u derhal yenilenir.

---

## 10. Migration Notu (Mevcut İçerik)

Şu an `src/content/blog/` altındaki 12 yazı ve `src/content/legal-updates/`
altındaki 6 yazı bu spec'e tam uygun değildir. Backfill planı:

1. **Hafta 1:** Tüm mevcut yazılara `type`, `tier`, `intent`, `reviewedBy`,
   `reviewedAt`, `author.ref` alanları eklenir (Aykut onayıyla).
2. **Hafta 2:** `tldr`, `related_laws`, `related_cases` eksikleri doldurulur.
3. **Hafta 3:** SEO title/description karakter limitleri normalize edilir.
4. **Hafta 4:** Eksik olanlar `quarantine/` dizinine alınıp ubermensch'e revize
   PR talebi açılır.

Backfill görevleri ayrı task'lar halinde izlenir — bu spec dondurulduktan sonra başlar.
