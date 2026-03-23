---
description: Solopreneurler icin pratik fiyatlandirma rehberi — SaaS ve hizmet fiyatlandirma modelleri, formüller ve kopyala-yapistir sablonlar
---

# Fiyatlandırma Stratejisi Rehberi

## Amaç

Solopreneur olarak fiyatlandırma en çok para bırakan karardır. Bu skill, "Kaça satayım?" sorusunu somut formüller, gerçek rakamlar ve test edilmiş modellerle cevaplar. Kurumsal değil, tek kişilik SaaS ve hizmet işleri için tasarlanmıştır.

**Kategori**: Finans & Gelir Optimizasyonu

## 3 Fiyatlandırma Modeli: Hangisini Ne Zaman Kullan?

| Model | En uygun olduğu durum | Solopreneur için risk | Örnek |
|-------|----------------------|----------------------|-------|
| **Flat Rate** (Sabit) | Basit ürün, tek kullanım senaryosu | Düşük — anlaşılması kolay | Todoist: $4/ay |
| **Tiered** (Kademeli) | Farklı müşteri segmentleri var | Orta — 3'ten fazla tier yapma | Notion: Free/Plus/Business |
| **Usage-Based** (Kullanıma dayalı) | Maliyetin kullanımla arttığı ürünler | Yüksek — gelir tahmin edilemez | AWS, Twilio |

**Solopreneur için varsayılan seçim: 3 kademeli (Tiered) model.** Sebebi:
- Free tier erken kullanıcı çeker
- Orta tier gelirin %80'ini oluşturur
- Üst tier anchor pricing (çapa fiyatı) görevi görür

## $29-49-99 Tatlı Noktası

Solo SaaS için en çok test edilmiş fiyat aralığı:

| Tier | Fiyat | Rolü | Müşteri oranı |
|------|-------|------|---------------|
| **Starter** | $29/ay | Giriş kapısı, bireysel kullanıcılar | %30 |
| **Pro** | $49/ay | Ana gelir kaynağı, "en popüler" etiketi | %55 |
| **Business** | $99/ay | Çapa fiyat, küçük ekipler | %15 |

**Neden bu rakamlar?**
- $29 = "Bir akşam yemeği parası" — düşünmeden karar verilebilir
- $49 = Orta tier her zaman Pro tier'dan %40-70 pahalı olmalı
- $99 = Business tier, Pro'nun 2x'i — "premium" hissiyatı verir
- $99 üstü solopreneur SaaS için nadiren çalışır (satış süreci gerektirir)

**Türk pazarı için uyarlama**: Eğer Türkiye hedefliyorsan, $29/49/99 yerine ₺299/₺499/₺999 kullan. Aynı psikolojik etkiyi verir.

## Değer Bazlı Fiyatlandırma Formülü

**Kural: Fiyatın, sağladığın değerin 1/10'u olmalı.**

```
Algılanan Değer = Müşterinin kazandığı/tasarruf ettiği para (yıllık)
Fiyat = Algılanan Değer / 10

Örnek:
- Ürün freelancer'a ayda 5 saat tasarruf ettiriyor
- Freelancer'ın saat ücreti: $50
- Aylık tasarruf: 5 × $50 = $250
- Fiyat: $250 / 10 = $25/ay ✓ ($29 tier'a oturur)
```

**Bu formül çalışmazsa**: Müşterinin ürününle ne kadar kazandığını/tasarruf ettiğini ölçemiyorsan, rakip bazlı fiyatlandırmaya geç.

## Rakip Bazlı Konumlandırma

Piyasadaki en ucuz ve en pahalı rakibin arasına otur:

```
[Ucuz Rakip] -------- [SEN] -------- [Pahalı Rakip]
   $15/ay              $49/ay              $150/ay
  "Yetersiz"         "Tam kararında"        "Kurumsal"
```

**Nasıl uygularsın:**
1. Rakiplerin fiyatlandırma sayfalarının ekran görüntüsünü al (en az 5 rakip)
2. Bir spreadsheet'e yaz: Rakip | En düşük fiyat | En yüksek fiyat | Öne çıkan özellik
3. Ortalamanın biraz üstüne konumlan — ucuz olmak güven vermez
4. Landing page'de rakip karşılaştırma tablosu koy (isim vermeden: "Diğer araçlar" vs "Biz")

## Fiyat Testi: A/B Test Nasıl Yapılır?

1. **İki farklı fiyatlandırma sayfası** oluştur (aynı ürün, farklı fiyatlar)
2. Trafiği %50-%50 böl (Vercel Edge Config veya PostHog feature flags ile)
3. **En az 100 ziyaretçi/varyant** bekle (istatistiksel anlamlılık için)
4. Conversion rate'e bak, gelire değil — düşük fiyat daha çok satabilir ama daha az kazandırır

**Pratik formül:**
```
A seçeneği: $29/ay, %5 dönüşüm → 100 ziyaretçide 5 müşteri × $29 = $145
B seçeneği: $49/ay, %3 dönüşüm → 100 ziyaretçide 3 müşteri × $49 = $147

→ B kazanır (daha az müşteri, daha yüksek gelir, daha az destek yükü)
```

**Mevcut müşterileri koru**: Fiyat değişikliğinde mevcut müşterilere "grandfather pricing" uygula — eski fiyattan devam etsinler. Churn'ü %90 azaltır.

## Yıllık vs Aylık Fiyatlandırma

**Kural: Yıllık planda 2 ay ücretsiz ver (≈%17 indirim)**

```
Aylık: $49/ay = $588/yıl
Yıllık: $49 × 10 ay = $490/yıl ($40.8/ay göster)
Tasarruf: $98 (%17)
```

**Neden yıllık plan önemli:**
- Cash flow: 12 aylık geliri peşin alırsın
- Churn azalır: Yıllık müşterilerde churn %50 daha düşük
- LTV artar: Yıllık müşteriler ortalama 2.3 yıl kalır, aylık müşteriler 6.5 ay

**Fiyatlandırma sayfasında yıllık planı varsayılan göster**, aylık plana geçiş için toggle koy.

## Ne Zaman Fiyat Artır?

**Kural: Her 6-12 ayda bir fiyat artışı yap.**

Fiyat artırma zamanı geldiğinin işaretleri:
- Churn rate %5'in altında (müşteriler memnun)
- Yeni özellikler eklendi (değer arttı)
- Rakipler senden pahalı (piyasa kaldırır)
- Müşterilerden "bu kadar ucuz olmamalı" yorumları geliyor

**Artış stratejisi:**
1. Yeni müşterilere yeni fiyatı uygula
2. Mevcut müşterilere 60 gün önceden email at
3. Mevcut müşterilere daha düşük bir artış uygula (%10-15, yenilere %20-30)
4. Grandfather seçeneği sun: "Yıllık plana geçersen eski fiyattan devam"

## Ücretsiz Katman Kararı: Freemium mi, Free Trial mı?

| Model | Ne zaman kullan | Ne zaman KULLANMA |
|-------|----------------|-------------------|
| **Freemium** | Marginal maliyetin ~$0 (yazılım), ağ etkisi var, pazarı büyütmen gerek | Destek yükü yüksek, sunucu maliyeti kullanıcı başı yüksek |
| **Free Trial** (7-14 gün) | Değer hemen anlaşılıyor, kısa satış döngüsü | Ürünü anlamak zaman alıyor |
| **Ücretsiz katman yok** | B2B, yüksek fiyat, premium konumlandırma | Organik büyümeye ihtiyacın varsa |

**Solopreneur için varsayılan**: 14 günlük free trial + kredi kartı isteme. Dönüşüm oranı hedefi: %5-15.

## Kalite Kontrolü

Fiyatlandırma stratejini bitirdikten sonra şu kontrol listesini uygula:

- [ ] Fiyat, müşteriye sağlanan değerin 1/10'u veya altında mı?
- [ ] En az 3 rakibin fiyatını araştırdın mı?
- [ ] 3'ten fazla tier yok mu? (3 ideal)
- [ ] Yıllık plan seçeneği var mı?
- [ ] Fiyatlandırma sayfasında "En Popüler" etiketi orta tier'da mı?
- [ ] Mevcut müşteriler için grandfather politikan var mı?
- [ ] A/B test planın var mı?

## Örnek Çıktı

```markdown
# Fiyatlandırma Tablosu: TaskFlow (Freelancer Proje Yönetim Aracı)

## Konumlandırma
Rakip analizi: Trello (ücretsiz-$10), Asana ($11-$25), Monday ($9-$16)
Pozisyonumuz: Trello'dan güçlü, Asana'dan basit — freelancer'a özel

## Fiyat Tablosu

|                          | Free         | Pro ⭐ En Popüler | Business      |
|--------------------------|-------------|-------------------|---------------|
| **Aylık fiyat**          | $0           | $29/ay            | $49/ay        |
| **Yıllık fiyat**         | $0           | $24/ay ($290/yıl) | $41/ay ($490/yıl) |
| Proje sayısı             | 3            | Sınırsız          | Sınırsız      |
| Müşteri yönetimi         | 5 müşteri    | Sınırsız          | Sınırsız      |
| Fatura oluşturma         | ❌           | ✅                | ✅            |
| Otomatik hatırlatmalar   | ❌           | ✅                | ✅            |
| Özel domain raporları    | ❌           | ❌                | ✅            |
| API erişimi              | ❌           | ❌                | ✅            |
| Öncelikli destek         | ❌           | ❌                | ✅            |

## Değer Hesaplaması
- Freelancer ayda ~8 saat idari iş yapıyor
- TaskFlow bu süreyi ~3 saate düşürür (5 saat tasarruf)
- Ortalama freelancer saat ücreti: $40
- Aylık tasarruf: 5 × $40 = $200
- Pro fiyatı: $29 = tasarrufun %14.5'i ✅ (1/10 kuralını geçiyor)

## Yıllık Plan Teşviki
- "Yıllık öde, 2 ay bedava" — tüm tier'larda
- Yıllık plan, fiyatlandırma sayfasında varsayılan olarak seçili

## Fiyat Artış Planı
- Launch fiyatı: Yukarıdaki tablo (ilk 6 ay)
- 6. ayda: Pro $29→$39, Business $49→$59 (yeni müşteriler)
- Mevcut müşteriler: 12 ay boyunca launch fiyatından devam
```
