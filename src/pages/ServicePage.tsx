import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  FileSignature,
  Gavel,
  Handshake,
  Home,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Scale,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import MarkdownContent from "@/components/MarkdownContent";
import { useSeo } from "@/hooks/use-seo";
import { formatDateTr } from "@/lib/format-date";
import { getServiceBySlug } from "@/lib/service-repository";
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

const ServicePage = () => {
  const { slug = "" } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadService = async () => {
      const result = await getServiceBySlug(slug);
      if (mounted) {
        setService(result);
        setLoading(false);
      }
    };

    void loadService();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const IconComponent = service ? iconMap[service.icon] ?? Briefcase : Briefcase;

  useSeo({
    title: service?.seoTitle ?? `${service?.title ?? "Hizmet"} | Vega Hukuk İstanbul`,
    description:
      service?.seoDescription ??
      service?.description ??
      "Vega Hukuk İstanbul hizmet alanı: hukuki danışmanlık ve dava takibi.",
    canonicalPath: `/hizmetler/${slug}`,
    image: service?.heroImage,
    type: "website",
    structuredData: service
      ? [
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            serviceType: service.heading,
            description: service.seoDescription ?? service.description,
            provider: {
              "@type": "LegalService",
              name: "Vega Hukuk İstanbul",
              url: window.location.origin,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Osmanağa Mahallesi, Karadut Sokak No:14/10",
                addressLocality: "Kadıköy",
                addressRegion: "İstanbul",
                addressCountry: "TR",
              },
              telephone: "+905519814937",
            },
            areaServed: {
              "@type": "City",
              name: "İstanbul",
            },
            url: `${window.location.origin}/hizmetler/${service.slug}`,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: window.location.origin },
              { "@type": "ListItem", position: 2, name: "Hizmetler", item: `${window.location.origin}/hizmetler` },
              { "@type": "ListItem", position: 3, name: service.heading },
            ],
          },
          ...(service.faq.length > 0
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: service.faq.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: item.answer,
                    },
                  })),
                },
              ]
            : []),
        ]
      : undefined,
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="section-container py-24">
          <p className="text-muted-foreground">Hizmet sayfası yükleniyor...</p>
        </section>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="min-h-screen bg-background">
        <section className="section-container py-24">
          <h1 className="font-display text-4xl font-bold text-primary-deep">Hizmet bulunamadı</h1>
          <p className="mt-3 text-muted-foreground">
            İstediğiniz hizmet sayfası kaldırılmış olabilir veya bağlantı yanlış olabilir.
          </p>
          <Link to="/hizmetler" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
            <ArrowLeft className="h-4 w-4" /> Hizmetlere dön
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <article className="section-container max-w-[900px] pt-24 pb-16">
        <Link
          to="/hizmetler"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Hizmetlere dön
        </Link>

        <div className="mt-6 flex items-start gap-5">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[14px] border border-primary/[0.08] bg-gradient-to-br from-primary/[0.08] to-primary/[0.02] text-primary">
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[1.4px] text-accent">
              Hizmet Alanı
            </span>
            <h1 className="mt-2 font-display text-[clamp(32px,5vw,52px)] font-bold leading-[1.1] text-primary-deep">
              {service.title}
            </h1>
            <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-muted-foreground">{service.description}</p>
          </div>
        </div>

        {service.heroImage ? (
          <img
            src={service.heroImage}
            alt={service.title}
            className="mt-8 mb-9 aspect-[16/8] w-full rounded-2xl object-cover object-top"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        ) : (
          <div className="mt-8 mb-9 aspect-[16/8] w-full rounded-2xl bg-gradient-to-br from-primary/[0.08] to-primary/[0.03]" />
        )}

        <MarkdownContent content={service.content} />

        {service.faq.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-[clamp(26px,3.5vw,34px)] font-bold leading-[1.15] text-primary-deep">
              Sıkça Sorulan Sorular
            </h2>
            <div className="mt-6 space-y-3">
              {service.faq.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={item.question}
                    className="cursor-pointer rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-accent/25"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display text-base font-bold text-primary-deep">{item.question}</h3>
                      <Plus
                        className={`h-5 w-5 flex-shrink-0 text-accent transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      />
                    </div>
                    <div
                      className={`grid overflow-hidden transition-all duration-300 ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="mt-3 pb-1 text-[14.5px] leading-relaxed text-muted-foreground">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-12 rounded-2xl border border-border bg-card p-8">
          <h2 className="font-display text-2xl font-bold text-primary-deep">Danışma ve İletişim</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Somut uyuşmazlığınız için dosya bazlı değerlendirme almak üzere iletişime geçebilirsiniz. İlk görüşme için
            randevu talebinizi aşağıdaki kanallardan iletebilirsiniz.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://wa.me/905519814937"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-accent-light transition-all hover:-translate-y-0.5 hover:bg-primary-deep"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp ile Yaz
            </a>
            <a
              href="tel:+905519814937"
              className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-pale px-5 py-3 text-sm font-semibold text-primary-deep transition-all hover:-translate-y-0.5 hover:bg-accent/20"
            >
              <Phone className="h-4 w-4" /> +90 551 981 49 37
            </a>
            <a
              href="mailto:vegalaw.contact@gmail.com"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-primary-deep transition-all hover:-translate-y-0.5 hover:border-accent/25"
            >
              <Mail className="h-4 w-4" /> E-posta Gönder
            </a>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Osmanağa Mahallesi, Karadut Sokak No:14/10, Kadıköy/İstanbul · Pazartesi-Cuma 09:00-18:00
          </p>
        </section>

        <div className="mt-8 rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Bu sayfa genel bilgilendirme amacıyla hazırlanmıştır. Her somut olay kendi koşullarında
            değerlendirilmelidir; bu içerik hukuki danışmanlık yerine geçmez.
          </p>
          {service.updatedAt && (
            <p className="mt-2 text-xs text-muted-foreground">
              Son güncelleme: {formatDateTr(service.updatedAt)}
            </p>
          )}
        </div>
      </article>
    </main>
  );
};

export default ServicePage;
