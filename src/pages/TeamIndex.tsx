import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Seo from "@/components/Seo";
import { teamMembers } from "@/lib/team-data";
import { SITE_URL } from "@/lib/site-config";

const TeamIndex = () => {
  return (
    <main className="min-h-screen bg-background">
      <Seo
        title="Ekibimiz | Vega Hukuk İstanbul"
        description="Vega Hukuk İstanbul ekibi: Av. Aykut Yeşilkaya (İstanbul Barosu sicil no 61223), Av. Mücahit İslam Keskün ve Av. Büşra Yeşilkaya. Kadıköy merkezli hukuk bürosu."
        canonicalPath="/ekip"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Ekip", item: `${SITE_URL}/ekip` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: teamMembers.map((member, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              item: {
                "@type": "Person",
                "@id": `${SITE_URL}/ekip/${member.slug}#person`,
                name: member.name,
                jobTitle: member.jobTitle,
                url: `${SITE_URL}/ekip/${member.slug}`,
              },
            })),
          },
        ]}
      />
      <section className="section-container max-w-[1100px] pt-24 pb-16">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[2.5px] text-accent before:h-[1.5px] before:w-6 before:bg-accent before:content-['']">
          Ekip
        </span>
        <h1 className="mt-3 font-display text-[clamp(32px,5vw,48px)] font-bold leading-[1.1] text-primary-deep">
          Ekibimiz
        </h1>
        <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
          Vega Hukuk İstanbul, Kadıköy merkezli bir hukuk bürosudur. Ekibimiz; iş, ceza, kira, gayrimenkul, miras, aile,
          tüketici, sigorta, sözleşmeler ve icra-iflas alanlarında hukuki danışmanlık ve dava takibi sağlar.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {teamMembers.map((member) => (
            <Link
              key={member.slug}
              to={`/ekip/${member.slug}`}
              className="group block rounded-2xl border border-border bg-card p-7 transition-all duration-400 hover:-translate-y-1 hover:shadow-elegant-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-accent/25 bg-primary/5 font-display text-[22px] font-bold text-primary">
                  {member.initials}
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-primary-deep">{member.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-primary">{member.roleShort}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{member.shortDescription}</p>
              {member.baroSicilNo && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {member.baro} sicil no: <span className="font-semibold text-primary-deep">{member.baroSicilNo}</span>
                </p>
              )}
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:text-accent">
                Profili incele <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default TeamIndex;
