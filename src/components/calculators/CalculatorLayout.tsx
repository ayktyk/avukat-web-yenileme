import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ChevronRight } from "lucide-react";
import Seo, { type SeoStructuredData } from "@/components/Seo";
import { SITE_URL } from "@/lib/site-config";

type CalculatorLayoutProps = {
  title: string;
  shortTitle: string;
  description: string;
  canonicalPath: string;
  seoTitle?: string;
  seoDescription?: string;
  extraStructuredData?: SeoStructuredData;
  children: ReactNode;
};

const CalculatorLayout = ({
  title,
  shortTitle,
  description,
  canonicalPath,
  seoTitle,
  seoDescription,
  extraStructuredData,
  children,
}: CalculatorLayoutProps) => {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Hesaplamalar", item: `${SITE_URL}/hesaplamalar` },
      { "@type": "ListItem", position: 3, name: shortTitle, item: `${SITE_URL}${canonicalPath}` },
    ],
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    description,
    url: `${SITE_URL}${canonicalPath}`,
    applicationCategory: "LegalService",
    operatingSystem: "Any",
    inLanguage: "tr-TR",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
    provider: {
      "@type": "LegalService",
      name: "Vega Hukuk İstanbul",
      url: SITE_URL,
    },
  };

  const structuredData: SeoStructuredData = [breadcrumb, webApp];
  if (extraStructuredData) {
    const extras = Array.isArray(extraStructuredData) ? extraStructuredData : [extraStructuredData];
    structuredData.push(...extras);
  }

  return (
    <main className="min-h-screen bg-background">
      <Seo
        title={seoTitle ?? `${title} | Vega Hukuk İstanbul`}
        description={seoDescription ?? description}
        canonicalPath={canonicalPath}
        structuredData={structuredData}
      />

      <section className="section-container pt-24 pb-6">
        <nav
          aria-label="Sayfa yolu"
          className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link to="/" className="transition-colors hover:text-primary">
            Ana Sayfa
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/hesaplamalar" className="transition-colors hover:text-primary">
            Hesaplamalar
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{shortTitle}</span>
        </nav>

        <h1 className="mt-5 font-display text-[clamp(32px,4.5vw,48px)] font-bold leading-[1.1] text-primary-deep">
          {title}
        </h1>
        <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div
          role="note"
          className="mt-6 flex gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-4 text-sm leading-relaxed text-foreground/90"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
          <p>
            <strong className="font-semibold text-primary-deep">Bilgilendirme amaçlıdır.</strong> Bu
            araç genel hukuki bilgi vermek için tasarlanmıştır ve hukuki danışmanlık yerine geçmez.
            Dosyanıza özel değerlendirme için{" "}
            <Link to="/#iletisim" className="font-semibold text-primary underline-offset-2 hover:underline">
              avukatınıza başvurun
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="section-container pb-16">{children}</section>
    </main>
  );
};

export default CalculatorLayout;
