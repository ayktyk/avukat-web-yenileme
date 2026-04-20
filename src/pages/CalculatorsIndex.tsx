import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import Seo from "@/components/Seo";
import { CALCULATORS } from "@/lib/calculators-meta";
import { SITE_URL } from "@/lib/site-config";

const CalculatorsIndex = () => {
  return (
    <main className="min-h-screen bg-background">
      <Seo
        title="Hesaplama Araçları | Vega Hukuk İstanbul"
        description="İşçilik alacakları, miras payı ve infaz hesaplama araçlarıyla hukuki sürecinize dair bilgilendirme niteliğinde ön değerlendirme alın. Vega Hukuk İstanbul."
        canonicalPath="/hesaplamalar"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Hesaplamalar", item: `${SITE_URL}/hesaplamalar` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Hesaplama Araçları",
            url: `${SITE_URL}/hesaplamalar`,
            inLanguage: "tr-TR",
            about: CALCULATORS.map((c) => c.shortTitle),
          },
        ]}
      />

      <section className="section-container pt-24 pb-6">
        <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          Ana sayfaya dön
        </Link>
        <h1 className="mt-4 font-display text-[clamp(34px,5vw,54px)] font-bold leading-[1.1] text-primary-deep">
          Hesaplama Araçları
        </h1>
        <p className="mt-3 max-w-[70ch] text-base text-muted-foreground">
          İş, miras ve ceza hukuku alanlarında ön değerlendirme yapmanıza yardımcı olacak
          hesaplama araçları. Sonuçlar bilgilendirme amaçlıdır; davanızın hukuki
          değerlendirmesi için avukatınıza başvurmanız gerekir.
        </p>
      </section>

      <section className="section-container pb-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CALCULATORS.map((calc) => {
            const Icon = calc.icon;
            const isActive = calc.status === "active";
            const href = `/hesaplamalar/${calc.slug}`;

            const cardContent = (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-primary/[0.08] bg-gradient-to-br from-primary/[0.06] to-primary/[0.02] text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-primary-deep group-hover:text-accent-light">
                    <Icon className="h-5 w-5" />
                  </div>
                  {!isActive ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Yakında
                    </span>
                  ) : null}
                </div>
                <h2 className="mb-2 font-display text-xl font-bold text-primary-deep">
                  {calc.title}
                </h2>
                <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                  {calc.description}
                </p>
                {isActive ? (
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                    Hesaplamaya başla <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                    Yakında yayında
                  </span>
                )}
              </>
            );

            return isActive ? (
              <Link
                key={calc.slug}
                to={href}
                className="group block rounded-2xl border border-border bg-card p-7 transition-all duration-400 hover:-translate-y-1 hover:border-accent/25 hover:shadow-elegant-lg"
              >
                {cardContent}
              </Link>
            ) : (
              <div
                key={calc.slug}
                className="group block rounded-2xl border border-border bg-card/60 p-7 opacity-75"
                aria-disabled="true"
              >
                {cardContent}
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-muted/30 p-6 text-sm leading-relaxed text-muted-foreground">
          <strong className="mb-1 block font-semibold text-primary-deep">Yasal Uyarı.</strong>
          Hesaplama araçları yalnızca bilgilendirme amaçlıdır. Çıktılar mahkeme, bilirkişi veya
          resmi makamlarca bağlayıcı sayılmaz. Dosyanıza özgü hukuki değerlendirme için
          avukatınıza başvurunuz.
        </div>
      </section>
    </main>
  );
};

export default CalculatorsIndex;
