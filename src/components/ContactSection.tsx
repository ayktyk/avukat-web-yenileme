import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({ adsoyad: "", email: "", mesaj: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ adsoyad: "", email: "", mesaj: "" });
    }, 2500);
  };

  return (
    <section id="iletisim" className="py-20 bg-background">
      <div className="section-container">
        <div className="mb-10">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[2.5px] uppercase text-accent before:content-[''] before:w-6 before:h-[1.5px] before:bg-accent">
            İletişim
          </motion.span>
          <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-display text-[clamp(30px,4vw,42px)] font-bold leading-[1.15] text-primary-deep mt-3">
            Bize Ulaşın
          </motion.h3>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-base leading-relaxed text-muted-foreground mt-4">
            Randevu ve ön değerlendirme için iletişime geçin.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-navy text-primary-foreground rounded-2xl p-9"
          >
            <h4 className="font-display text-[22px] font-bold text-accent-light">İletişim Bilgileri</h4>
            <div className="gold-line mt-2 mb-6" style={{ background: "linear-gradient(90deg, hsl(var(--accent-light)), transparent)" }} />

            <div className="space-y-5">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                <div>
                  <strong className="block text-primary-foreground text-[13px] tracking-wider uppercase mb-1">Adres</strong>
                  <p className="text-primary-foreground/75 text-[15px] leading-relaxed">Osmanağa Mahallesi, Karadut Sokak<br />No:14/10, Kadıköy/İstanbul</p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <Phone className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                <div>
                  <strong className="block text-primary-foreground text-[13px] tracking-wider uppercase mb-1">Telefon</strong>
                  <a href="tel:+905519814937" className="text-primary-foreground/75 text-[15px] hover:text-accent-light transition-colors">0551 981 49 37</a>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <Mail className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                <div>
                  <strong className="block text-primary-foreground text-[13px] tracking-wider uppercase mb-1">E-posta</strong>
                  <a href="mailto:vegalaw.contact@gmail.com" className="text-primary-foreground/75 text-[15px] hover:text-accent-light transition-colors">vegalaw.contact@gmail.com</a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-7">
              <a href="https://wa.me/905519814937" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold text-primary-foreground border border-primary-foreground/15 hover:bg-primary-foreground/10 hover:border-accent transition-all">
                📱 WhatsApp
              </a>
              <a href="mailto:vegalaw.contact@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold text-primary-foreground border border-primary-foreground/15 hover:bg-primary-foreground/10 hover:border-accent transition-all">
                ✉️ E-posta
              </a>
              <a href="tel:+905519814937"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold text-primary-foreground border border-primary-foreground/15 hover:bg-primary-foreground/10 hover:border-accent transition-all">
                📞 Ara
              </a>
            </div>

            <div className="mt-5 rounded-[14px] overflow-hidden border border-primary-foreground/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.6!2d29.028!3d40.9903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab868f38e3a21%3A0x0!2sOsmanağa%2C+Karadut+Sk.+No%3A14%2C+Kadıköy%2Fİstanbul!5e0!3m2!1str!2str!4v1700000000000"
                width="100%"
                height="200"
                style={{ border: 0, display: "block", borderRadius: "14px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vega Hukuk Konum"
              />
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-9"
          >
            <h4 className="font-display text-[22px] font-bold text-primary-deep">Mesaj Gönder</h4>
            <div className="gold-line mt-2 mb-6" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-foreground tracking-wide">Ad Soyad</label>
                <input
                  className="w-full px-4 py-3 border-[1.5px] border-border rounded-[10px] text-sm bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  placeholder="Adınız Soyadınız"
                  value={formData.adsoyad}
                  onChange={(e) => setFormData({ ...formData, adsoyad: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-foreground tracking-wide">E-posta</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-[1.5px] border-border rounded-[10px] text-sm bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-foreground tracking-wide">Mesajınız</label>
                <textarea
                  className="w-full px-4 py-3 border-[1.5px] border-border rounded-[10px] text-sm bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-y min-h-[100px]"
                  placeholder="Konu ve mesajınızı yazın..."
                  rows={4}
                  value={formData.mesaj}
                  onChange={(e) => setFormData({ ...formData, mesaj: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3.5 pt-1">
                <button
                  type="submit"
                  className={`inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    submitted
                      ? "bg-green-600 text-primary-foreground"
                      : "bg-primary text-primary-foreground hover:bg-primary-deep hover:-translate-y-0.5 hover:shadow-elegant"
                  }`}
                >
                  {submitted ? "✓ Gönderildi!" : <><Send className="w-4 h-4" /> Gönder</>}
                </button>
                <small className="text-muted-foreground text-xs">KVKK aydınlatma metni kabul edilir.</small>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
