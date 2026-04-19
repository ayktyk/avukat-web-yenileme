# Ubermensch Email Output Prompt — Vega Hukuk CMS Paneli Uyumlu

> Bu prompt, Ubermensch'in ürettiği her blog yazısını Av. Aykut'a email ile
> gönderirken kullanacağı çıktı şablonunu tanımlar. Amaç: Aykut email'i açıp
> her bölümü CMS panelindeki karşılık gelen alana tek tek yapıştırsın.
> Ek olarak, ham .md dosyası da gönderilir (opsiyonel direkt commit için).
>
> Referans: `UBERMENSCH_BRIEFING.md`, `BLOG_FRONTMATTER_SPEC.md`, `STYLE_GUIDE.md`.
> CMS config: `public/admin/cms-config.yml` (blog ve legal_updates collection'ları).
> Son güncelleme: 2026-04-19.

---

## 1. Email Genel Formatı

**Konu satırı:**
```
[Blog PR] <Yazı Başlığı> — <YYYY-MM-DD>
```

Örnek:
```
[Blog PR] İstifa Eden İşçi Kıdem Tazminatı Alabilir mi? — 2026-04-22
```

Karar analizi (legal-update) için:
```
[Gündem PR] <Karar Başlığı> — <YYYY-MM-DD>
```

**Email gövdesi üç bölümden oluşur:**
1. **KISA ÖZET** — Aykut 30 saniyede neyi onayladığını anlasın.
2. **CMS PANEL DOLDURMA REHBERİ** — Alan alan kopyala-yapıştır.
3. **HAM .MD DOSYASI** — Direkt repo'ya commit isteyen için.

---

## 2. Bölüm 1 — KISA ÖZET (email'in en üstü)

```
=== KISA ÖZET ===

Konu: <tek cümle, ne hakkında yazı olduğu>
Tier: T3  |  Intent: I1  |  Kelime sayısı: ~1200
Primary query: "<hedeflenen long-tail sorgu>"
Pillar: /hizmetler/is-hukuku
Ana argüman: <bir cümle>
Kritik karar: <daire + esas/karar no + tarih>
Yayın önerisi: <onayla / küçük düzeltmeyle onayla / tartış>

SELF-CHECK (Ubermensch kendi kontrolü — hepsi PASS):
[x] Frontmatter tüm zorunlu alanlar dolu
[x] seoTitle ≤ 60 karakter
[x] seoDescription 150-160 karakter
[x] TL;DR 40-60 kelime
[x] Min 5 FAQ, her cevap 40-80 kelime
[x] Min 1 Yargıtay karar tam künyesiyle
[x] Min 1 kanun tam künyesiyle
[x] Her H2 doğal dil soru formatında
[x] Yasak ifade taraması temiz
[x] Slug ASCII, Türkçe karakter yok
[x] Disclaimer + review rozeti yazı sonunda
[x] Min 1 pillar + 1 cluster iç link
```

---

## 3. Bölüm 2 — CMS PANEL DOLDURMA REHBERİ

Her başlık bir panel alanına tekabül eder. Başlık **birebir** panelde gördüğü
label'dir — Aykut karışıklık yaşamaz.

```
=== CMS PANEL DOLDURMA REHBERİ ===
Koleksiyon: Blog Yazıları   (veya: Hukuk Gündemi)

--- KİMLİK ---

[Başlık]
<Max 100 karakter. H1 değildir.>

[Slug]
<ascii-kebab-case, Türkçe karakter yok>

[Özet]
<150-180 karakter>

[Kategori]
<örn: İş Hukuku>

[Yazar]
Vega Hukuk

[Yazar Kimliği (slug)]
aykut-yesilkaya

--- YAYIN ---

[Yayın Tarihi]
YYYY-MM-DD

[Güncelleme Tarihi]
YYYY-MM-DD

[Gözden Geçiren]
aykut-yesilkaya

[Gözden Geçirme Tarihi]
YYYY-MM-DD

[Sonraki Gözden Geçirme]
YYYY-MM-DD   (T3 → +90 gün, T4 → +180 gün)

--- SEO ---

[SEO Başlığı]
<max 60 karakter | Vega Hukuk İstanbul>

[SEO Açıklaması]
<150-160 karakter, CTA verb içer>

[Canonical URL]
(boş bırak — otomatik üretilir)

--- TAKSONOMİ ---

[Seviye (tier)]
T3

[Intent]
I1   (I1=info, I2=nasıl, I3=karşılaştırma, I4=emsal, I5=avukat ara)

[Topic Anahtarları]   (liste — her satır ayrı topic)
- is-hukuku
- kidem-tazminati
- hakli-fesih

[Pillar Bağlantıları]
P1: /hizmetler/is-hukuku
P2: /hizmetler/is-hukuku/kidem-tazminati   (opsiyonel)

--- İÇERİK BİLEŞENLERİ ---

[TL;DR (40-60 kelime direkt cevap)]
<İlk cümle direkt cevap (evet/hayır + koşul). İkinci cümle karar referansı.>

[SSS (JSON)]
[
  {"question":"Soru 1?", "answer":"Cevap 1 — 40-80 kelime, ilk cümle direkt cevap."},
  {"question":"Soru 2?", "answer":"..."},
  {"question":"Soru 3?", "answer":"..."},
  {"question":"Soru 4?", "answer":"..."},
  {"question":"Soru 5?", "answer":"..."}
]

--- CITATION ---

[Kanun Referansları]   (her satır yeni kayıt — panelde "Add" butonuyla ekle)
1. Kanun No: 4857  |  Madde: 17  |  Başlık: İhbar öneli
2. Kanun No: 4857  |  Madde: 24  |  Başlık: İşçinin haklı fesih nedenleri

[Yargı Kararları]   (her satır yeni kayıt)
1. Daire: 9. HD
   Esas No: 2024/1234
   Karar No: 2024/5678
   Karar Tarihi: 2024-03-15
   Yargı MCP ID: ym_12345abc
   Özet: <1-2 cümle>

2. Daire: HGK
   Esas No: 2023/456
   ...

--- GÖRSEL ---

[Kapak Görseli]
Dosya adı: <slug>.webp
Boyut: 1600x900
NOT: Bu dosyayı EKTE gönderiyorum. Panele yüklerken "Choose an image" → Upload.

[Kapak Alt Text]
<açıklayıcı — keyword stuffing yasak>

[OG Image]
<slug>-og.webp   (opsiyonel, boşsa kapak kullanılır)

[OG Image Alt]
Vega Hukuk İstanbul — <konu kısa>

--- DURUM ---

[Durum]
published

[noindex]
Hayır (unchecked)

--- İÇERİK (markdown body) ---
(panelde "İçerik" alanına aşağıdaki gövdeyi TAMAMEN yapıştır)

----------- İÇERİK BAŞLANGIÇ -----------

# <H1 — primary query + modifier, title'dan biraz farklı>

<aside class="tldr">
<TL;DR metni burada — frontmatter'daki TL;DR ile aynı>
</aside>

## <Doğal dil soru formatında H2>

<İçerik paragrafı. Her H2 altında AI'ın alıntılayabileceği tek net cevap
cümlesiyle başla. Sonra detaylandır.>

## <İkinci H2 — soru formatında>

<İçerik>

## <Üçüncü H2>

<İçerik. Karar-anchor veya pratik sonuç narrative hook'u kullan.>

...

## Sık Sorulan Sorular

**<Soru 1 — frontmatter faqJson ile aynı>**

<Cevap 1>

**<Soru 2>**

<Cevap 2>

<...min 5 soru...>

---

**Hukuki uyarı:** Bu içerik yalnızca bilgilendirme amaçlıdır, hukuki tavsiye
niteliği taşımaz. Somut olaya özgü değerlendirme için avukata başvurulmalıdır.

**Gözden geçirme:** Av. Aykut Yeşilkaya (İstanbul Barosu sicil no: 61223)
tarafından <YYYY-MM-DD> itibariyle incelenmiştir.

----------- İÇERİK SON -----------
```

---

## 4. Bölüm 3 — HAM .MD DOSYASI (Email'in Sonu)

Bu bölüm, Aykut CMS yerine direkt git commit'i tercih ederse kullanılır. Tam
frontmatter + body .md dosyası olarak.

```
=== HAM .MD DOSYASI (opsiyonel direkt commit için) ===
Dosya yolu: src/content/blog/<slug>.md

---------- DOSYA İÇERİĞİ BAŞLANGIÇ ----------
---
slug: kidem-tazminati-istifa-hakli-fesih-yargitay-2024
title: "İstifa Eden İşçi Kıdem Tazminatı Alabilir mi? Haklı Fesih Kriterleri"
excerpt: "Ödenmemiş fazla mesai veya mobbing gibi durumlarda istifa eden işçi, 4857 sayılı Kanun m. 24 kapsamında haklı fesih sayılarak kıdem tazminatına hak kazanabilir."
category: İş Hukuku
author: Vega Hukuk
authorSlug: aykut-yesilkaya

publishedAt: 2026-04-22
updatedAt: 2026-04-22
reviewedBy: aykut-yesilkaya
reviewedAt: 2026-04-22
nextReviewAt: 2026-07-21

seoTitle: "İstifa Eden İşçi Kıdem Alır mı? | Vega Hukuk İstanbul"
seoDescription: "İstifa belgesi imzalayan işçinin kıdem tazminatı alma koşulları: haklı fesih, ödenmemiş alacak, mobbing kriterleri ve güncel Yargıtay kararları."

type: blog
tier: T3
intent: I1
topics:
  - is-hukuku
  - kidem-tazminati
  - hakli-fesih
pillars:
  p1: /hizmetler/is-hukuku
  p2: /hizmetler/is-hukuku/kidem-tazminati

tldr: >
  İstifa eden işçi, ödenmemiş ücret veya mobbing gibi hallerde 4857 sayılı
  Kanun m. 24 uyarınca haklı fesih yapmış sayılarak kıdem tazminatına hak
  kazanabilir. Yargıtay 9. HD 2024/1234 E. kararı, bordro imzalı olsa dahi
  ödenmemiş alacak varsa istifanın haklı fesih olarak nitelendirileceğini
  teyit etmiştir.

faqJson: |
  [
    {"question":"İstifa dilekçesi veren işçi kıdem tazminatı alabilir mi?","answer":"Evet, 4857 sayılı İş Kanunu m. 24 kapsamında haklı fesih halleri varsa istifa eden işçi de kıdem tazminatına hak kazanır."},
    {"question":"...","answer":"..."}
  ]

relatedLaws:
  - { code: "4857", madde: "17", title: "İhbar öneli" }
  - { code: "4857", madde: "24", title: "İşçinin haklı fesih nedenleri" }

relatedCases:
  - daire: "9. HD"
    esas: "2024/1234"
    karar: "2024/5678"
    date: 2024-03-15
    yargiMcpId: "ym_12345abc"
    summary: "Ödenmemiş fazla mesai nedeniyle istifa — haklı fesih sayıldı."

coverImage: /uploads/blog/kidem-tazminati-istifa.webp
coverAlt: "İstanbul'da iş hukuku davası süreci"
ogImage: /og/blog/kidem-tazminati-istifa-og.webp
ogImageAlt: "Vega Hukuk İstanbul — Kıdem tazminatı rehberi"

status: published
noindex: false
---

# İstifa Eden İşçi Kıdem Tazminatı Alır mı?

<aside class="tldr">
İstifa eden işçi, ödenmemiş ücret veya mobbing gibi hallerde 4857 sayılı
Kanun m. 24 uyarınca haklı fesih yapmış sayılarak kıdem tazminatına hak
kazanabilir. Yargıtay 9. HD 2024/1234 E. kararı, bordro imzalı olsa dahi
ödenmemiş alacak varsa istifanın haklı fesih olarak nitelendirileceğini
teyit etmiştir.
</aside>

## İstifa her koşulda kıdem tazminatı hakkını ortadan kaldırır mı?

<içerik>

## Haklı fesih hangi hallerde gündeme gelir?

<içerik>

...

## Sık Sorulan Sorular

**İstifa dilekçesi veren işçi kıdem tazminatı alabilir mi?**

<cevap>

...

---

**Hukuki uyarı:** Bu içerik yalnızca bilgilendirme amaçlıdır, hukuki tavsiye
niteliği taşımaz. Somut olaya özgü değerlendirme için avukata başvurulmalıdır.

**Gözden geçirme:** Av. Aykut Yeşilkaya (İstanbul Barosu sicil no: 61223)
tarafından 2026-04-22 itibariyle incelenmiştir.
---------- DOSYA İÇERİĞİ SON ----------
```

---

## 5. Görsel Ekleri

**Her email ekinde şu dosyalar olur:**

1. `<slug>.webp` — Kapak görseli (1600x900)
2. `<slug>-og.webp` — OG paylaşım görseli (1200x630) — opsiyonel

**Görsel kuralları:**
- Format: WebP (PNG/JPG gönderme).
- Kapak: 1600x900 (16:9), 150 KB altında.
- OG: 1200x630 (~1.91:1), 100 KB altında.
- Alt text keyword stuffing içermez.
- Dosya adı slug ile aynı (ascii kebab-case).

---

## 6. Panel Doldurma Sırası (Aykut İçin Kısa Not)

Email'i aldıktan sonra Aykut şu sırayla hareket eder:

1. Kısa özet bölümünü oku, self-check'e bak — tüm [x] var mı?
2. CMS paneli aç: `vegahukukistanbul.com/admin`
3. **Blog Yazıları** → **New Blog Yazısı**
4. Email'deki "PANEL DOLDURMA REHBERİ"nden her başlığı alıp karşılık gelen
   panel alanına yapıştır.
5. Görsel ekleri yükle (kapak + OG).
6. İçerik gövdesini "İçerik" alanına yapıştır (markdown).
7. "Save" → "Publish" (veya draft olarak bırakıp tekrar oku).
8. Build tetiklenir, 2-3 dk içinde canlıda.

**Alternatif (Aykut hızlı istiyorsa):** HAM .MD DOSYASI bölümünü kopyala,
GitHub web arayüzünde `src/content/blog/<slug>.md` olarak yeni dosya oluştur,
commit et. Görselleri ayrıca `public/uploads/blog/` klasörüne yükle.
Panel bypass edilmiş olur ama her şey çalışır.

---

## 7. Alan Eşleştirme Tablosu (Referans)

| Email bölümü | CMS panel alanı | Frontmatter anahtarı |
|---|---|---|
| [Başlık] | Başlık | `title` |
| [Slug] | Slug | `slug` |
| [Özet] | Özet | `excerpt` |
| [Kategori] | Kategori | `category` |
| [Yazar] | Yazar | `author` |
| [Yazar Kimliği (slug)] | Yazar Kimliği (slug) | `authorSlug` |
| [Yayın Tarihi] | Yayın Tarihi | `publishedAt` |
| [Güncelleme Tarihi] | Güncelleme Tarihi | `updatedAt` |
| [Gözden Geçiren] | Gözden Geçiren | `reviewedBy` |
| [Gözden Geçirme Tarihi] | Gözden Geçirme Tarihi | `reviewedAt` |
| [Sonraki Gözden Geçirme] | Sonraki Gözden Geçirme | `nextReviewAt` |
| [SEO Başlığı] | SEO Başlığı | `seoTitle` |
| [SEO Açıklaması] | SEO Açıklaması | `seoDescription` |
| [Canonical URL] | Canonical URL | `canonical` |
| [Seviye (tier)] | Seviye (tier) | `tier` |
| [Intent] | Intent | `intent` |
| [Topic Anahtarları] | Topic Anahtarları | `topics` |
| [Pillar Bağlantıları] | Pillar Bağlantıları | `pillars.p1`, `pillars.p2` |
| [TL;DR] | TL;DR (40-60 kelime) | `tldr` |
| [SSS (JSON)] | SSS (JSON) | `faqJson` |
| [Kanun Referansları] | Kanun Referansları | `relatedLaws[]` |
| [Yargı Kararları] | Yargı Kararları | `relatedCases[]` |
| [Kapak Görseli] | Kapak Görseli | `coverImage` |
| [Kapak Alt Text] | Kapak Alt Text | `coverAlt` |
| [OG Image] | OG Image | `ogImage` |
| [OG Image Alt] | OG Image Alt | `ogImageAlt` |
| [Durum] | Durum | `status` |
| [noindex] | Arama Motorlarından Gizle | `noindex` |
| [İçerik] | İçerik (markdown) | body |

---

## 8. Legal-Update (Karar Analizi) Farkları

Karar analizi yazısında (collection: **Hukuk Gündemi**) ek bir bölüm var:

```
--- KARAR BİLGİSİ (T4) ---

[Karar Bilgisi]
Mahkeme: Yargıtay
Daire: 9. HD
Esas No: 2024/1234
Karar No: 2024/5678
Karar Tarihi: 2024-03-15
Yargı MCP ID: ym_12345abc
Sonuç: bozma   (seçenekler: onama / bozma / duzeltme / ek-karar)
Emsal Değeri: high   (seçenekler: high / medium / low)
Aykut'un Davası mı?: Hayır
```

Bu bölüm CMS panelinde **Karar Bilgisi (T4)** başlığıyla collapsed grup olarak
bulunur — açıp doldur.

**Varsayılan değerler:**
- `tier: T4`
- `intent: I4` (emsal)
- `nextReviewAt: +180 gün`

---

## 9. Ubermensch İçin Son Hatırlatmalar

1. **Self-check fail olursa email gönderme.** Hatayı düzelt, sonra gönder.
2. **Aynı başlık altında iki yazı açma** — canonical çakışması.
3. **Long-tail'e odaklan** — "istanbul avukat" değil, "ibra sözleşmesi 1 ay şartı".
4. **Yasak ifade taraması** — TBB reklam yasağı + jenerik sıfatlar (bkz.
   `STYLE_GUIDE.md` Bölüm 3).
5. **Yeni yazı eski yazıları taklit etmez** — eskiler eksik frontmatter'lı;
   senin çıktın tam spec.
6. **Kelime sayısı:** T3 = 1000-1500, T4 = 800-1200. Altında/üstünde kalırsan
   build gate uyarı verir.
7. **Hero görsel dosyası ekte olmalı** — yoksa Aykut manuel görsel bulmak
   zorunda kalır, moral bozar.

---

## 10. Örnek Tam Email (Kısa Versiyon)

```
To: aykut@vegahukukistanbul.com
Konu: [Blog PR] Fazla Mesai İspat Yükü — 2026-04-22

=== KISA ÖZET ===
Konu: Bordro imzalı olsa dahi fazla mesai iddiası tanıkla ispat edilebilir mi
Tier: T3 | Intent: I1 | Kelime: ~1180
Primary query: "fazla mesai ispat yükü imzalı bordro"
Pillar: /hizmetler/is-hukuku
Ana argüman: HGK 2023/456 E. kararı, bordro imzalı olsa bile fazla mesai
  sütunu boşsa tanık delilinin geçerli olacağını kabul etti.
Kritik karar: HGK, 2023/456 E., 2023/789 K., 18.10.2023
Yayın önerisi: Onayla

SELF-CHECK: hepsi PASS (12/12) ✓

=== CMS PANEL DOLDURMA REHBERİ ===
Koleksiyon: Blog Yazıları

[Başlık]
Bordro İmzalı Olsa Bile Fazla Mesai Tanıkla İspat Edilebilir mi?

[Slug]
bordro-imzali-fazla-mesai-tanik-ispat-hgk-2023

...

=== HAM .MD DOSYASI ===
Dosya yolu: src/content/blog/bordro-imzali-fazla-mesai-tanik-ispat-hgk-2023.md

---
slug: bordro-imzali-fazla-mesai-tanik-ispat-hgk-2023
...
---

Ekler:
- bordro-imzali-fazla-mesai-tanik-ispat-hgk-2023.webp (kapak)
- bordro-imzali-fazla-mesai-tanik-ispat-hgk-2023-og.webp (OG)
```

---

## Özet — Tek Cümle

**Her yazı email'inde: KISA ÖZET + SELF-CHECK + PANEL DOLDURMA REHBERİ (alan
başlıkları panelde gördüğü label'lar) + HAM .MD + görsel ekler. Aykut email'i
açar, panele 5-10 dakikada yapıştırır, yayın.**
