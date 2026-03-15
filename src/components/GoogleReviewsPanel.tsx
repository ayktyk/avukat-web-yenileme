import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, MessageSquareQuote, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { GoogleReview, GoogleReviewsPayload } from "@/types/google-reviews";

type GoogleReviewsPanelProps = {
  variant?: "section" | "page" | "marquee";
  sectionId?: string;
  limit?: number;
  title?: string;
  description?: string;
  className?: string;
};

const renderStars = (rating: number, className = "h-4 w-4") =>
  Array.from({ length: 5 }, (_, index) => (
    <Star
      key={`${rating}-${index}`}
      className={cn(className, index < Math.round(rating) ? "fill-accent text-accent" : "text-accent/25")}
    />
  ));

const ReviewCard = ({ review, compact = false }: { review: GoogleReview; compact?: boolean }) => (
  <article
    className={cn(
      "rounded-[28px] border border-white/70 bg-white/88 shadow-[0_20px_60px_rgba(15,43,86,0.08)] backdrop-blur",
      compact ? "min-w-[320px] max-w-[320px] p-6 md:min-w-[360px] md:max-w-[360px]" : "p-7",
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="font-display text-xl font-bold text-primary-deep">{review.authorName}</h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[1.6px] text-accent">
          {review.relativeTimeDescription ?? "Google yorumu"}
        </p>
      </div>
      <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
    </div>

    <p className="mt-4 text-[15px] leading-7 text-muted-foreground">{review.text}</p>

    {!compact && review.authorUrl && (
      <a
        href={review.authorUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all hover:gap-2.5"
      >
        Google profilini aç <ExternalLink className="h-3.5 w-3.5" />
      </a>
    )}
  </article>
);

const GoogleReviewsPanel = ({
  variant = "section",
  sectionId,
  limit,
  title = "Müvekkillerimizden Gelenler",
  description = "Google Haritalar işletme profilimizdeki yorumlar bu sayfaya otomatik olarak yansır.",
  className,
}: GoogleReviewsPanelProps) => {
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
        console.error("Google yorumları yüklenemedi.", error);
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

  const reviews = limit ? data?.reviews.slice(0, limit) ?? [] : data?.reviews ?? [];
  const isPage = variant === "page";
  const isMarquee = variant === "marquee";
  const loopedReviews = reviews.length > 1 ? [...reviews, ...reviews] : reviews;

  if (isMarquee) {
    return (
      <section id={sectionId} className={cn("bg-background py-20", className)}>
        <div className="section-container">
          <div className="overflow-hidden rounded-[34px] border border-border/70 bg-[linear-gradient(135deg,#f8f4ec_0%,#ffffff_45%,#eef3fb_100%)] px-5 py-6 shadow-[0_24px_80px_rgba(15,43,86,0.07)] md:px-8 md:py-8">
            <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[44rem]">
                <p className="text-sm font-semibold uppercase tracking-[2px] text-primary/65">
                  Google Haritalar işletme profilimizden seçili yorumlar
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-primary-deep">
                  <div className="flex items-center gap-1.5">{renderStars(data?.rating ?? 0, "h-4 w-4")}</div>
                  <strong className="font-display text-[28px] leading-none">{(data?.rating ?? 0).toFixed(1)}</strong>
                  <span className="text-sm text-muted-foreground">
                    {data?.placeName} için {data?.userRatingCount ?? 0} Google değerlendirmesi
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/muvekkil-yorumlari"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/80 px-4 py-2 text-[13px] font-semibold text-primary transition-all hover:bg-white"
                >
                  <MessageSquareQuote className="h-3.5 w-3.5" /> Tüm yorumları incele
                </Link>
                {data?.mapsUrl && (
                  <a
                    href={data.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-pale px-4 py-2 text-[13px] font-semibold text-primary-deep transition-all hover:bg-accent/20"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Google Haritalar'da aç
                  </a>
                )}
              </div>
            </div>

            {loading ? (
              <p className="text-muted-foreground">Yorumlar yükleniyor...</p>
            ) : (
              <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f8f4ec] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#eef3fb] to-transparent" />

                {reviews.length > 1 ? (
                  <motion.div
                    initial={false}
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                      duration: Math.max(20, reviews.length * 5),
                      ease: "linear",
                      repeat: Infinity,
                    }}
                    className="flex w-max gap-5 pr-5"
                  >
                    {loopedReviews.map((review, index) => (
                      <ReviewCard
                        key={`${review.authorName}-${review.publishTime ?? "yorum"}-${index}`}
                        review={review}
                        compact
                      />
                    ))}
                  </motion.div>
                ) : (
                  <div className="max-w-[360px]">
                    {reviews[0] ? <ReviewCard review={reviews[0]} compact /> : null}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={sectionId} className={cn("py-20", className)}>
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
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 font-display text-[clamp(30px,4vw,42px)] font-bold leading-[1.15] text-primary-deep"
            >
              {title}
            </motion.h2>
            <p className="mt-3 max-w-[72ch] text-base leading-relaxed text-muted-foreground">{description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {!isPage && (
              <Link
                to="/muvekkil-yorumlari"
                className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/[0.04] px-4 py-2 text-[13px] font-semibold text-primary transition-all hover:bg-primary/[0.08]"
              >
                <MessageSquareQuote className="h-3.5 w-3.5" /> Tümünü sitede gör
              </Link>
            )}
            {data?.mapsUrl && (
              <a
                href={data.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent-pale px-4 py-2 text-[13px] font-semibold text-primary-deep transition-all hover:bg-accent/20"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Google Haritalar'da aç
              </a>
            )}
          </div>
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

            <div className={cn("grid grid-cols-1 gap-5", isPage ? "lg:grid-cols-2" : "md:grid-cols-3")}>
              {reviews.map((review, index) => (
                <motion.div
                  key={`${review.authorName}-${review.publishTime ?? index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <ReviewCard review={review} />
                </motion.div>
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

export default GoogleReviewsPanel;
