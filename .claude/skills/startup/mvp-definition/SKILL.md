---
description: Solopreneurler icin adim adim MVP tanimlama rehberi — kapsam kesme, dogrulama ve 2-6 haftada insaya hazir bir plan
---

# MVP Tanımlama Rehberi

## Amaç

Solopreneur olarak en büyük risk, kimsenin istemediği bir şeyi inşa etmektir. Bu skill, "1 kullanıcı, 1 problem, 1 çözüm" kuralıyla kapsamı acımasızca keser, inşa etmeden önce doğrulama yaptırır ve 2-6 haftalık bir MVP planı çıkartır.

**Kategori**: Girişimcilik & Startup

## Temel Kural: 1-1-1

Her MVP tam olarak şu üçlüyü tanımlamalıdır:
- **1 Kullanıcı**: Tek bir persona (ör. "Türkiye'deki freelance grafik tasarımcılar")
- **1 Problem**: Tek bir acı nokta (ör. "Müşteri takibi ve fatura kesimi dağınık")
- **1 Çözüm**: Tek bir değer önerisi (ör. "Müşteri + fatura yönetimi tek ekranda")

Eğer cümle içinde "ve" veya "ayrıca" geçiyorsa, kapsam çok geniş demektir.

## Adım 1: Kapsam Kesme — MoSCoW Metodu

30 özellik yaz, sonra acımasızca kes:

1. Beyin fırtınası yap: Ürünün yapabileceği **30 özelliği** listele (süre: 15 dakika)
2. Her özelliği MoSCoW ile sınıflandır:

| Kategori | Tanım | MVP'de var mı? | Hedef sayı |
|----------|--------|----------------|------------|
| **Must** | Bu olmadan ürün çalışmaz | Evet | 3-5 özellik |
| **Should** | Önemli ama v1.1'e kalabilir | Hayır | Sonraki sprint |
| **Could** | Güzel olur ama kritik değil | Hayır | Backlog |
| **Won't** | Bu versiyonda kesinlikle yok | Hayır | Çöpe at |

3. **Must kategorisinden en fazla 5 özellik** seç
4. Her özellik için "Bu olmadan kullanıcı parayı öder mi?" sorusunu sor — cevap hayırsa, Should'a taşı

## Adım 2: İnşa Etmeden Önce Doğrula

Kod yazmadan önce şu 3 testten en az birini uygula:

### Test A: Fake Door Test (1-2 gün)
- Ürünün landing page'ini oluştur (Carrd.co veya Framer ile, ücretsiz)
- "Erken erişim için kaydol" butonu koy
- Google Ads veya sosyal medyada 50-100 TL'lik reklam ver
- **Başarı kriteri**: %5+ dönüşüm oranı (100 ziyaretçiden 5+ kayıt)

### Test B: Concierge MVP (1-2 hafta)
- Ürünün yapacağı işi **elle, manuel olarak** yap
- İlk 5-10 müşteriye hizmeti sen sun (spreadsheet + email ile)
- **Başarı kriteri**: 5 kişiden 3'ü "bunu düzenli kullanırım" derse devam et

### Test C: Pre-sell Testi — "Ödeyecekler mi?" (3-5 gün)
- Gumroad veya Lemon Squeezy'de ön sipariş sayfası aç
- Fiyatı yaz, "Geliştirme aşamasında — Haziran'da teslim" notu ekle
- **Başarı kriteri**: En az 10 ön satış veya $500+ gelir

**Hiçbir test başarılı olmazsa, pivot yap. Kod yazma.**

## Adım 3: Zaman Kutusu Belirle

| MVP Boyutu | Süre | Özellik sayısı | Tek kişi için uygun mu? |
|-----------|------|----------------|------------------------|
| Mikro MVP | 2 hafta | 2-3 özellik | Evet, ideal |
| Standart MVP | 4 hafta | 4-5 özellik | Evet |
| Maksimum MVP | 6 hafta | 5-7 özellik | Riskli, dikkatli ol |
| 6 hafta+ | YAPMA | — | Kapsam kayması belirtisi |

**Haftalık ritim**:
- Hafta 1: Temel altyapı + 1 ana özellik
- Hafta 2-3: Kalan Must özellikleri
- Hafta 4: Ödeme entegrasyonu + landing page
- Hafta 5 (varsa): Bug fix + beta kullanıcılardan geri bildirim
- Hafta 6 (varsa): İyileştirme + launch hazırlığı

## Adım 4: Teknoloji Kararı — Sıkıcı Teknoloji Kazanır

Solopreneur olarak egzotik teknoloji seçme. Şu kuralı uygula:

**Web SaaS için varsayılan stack**:
- Frontend: Next.js veya Remix (React biliyorsan) / Nuxt (Vue biliyorsan)
- Backend: Aynı framework'ün API routes'ları (ayrı backend YAPMA)
- Veritabanı: Supabase (PostgreSQL + Auth + Storage hepsi bir arada)
- Ödeme: Stripe veya Lemon Squeezy (Türkiye'den satış için Lemon Squeezy daha kolay)
- Hosting: Vercel (frontend) + Supabase (backend) — ikisi de ücretsiz tier var
- Email: Resend veya Loops

**Mobil uygulama yapma** — ilk MVP her zaman web olsun. Mobil ihtiyaç varsa PWA yap.

**Karar ağacı**:
- Bildiğin teknoloji var mı? → Onu kullan
- Bilmiyorsan → Yukarıdaki varsayılan stack'i al
- "Ama X teknolojisi daha iyi" → Önemli değil, shipping hızı her şeyi yener

## Adım 5: MVP Tanım Belgesi Oluştur

Aşağıdaki şablonu doldur:

```markdown
# MVP Tanımı: [Ürün Adı]

## Problem Cümlesi
[Persona], [bağlam] sırasında [problem] yaşıyor. Bu yüzden [olumsuz sonuç].

## Çözüm (tek cümle)
[Ürün], [persona]'nın [problem]'ini [nasıl] çözer.

## Must Özellikler (max 5)
1. [Özellik] — çünkü [bu olmadan ürün çalışmaz]
2. ...

## Won't Özellikler (bilinçli kararlar)
- [Özellik] — çünkü [neden v1'de yok]

## Doğrulama Sonuçları
- Test tipi: [Fake Door / Concierge / Pre-sell]
- Sonuç: [Rakamlar]
- Karar: [Devam / Pivot]

## Zaman Çizelgesi
- Başlangıç: [tarih]
- MVP teslim: [tarih] (max 6 hafta)
- İlk ödeme alan müşteri hedefi: [tarih]

## Başarı Metrikleri (ilk 30 gün)
- [ ] 100+ kayıtlı kullanıcı
- [ ] 10+ ödeme yapan müşteri
- [ ] %40+ Activation Rate
- [ ] Sean Ellis Test: %40+ "çok hayal kırıklığına uğrarım" yanıtı

## Teknoloji Stack
- [Framework]: [neden]
- [Veritabanı]: [neden]
- [Hosting]: [neden]
```

## Kalite Kontrolü

MVP tanımını bitirdikten sonra şu kontrol listesini uygula:

- [ ] Tek bir persona tanımlanmış mı?
- [ ] Problem cümlesi "ve" içermiyor mu? (içeriyorsa kapsamı kes)
- [ ] Must özellikler 5'i geçmiyor mu?
- [ ] En az 1 doğrulama testi yapılmış mı?
- [ ] Süre 6 haftayı geçmiyor mu?
- [ ] "Ödeyecekler mi?" sorusunun cevabı kanıtla desteklenmiş mi?
- [ ] Teknoloji stack'i "sıkıcı" mı? (yeni, denenmemiş teknoloji yok mu?)

## Örnek Çıktı

```markdown
# MVP Tanımı: FreelancerCRM

## Problem Cümlesi
Türkiye'deki freelance yazılımcılar, müşteri takibi için WhatsApp + Excel +
e-fatura portalı arasında gidip geliyor. Bu yüzden ayda ortalama 3 saat
sadece idari işlere harcıyor ve 10 müşteriden 2'sinin faturası gecikiyor.

## Çözüm (tek cümle)
FreelancerCRM, freelance yazılımcıların müşteri, proje ve fatura
yönetimini tek bir dashboard'da yapmasını sağlar.

## Must Özellikler
1. Müşteri listesi + iletişim bilgileri — CRM'in temeli
2. Proje takibi (aktif/tamamlanmış/bekleyen) — iş durumu görünürlüğü
3. Fatura oluşturma (PDF export) — e-fatura entegrasyonu v2'de
4. Dashboard: Bu ay kazanılan, bekleyen ödeme, aktif proje sayısı
5. Email hatırlatma: Vadesi geçen faturalar için otomatik reminder

## Won't Özellikler
- Zaman takibi (time tracking) — v1.1'de
- Teklif/proposal oluşturma — v2'de
- Mobil uygulama — PWA yeterli
- Çoklu dil desteği — sadece Türkçe başlıyoruz
- Takım özellikleri — solopreneur ürünü

## Doğrulama Sonuçları
- Test tipi: Fake Door Test (Carrd landing page + LinkedIn reklamı)
- Sonuç: 340 ziyaretçi, 28 kayıt (%8.2 dönüşüm), 4 kişi DM'den fiyat sordu
- Karar: Devam — %5 eşiğini geçtik

## Zaman Çizelgesi
- Başlangıç: 1 Nisan
- MVP teslim: 6 Mayıs (5 hafta)
- İlk ödeme alan müşteri hedefi: 15 Mayıs

## Başarı Metrikleri (ilk 30 gün)
- [ ] 100+ kayıtlı kullanıcı
- [ ] 10+ ödeme yapan müşteri (₺99/ay)
- [ ] %40+ Activation Rate (kayıt → ilk müşteri ekleme)
- [ ] Sean Ellis Test: %40+ "çok hayal kırıklığına uğrarım"

## Teknoloji Stack
- Next.js 14 (App Router): Bildiğim framework, full-stack
- Supabase: Auth + DB + Storage hepsi bir arada
- Vercel: Ücretsiz tier, Next.js ile mükemmel entegrasyon
- Lemon Squeezy: Türkiye'den satış için Stripe'dan kolay
- Resend: Transactional email (hatırlatmalar için)
```
