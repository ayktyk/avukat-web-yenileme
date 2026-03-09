import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TeamSection = () => {
  return (
    <section id="ekibimiz" className="bg-cream py-20">
      <div className="section-container">
        <div className="mb-10">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[2.5px] text-accent before:h-[1.5px] before:w-6 before:bg-accent before:content-['']"
          >
            Ekip
          </motion.span>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 font-display text-[clamp(30px,4vw,42px)] font-bold leading-[1.15] text-primary-deep"
          >
            Ekibimiz
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-[56ch] text-base leading-relaxed text-muted-foreground"
          >
            Vega Hukuk Ýstanbul ekibi; Av. Aykut Yeþilkaya, Av. Mücahit Ýslam Keskün ve Av. Büþra Yeþilkaya ile sonuç
            odaklý hukuki danýþmanlýk sunar.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl gradient-navy p-8 text-primary-foreground md:col-span-2"
          >
            <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent/25 bg-primary-foreground/10 font-display text-[28px] font-bold text-accent-light">
              AY
              <span className="absolute -right-0.5 -bottom-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-accent">
                <Star className="h-[10px] w-[10px] text-primary-foreground" />
              </span>
            </div>
            <h4 className="font-display text-[22px] font-bold text-accent-light">Av. Aykut Yeþilkaya</h4>
            <p className="mt-1 text-primary-foreground/75">Kurucu Avukat • Arabulucu • Özel Hukuk</p>

            <div className="relative mt-5 pl-7">
              <div className="absolute left-[10px] top-1.5 bottom-1.5 w-[1.5px] bg-accent/30" />
              {[
                { title: "Ýþ Hukuku:", desc: "Ýþe iade, tazminat, fazla mesai ve mobbing süreçleri" },
                { title: "Kira ve Gayrimenkul:", desc: "Tahliye, uyarlama, tapu iptal ve kira uyuþmazlýklarý" },
                { title: "Miras ve Aile:", desc: "Tereke, tenkis, nafaka ve velayet dosyalarý" },
                { title: "Tüketici ve Sigorta:", desc: "Ayýplý mal, poliçe ve tazminat talepleri" },
              ].map((step) => (
                <div key={step.title} className="relative my-4 text-[14.5px] leading-relaxed text-primary-foreground/75">
                  <span className="absolute -left-[20px] top-2 h-2 w-2 rounded-full bg-accent shadow-[0_0_0_3px_rgba(185,151,91,0.2)]" />
                  <strong className="text-primary-foreground">{step.title}</strong> {step.desc}
                </div>
              ))}
            </div>
          </motion.article>

          <div className="space-y-5">
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border bg-card p-7 transition-all duration-400 hover:-translate-y-1 hover:shadow-elegant-lg"
            >
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/10 bg-gradient-to-br from-primary/[0.08] to-primary/[0.03] font-display text-[28px] font-bold text-primary">
                MK
              </div>
              <h4 className="font-display text-xl font-bold text-primary-deep">Av. Mücahit Ýslam Keskün</h4>
              <div className="gold-line my-3" />
              <p className="mb-2 font-semibold text-primary">Kurucu Avukat · Ceza Hukuku</p>
              <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                Ceza davalarýnda savunma, soruþturma ve kovuþturma süreçlerinde etkin temsil ve stratejik savunma hizmeti sunar.
              </p>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border bg-card p-7 transition-all duration-400 hover:-translate-y-1 hover:shadow-elegant-lg"
            >
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent/20 bg-gradient-to-br from-accent/15 to-accent/5 font-display text-[28px] font-bold text-accent">
                BY
              </div>
              <h4 className="font-display text-xl font-bold text-primary-deep">Av. Büþra Yeþilkaya</h4>
              <div className="gold-line my-3" />
              <p className="mb-2 font-semibold text-primary">Sözleþmeler Hukuku</p>
              <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                Sözleþme tasarýmý, müzakeresi ve uyuþmazlýk çözümünde titiz ve detay odaklý hukuki destek saðlar.
              </p>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
