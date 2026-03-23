---
description: Solopreneurler için pratik prompt mühendisliği rehberi — Claude ve ChatGPT ile verimli çalışma
---

# Prompt Mühendisliği — Solopreneur Rehberi

## Amaç

AI'dan profesyonel kalitede çıktı almak için pratik teknikler. Akademik teori yok — kopyala-yapıştır yapabileceğin şablonlar ve hemen uygulayabileceğin kurallar. Solopreneur olarak AI, senin ilk çalışanın. Ama ona iyi brief vermezsen kötü iş çıkarır.

**Kategori**: Yapay Zeka ve Otomasyon
**Ön koşul**: Claude veya ChatGPT hesabı
**Seviye**: Başlangıç → Orta

## Temel Çerçeve: RACE

Her prompt'u bu 4 katmanlı yapıyla kur:

| Katman | Açıklama | Örnek |
|--------|----------|-------|
| **R**ole (Rol) | AI'ya kim olduğunu söyle | "Sen 10 yıllık deneyimli bir SaaS copywriter'ısın" |
| **A**ction (Eylem) | Ne yapmasını istediğini söyle | "Bir landing page headline'ı yaz" |
| **C**ontext (Bağlam) | İşin arka planını ver | "Ürünüm freelancerlar için zaman takip aracı, aylık ₺99" |
| **E**xample (Örnek) | Beklediğin çıktıyı göster | "Şu tarz olsun: 'Stop trading time for money'" |

**Neden çalışır?** AI, bağlam ne kadar spesifikse o kadar iyi çıktı verir. "Bir metin yaz" dersen ortalama bir şey alırsın. RACE ile yönlendirirsen profesyonel çıktı alırsın.

## 5 Temel Prompt Kalıbı

### 1. İçerik Üretimi (Blog, Sosyal Medya, E-posta)

```
Rol: Sen [niş alanı] konusunda uzman bir içerik stratejistsin.
Hedef kitle: [kitle tanımı — yaş, meslek, acı noktası].
Görev: [içerik türü] yaz.
Ton: [konuşkan / profesyonel / eğitici / ikna edici].
Uzunluk: [kelime sayısı veya paragraf sayısı].
Format: [madde listesi / hikaye / listicle / how-to].

Şu yapıyı kullan:
- Dikkat çekici açılış (ilk cümle kancası)
- Ana mesaj (3 alt başlıkla)
- Kapanış + call-to-action

Örnek ton: "[buraya beğendiğin bir içerikten 2-3 cümle yapıştır]"
```

### 2. Araştırma ve Analiz (Rakip, Pazar)

```
Rol: Sen [sektör] alanında deneyimli bir iş analisti sin.
Görev: [rakip/pazar/trend] analizi yap.
Kapsam: [coğrafya, zaman dilimi, segment].

Şu çerçeveyi kullan:
1. Mevcut durum özeti (5 madde)
2. Güçlü ve zayıf yönler tablosu
3. Fırsatlar (3 tane, her biri potansiyel gelir tahminiyle)
4. Tehditler ve riskler
5. Benim için 3 aksiyon önerisi (öncelik sırasıyla)

Kaynak olarak bilinen verileri kullan. Emin olmadığın yerleri "[doğrulanmalı]" olarak işaretle.
```

### 3. Kod ve Otomasyon (Script, Entegrasyon)

```
Rol: Sen [dil/platform] konusunda senior bir geliştiricisin.
Görev: [ne yapmasını istediğini anlat].
Ortam: [Node.js / Python / Zapier / Make.com / vb.].
Kısıtlamalar: [API limiti, maliyet, güvenlik].

Şunları dahil et:
- Çalışan kod (kopyala-yapıştır edilebilir)
- Adım adım kurulum talimatları
- Hata durumları için error handling
- Yorumlar Türkçe olsun

Kod seviyem: [başlangıç / orta / ileri] — buna göre açıkla.
```

### 4. Düzenleme ve İyileştirme (Yeniden Yaz, Sadeleştir, Çevir)

```
Aşağıdaki metni [düzenle / sadeleştir / yeniden yaz / çevir].

Kurallar:
- Ton: [mevcut tonu koru / daha resmi yap / daha samimi yap]
- Uzunluk: [%30 kısalt / aynı uzunlukta tut / genişlet]
- Hedef: [daha ikna edici / daha net / SEO uyumlu / daha profesyonel]
- Koruma: [teknik terimleri değiştirme / marka adını koru / sayıları değiştirme]

Metin:
"""
[metni buraya yapıştır]
"""
```

### 5. Strateji ve Beyin Fırtınası (Fikir, Plan, Karar)

```
Rol: Sen benim iş danışmanımsın. Beni iyi tanıyorsun:
- İşim: [ne yaptığını 1 cümleyle anlat]
- Gelirim: [aylık gelir aralığı]
- Hedefim: [6 aylık hedef]
- En büyük engelim: [1 cümle]

Görev: [karar / plan / fikir üretimi] konusunda yardım et.

Şu formatta cevap ver:
1. Durumun kısa analizi (3 cümle)
2. 3 seçenek (her birinin artıları, eksileri, tahmini etkisi)
3. Senin tavsiyeni seç ve nedenini açıkla
4. İlk 7 günlük aksiyon planı
```

## System Prompt Kurulumu

System prompt, her konuşmanın başında AI'ya verdiğin kalıcı talimattır. Claude'da "Project Instructions", ChatGPT'de "Custom Instructions" olarak ayarlanır.

**Neden önemli?** Her seferinde aynı bağlamı tekrar vermekten kurtarır. AI seni "tanır" hale gelir.

**Solopreneur system prompt şablonu:**
```
Sen benim iş asistanımsın. Hakkımda bildiklerin:
- [İşin ne, kime satıyorsun, fiyat aralığın]
- [Hedef kitlen kim, en büyük acı noktaları]
- [Mevcut gelir, hedef gelir, zaman çerçevesi]
- [Kullandığın araçlar: Notion, Figma, VS Code, vb.]
- [Tercih ettiğin ton: samimi ama profesyonel]

Kuralların:
- Kısa ve net cevap ver, gereksiz uzatma
- Somut örnekler ve rakamlar kullan
- Emin olmadığın bilgileri belirt
- Türkçe cevap ver (teknik terimler İngilizce kalabilir)
```

## Chain-of-Thought: Adım Adım Düşündürme

Prompt'una "adım adım düşün" veya "think step by step" eklemek çıktı kalitesini ciddi ölçüde artırır. Özellikle şu durumlarda kullan:

- Karmaşık analiz veya karşılaştırma
- Matematik veya hesaplama içeren talepler
- Çok adımlı planlama
- Hata ayıklama (debugging)

**Örnek**: "Bu fiyatlandırma stratejisini analiz et. Adım adım düşün: önce mevcut durumu özetle, sonra her seçeneğin etkisini hesapla, en son tavsiyeni ver."

## Few-Shot: Örnekle Gösterme

AI'ya ne istediğini anlatmak yerine göster. 2-3 örnek vermek çıktı kalitesini %40-60 artırır.

**Kötü prompt**: "Müşteri testimonial'ı yaz."
**İyi prompt**:
```
Şu örneklere benzer bir müşteri testimonial'ı yaz:

Örnek 1: "Aracı kullanmaya başladıktan sonra haftalık 5 saatimi geri kazandım.
Artık müşteri takibini unutmuyorum." — Ayşe, freelance tasarımcı

Örnek 2: "İlk ayda 3 yeni müşteri kazandım, çünkü tekliflerimi çok daha hızlı
gönderebiliyorum." — Mert, danışman

Şimdi benzer tonda, bir yazılım geliştirici için yaz. Ürün: proje yönetim aracı.
```

## Sık Yapılan Hatalar

| Hata | Neden kötü | Çözüm |
|------|------------|-------|
| Belirsiz prompt | "Bir şey yaz" → ortalama çıktı | RACE çerçevesini kullan, spesifik ol |
| Aşırı uzun prompt | AI önemli detayları kaçırır | En kritik bilgiyi başa koy, 300 kelimeyi geçme |
| Bağlam vermemek | AI varsayım yapar, genelde yanlış | İşini, kitlesini, hedefini 2-3 cümleyle anlat |
| Örnek vermemek | AI senin tarzını bilemez | En az 1 örnek göster (few-shot) |
| Tek seferde her şeyi istemek | Kalite düşer | Büyük işleri adımlara böl, her adımı ayrı iste |

## Temperature ve Token Ayarları

- **Temperature** (0.0 - 1.0): Yaratıcılık düğmesi. 0.0 = tutarlı ve öngörülebilir, 1.0 = yaratıcı ve sürprizli.
  - Kod yazımı: 0.0-0.2 (hata istemezsin)
  - İş metinleri: 0.3-0.5 (tutarlı ama sıkıcı değil)
  - Beyin fırtınası: 0.7-0.9 (çılgın fikirler gelsin)
- **Max Tokens**: Cevap uzunluğu limiti. 500 token ~ 375 kelime. Kısa cevap istiyorsan düşük tut, detaylı analiz istiyorsan yükselt.

## Örnek Çıktı

Aşağıda 5 kategoride kullanıma hazır prompt şablonları:

```markdown
# 1. İçerik — Haftalık Newsletter
Sen SaaS dünyasında uzman bir içerik editörüsün. Solopreneurlere yönelik
haftalık newsletter yaz. Konu: [bu haftanın konusu]. Ton: samimi, pratik,
buzzword'süz. Yapı: 1 ana ders (3 paragraf) + 3 kısa kaynak linki açıklaması +
1 CTA (ücretsiz deneme). Uzunluk: 400 kelime. Türkçe yaz.

# 2. Araştırma — Rakip Analizi
Sen bir pazar araştırma analistsin. Şu 3 rakibi karşılaştır: [Rakip A],
[Rakip B], [Rakip C]. Kriterler: fiyatlandırma, özellikler, hedef kitle,
zayıf noktalar. Tablo formatında sun. Sonunda "benim ürünüm nasıl
farklılaşabilir" sorusuna 3 somut öneri ver.

# 3. Kod — Zapier Alternatifi Script
Sen senior bir Python geliştiricisisin. Bana [X API]'den veri çeken ve
[Y aracına] yazan bir Python scripti yaz. Ortam: Python 3.11, requests
kütüphanesi. Error handling ekle. Cron job olarak çalışacak. Yorumlar
Türkçe olsun. Kurulum adımlarını da anlat.

# 4. Düzenleme — Landing Page Metni
Aşağıdaki landing page metnini yeniden yaz. Hedef: dönüşüm oranını artırmak.
Kurallar: (a) headline'ı fayda odaklı yap, (b) jargonu temizle,
(c) sosyal kanıt ekle, (d) CTA'yı güçlendir. Orijinal uzunluğu koru.
Metin: """[yapıştır]"""

# 5. Strateji — Fiyat Artışı Kararı
Sen benim iş danışmanımsın. Mevcut fiyatım: ₺99/ay, 230 aktif müşteri.
₺149/ay'a çıkmayı düşünüyorum. Adım adım düşün: (1) churn riski hesapla
(%5-15 aralığında senaryolar), (2) gelir etkisi tablosu, (3) geçiş stratejisi
(grandfather, gradual, cold turkey), (4) tavsiyeni ve uygulama takvimini ver.
```
