import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import { listLatestBlogPosts } from "@/lib/blog-repository";
import { formatDateTr } from "@/lib/format-date";
import type { BlogPost } from "@/types/blog";

const ArticlesSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadPosts = async () => {
      const result = await listLatestBlogPosts(3);
      if (mounted) {
        setPosts(result);
        setLoading(false);
      }
    };

    void loadPosts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="yayinlar" className="py-20 bg-background">
      <div className="section-container">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-10">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[2.5px] uppercase text-accent before:content-[''] before:w-6 before:h-[1.5px] before:bg-accent"
            >
              Blog
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-[clamp(30px,4vw,42px)] font-bold leading-[1.15] text-primary-deep mt-3"
            >
              Yayinlar ve Icgoruler
            </motion.h3>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-pale text-primary-deep font-semibold text-[13px] border border-accent/15 hover:bg-accent/20 transition-all"
            >
              <Newspaper className="w-3.5 h-3.5" /> Tumunu Gor
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Yazilar yukleniyor...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {posts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-7 group hover:-translate-y-1 hover:shadow-elegant-lg hover:border-accent/25 transition-all duration-400"
              >
                <div
                  className={`w-full aspect-video rounded-[10px] mb-4 flex items-center justify-center bg-gradient-to-br ${
                    post.coverClass ?? "from-primary/[0.08] to-primary/[0.03]"
                  } relative overflow-hidden`}
                />
                <span className="inline-block text-[11px] font-bold tracking-[1.5px] uppercase text-accent mb-3">
                  {post.category}
                </span>
                <h4 className="font-display text-xl font-bold text-primary-deep mb-2">{post.title}</h4>
                <p className="text-[14.5px] leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {formatDateTr(post.publishedAt)}
                </div>
                <div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-4 group-hover:gap-3 transition-all duration-300"
                  >
                    Devamini oku <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticlesSection;

