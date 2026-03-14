import { motion } from "framer-motion";
import { ArrowRight, Calendar, Check, PhoneCall, Scale } from "lucide-react";

import heroBg from "@/assets/hero-bg-1.jpg";

const quickNotes = [
  "İş hukuku, ceza, sözleşmeler, kira ve gayrimenkul dosyalarında sonuç odaklı yaklaşım",
  "Aynı iş günü içinde dönüş hedefi ve düzenli süreç bilgilendirmesi",
  "Kadıköy merkezli yüz yüze görüşme, telefon ve WhatsApp üzerinden hızlı iletişim",
];

const HeroSection = () => {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section id="ana-sayfa" className="relative flex min-h-screen items-center overflow-hidden pt-[120px] pb-20">
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      <svg
        className="pointer-events-none absolute inset-0 z-[1] opacity-20"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <line x1="100" y1="0" x2="100" y2="800" stroke="hsl(var(--primary))" strokeWidth=".3" opacity=".12" />
        <line x1="300" y1="0" x2="300" y2="800" stroke="hsl(var(--primary))" strokeWidth=".3" opacity=".08" />
        <line x1="700" y1="0" x2="700" y2="800" stroke="hsl(var(--accent))" strokeWidth=".3" opacity=".06" />
        <line x1="900" y1="0" x2="900" y2="800" stroke="hsl(var(--accent))" strokeWidth=".3" opacity=".1" />
        <circle cx="900" cy="600" r="80" stroke="hsl(var(--accent))" strokeWidth=".4" opacity=".08" />
      </svg>

      <div className="section-container relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent-pale px-4 py-2 text-[13px] font-semibold uppercase tracking-wider text-primary-deep"
          >
            <Scale className="h-4 w-4 text-accent" />
            Hukuk • Danışmanlık • Arabuluculuk
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 mb-5 font-display text-[clamp(38px,5vw,62px)] font-bold leading-[1.08] text-primary-deep"
          >
            Stratejik, hızlı ve
            <br />
            güvenilir <em className="text-accent italic">hukuki çözüm.</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-[54ch] text-[17px] leading-[1.7] text-muted-foreground"
          >
            Vega Hukuk & Danışmanlık Arabuluculuk; iş hukuku, ceza hukuku, sözleşmeler, kira, gayrimenkul, miras,
            tüketici ve sigorta hukuku alanlarında sonuç odaklı dava, danışmanlık ve arabuluculuk hizmeti sunar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-7 flex flex-wrap gap-6"
          >
            {["Şeffaf süreç", "Güncel içtihat", "Etkin iletişim"].map((text) => (
              <span key={text} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Check className="h-4 w-4 text-accent" />
                {text}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-9 flex flex-wrap gap-3.5"
          >
            <button
              onClick={() => scrollTo("#iletisim")}
              className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-4 text-[15px] font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-deep hover:shadow-elegant-lg"
            >
              <Calendar className="h-4 w-4" /> Bize Ulaşın
            </button>
            <button
              onClick={() => scrollTo("#calisma-alanlari")}
              className="inline-flex items-center gap-2.5 rounded-xl border-[1.5px] border-border bg-transparent px-8 py-4 text-[15px] font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/[0.03]"
            >
              Çalışma Alanları <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card/95 p-8 shadow-elegant-lg backdrop-blur"
        >
          <div className="absolute -top-px left-6 right-6 h-[3px] rounded-b gradient-gold-accent" />
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-pale px-3 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-primary-deep">
            Hızlı İletişim
          </span>
          <h3 className="mt-4 font-display text-2xl font-bold text-primary-deep">Tek form yeterli.</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Tüm iletişim taleplerini sayfanın altındaki <strong className="text-primary-deep">Bize Ulaşın</strong> alanında topladık.
            Böylece kullanıcı tek bir net başvuru noktası görüyor.
          </p>

          <div className="mt-6 space-y-3">
            {quickNotes.map((note) => (
              <div key={note} className="flex items-start gap-3 rounded-xl border border-border bg-background/70 p-4">
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/[0.08] text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => scrollTo("#iletisim")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary-deep hover:shadow-elegant"
            >
              <PhoneCall className="h-4 w-4" /> Forma Git
            </button>
            <a
              href="tel:+905519814937"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary/[0.03]"
            >
              Hemen Ara
            </a>
          </div>
        </motion.aside>
      </div>
    </section>
  );
};

export default HeroSection;
