import { parseMarkdownDocument } from "@/lib/markdown-frontmatter";
import type { Service, ServiceFAQ } from "@/types/service";

type ServiceFrontmatter = Partial<{
  slug: string;
  title: string;
  heading: string;
  description: string;
  icon: string;
  orderIndex: string;
  seoTitle: string;
  seoDescription: string;
  heroImage: string;
  publishedAt: string;
  updatedAt: string;
  faqJson: string;
}>;

const markdownModules = import.meta.glob("../content/services/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const toSlugFromPath = (path: string) => path.split("/").pop()?.replace(/\.md$/, "") ?? path;

const trim = (value?: string) => {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
};

const parseFaqJson = (raw?: string): ServiceFAQ[] => {
  const normalized = trim(raw);
  if (!normalized) return [];

  try {
    const parsed = JSON.parse(normalized);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is { question: string; answer: string } =>
          !!item &&
          typeof item === "object" &&
          typeof (item as Record<string, unknown>).question === "string" &&
          typeof (item as Record<string, unknown>).answer === "string",
      )
      .map((item) => ({
        question: String(item.question).trim(),
        answer: String(item.answer).trim(),
      }))
      .filter((item) => item.question.length > 0 && item.answer.length > 0);
  } catch (error) {
    console.error("Service FAQ JSON parse hatası", error);
    return [];
  }
};

const parseServiceDocument = (path: string, raw: string): Service | null => {
  const { data, content } = parseMarkdownDocument<ServiceFrontmatter>(raw);
  const frontmatter = data as ServiceFrontmatter;

  const slug = trim(frontmatter.slug) || toSlugFromPath(path);
  const title = trim(frontmatter.title);
  const heading = trim(frontmatter.heading);
  const description = trim(frontmatter.description);
  const publishedAt = trim(frontmatter.publishedAt);

  if (!title || !heading || !description || !publishedAt) {
    return null;
  }

  const orderIndexRaw = trim(frontmatter.orderIndex);
  const orderIndex = orderIndexRaw ? Number.parseInt(orderIndexRaw, 10) : 99;

  return {
    slug,
    title,
    heading,
    description,
    content: content.trim(),
    icon: trim(frontmatter.icon) || "Briefcase",
    orderIndex: Number.isFinite(orderIndex) ? orderIndex : 99,
    seoTitle: trim(frontmatter.seoTitle),
    seoDescription: trim(frontmatter.seoDescription),
    heroImage: trim(frontmatter.heroImage),
    publishedAt,
    updatedAt: trim(frontmatter.updatedAt),
    faq: parseFaqJson(frontmatter.faqJson),
  };
};

const loadServices = (): Service[] =>
  Object.entries(markdownModules)
    .map(([path, raw]) => parseServiceDocument(path, raw))
    .filter((service): service is Service => service !== null)
    .sort((a, b) => a.orderIndex - b.orderIndex);

let servicesCache: Service[] | null = null;

export const listServices = async (): Promise<Service[]> => {
  if (!servicesCache) {
    servicesCache = loadServices();
  }
  return servicesCache;
};

export const getServiceBySlug = async (slug: string): Promise<Service | null> => {
  const services = await listServices();
  return services.find((service) => service.slug === slug) ?? null;
};

export const resetServiceRepositoryCache = () => {
  servicesCache = null;
};
