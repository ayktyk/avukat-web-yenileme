import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Scale, Home, Newspaper } from "lucide-react";

const articles = [
  {
    icon: Briefcase,
    tag: "İş Hukuku",
    title: "İşe İade Arabuluculuğunda İşçilik Alacakları",
    desc: "Kısa rehber: konu edilebilir mi, nasıl?",
    thumbClass: "from-primary/[0.08] to-primary/[0.03]",
  },
  {
    icon: Scale,
    tag: "İcra Hukuku",
    title: "Menfi Tespit Davalarında İspat Yükü",
    desc: "Güncel Yargıtay yaklaşımı ve pratik notlar.",
    thumbClass: "from-accent/[0.15] to-accent/[0.05]",
  },
  {
    icon: Home,
    tag: "Kira Hukuku",
    title: "Kira Uyarlama Davalarında Yol Haritası",
    desc: "Delil seti, bilirkişi ve risk analizi.",
    thumbClass: "from-muted/80 to-muted/40",
  },
];

const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }
};

const ArticlesSection = () => {
  return (
    <section id="yayinlar" className="py-20 bg-background">
      <div className="section-container">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-10">
          <div>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[2.5px] uppercase text-accent before:content-[''] before:w-6 before:h-[1.5px] before:bg-accent">
              Blog
            </motion.span>
            <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="font-display text-[clamp(30px,4vw,42px)] font-bold leading-[1.15] text-primary-deep mt-3">
              Yayınlar & İçgörüler
            </motion.h3>
          </div>
          <motion.button initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-pale text-primary-deep font-semibold text-[13px] border border-accent/15 hover:bg-accent/20 transition-all">
            <Newspaper className="w-3.5 h-3.5" /> Tümünü Gör
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {articles.map((article, i) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-7 group hover:-translate-y-1 hover:shadow-elegant-lg hover:border-accent/25 transition-all duration-400"
            >
              <div className={`w-full aspect-video rounded-[10px] mb-4 flex items-center justify-center bg-gradient-to-br ${article.thumbClass} relative overflow-hidden`}>
                <article.icon className="w-7 h-7 text-primary/60" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/10" />
              </div>
              <span className="inline-block text-[11px] font-bold tracking-[1.5px] uppercase text-accent mb-3">{article.tag}</span>
              <h4 className="font-display text-xl font-bold text-primary-deep mb-2">{article.title}</h4>
              <p className="text-[14.5px] leading-relaxed text-muted-foreground">{article.desc}</p>
              <button
                onClick={() => scrollTo("#iletisim")}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-3.5 group-hover:gap-3 transition-all duration-300"
              >
                Devamını oku <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
