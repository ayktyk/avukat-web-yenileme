import { motion } from "framer-motion";
import { Scale, Check, Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const [formData, setFormData] = useState({ ad: "", tel: "", konu: "", mesaj: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ ad: "", tel: "", konu: "", mesaj: "" });
    }, 2500);
  };

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section id="ana-sayfa" className="relative min-h-screen flex items-center pt-[120px] pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/50" />
      </div>

      {/* Decorative lines */}
      <svg className="absolute inset-0 z-[1] opacity-20 pointer-events-none" viewBox="0 0 1200 800" fill="none" preserveAspectRatio="xMidYMid slice">
        <line x1="100" y1="0" x2="100" y2="800" stroke="hsl(var(--primary))" strokeWidth=".3" opacity=".12" />
        <line x1="300" y1="0" x2="300" y2="800" stroke="hsl(var(--primary))" strokeWidth=".3" opacity=".08" />
        <line x1="700" y1="0" x2="700" y2="800" stroke="hsl(var(--accent))" strokeWidth=".3" opacity=".06" />
        <line x1="900" y1="0" x2="900" y2="800" stroke="hsl(var(--accent))" strokeWidth=".3" opacity=".1" />
        <circle cx="900" cy="600" r="80" stroke="hsl(var(--accent))" strokeWidth=".4" opacity=".08" />
      </svg>

      <div className="section-container relative z-10 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
        {/* Left */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex gap-2.5 items-center px-4 py-2 rounded-full bg-accent-pale text-primary-deep font-semibold text-[13px] tracking-wider uppercase border border-accent/20"
          >
            <Scale className="w-4 h-4 text-accent" />
            Hukuk • Danışmanlık • Arabuluculuk
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-[clamp(38px,5vw,62px)] font-bold leading-[1.08] mt-6 mb-5 text-primary-deep"
          >
            Stratejik, hızlı ve
            <br />
            güvenilir <em className="italic text-accent">hukuki çözüm.</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[17px] leading-[1.7] text-muted-foreground max-w-[54ch]"
          >
            Vega Hukuk & Danışmanlık Arabuluculuk; iş hukuku, ceza hukuku, sözleşmeler, kira, gayrimenkul, miras, tüketici ve sigorta hukuku alanlarında sonuç odaklı dava, danışmanlık ve arabuluculuk hizmeti sunar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-6 mt-7 flex-wrap"
          >
            {["Şeffaf süreç", "Güncel içtihat", "Etkin iletişim"].map((text) => (
              <span key={text} className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <Check className="w-4 h-4 text-accent" />
                {text}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-3.5 mt-9 flex-wrap"
          >
            <button
              onClick={() => scrollTo("#iletisim")}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-[15px] hover:bg-primary-deep hover:-translate-y-0.5 hover:shadow-elegant-lg transition-all duration-300"
            >
              <Calendar className="w-4 h-4" /> Randevu Al
            </button>
            <button
              onClick={() => scrollTo("#calisma-alanlari")}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-transparent text-primary font-semibold text-[15px] border-[1.5px] border-border hover:border-primary hover:bg-primary/[0.03] hover:-translate-y-0.5 transition-all duration-300"
            >
              Çalışma Alanları <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Right - Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-8 shadow-elegant-lg relative"
        >
          <div className="absolute -top-px left-6 right-6 h-[3px] rounded-b gradient-gold-accent" />
          <h3 className="font-display text-2xl font-bold text-primary-deep">Ücretsiz Ön Değerlendirme</h3>
          <p className="text-muted-foreground text-sm mt-1">Kısa not bırakın; sizi arayalım.</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-foreground tracking-wide">Ad Soyad</label>
                <input
                  className="w-full px-4 py-3 border-[1.5px] border-border rounded-[10px] text-sm bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  placeholder="Adınız Soyadınız"
                  value={formData.ad}
                  onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-foreground tracking-wide">Telefon</label>
                <input
                  className="w-full px-4 py-3 border-[1.5px] border-border rounded-[10px] text-sm bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  placeholder="05xx xxx xx xx"
                  value={formData.tel}
                  onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-foreground tracking-wide">Konu</label>
              <input
                className="w-full px-4 py-3 border-[1.5px] border-border rounded-[10px] text-sm bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                placeholder="Örn. İşe iade, kira, alacak"
                value={formData.konu}
                onChange={(e) => setFormData({ ...formData, konu: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-foreground tracking-wide">Mesajınız</label>
              <textarea
                className="w-full px-4 py-3 border-[1.5px] border-border rounded-[10px] text-sm bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-y min-h-[80px]"
                placeholder="Kısaca notunuzu iletin"
                rows={3}
                value={formData.mesaj}
                onChange={(e) => setFormData({ ...formData, mesaj: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3.5 pt-2">
              <button
                type="submit"
                className={`px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  submitted
                    ? "bg-green-600 text-primary-foreground"
                    : "bg-primary text-primary-foreground hover:bg-primary-deep hover:-translate-y-0.5 hover:shadow-elegant"
                }`}
              >
                {submitted ? "✓ Gönderildi!" : "Gönder"}
              </button>
              <small className="text-muted-foreground text-xs">Yanıt: aynı iş günü</small>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
