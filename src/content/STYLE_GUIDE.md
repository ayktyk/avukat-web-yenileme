# Vega Hukuk — İçerik Style Guide

> Bu doküman Vega Hukuk İstanbul'un tüm yayınlanan içeriklerinde tutarlılığı sağlayan
> editoryal kuralların kaynağıdır. `ubermensch` içerik fabrikası bu dosyayı referans alır;
> insan onay aşamasında Aykut bu kurallara sapma gerekçesiyle reject yetkisine sahiptir.
>
> Referans belge: `BULLETPROOFSEO.md` Bölüm 8 + Bölüm 11.

---

## 1. Marka Sesi — Vega Karakteri

Rakipler üç arketipe düşer: akademik-mesafeli (Mıhçı), neşeli-pop (Ayboğa),
uzman-soğuk (BAF). Vega bunların hiçbiri değil.

**Vega'nın sesi:** *Resmi ama erişilebilir. Kararlı ama alçakgönüllü.
Derinlikli ama karmaşık değil.*

### Ton kontrol noktaları

| Durum | Vega yapar | Vega yapmaz |
|-------|-----------|-------------|
| Teknik kavram ilk geçiş | Parantez içi kısa açıklama | Tanımsız terim bırakma |
| İddia | "Yargıtay X tarihli kararla belirlemiştir" | "Herkes bilir ki…" |
| Öneri | "Bu durumda yapılması gereken…" | "Mutlaka şunu yapın" |
| Sonuç | "…sayılma ihtimali yüksektir." | "Kesin kazanırsınız." |
| Kendinden bahis | "büromuz" (resmi) | "biz" (samimi-gevşek) |
| Okuyucuya hitap | "siz" (resmi-yakın) | "sen" (samimi) |

---

## 2. Kişi ve Dil

- **1. tekil şahıs yasak.** "Ben savunurum" ❌ → "Bu durumda şu argüman geçerlidir" ✅
- **1. çoğul "biz" yerine "büromuz"** (TBB etik tutumuyla da uyumlu).
- **2. şahıs "siz"** — müvekkil adayına doğrudan hitap, resmi ama sıcak.
- Abartılı sıfat yasak: **"çığır açıcı", "muazzam", "dehşet verici",
  "Türkiye'nin önde gelen", "devrim niteliğinde"** ❌

---

## 3. Yasak İfadeler (TBB Reklam Yasağı + Generic-Sound)

Aşağıdaki ifadeler hiçbir yayında geçemez. Build gate'te otomatik taranır:

- "en iyi avukat"
- "kesin kazanırız"
- "garantili sonuç" / "sonuç garantisi"
- "%100 başarı" / "100% başarı"
- "Türkiye'nin önde gelen"
- "lider hukuk bürosu"
- "sektörün en deneyimli"
- "hiç kaybetmediğimiz"
- "rakipsiz" / "benzersiz başarı"

**İade yerine ne:** Somut ve ölçülebilir ifadeler. "Son 18 ayda 34 fazla mesai davasında…"
veya "Yargıtay 9. HD 2024/… sayılı kararı ışığında…" gibi.

---

## 4. Zorunlu İfadeler (Her T3 Blog Yazısı Sonunda)

Bu üç unsur her blog yazısında mutlaka bulunur:

1. **Hukuki uyarı disclaimer'ı:**
   > Bu içerik yalnızca bilgilendirme amaçlıdır, hukuki tavsiye niteliği taşımaz.
   > Somut olaya özgü değerlendirme için avukata başvurulmalıdır.

2. **Review rozeti:**
   > Av. Aykut Yeşilkaya (İstanbul Barosu sicil no: 61223) tarafından
   > [YYYY-MM-DD] itibariyle gözden geçirilmiştir.

3. **En az bir Yargıtay veya mevzuat kaynağı** — tam künyesiyle
   (daire/esas no/karar no/tarih veya kanun no/madde no).

---

## 5. Narrative Hooks — Her Yazıda Biri Mutlaka

Her T3/T4 yazıda aşağıdaki üç anlatı modelinden biri kullanılır:

### 5.1 Karar-anchor (T3'ün %60'ı)
> "Yargıtay 9. HD, 15.03.2024 tarihli 2023/12345 E., 2024/5678 K. sayılı
> kararında bu meseleyi şöyle çözdü: …"

### 5.2 Pratik sonuç (T3'ün %30'u)
> "Bu durumda yapılması gereken, fesih bildiriminden itibaren 30 gün
> içinde arabulucuya başvurmaktır."

### 5.3 Yanılsama çürütme (T3'ün %10'u)
> "Çoğunlukla sanılır ki bordronun imzalanması her türlü alacağı ibra eder.
> Ancak 9. HD 2024/… kararı gösteriyor ki…"

---

## 6. On-Page Kuralları (Bölüm 8'den Özet)

### Title tag
`{Primary Query} | {Modifier} | Vega Hukuk İstanbul`
- Max **60 karakter**
- Primary query ilk **40 karakter** içinde
- Branded suffix sabit: `| Vega Hukuk İstanbul`

### Meta description
- **150–160 karakter**
- İlk 110 karakterde primary query + değer önerisi
- CTA verbi (öğrenin, hesaplayın, başvurun)
- Differentiation: "Yargıtay karar referanslı" / "Av. Aykut onayıyla"

### H1–H2 hiyerarşisi
- **H1:** primary query + modifier (title ile birebir aynı değil, daha açık)
- **H2:** önce TL;DR, sonra 4–8 bölüm başlığı — **her biri doğal dil soru formatı**
  - Örn: "İstifa eden işçi kıdem tazminatı alır mı?"
  - AEO için kritik: AI modelleri H2'yi soru olarak tanırsa cevabı alıntılar.
- **H3:** alt konular
- **H4+:** zorunlu değil

### TL;DR Box (AI Overview citation bait)
Her T2/T3/T4/T6 sayfasının hero altında:

```html
<aside role="doc-abstract" class="tldr">
  <p>{40–60 kelime direkt cevap, karar referansıyla}</p>
</aside>
```

- **40–60 kelime sert sınır.**
- İlk cümle doğrudan cevap (evet/hayır + koşul).
- İkinci cümle karar referansı.
- Schema: `Article.abstract` alanına mapping yapılır.

### URL
- Kebab-case, Türkçe karakter ASCII: `ı→i, ş→s, ç→c, ğ→g, ü→u, ö→o`
- Max 5 slug seviyesi: `/hizmetler/[modul]/[alt]/[spesifik]`
- **Tarih yok** — evergreen URL
- Stop word (ve, ile, için) doğal okunuyorsa bırakılır

### Görsel
- Alt text: açıklayıcı, primary query geçirilmez (keyword stuffing yasak)
- Width/height explicit
- AVIF + WebP fallback
- Above-fold görsel `fetchpriority="high"`, diğerleri `loading="lazy"`
- Dosya adı: kebab-case, max 5 kelime

### FAQ
- T3/T4/T6: **min 5** Q&A
- T1: **min 10** Q&A
- Soru doğal dilde ve tam cümle: "Kıdem tazminatı nasıl hesaplanır?"
- Cevap **40–80 kelime**, ilk cümle doğrudan cevap
- `FAQPage` schema zorunlu
- "People Also Ask" Google'dan gerçek sorular harvest edilerek desteklenir

### Schema
- Tüm sayfalarda `BreadcrumbList`
- Tüm sayfalarda `WebPage` wrapper veya primary `@type`
- Tipe göre zorunlu: T1/T2/T3 → `Article`, T4 → `Article + LegalCase`,
  T5 → `HowTo + WebApplication`, T6 → `Article + LocalBusiness + LegalService`
- Birbiriyle çelişen `@type` yasak
- Schema validator build gate'te

---

## 7. Citation Kuralları

### Karar referansı tam künyesi
```
Yargıtay [Daire]. HD, [GG.AA.YYYY] tarihli [YYYY/NNNNN] E., [YYYY/NNNN] K.
```

Örnek: `Yargıtay 9. HD, 12.02.2024 tarihli 2023/15234 E., 2024/3021 K.`

### Kanun referansı tam künyesi
```
[Kanun no] sayılı [Kanun adı] m. [Madde no]
```

Örnek: `4857 sayılı İş Kanunu m. 17` veya `6098 sayılı TBK m. 344`

### Yargı MCP ID
Karar Yargı MCP veritabanından alındıysa, frontmatter'da `related_cases[].id`
alanına mutlaka ID girilir. Böylece sayfa build'inde karar linki validate edilir.

---

## 8. Differentiation Mekaniği — Rakipten Ayrışma

| Özellik | Rakip | Vega |
|---------|-------|------|
| Karar referansı | Adı geçer | Tam künye + Yargı MCP ID + link |
| Author bilgisi | İsim + foto | Sicil no + yayın listesi + dava özetleri |
| Araç | Basit hesaplayıcı | Karar citation'lı + yasal dayanak açıklamalı |
| Disclaimer | Jenerik | "Av. Aykut tarafından [tarih] onaylanmıştır" |
| AI-readiness | Yok | `llms.txt` + markdown negotiation |
| Güncellik | Tarihsiz | `reviewed_at` zorunlu + 90/180/365 gün cycle |

---

## 9. Yayın Öncesi 7 Kontrol (Pre-Publish Gate)

Build pipeline bunların hepsini kontrol eder. Herhangi biri fail → merge engel.

1. **Intent check** — frontmatter `intent` ile içerik örtüşüyor mu? (I1–I5)
2. **Schema validator** — JSON-LD hatasız, çelişen `@type` yok
3. **Frontmatter spec** — `BLOG_FRONTMATTER_SPEC.md` ile tam uyum
4. **Quality gate** — tipe göre (T1: 2500 kelime, T3: 1000 kelime, T6 cell: 800 + 3 citation)
5. **Internal link minimum** — T3 için en az 1 pillar + 1 cluster bağlantısı
6. **Canonical/cannibalization** — aynı query'yi hedefleyen başka URL var mı?
7. **Author entity reference** — `author: { "@id": "/ekip/aykut-yesilkaya#person" }`

---

## 10. Refresh Cadence

| Sayfa katmanı | Cycle |
|---------------|-------|
| Top %20 (impression) | 90 gün |
| Mid %30 | 180 gün |
| Bottom %50 | 365 gün |
| CTR < %0.5 ve rank > 20 | prune candidate |

**Refresh içeriği:** yeni karar inject + `reviewedAt` güncelle + FAQ'ya yeni soru +
iç link rebalance. **Full rewrite değil.**

---

## 11. Tutarlılık Denetimi

- **3 ayda bir style audit:** 10 rastgele yayın → deviation raporu
- Deviation tipleri: yasak ifade kullanımı, disclaimer eksik, citation formatı bozuk,
  H2 query-format olmamış, TL;DR kelime sayısı aşımı
- Audit sonucunda sapma bulunan yazılar `quarantine/` klasörüne alınıp revize edilir.

---

## 12. Ubermensch Sistem Prompt'una Referans

Bu dosya `ubermensch` içerik fabrikasının sistem prompt'unda referans olarak
yüklenir. Fabrika çıktısı PR olarak bu repo'ya gelir; pre-publish hook bu kuralları
otomatik doğrular.

Style kurallarında değişiklik olursa:

1. Bu dosyada güncelleme yap.
2. `BULLETPROOFSEO.md` Section 11'i senkronize et.
3. ubermensch system prompt'unu yeniden yükle.
4. Son 10 yayını spot-check yap (yeni kurala uyum kontrolü).
