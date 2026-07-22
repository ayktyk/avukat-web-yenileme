import { Fragment } from "react";
import { Head } from "vite-react-ssg";
import { SITE_URL } from "@/lib/site-config";

type SeoStructuredData = Record<string, unknown> | Array<Record<string, unknown>>;

type SeoProps = {
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
  type?: "website" | "article";
  structuredData?: SeoStructuredData;
  noindex?: boolean;
};

const buildAbsoluteUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

const buildMarkdownPath = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/" || normalized === "") return "/index.md";
  const trimmed = normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
  return `${trimmed}.md`;
};

const Seo = ({ title, description, canonicalPath, image, type = "website", structuredData, noindex = false }: SeoProps) => {
  const canonical = buildAbsoluteUrl(canonicalPath);
  const markdownUrl = buildAbsoluteUrl(buildMarkdownPath(canonicalPath));
  const imageUrl = buildAbsoluteUrl(image ?? "/og-image.png");
  const structuredPayload = Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : [];

  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
        <link rel="alternate" type="text/markdown" href={markdownUrl} />
        {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={type} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>
      {structuredPayload.map((data, index) => (
        <script
          key={`seo-ld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </Fragment>
  );
};

export default Seo;
export type { SeoProps, SeoStructuredData };
