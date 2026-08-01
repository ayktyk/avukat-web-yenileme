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

// Google meta description'i ~160 karakterde kesiyor. CMS'ten seoDescription gelmediginde
// excerpt kullaniliyor ve bu bazen cok satirli bir bloga donusuyor; burada tek satira
// indirip kelime sinirinda kirpiyoruz ki arama sonucunda ortada kesilmis metin cikmasin.
const MAX_DESCRIPTION_LENGTH = 160;

const clampDescription = (value: string) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= MAX_DESCRIPTION_LENGTH) return normalized;

  const cut = normalized.slice(0, MAX_DESCRIPTION_LENGTH);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:\-–—]$/, "")}…`;
};

const buildMarkdownPath = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/" || normalized === "") return "/index.md";
  const trimmed = normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
  return `${trimmed}.md`;
};

const Seo = ({ title, description, canonicalPath, image, type = "website", structuredData, noindex = false }: SeoProps) => {
  const metaDescription = clampDescription(description);
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
        {/*
          Google, AI Overviews / AI Mode'da gorunmek icin sayfanin snippet gostermeye uygun
          olmasini sart kosuyor. Varsayilan kisitlari acikca kaldiriyoruz:
          max-snippet:-1 (metin snippet sinirsiz), max-image-preview:large (Discover ve
          zengin gorsel onizleme uygunlugu), max-video-preview:-1.
        */}
        <meta
          name="robots"
          content={noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"}
        />
        <meta
          name="googlebot"
          content={noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"}
        />
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content={type} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metaDescription} />
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
