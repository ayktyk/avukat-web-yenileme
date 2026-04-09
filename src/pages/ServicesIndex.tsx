import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  FileSignature,
  Gavel,
  Handshake,
  Home,
  Scale,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { listServices } from "@/lib/service-repository";
import { SITE_URL } from "@/lib/site-config";
import type { Service } from "@/types/service";

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Scale,
  Handshake,
  Home,
  Users,
  ShoppingCart,
  Gavel,
  FileSignature,
};

const ServicesIndex = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadServices = async () => {
      const result = await listServices();
      if (mounted) {
        setServices(result);
        setLoading(false);
      }
    };

    void loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  useSeo({
    title: "Hizmet Alanları | Vega Hukuk İstanbul",
    description:
      "İstanbul Kadıköy'de iş hukuku, icra-iflas, kira-gayrimenkul, miras-aile, tüketici-sigorta, ceza hukuku ve ticaret hukuku alanında hukuki danışmanlık ve dava takibi.",
    canonicalPath: "/hizmetler",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Ana Sayfa",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Hizmetler",
          item: `${SITE_URL}/hizmetler`,
        },
      ],
    },
  });

  return (
    <main className="min-h-screen bg-background">
      <section className="section-container pt-24 pb-6">
        <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          Ana sayfaya dön
        </Link>
        <h1 className="mt-4 font-display text-[clamp(34px,5vw,54px)] font-bold leading-[1.1] text-primary-deep">
          Hizmet Alanları
        </h1>
        <p className="mt-3 max-w-[70ch] text-base text-muted-foreground">
          İş hukuku, icra-iflas, kira, miras, tüketici ve ceza hukuku başta olmak üzere çalışma alanlarımızda dosya
          bazlı hukuki danışmanlık ve dava takibi sunuyoruz. Her alan için süreç, sık karşılaşılan durumlar ve sıkça
          sorulan soruları ilgili sayfalarda bulabilirsiniz.
        </p>
      </section>

      <section className="section-container pb-16">
        {loading ? (
          <p className="text-muted-foreground">Hizmetler yükleniyor...</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] ?? Briefcase;
              return (
                <Link
                  key={service.slug}
                  to={`/hizmetler/${service.slug}`}
                  className="group block rounded-2xl border border-border bg-card p-7 transition-all duration-400 hover:-translate-y-1 hover:border-accent/25 hover:shadow-elegant-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] border border-primary/[0.08] bg-gradient-to-br from-primary/[0.06] to-primary/[0.02] text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-primary-deep group-hover:text-accent-light">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h2 className="mb-2 font-display text-xl font-bold text-primary-deep">{service.heading}</h2>
                  <p className="text-[14.5px] leading-relaxed text-muted-foreground">{service.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                    Detayı incele <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default ServicesIndex;
