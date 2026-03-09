import { motion } from "framer-motion";
import { ArrowRight, Calendar, Check, Scale } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import heroBg from "@/assets/hero-bg-1.jpg";
import { submitCallbackRequest } from "@/lib/contact-service";
import { ContactServiceError } from "@/types/contact";

const initialFormState = { ad: "", tel: "", konu: "", mesaj: "", kvkkOnay: false, website: "" };

const HeroSection = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitCallbackRequest({
        adsoyad: formData.ad,
        telefon: formData.tel,
        konu: formData.konu,
        mesaj: formData.mesaj,
        kvkkOnay: formData.kvkkOnay,
        website: formData.website,
      });

      setFormData(initialFormState);
      toast({
        title: "Talep alindi",
        description: "On degerlendirme talebiniz iletildi. En kisa surede aranacaksiniz.",
      });
    } catch (error) {
      const message =
        error instanceof ContactServiceError
          ? error.message
          : "Talep gonderilemedi. Lutfen daha sonra tekrar deneyin.";

      toast({
        title: "Talep gonderilemedi",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

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
            Hukuk • Danismanlik • Arabuluculuk
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 mb-5 font-display text-[clamp(38px,5vw,62px)] font-bold leading-[1.08] text-primary-deep"
          >
            Stratejik, hizli ve
            <br />
            guvenilir <em className="text-accent italic">hukuki cozum.</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-[54ch] text-[17px] leading-[1.7] text-muted-foreground"
          >
            Vega Hukuk & Danismanlik Arabuluculuk; is hukuku, ceza hukuku, sozlesmeler, kira, gayrimenkul, miras,
            tuketici ve sigorta hukuku alanlarinda sonuc odakli dava, danismanlik ve arabuluculuk hizmeti sunar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-7 flex flex-wrap gap-6"
          >
            {["Seffaf surec", "Guncel ictihat", "Etkin iletisim"].map((text) => (
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
              <Calendar className="h-4 w-4" /> Randevu Al
            </button>
            <button
              onClick={() => scrollTo("#calisma-alanlari")}
              className="inline-flex items-center gap-2.5 rounded-xl border-[1.5px] border-border bg-transparent px-8 py-4 text-[15px] font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/[0.03]"
            >
              Calisma Alanlari <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative rounded-2xl border border-border bg-card p-8 shadow-elegant-lg"
        >
          <div className="absolute -top-px left-6 right-6 h-[3px] rounded-b gradient-gold-accent" />
          <h3 className="font-display text-2xl font-bold text-primary-deep">Ucretsiz On Degerlendirme</h3>
          <p className="mt-1 text-sm text-muted-foreground">Kisa not birakin; sizi arayalim.</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              autoComplete="off"
              tabIndex={-1}
              className="hidden"
              aria-hidden="true"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold tracking-wide text-foreground">Ad Soyad</label>
                <input
                  className="w-full rounded-[10px] border-[1.5px] border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Adiniz Soyadiniz"
                  value={formData.ad}
                  onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold tracking-wide text-foreground">Telefon</label>
                <input
                  className="w-full rounded-[10px] border-[1.5px] border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="05xx xxx xx xx"
                  value={formData.tel}
                  onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold tracking-wide text-foreground">Konu</label>
              <input
                className="w-full rounded-[10px] border-[1.5px] border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Orn. Ise iade, kira, alacak"
                value={formData.konu}
                onChange={(e) => setFormData({ ...formData, konu: e.target.value })}
                disabled={submitting}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold tracking-wide text-foreground">Mesajiniz</label>
              <textarea
                className="min-h-[80px] w-full resize-y rounded-[10px] border-[1.5px] border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Kisaca notunuzu iletin"
                rows={3}
                value={formData.mesaj}
                onChange={(e) => setFormData({ ...formData, mesaj: e.target.value })}
                disabled={submitting}
              />
            </div>
            <label className="flex items-start gap-3 rounded-xl border border-border bg-background/70 p-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={formData.kvkkOnay}
                onChange={(e) => setFormData({ ...formData, kvkkOnay: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-border"
                disabled={submitting}
              />
              <span>
                On degerlendirme talebim kapsaminda ilettigim verilerin benimle iletisime gecilmesi amaciyla islenmesini
                kabul ediyorum. Ayrintilar icin{" "}
                <Link to="/kvkk-aydinlatma" className="font-semibold text-primary underline-offset-4 hover:underline">
                  KVKK aydinlatma metni
                </Link>
                .
              </span>
            </label>
            <div className="flex items-center gap-3.5 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className={`rounded-xl px-7 py-3 text-sm font-semibold transition-all duration-300 ${
                  submitting
                    ? "cursor-not-allowed bg-primary/70 text-primary-foreground"
                    : "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:bg-primary-deep hover:shadow-elegant"
                }`}
              >
                {submitting ? "Gonderiliyor..." : "Gonder"}
              </button>
              <small className="text-xs text-muted-foreground">Yanýt: ayni is gunu</small>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
