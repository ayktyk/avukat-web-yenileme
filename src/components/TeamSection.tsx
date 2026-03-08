import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TeamSection = () => {
  return (
    <section id="ekibimiz" className="py-20 bg-cream">
      <div className="section-container">
        <div className="mb-10">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[2.5px] uppercase text-accent before:content-[''] before:w-6 before:h-[1.5px] before:bg-accent">
            Ekip
          </motion.span>
          <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-display text-[clamp(30px,4vw,42px)] font-bold leading-[1.15] text-primary-deep mt-3">
            Ekibimiz
          </motion.h3>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-base leading-relaxed text-muted-foreground max-w-[56ch] mt-4">
            Özel hukuk, ceza hukuku ve sözleşmeler alanında 3 avukat ile sonuç odaklı çözümler.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Main team card */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 gradient-navy text-primary-foreground rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="w-20 h-20 rounded-full bg-primary-foreground/10 border-2 border-accent/25 flex items-center justify-center font-display text-[28px] font-bold text-accent-light mb-5 relative">
              AY
              <span className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] rounded-full bg-accent flex items-center justify-center">
                <Star className="w-[10px] h-[10px] text-primary-foreground" />
              </span>
            </div>
            <h4 className="font-display text-[22px] font-bold text-accent-light">Av. Aykut Yeşilkaya</h4>
            <p className="text-primary-foreground/75 mt-1">Kurucu Avukat • Arabulucu • Özel Hukuk</p>

            <div className="relative pl-7 mt-5">
              <div className="absolute left-[10px] top-1.5 bottom-1.5 w-[1.5px] bg-accent/30" />
              {[
                { title: "İş Hukuku:", desc: "İşe iade, tazminat, fazla mesai, mobbing" },
                { title: "Kira & Gayrimenkul:", desc: "Tahliye, uyarlama, tapu iptal" },
                { title: "Miras & Aile:", desc: "Tereke, tenkis, nafaka, velayet" },
                { title: "Tüketici & Sigorta:", desc: "Ayıplı mal, poliçe, tazminat" },
              ].map((step) => (
                <div key={step.title} className="relative my-4 text-[14.5px] leading-relaxed text-primary-foreground/75">
                  <span className="absolute -left-[20px] top-2 w-2 h-2 rounded-full bg-accent shadow-[0_0_0_3px_rgba(185,151,91,0.2)]" />
                  <strong className="text-primary-foreground">{step.title}</strong> {step.desc}
                </div>
              ))}
            </div>
          </motion.article>

          {/* Other team members */}
          <div className="space-y-5">
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-7 hover:-translate-y-1 hover:shadow-elegant-lg transition-all duration-400"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/[0.08] to-primary/[0.03] border-2 border-primary/10 flex items-center justify-center font-display text-[28px] font-bold text-primary mb-4">
                MK
              </div>
              <h4 className="font-display text-xl font-bold text-primary-deep">Av. Mücahit İslam Keskün</h4>
              <div className="gold-line my-3" />
              <p className="text-primary font-semibold mb-2">Kurucu Avukat · Ceza Hukuku</p>
              <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                Ceza davalarında savunma, soruşturma ve kovuşturma süreçlerinde etkin temsil ve stratejik savunma hizmeti sunar.
              </p>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-7 hover:-translate-y-1 hover:shadow-elegant-lg transition-all duration-400"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/15 to-accent/5 border-2 border-accent/20 flex items-center justify-center font-display text-[28px] font-bold text-accent mb-4">
                BY
              </div>
              <h4 className="font-display text-xl font-bold text-primary-deep">Av. Büşra Yeşilkaya</h4>
              <div className="gold-line my-3" />
              <p className="text-primary font-semibold mb-2">Sözleşmeler Hukuku</p>
              <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                Sözleşme tasarımı, müzakeresi ve uyuşmazlık çözümünde titiz ve detay odaklı hukuki destek sağlar.
              </p>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
