import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import type { GoogleReviewsPayload } from "@/types/google-reviews";

const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, index) => (
    <Star
      key={`${rating}-${index}`}
      className={`h-4 w-4 ${index < Math.round(rating) ? "fill-accent text-accent" : "text-accent/25"}`}
    />
  ));

const ClientReviewsSection = () => {
  const [data, setData] = useState<GoogleReviewsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadReviews = async () => {
      try {
        const response = await fetch("/api/google-reviews");
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as GoogleReviewsPayload;
        if (active) {
          setData(payload);
        }
      } catch (error) {
        console.error("Google yorumlari yuklenemedi.", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadReviews();

    return () => {
      active = false;
    };
  }, []);

  if (!loading && (!data || data.reviews.length === 0)) {
    return null;
  }

  return (
    <section id="muvekkil-gorusleri" className="bg-background py-20">
      <div className="section-container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[2.5px] text-accent before:h-[1.5px] before:w-6 before:bg-accent before:content-['']"
            >
              Google Yorumları
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 font-display text-[clamp(30px,4vw,42px)] font-bold leading-[1.15] text-primary-deep"
            >
              Müvekkillerimizden Gelenler
            </motion.h3>
            <p className="mt-3 max-w-[70ch] text-base text-muted-foreground">
              Google Haritalar üzerindeki işletme profilinden otomatik çekilen son yorumlar.
            </p>
          </div>
          {data?.mapsUrl && (
            <a
              href={data.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent-pale px-4 py-2 text-[13px] font-semibold text-primary-deep transition-all hover:bg-accent/20"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Tüm Yorumları Gör
            </a>
          )}
        </div>

        {data ? (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4">
              <div className="flex items-center gap-1.5">{renderStars(data.rating ?? 0)}</div>
              <strong className="font-display text-2xl text-primary-deep">{(data.rating ?? 0).toFixed(1)}</strong>
              <span className="text-sm text-muted-foreground">
                {data.placeName} için {data.userRatingCount ?? 0} Google değerlendirmesi
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {data.reviews.slice(0, 6).map((review, index) => (
                <motion.article
                  key={`${review.authorName}-${review.publishTime ?? index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-elegant-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-display text-xl font-bold text-primary-deep">{review.authorName}</h4>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[1.3px] text-accent">
                        {review.relativeTimeDescription ?? "Google yorumu"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                  </div>

                  <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{review.text}</p>

                  {review.authorUrl && (
                    <a
                      href={review.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all hover:gap-2.5"
                    >
                      Google profilini aç <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </motion.article>
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground">Yorumlar yükleniyor...</p>
        )}
      </div>
    </section>
  );
};

export default ClientReviewsSection;
