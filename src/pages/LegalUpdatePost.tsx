import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import MarkdownContent from "@/components/MarkdownContent";
import { useSeo } from "@/hooks/use-seo";
import { formatDateTr } from "@/lib/format-date";
import { listBlogPosts } from "@/lib/blog-repository";
import { enrichMarkdownContent, type LinkableContent } from "@/lib/internal-linking";
import { getLegalUpdateBySlug, listLegalUpdates } from "@/lib/legal-updates-repository";
import type { LegalUpdate } from "@/types/legal-update";

const LegalUpdatePost = () => {
  const { slug = "" } = useParams();
  const [item, setItem] = useState<LegalUpdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [linkableEntries, setLinkableEntries] = useState<LinkableContent[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadItem = async () => {
      const [result, blogPosts, legalUpdates] = await Promise.all([
        getLegalUpdateBySlug(slug),
        listBlogPosts(),
        listLegalUpdates(),
      ]);

      if (mounted) {
        setItem(result);
        setLinkableEntries([
          ...blogPosts.map((entry) => ({ ...entry, href: `/blog/${entry.slug}` })),
          ...legalUpdates.map((entry) => ({ ...entry, href: `/guncel-hukuk-gundemi/${entry.slug}` })),
        ]);
        setLoading(false);
      }
    };

    void loadItem();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const renderedContent = item
    ? enrichMarkdownContent(
        {
          ...item,
          href: `/guncel-hukuk-gundemi/${item.slug}`,
          content: item.content,
        },
        linkableEntries,
      )
    : "";

  useSeo({
    title: item?.seoTitle ?? `${item?.title ?? "Gündem"} | Vega Hukuk`,
    description: item?.seoDescription ?? item?.excerpt ?? "Güncel hukuk gelişmeleri ve karar notları.",
    canonicalPath: `/guncel-hukuk-gundemi/${slug}`,
    image: item?.coverImage,
    type: "article",
    structuredData: item
      ? [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: item.title,
            description: item.seoDescription ?? item.excerpt,
            datePublished: item.publishedAt,
            dateModified: item.updatedAt ?? item.publishedAt,
            publisher: {
              "@type": "LegalService",
              name: "Vega Hukuk",
              url: window.location.origin,
            },
            image: item.coverImage
              ? `${window.location.origin}${item.coverImage}`
              : `${window.location.origin}/og-image.svg`,
            mainEntityOfPage: `${window.location.origin}/guncel-hukuk-gundemi/${item.slug}`,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: window.location.origin },
              { "@type": "ListItem", position: 2, name: "Güncel Hukuk Gündemi", item: `${window.location.origin}/guncel-hukuk-gundemi` },
              { "@type": "ListItem", position: 3, name: item.title },
            ],
          },
        ]
      : undefined,
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="section-container py-24">
          <p className="text-muted-foreground">İçerik yükleniyor...</p>
        </section>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-background">
        <section className="section-container py-24">
          <h1 className="font-display text-4xl font-bold text-primary-deep">İçerik bulunamadı</h1>
          <p className="mt-3 text-muted-foreground">İlgili hukuk gündemi içeriği kaldırılmış olabilir veya bağlantı yanlış olabilir.</p>
          <Link to="/guncel-hukuk-gundemi" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
            <ArrowLeft className="h-4 w-4" /> Gündem listesine dön
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <article className="section-container max-w-[900px] pt-24 pb-16">
        <Link
          to="/guncel-hukuk-gundemi"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Gündem listesine dön
        </Link>

        <div className="mt-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[1.4px] text-accent">
            {item.category}
          </span>
          <h1 className="mt-3 font-display text-[clamp(34px,5vw,56px)] font-bold leading-[1.1] text-primary-deep">
            {item.title}
          </h1>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>{formatDateTr(item.publishedAt)}</span>
          </div>
        </div>

        {item.coverImage ? (
          <img
            src={item.coverImage}
            alt={item.title}
            className="mt-8 mb-9 aspect-[16/8] w-full rounded-2xl object-cover object-top"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        ) : (
          <div
            className={`mt-8 mb-9 aspect-[16/8] w-full rounded-2xl bg-gradient-to-br ${
              item.coverClass ?? "from-primary/[0.08] to-primary/[0.03]"
            }`}
          />
        )}

        <MarkdownContent content={renderedContent} />
      </article>
    </main>
  );
};

export default LegalUpdatePost;
