import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import MarkdownContent from "@/components/MarkdownContent";
import { useSeo } from "@/hooks/use-seo";
import { formatDateTr } from "@/lib/format-date";
import { getBlogPostBySlug, listBlogPosts } from "@/lib/blog-repository";
import { enrichMarkdownContent, type LinkableContent } from "@/lib/internal-linking";
import { listLegalUpdates } from "@/lib/legal-updates-repository";
import { SITE_URL } from "@/lib/site-config";
import type { BlogPost as BlogPostType } from "@/types/blog";

const BlogPost = () => {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [linkableEntries, setLinkableEntries] = useState<LinkableContent[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadPost = async () => {
      const [result, blogPosts, legalUpdates] = await Promise.all([
        getBlogPostBySlug(slug),
        listBlogPosts(),
        listLegalUpdates(),
      ]);

      if (mounted) {
        setPost(result);
        setLinkableEntries([
          ...blogPosts.map((entry) => ({ ...entry, href: `/blog/${entry.slug}` })),
          ...legalUpdates.map((entry) => ({ ...entry, href: `/guncel-hukuk-gundemi/${entry.slug}` })),
        ]);
        setLoading(false);
      }
    };

    void loadPost();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const renderedContent = post
    ? enrichMarkdownContent(
        {
          ...post,
          href: `/blog/${post.slug}`,
          content: post.content,
        },
        linkableEntries,
      )
    : "";

  useSeo({
    title: post?.seoTitle ?? `${post?.title ?? "Yazı"} | Vega Hukuk`,
    description:
      post?.seoDescription ?? post?.excerpt ?? "Vega Hukuk blog yazısı: hukuki süreçler ve uygulamaya dönük değerlendirmeler.",
    canonicalPath: `/blog/${slug}`,
    image: post?.coverImage,
    type: "article",
    structuredData: post
      ? [
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.seoDescription ?? post.excerpt,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt ?? post.publishedAt,
            author: {
              "@type": "Organization",
              name: post.author,
            },
            publisher: {
              "@type": "LegalService",
              name: "Vega Hukuk",
              url: SITE_URL,
            },
            image: post.coverImage
              ? `${SITE_URL}${post.coverImage}`
              : `${SITE_URL}/og-image.svg`,
            mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
              { "@type": "ListItem", position: 3, name: post.title },
            ],
          },
        ]
      : undefined,
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="section-container py-24">
          <p className="text-muted-foreground">Yazı yükleniyor...</p>
        </section>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <section className="section-container py-24">
          <h1 className="font-display text-4xl font-bold text-primary-deep">Yazı bulunamadı</h1>
          <p className="mt-3 text-muted-foreground">
            İstediğiniz blog yazısı kaldırılmış olabilir veya bağlantı yanlış olabilir.
          </p>
          <Link to="/blog" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
            <ArrowLeft className="h-4 w-4" /> Blog listesine dön
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <article className="section-container max-w-[900px] pt-24 pb-16">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Blog listesine dön
        </Link>

        <div className="mt-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[1.4px] text-accent">
            {post.category}
          </span>
          <h1 className="mt-3 font-display text-[clamp(34px,5vw,56px)] font-bold leading-[1.1] text-primary-deep">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>{formatDateTr(post.publishedAt)}</span>
            <span>&middot;</span>
            <span>{post.author}</span>
          </div>
        </div>

        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="mt-8 mb-9 aspect-[16/8] w-full rounded-2xl object-cover object-top"
            loading="eager"
            decoding="async"
            {...({ fetchpriority: "high" } as Record<string, string>)}
          />
        ) : (
          <div
            className={`mt-8 mb-9 aspect-[16/8] w-full rounded-2xl bg-gradient-to-br ${
              post.coverClass ?? "from-primary/[0.08] to-primary/[0.03]"
            }`}
          />
        )}

        <MarkdownContent content={renderedContent} />

        <div className="mt-12 rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Bu yazı genel bilgilendirme amacıyla hazırlanmıştır. Somut uyuşmazlıklar için dosya bazlı hukuki
            değerlendirme alınması gerekir.
          </p>
        </div>
      </article>
    </main>
  );
};

export default BlogPost;
