import { ArrowLeft, CalendarDays } from "lucide-react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import MarkdownContent from "@/components/MarkdownContent";
import Seo from "@/components/Seo";
import { formatDateTr } from "@/lib/format-date";
import { listBlogPosts } from "@/lib/blog-repository";
import { enrichMarkdownContent, type LinkableContent } from "@/lib/internal-linking";
import { getLegalUpdateBySlug, listLegalUpdates } from "@/lib/legal-updates-repository";
import { getTeamMemberBySlug } from "@/lib/team-data";
import { SITE_URL } from "@/lib/site-config";
import type { LegalUpdate } from "@/types/legal-update";

type LegalUpdateLoaderData = {
  item: Omit<LegalUpdate, "content"> | null;
  renderedContent: string;
};

const toLinkableEntry = (entry: { slug: string; title: string; excerpt?: string; category?: string }, href: string): LinkableContent => ({
  slug: entry.slug,
  title: entry.title,
  href,
  excerpt: entry.excerpt,
  category: entry.category,
});

export const loader = async ({ params }: LoaderFunctionArgs): Promise<LegalUpdateLoaderData> => {
  const slug = params.slug ?? "";
  const [item, blogPosts, legalUpdates] = await Promise.all([
    getLegalUpdateBySlug(slug),
    listBlogPosts(),
    listLegalUpdates(),
  ]);

  if (!item) {
    return { item: null, renderedContent: "" };
  }

  const linkableEntries: LinkableContent[] = [
    ...blogPosts.map((entry) => toLinkableEntry(entry, `/blog/${entry.slug}`)),
    ...legalUpdates.map((entry) => toLinkableEntry(entry, `/guncel-hukuk-gundemi/${entry.slug}`)),
  ];

  const renderedContent = enrichMarkdownContent(
    {
      ...item,
      href: `/guncel-hukuk-gundemi/${item.slug}`,
      content: item.content,
    },
    linkableEntries,
  );

  const { content: _content, ...itemMeta } = item;

  return { item: itemMeta, renderedContent };
};

const DEFAULT_AUTHOR_SLUG = "aykut-yesilkaya";

const LegalUpdatePost = () => {
  const { slug = "" } = useParams();
  const { item, renderedContent } = useLoaderData() as LegalUpdateLoaderData;

  const authorMember = getTeamMemberBySlug(DEFAULT_AUTHOR_SLUG);

  const seoStructuredData = item
    ? [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: item.title,
          description: item.seoDescription ?? item.excerpt,
          datePublished: item.publishedAt,
          dateModified: item.updatedAt ?? item.publishedAt,
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
                name: "Vega Hukuk",
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
          image: item.coverImage
            ? `${SITE_URL}${item.coverImage}`
            : `${SITE_URL}/og-image.png`,
          mainEntityOfPage: `${SITE_URL}/guncel-hukuk-gundemi/${item.slug}`,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Güncel Hukuk Gündemi", item: `${SITE_URL}/guncel-hukuk-gundemi` },
            { "@type": "ListItem", position: 3, name: item.title },
          ],
        },
      ]
    : undefined;

  const seoElement = (
    <Seo
      title={item?.seoTitle ?? `${item?.title ?? "Gündem"} | Vega Hukuk`}
      description={item?.seoDescription ?? item?.excerpt ?? "Güncel hukuk gelişmeleri ve karar notları."}
      canonicalPath={`/guncel-hukuk-gundemi/${slug}`}
      image={item?.coverImage}
      type="article"
      structuredData={seoStructuredData}
      noindex={!item}
    />
  );

  if (!item) {
    return (
      <main className="min-h-screen bg-background">
        {seoElement}
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
      {seoElement}
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
            {...({ fetchpriority: "high" } as Record<string, string>)}
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
