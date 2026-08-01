import { ArrowLeft, CalendarDays } from "lucide-react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import MarkdownContent from "@/components/MarkdownContent";
import Seo from "@/components/Seo";
import { formatDateTr } from "@/lib/format-date";
import { getBlogPostBySlug, listBlogPosts } from "@/lib/blog-repository";
import { enrichMarkdownContent, type LinkableContent } from "@/lib/internal-linking";
import { listLegalUpdates } from "@/lib/legal-updates-repository";
import { getTeamMemberBySlug } from "@/lib/team-data";
import { SITE_URL } from "@/lib/site-config";
import type { BlogPost as BlogPostType } from "@/types/blog";

type BlogPostLoaderData = {
  post: Omit<BlogPostType, "content"> | null;
  renderedContent: string;
};

const toLinkableEntry = (entry: { slug: string; title: string; excerpt?: string; category?: string }, href: string): LinkableContent => ({
  slug: entry.slug,
  title: entry.title,
  href,
  excerpt: entry.excerpt,
  category: entry.category,
});

export const loader = async ({ params }: LoaderFunctionArgs): Promise<BlogPostLoaderData> => {
  const slug = params.slug ?? "";
  const [post, blogPosts, legalUpdates] = await Promise.all([
    getBlogPostBySlug(slug),
    listBlogPosts(),
    listLegalUpdates(),
  ]);

  if (!post) {
    return { post: null, renderedContent: "" };
  }

  const linkableEntries: LinkableContent[] = [
    ...blogPosts.map((entry) => toLinkableEntry(entry, `/blog/${entry.slug}`)),
    ...legalUpdates.map((entry) => toLinkableEntry(entry, `/guncel-hukuk-gundemi/${entry.slug}`)),
  ];

  const renderedContent = enrichMarkdownContent(
    {
      ...post,
      href: `/blog/${post.slug}`,
      content: post.content,
    },
    linkableEntries,
  );

  const { content: _content, ...postMeta } = post;

  return { post: postMeta, renderedContent };
};

const DEFAULT_AUTHOR_SLUG = "aykut-yesilkaya";

const BlogPost = () => {
  const { slug = "" } = useParams();
  const { post, renderedContent } = useLoaderData() as BlogPostLoaderData;

  const authorMember = getTeamMemberBySlug(post?.reviewedBy ?? DEFAULT_AUTHOR_SLUG);

  const seoStructuredData = post
    ? [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.seoDescription ?? post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt ?? post.publishedAt,
          inLanguage: "tr",
          author: authorMember
            ? {
                "@type": "Person",
                name: authorMember.name,
                jobTitle: authorMember.jobTitle,
                url: `${SITE_URL}/ekip/${authorMember.slug}`,
              }
            : {
                "@type": "Organization",
                name: post.author,
              },
          publisher: {
            "@type": "LegalService",
            name: "Vega Hukuk",
            url: SITE_URL,
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/logo.png`,
            },
          },
          image: post.coverImage
            ? `${SITE_URL}${post.coverImage}`
            : `${SITE_URL}/og-image.png`,
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
        ...(post.faq && post.faq.length > 0
          ? [
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: post.faq.map((item) => ({
                  "@type": "Question",
                  name: item.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: item.answer,
                  },
                })),
              },
            ]
          : []),
      ]
    : undefined;

  const seoElement = (
    <Seo
      title={post?.seoTitle ?? `${post?.title ?? "Yazı"} | Vega Hukuk`}
      description={
        post?.seoDescription ??
        post?.excerpt ??
        "Vega Hukuk blog yazısı: hukuki süreçler ve uygulamaya dönük değerlendirmeler."
      }
      canonicalPath={`/blog/${slug}`}
      image={post?.coverImage}
      type="article"
      structuredData={seoStructuredData}
      noindex={!post}
    />
  );

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        {seoElement}
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
      {seoElement}
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
            <span>{authorMember ? authorMember.name : post.author}</span>
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
