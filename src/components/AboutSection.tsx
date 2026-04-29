import { ArrowRight, Compass, Cpu, Target } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  {
    num: "01",
    icon: Target,
    title: "Misyon",
    desc: "Vaka-özel strateji, disiplinli süreç yönetimi ve güçlü müzakere ile müvekkillerimizin zamanını ve maliyetini optimize eden çözümler üretiyoruz.",
    border: "border-t-primary",
  },
  {
    num: "02",
    icon: Compass,
    title: "Yaklaşım",
    desc: "Uyuşmazlığı erken safhada analiz ediyor, delil-ekonomi ilkesi ve güncel içtihat dengesiyle en rasyonel yolu öneriyoruz.",
    border: "border-t-accent",
  },
  {
    num: "03",
    icon: Cpu,
    title: "Teknoloji",
    desc: "Hukuki araştırma ve belge otomasyonunda yapay zeka destekli araçlar kullanıyor; süreç şeffaflığı için düzenli raporlama yapıyoruz.",
    border: "border-t-primary-light",
  },
];

const steps = [
  { num: "1", title: "Görüşme", desc: "Ücretsiz ön değerlendirme" },
  { num: "2", title: "Analiz", desc: "Dosya ve risk analizi" },
  { num: "3", title: "Strateji", desc: "Yol haritası belirleme" },
  { num: "4", title: "Çözüm", desc: "Sonuç odaklı takip" },
];

const AboutSection = () => {
  return (
    <section id="hakkimizda" className="bg-cream py-20">
      <div className="section-container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[2.5px] text-accent before:h-[1.5px] before:w-6 before:bg-accent before:content-['']">
              Hakkımızda
            </span>
            <h3 className="mt-3 font-display text-[clamp(30px,4vw,42px)] font-bold leading-[1.15] text-primary-deep">
              Güven, gizlilik
              <br />
              ve etik ilkesiyle.
            </h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent-pale px-4 py-2 text-[13px] font-semibold text-primary-deep">
            Güven • Gizlilik • Etik
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map((card) => (
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
              <h4 className="mb-2 font-display text-xl font-bold text-primary-deep">{card.title}</h4>
              <div className="gold-line mb-3" />
              <p className="text-[14.5px] leading-relaxed text-muted-foreground">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-6 hidden h-[2px] bg-border md:block" />
          {steps.map((step) => (
            <div key={step.num} className="group relative text-center">
              <div className="relative z-10 mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-card font-display text-lg font-bold text-primary transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                {step.num}
              </div>
              <h5 className="mb-1 font-display text-base font-bold text-primary-deep">{step.title}</h5>
              <p className="mx-auto max-w-[18ch] text-[13px] text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/hakkimizda"
            className="group inline-flex items-center gap-2 rounded-[10px] border border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-deep hover:shadow-elegant"
          >
            Hakkımızda sayfası
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
