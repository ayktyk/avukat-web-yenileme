import { ArrowLeft, Mail, Phone, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Seo from "@/components/Seo";
import { getTeamMemberBySlug } from "@/lib/team-data";
import { SITE_URL } from "@/lib/site-config";

const TeamMemberPage = () => {
  const { slug = "" } = useParams();
  const member = getTeamMemberBySlug(slug);

  const canonicalPath = member ? `/ekip/${member.slug}` : `/ekip/${slug}`;

  const seoStructuredData = member
    ? [
        {
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": `${SITE_URL}${canonicalPath}#person`,
          name: member.name,
          jobTitle: member.jobTitle,
          description: member.shortDescription,
          url: `${SITE_URL}${canonicalPath}`,
          email: `mailto:${member.email}`,
          telephone: member.phone,
          knowsAbout: member.knowsAbout,
          knowsLanguage: ["tr"],
          nationality: { "@type": "Country", name: "TR" },
          ...(member.baroSicilNo
            ? {
                identifier: {
                  "@type": "PropertyValue",
                  propertyID: "İstanbul Barosu Sicil No",
                  value: member.baroSicilNo,
                },
              }
            : {}),
          memberOf: {
            "@type": "Organization",
            name: member.baro,
            url: "https://www.istanbulbarosu.org.tr/",
          },
          worksFor: {
            "@type": "LegalService",
            name: "Vega Hukuk İstanbul",
            url: SITE_URL,
          },
          workLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Osmanağa Mah., Karadut Sok. No:14/10",
              addressLocality: "Kadıköy",
              addressRegion: "İstanbul",
              postalCode: "34714",
              addressCountry: "TR",
            },
          },
          sameAs: member.sameAs,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Ekip", item: `${SITE_URL}/ekip` },
            { "@type": "ListItem", position: 3, name: member.name, item: `${SITE_URL}${canonicalPath}` },
          ],
        },
      ]
    : undefined;

  const seoElement = (
    <Seo
      title={member?.seoTitle ?? "Ekip Üyesi Bulunamadı | Vega Hukuk İstanbul"}
      description={member?.seoDescription ?? "Vega Hukuk İstanbul ekip üyesi sayfası."}
      canonicalPath={canonicalPath}
      type="article"
      structuredData={seoStructuredData}
    />
  );

  if (!member) {
    return (
      <main className="min-h-screen bg-background">
        {seoElement}
        <section className="section-container max-w-[900px] pt-24 pb-16">
          <h1 className="font-display text-3xl font-bold text-primary-deep">Ekip üyesi bulunamadı</h1>
          <p className="mt-4 text-muted-foreground">Aradığınız ekip üyesi mevcut değil.</p>
          <Link to="/#ekibimiz" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <ArrowLeft className="h-4 w-4" /> Ekibimize dön
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {seoElement}
      <section className="section-container max-w-[900px] pt-24 pb-16">
        <Link to="/#ekibimiz" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Ekibimize dön
        </Link>

        <div className="mt-6 flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-accent/25 bg-primary/5 font-display text-[28px] font-bold text-primary">
            {member.initials}
          </div>
          <div>
            <h1 className="font-display text-[clamp(30px,4vw,44px)] font-bold leading-[1.1] text-primary-deep">
              {member.name}
            </h1>
            <p className="mt-2 text-sm font-semibold text-primary">{member.roleShort}</p>
          </div>
        </div>

        {member.baroSicilNo && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-2 text-sm text-primary-deep">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span className="font-medium">{member.baro} sicil no:</span> {member.baroSicilNo}
          </div>
        )}

        <p className="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
          {member.shortDescription}
        </p>

        <div className="mt-10 space-y-6">
          {member.longBio.map((paragraph, idx) => (
            <p key={idx} className="max-w-[70ch] text-[16px] leading-8 text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl font-bold text-primary-deep">Uygulama Alanları</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {member.practiceAreas.map((area) => (
            <article key={area.title} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-bold text-primary-deep">{area.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{area.description}</p>
            </article>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl font-bold text-primary-deep">İletişim</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <a href={`mailto:${member.email}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary-deep hover:text-accent">
            <Mail className="h-4 w-4" /> {member.email}
          </a>
          <a href={`tel:${member.phone}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary-deep hover:text-accent">
            <Phone className="h-4 w-4" /> {member.phone}
          </a>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
          Bu sayfa avukatın mesleki bilgilerini Schema.org Person işaretlemesiyle birlikte sunar. Yayınlanan tüm Vega Hukuk blog içerikleri,
          sorumlu avukat tarafından gözden geçirilmektedir.
        </div>
      </section>
    </main>
  );
};

export default TeamMemberPage;
