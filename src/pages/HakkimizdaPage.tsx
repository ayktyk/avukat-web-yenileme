import { Link } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  Cpu,
  Mail,
  MapPin,
  Phone,
  Scale,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import Seo from "@/components/Seo";
import { SITE_URL } from "@/lib/site-config";
import { teamMembers } from "@/lib/team-data";

const principles = [
  {
    num: "01",
    icon: Target,
    title: "Misyon",
    desc: "Vaka-özel strateji, disiplinli süreç yönetimi ve güçlü müzakere ile müvekkillerimizin zamanını ve maliyetini optimize eden çözümler üretmek.",
    border: "border-t-primary",
  },
  {
    num: "02",
    icon: Compass,
    title: "Yaklaşım",
    desc: "Uyuşmazlığı erken safhada analiz ediyor, delil-ekonomi ilkesi ve güncel içtihat dengesiyle en rasyonel yolu öneriyoruz. Dosya açılmadan önce de yanınızdayız.",
    border: "border-t-accent",
  },
  {
    num: "03",
    icon: Cpu,
    title: "Teknoloji",
    desc: "Hukuki araştırma ve belge otomasyonunda yapay zeka destekli araçlar kullanıyor; süreç şeffaflığı için müvekkillerimize düzenli raporlama yapıyoruz.",
    border: "border-t-primary-light",
  },
  {
    num: "04",
    icon: ShieldCheck,
    title: "Etik",
    desc: "Avukatlık Kanunu ve TBB Meslek Kuralları'na sıkı bağlılık. Müvekkil sırrı ve menfaat çatışması ilkelerini istisnasız uyguluyoruz.",
    border: "border-t-primary",
  },
];

const steps = [
  { num: "1", title: "Görüşme", desc: "Ücretsiz ön değerlendirme" },
  { num: "2", title: "Analiz", desc: "Dosya ve risk analizi" },
  { num: "3", title: "Strateji", desc: "Yol haritası belirleme" },
  { num: "4", title: "Çözüm", desc: "Sonuç odaklı takip" },
];

const practiceHighlights = [
  { title: "İş Hukuku", slug: "is-hukuku" },
  { title: "Ceza Hukuku", slug: "ceza-hukuku" },
  { title: "İcra ve İflas", slug: "icra-iflas" },
  { title: "Kira ve Gayrimenkul", slug: "kira-gayrimenkul" },
  { title: "Miras ve Aile", slug: "miras-aile" },
  { title: "Sözleşmeler Hukuku", slug: "sozlesmeler-hukuku" },
  { title: "Ticaret ve Sözleşmeler", slug: "ticaret-sozlesmeler" },
  { title: "Tüketici ve Sigorta", slug: "tuketici-sigorta" },
];

const HakkimizdaPage = () => {
  const pageTitle = "Hakkımızda | Vega Hukuk İstanbul";
  const pageDescription =
    "Vega Hukuk İstanbul, Kadıköy merkezli bir hukuk bürosudur. İş, ceza, kira, miras, aile, tüketici, sigorta, sözleşmeler ve icra-iflas alanlarında hukuki danışmanlık ve dava takibi.";

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Hakkımızda", item: `${SITE_URL}/hakkimizda` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "LegalService",
      "@id": `${SITE_URL}/#legalservice`,
      name: "Vega Hukuk İstanbul",
      url: SITE_URL,
      description: pageDescription,
      areaServed: {
        "@type": "City",
        name: "İstanbul",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kadıköy",
        addressRegion: "İstanbul",
        addressCountry: "TR",
      },
      knowsAbout: [
        "İş Hukuku",
        "Ceza Hukuku",
        "İcra ve İflas Hukuku",
        "Kira Hukuku",
        "Gayrimenkul Hukuku",
        "Miras Hukuku",
        "Aile Hukuku",
        "Sözleşmeler Hukuku",
        "Tüketici Hukuku",
        "Sigorta Hukuku",
        "Arabuluculuk",
      ],
      employee: teamMembers.map((member) => ({
        "@type": "Person",
        "@id": `${SITE_URL}/ekip/${member.slug}#person`,
        name: member.name,
        jobTitle: member.jobTitle,
        url: `${SITE_URL}/ekip/${member.slug}`,
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Seo
        title={pageTitle}
        description={pageDescription}
        canonicalPath="/hakkimizda"
        structuredData={structuredData}
      />

      <section className="section-container max-w-[1100px] pt-24 pb-10">
        <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          Ana sayfaya dön
        </Link>
        <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[2.5px] text-accent before:h-[1.5px] before:w-6 before:bg-accent before:content-['']">
          Hakkımızda
        </span>
        <h1 className="mt-3 font-display text-[clamp(34px,5vw,54px)] font-bold leading-[1.1] text-primary-deep">
          Vega Hukuk İstanbul
        </h1>
        <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
          Vega Hukuk İstanbul, Kadıköy merkezli bir hukuk bürosudur. Av. Aykut Yeşilkaya ve Av. Mücahit İslam Keskün
          tarafından kurulan büromuz; iş, ceza, kira ve gayrimenkul, miras ve aile, tüketici ve sigorta, sözleşmeler
          ile icra-iflas hukuku alanlarında müvekkillerine hukuki danışmanlık ve dava takibi sağlar.
        </p>
        <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
          Yaklaşımımızın temelinde uyuşmazlığı doğmadan önce öngörmek ve sözleşme, ihtarname, arabuluculuk gibi
          erken müdahale araçlarıyla zaman ve maliyet kaybını en aza indirmek vardır. Dosya açıldıktan sonra ise güncel
          Yargıtay içtihadı ve mevzuat takibiyle desteklenen, delil-ekonomi ilkesine uygun bir savunma yürütürüz.
        </p>
      </section>

      <section className="bg-cream py-16">
        <div className="section-container max-w-[1100px]">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[2.5px] text-accent before:h-[1.5px] before:w-6 before:bg-accent before:content-['']">
            İlkelerimiz
          </span>
          <h2 className="mt-3 font-display text-[clamp(28px,3.6vw,40px)] font-bold leading-[1.15] text-primary-deep">
            Güven, gizlilik ve etik ilkesiyle.
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {principles.map((card) => (
              <div
                key={card.num}
                className={`group relative overflow-hidden rounded-2xl border border-border border-t-[3px] bg-card p-7 transition-all duration-400 hover:-translate-y-1 hover:shadow-elegant-lg ${card.border}`}
              >
                <span className="absolute right-5 top-4 font-display text-5xl font-bold leading-none text-primary/[0.06]">
                  {card.num}
                </span>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] border border-primary/[0.08] bg-gradient-to-br from-primary/[0.06] to-primary/[0.02] text-primary transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-primary-deep group-hover:text-accent-light">
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-display text-xl font-bold text-primary-deep">{card.title}</h3>
                <div className="gold-line mb-3" />
                <p className="text-[14.5px] leading-relaxed text-muted-foreground">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="relative mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-6 hidden h-[2px] bg-border md:block" />
            {steps.map((step) => (
              <div key={step.num} className="group relative text-center">
                <div className="relative z-10 mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-card font-display text-lg font-bold text-primary transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  {step.num}
                </div>
                <h4 className="mb-1 font-display text-base font-bold text-primary-deep">{step.title}</h4>
                <p className="mx-auto max-w-[18ch] text-[13px] text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container max-w-[1100px] py-16">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[2.5px] text-accent before:h-[1.5px] before:w-6 before:bg-accent before:content-['']">
          Ekibimiz
        </span>
        <h2 className="mt-3 font-display text-[clamp(28px,3.6vw,40px)] font-bold leading-[1.15] text-primary-deep">
          Uyuşmazlığı erken çözen bir ekip.
        </h2>
        <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
          Üç kişilik avukat kadromuz, alanında uzmanlaşmış bir yapı kurar; her dosya, alanın asıl yöneticisi ile en
          az bir kıdemli avukatın ortak gözetiminde ilerler.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {teamMembers.map((member) => (
            <Link
              key={member.slug}
              to={`/ekip/${member.slug}`}
              className="group block rounded-2xl border border-border bg-card p-6 transition-all duration-400 hover:-translate-y-1 hover:shadow-elegant-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-accent/25 bg-primary/5 font-display text-[20px] font-bold text-primary">
                  {member.initials}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-primary-deep">{member.name}</h3>
                  <p className="mt-0.5 text-[13px] font-semibold text-primary">{member.roleShort}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{member.shortDescription}</p>
              {member.baroSicilNo ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  {member.baro} sicil no: <span className="font-semibold text-primary-deep">{member.baroSicilNo}</span>
                </p>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">{member.baro}</p>
              )}
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 group-hover:text-accent">
                Profili incele <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/ekip"
            className="inline-flex items-center gap-2 rounded-[10px] border border-primary/20 bg-primary/[0.04] px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Users className="h-4 w-4" />
            Ekibin tamamı
          </Link>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="section-container max-w-[1100px]">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[2.5px] text-accent before:h-[1.5px] before:w-6 before:bg-accent before:content-['']">
            Çalışma Alanları
          </span>
          <h2 className="mt-3 font-display text-[clamp(28px,3.6vw,40px)] font-bold leading-[1.15] text-primary-deep">
            Sekiz ana hukuk alanında dosya yönetimi.
          </h2>
          <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            Her alan için süreç işleyişi, sık karşılaşılan durumlar, dava şartları ve müvekkilden istenen belgeleri
            ilgili sayfalarda derledik.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {practiceHighlights.map((area) => (
              <Link
                key={area.slug}
                to={`/hizmetler/${area.slug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-primary-deep transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-elegant"
              >
                <span>{area.title}</span>
                <ArrowRight className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Link
              to="/hizmetler"
              className="inline-flex items-center gap-2 rounded-[10px] border border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary-deep hover:shadow-elegant"
            >
              <Scale className="h-4 w-4" />
              Tüm çalışma alanları
            </Link>
          </div>
        </div>
      </section>

      <section className="section-container max-w-[1100px] py-16">
        <div className="grid gap-10 rounded-2xl border border-border bg-card p-8 md:grid-cols-[1.4fr_1fr] md:p-10">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[2.5px] text-accent before:h-[1.5px] before:w-6 before:bg-accent before:content-['']">
              İletişim
            </span>
            <h2 className="mt-3 font-display text-[clamp(26px,3vw,34px)] font-bold leading-[1.15] text-primary-deep">
              Görüşme talebiniz için bize ulaşın.
            </h2>
            <p className="mt-3 max-w-[55ch] text-[15px] leading-relaxed text-muted-foreground">
              Dosyanızla ilgili ücretsiz ön değerlendirme için randevu alabilirsiniz. Görüşme öncesinde elinizdeki
              belgeleri özetlemek süreci hızlandırır.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/#iletisim"
                className="inline-flex items-center gap-2 rounded-[10px] border border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary-deep hover:shadow-elegant"
              >
                Randevu talebi
              </Link>
              <a
                href="https://wa.me/905519814937"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[10px] border border-emerald-600 bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                WhatsApp ile yaz
              </a>
            </div>
          </div>

          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-cream text-primary">
                <MapPin className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-primary-deep">Adres</p>
                <p className="mt-0.5">Kadıköy, İstanbul</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-cream text-primary">
                <Phone className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-primary-deep">Telefon</p>
                <a href="tel:+905519814937" className="mt-0.5 inline-block transition-colors hover:text-primary">
                  +90 551 981 49 37
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-cream text-primary">
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-primary-deep">E-posta</p>
                <a
                  href="mailto:vegalaw.contact@gmail.com"
                  className="mt-0.5 inline-block transition-colors hover:text-primary"
                >
                  vegalaw.contact@gmail.com
                </a>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default HakkimizdaPage;
