import { Link } from "react-router-dom";
import {
  ArrowRight,
  CreditCard,
  Lock,
  ShieldCheck,
  Building2,
  Scale,
  CheckCircle2,
  Info,
} from "lucide-react";
import Seo from "@/components/Seo";
import { SITE_URL } from "@/lib/site-config";

const MOKA_POS_URL =
  "https://pos.mokaunited.com/tr/customerpos/payment-request?uppc=6fksucpuSNKx66xa7eakmA==";

const ETahsilat = () => {
  return (
    <main className="min-h-screen bg-background">
      <Seo
        title="E-Tahsilat — Online Ödeme | Vega Hukuk İstanbul"
        description="Vega Hukuk İstanbul müvekkilleri için güvenli kredi kartı ile online ödeme. Türkiye Barolar Birliği ve İstanbul Barosu denetimli avukatlık büromuza Moka POS altyapısı üzerinden 7/24 ödeme yapabilirsiniz."
        canonicalPath="/e-tahsilat"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "E-Tahsilat", item: `${SITE_URL}/e-tahsilat` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "E-Tahsilat — Online Ödeme",
            url: `${SITE_URL}/e-tahsilat`,
            inLanguage: "tr-TR",
            description:
              "Vega Hukuk İstanbul müvekkilleri için güvenli kredi kartı ile online ödeme sayfası. Moka POS altyapısı ile 256-bit SSL şifreli ödeme.",
          },
        ]}
      />

      <section className="section-container pt-24 pb-6">
        <Link
          to="/"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Ana sayfaya dön
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-md">
            <CreditCard className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[3px] text-emerald-700">
              Güvenli Online Ödeme
            </p>
            <h1 className="mt-1 font-display text-[clamp(30px,4.5vw,46px)] font-bold leading-[1.1] text-primary-deep">
              E-Tahsilat
            </h1>
          </div>
        </div>
        <p className="mt-4 max-w-[75ch] text-base leading-relaxed text-muted-foreground">
          Vega Hukuk İstanbul müvekkillerimize vekâlet ücreti, danışmanlık bedeli ve yargılama
          gideri avanslarını{" "}
          <strong className="text-foreground">kredi kartı ile 7/24 online</strong> ödeyebilme
          imkânı sunuyoruz. Ödemeleriniz, Türkiye Barolar Birliği ve İstanbul Barosu denetimi
          altındaki avukatlık büromuzun meslek güvencesinde, Moka POS (Moka United Ödeme
          Kuruluşu A.Ş.) altyapısı üzerinden işlenir.
        </p>
      </section>

      <section className="section-container pb-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-elegant">
            <Lock className="h-6 w-6 text-emerald-700" />
            <h3 className="mt-3 font-display text-base font-bold text-primary-deep">
              256-bit SSL
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Kart bilgileriniz banka düzeyinde SSL şifrelemesiyle korunur, büromuzun
              sunucularında saklanmaz.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-elegant">
            <ShieldCheck className="h-6 w-6 text-emerald-700" />
            <h3 className="mt-3 font-display text-base font-bold text-primary-deep">
              3D Secure
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Her işlem bankanızın SMS veya mobil onayı ile doğrulanır. Yetkisiz kullanıma karşı
              ek güvenlik.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-elegant">
            <Building2 className="h-6 w-6 text-emerald-700" />
            <h3 className="mt-3 font-display text-base font-bold text-primary-deep">
              BDDK Lisanslı
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Moka United, BDDK lisanslı ödeme kuruluşudur. PCI DSS Level-1 sertifikası ile
              uluslararası standartta çalışır.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-elegant">
            <Scale className="h-6 w-6 text-emerald-700" />
            <h3 className="mt-3 font-display text-base font-bold text-primary-deep">
              Baro Güvencesi
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Ödemeleriniz, İstanbul Barosu'na kayıtlı avukatlık büromuzun meslek sorumluluk
              çerçevesinde işlenir.
            </p>
          </div>
        </div>
      </section>

      <section className="section-container pb-10">
        <div className="rounded-3xl border-2 border-emerald-600/30 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 p-8 shadow-sm md:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Anında yönlendirme
              </div>
              <h2 className="mt-4 font-display text-[clamp(24px,3vw,34px)] font-bold leading-tight text-primary-deep">
                Kredi Kartı ile Online Ödeme
              </h2>
              <p className="mt-3 max-w-[55ch] text-[15px] leading-relaxed text-foreground/80">
                Aşağıdaki butona tıkladığınızda, ödemeniz Moka POS güvenli sanal pos
                sayfasında alınır. Ödeme tamamlandıktan sonra tarafınıza ve büromuza
                makbuz iletilir.
              </p>

              <ul className="mt-5 space-y-2 text-sm text-foreground/85">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  <span>Visa, Mastercard, American Express ve Troy kartlar kabul edilir.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  <span>Tek çekim ve uygun bankalarda taksit seçenekleri desteklenir.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  <span>
                    Açıklama kısmına{" "}
                    <strong className="text-foreground">dosya/esas numaranızı</strong> ya da
                    ad-soyadınızı yazmanız eşleştirmeyi hızlandırır.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  <span>Makbuzunuz kayıtlı e-posta adresinize iletilir.</span>
                </li>
              </ul>

              <div className="mt-7">
                <a
                  href={MOKA_POS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Moka POS güvenli ödeme sayfasına git (yeni sekmede açılır)"
                  className="group inline-flex items-center gap-2 rounded-2xl border-2 border-emerald-700 bg-emerald-600 px-7 py-4 font-display text-lg font-semibold text-white shadow-elegant transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-elegant-lg focus:outline-none focus:ring-4 focus:ring-emerald-300"
                >
                  <Lock className="h-5 w-5" />
                  Güvenli Ödemeye Git
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
                <p className="mt-3 text-xs text-muted-foreground">
                  Ödeme sayfası{" "}
                  <span className="font-mono text-foreground/80">pos.mokaunited.com</span> üzerinde
                  yeni sekmede açılır.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white/70 p-6 shadow-sm backdrop-blur">
              <h3 className="font-display text-base font-bold text-primary-deep">
                Kabul edilen ödeme yöntemleri
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {["Visa", "Mastercard", "American Express", "Troy"].map((brand) => (
                  <div
                    key={brand}
                    className="flex items-center justify-center rounded-lg border border-border bg-white px-3 py-3 text-sm font-semibold text-foreground/80"
                  >
                    {brand}
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
                <strong className="mb-1 block font-semibold text-primary-deep">
                  Ödeme altyapısı
                </strong>
                Moka United Ödeme Kuruluşu A.Ş. — BDDK lisanslı, PCI DSS Level-1 sertifikalı
                ödeme hizmet sağlayıcısı.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container pb-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-base font-bold text-primary">
              1
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-primary-deep">
              Butona tıklayın
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              "Güvenli Ödemeye Git" butonu ile Moka POS sanal pos sayfasına yönlendirilirsiniz.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-base font-bold text-primary">
              2
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-primary-deep">
              Bilgileri doldurun
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Kart bilgilerinizi, tutarı ve açıklama kısmına dosya/esas numaranızı girin. 3D
              Secure onayı ile işlemi tamamlayın.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-base font-bold text-primary">
              3
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-primary-deep">
              Makbuzunuzu alın
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Ödeme başarılı olduktan sonra tarafınıza ve büromuza bildirim iletilir; makbuz
              e-posta ile gönderilir.
            </p>
          </div>
        </div>
      </section>

      <section className="section-container pb-16">
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-6">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-primary-deep">Yasal uyarı.</strong> Bu sayfa üzerinden
              yapılan tahsilatlar Vega Hukuk İstanbul'un avukatlık sözleşmesine konu vekâlet
              ücreti, danışmanlık bedeli ve yargılama gideri avansı tahsilatıdır. 1136 sayılı
              Avukatlık Kanunu ve Türkiye Barolar Birliği Meslek Kuralları çerçevesinde makbuz
              düzenlenir. Ödeme bilgileri büromuzun sunucularında saklanmaz; kart verisi
              yalnızca Moka United Ödeme Kuruluşu A.Ş. altyapısında işlenir.
            </p>
            <p>
              Ödemenizle ilgili sorunuz veya iadeye ilişkin talebiniz için büromuzla{" "}
              <a
                href="mailto:vegalaw.contact@gmail.com"
                className="font-medium text-primary hover:underline"
              >
                vegalaw.contact@gmail.com
              </a>{" "}
              adresinden iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ETahsilat;
