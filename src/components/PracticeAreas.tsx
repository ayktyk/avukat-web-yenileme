import { Briefcase, FileSignature, Gavel, Handshake, Home, Phone, Scale, ShoppingCart, Users } from "lucide-react";
import { Link } from "react-router-dom";

const areas = [
  {
    icon: Briefcase,
    title: "İş Hukuku",
    slug: "is-hukuku",
    items: ["İşe iade • Kıdem/ihbar • Fazla mesai", "Mobbing • İş kazası tazminatı"],
  },
  {
    icon: Scale,
    title: "İcra & İflas",
    slug: "icra-iflas",
    items: ["İtirazın iptali • Menfi tespit", "Takip ve tahsilat yönetimi"],
  },
  {
    icon: Handshake,
    title: "Ticaret & Sözleşmeler",
    slug: "ticaret-sozlesmeler",
    items: ["Sözleşme tasarımı • Uyuşmazlık", "Şirketler hukuku danışmanlığı"],
  },
  {
    icon: Home,
    title: "Kira & Gayrimenkul",
    slug: "kira-gayrimenkul",
    items: ["Kiraya uyarlama • Tahliye • Alacak", "Tapu iptal tescil • İzaleyi şuyu"],
  },
  {
    icon: Users,
    title: "Miras & Aile",
    slug: "miras-aile",
    items: ["Tereke • Tenkis • Mal rejimi", "Nafaka • Velayet • Vasi işlemleri"],
  },
  {
    icon: ShoppingCart,
    title: "Tüketici & Sigorta",
    slug: "tuketici-sigorta",
    items: ["Ayıplı mal/hizmet • Poliçe uyuşmazlığı", "Tazminat • Hakem heyeti süreçleri"],
  },
  {
    icon: Gavel,
    title: "Ceza Hukuku",
    slug: "ceza-hukuku",
    items: ["Ceza davalarında savunma", "Soruşturma • Kovuşturma süreçleri"],
  },
  {
    icon: FileSignature,
    title: "Sözleşmeler Hukuku",
    slug: "sozlesmeler-hukuku",
    items: ["Sözleşme tasarımı • Müzakere", "Sözleşme uyuşmazlıkları • Revizyon"],
  },
];

const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }
};

const PracticeAreas = () => {
  return (
    <section id="calisma-alanlari" className="bg-background py-20">
      <div className="section-container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[2.5px] text-accent before:h-[1.5px] before:w-6 before:bg-accent before:content-['']">
              Uzmanlık
            </span>
            <h3 className="mt-3 font-display text-[clamp(30px,4vw,42px)] font-bold leading-[1.15] text-primary-deep">
              Çalışma Alanları
            </h3>
          </div>
          <button
            onClick={() => scrollTo("#iletisim")}
            className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent-pale px-4 py-2 text-[13px] font-semibold text-primary-deep transition-all hover:-translate-y-0.5 hover:bg-accent/20"
          >
            <Phone className="h-3.5 w-3.5" /> Hızlı Randevu
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <Link
              key={area.title}
              to={`/hizmetler/${area.slug}`}
              className="group block rounded-2xl border border-border bg-card p-7 transition-all duration-400 hover:-translate-y-1 hover:border-accent/25 hover:shadow-elegant-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] border border-primary/[0.08] bg-gradient-to-br from-primary/[0.06] to-primary/[0.02] text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-primary-deep group-hover:text-accent-light">
                <area.icon className="h-5 w-5" />
              </div>
              <h4 className="mb-2 font-display text-xl font-bold text-primary-deep">{area.title}</h4>
              <ul className="space-y-1.5">
                {area.items.map((item) => (
                  <li key={item} className="text-[14.5px] leading-relaxed text-muted-foreground">
                    <span className="mr-2 font-bold text-accent">-</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PracticeAreas;
