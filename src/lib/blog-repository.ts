import { blogPosts } from "@/data/blog-posts";
import type { BlogPost } from "@/types/blog";

type RemoteBlogPayload = BlogPost[] | Record<string, unknown>;

type BlogFieldMap = {
  itemsPath?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
  coverClass: string;
  coverImage: string;
};

const sortByDateDesc = (posts: BlogPost[]) =>
  [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

const DEFAULT_FIELD_MAP: BlogFieldMap = {
  itemsPath: "",
  slug: "slug",
  title: "title",
  excerpt: "excerpt",
  content: "content",
  category: "category",
  author: "author",
  publishedAt: "publishedAt",
  updatedAt: "updatedAt",
  seoTitle: "seoTitle",
  seoDescription: "seoDescription",
  coverClass: "coverClass",
  coverImage: "coverImage",
};

let postsPromise: Promise<BlogPost[]> | null = null;

const readEnv = (key: keyof ImportMetaEnv) => {
  const value = import.meta.env[key];
  return typeof value === "string" ? value.trim() : "";
};

const getRemoteConfig = () => ({
  url: readEnv("VITE_BLOG_API_URL"),
  token: readEnv("VITE_BLOG_API_TOKEN"),
});

const getFieldMap = (): BlogFieldMap => ({
  itemsPath: readEnv("VITE_BLOG_ITEMS_PATH"),
  slug: readEnv("VITE_BLOG_FIELD_SLUG") || DEFAULT_FIELD_MAP.slug,
  title: readEnv("VITE_BLOG_FIELD_TITLE") || DEFAULT_FIELD_MAP.title,
  excerpt: readEnv("VITE_BLOG_FIELD_EXCERPT") || DEFAULT_FIELD_MAP.excerpt,
  content: readEnv("VITE_BLOG_FIELD_CONTENT") || DEFAULT_FIELD_MAP.content,
  category: readEnv("VITE_BLOG_FIELD_CATEGORY") || DEFAULT_FIELD_MAP.category,
  author: readEnv("VITE_BLOG_FIELD_AUTHOR") || DEFAULT_FIELD_MAP.author,
  publishedAt: readEnv("VITE_BLOG_FIELD_PUBLISHED_AT") || DEFAULT_FIELD_MAP.publishedAt,
  updatedAt: readEnv("VITE_BLOG_FIELD_UPDATED_AT") || DEFAULT_FIELD_MAP.updatedAt,
  seoTitle: readEnv("VITE_BLOG_FIELD_SEO_TITLE") || DEFAULT_FIELD_MAP.seoTitle,
  seoDescription: readEnv("VITE_BLOG_FIELD_SEO_DESCRIPTION") || DEFAULT_FIELD_MAP.seoDescription,
  coverClass: readEnv("VITE_BLOG_FIELD_COVER_CLASS") || DEFAULT_FIELD_MAP.coverClass,
  coverImage: readEnv("VITE_BLOG_FIELD_COVER_IMAGE") || DEFAULT_FIELD_MAP.coverImage,
});

const hasRequiredFields = (value: unknown): value is Pick<BlogPost, "slug" | "title" | "excerpt" | "publishedAt"> =>
  Boolean(
    value &&
      typeof value === "object" &&
      "slug" in value &&
      "title" in value &&
      "excerpt" in value &&
      "publishedAt" in value,
  );

const getValueByPath = (source: unknown, path: string): unknown => {
  if (!path) {
    return source;
  }

  return path.split(".").reduce<unknown>((current, segment) => {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (Array.isArray(current) && /^\d+$/.test(segment)) {
      return current[Number(segment)];
    }

    if (typeof current === "object") {
      return (current as Record<string, unknown>)[segment];
    }

    return undefined;
  }, source);
};

const toOptionalString = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return undefined;
};

const normalizeContent = (content: unknown): string[] => {
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item.trim();
        }

        if (item && typeof item === "object") {
          return toOptionalString((item as Record<string, unknown>).text) ?? "";
        }

        return "";
      })
      .filter(Boolean);
  }

  if (typeof content === "string") {
    return content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }

  return [];
};

const mapRecordToBlogPost = (value: Record<string, unknown>, fieldMap: BlogFieldMap): BlogPost | null => {
  const slug = toOptionalString(getValueByPath(value, fieldMap.slug));
  const title = toOptionalString(getValueByPath(value, fieldMap.title));
  const excerpt = toOptionalString(getValueByPath(value, fieldMap.excerpt));
  const publishedAt = toOptionalString(getValueByPath(value, fieldMap.publishedAt));

  if (!slug || !title || !excerpt || !publishedAt) {
    return null;
  }

  const content = normalizeContent(getValueByPath(value, fieldMap.content));

  return {
    slug,
    title,
    excerpt,
    content: content.length > 0 ? content : [excerpt],
    category: toOptionalString(getValueByPath(value, fieldMap.category)) ?? "Genel",
    author: toOptionalString(getValueByPath(value, fieldMap.author)) ?? "Vega Hukuk",
    publishedAt,
    updatedAt: toOptionalString(getValueByPath(value, fieldMap.updatedAt)),
    seoTitle: toOptionalString(getValueByPath(value, fieldMap.seoTitle)),
    seoDescription: toOptionalString(getValueByPath(value, fieldMap.seoDescription)),
    coverClass: toOptionalString(getValueByPath(value, fieldMap.coverClass)),
    coverImage: toOptionalString(getValueByPath(value, fieldMap.coverImage)),
  };
};

const normalizeBlogPost = (value: unknown, fieldMap: BlogFieldMap): BlogPost | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (hasRequiredFields(value)) {
    const post = value as Record<string, unknown>;
    const normalizedContent = normalizeContent(post.content);

    return {
      slug: String(post.slug),
      title: String(post.title),
      excerpt: String(post.excerpt),
      content: normalizedContent.length > 0 ? normalizedContent : [String(post.excerpt)],
      category: typeof post.category === "string" ? post.category : "Genel",
      author: typeof post.author === "string" ? post.author : "Vega Hukuk",
      publishedAt: String(post.publishedAt),
      updatedAt: typeof post.updatedAt === "string" ? post.updatedAt : undefined,
      seoTitle: typeof post.seoTitle === "string" ? post.seoTitle : undefined,
      seoDescription: typeof post.seoDescription === "string" ? post.seoDescription : undefined,
      coverClass: typeof post.coverClass === "string" ? post.coverClass : undefined,
      coverImage: typeof post.coverImage === "string" ? post.coverImage : undefined,
    };
  }

  return mapRecordToBlogPost(value as Record<string, unknown>, fieldMap);
};

const extractItems = (payload: RemoteBlogPayload, fieldMap: BlogFieldMap): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  const configuredItems = getValueByPath(payload, fieldMap.itemsPath ?? "");
  if (Array.isArray(configuredItems)) {
    return configuredItems;
  }

  const fallbackItems = payload.posts ?? payload.data;
  return Array.isArray(fallbackItems) ? fallbackItems : [];
};

const parseRemotePayload = (payload: RemoteBlogPayload, fieldMap: BlogFieldMap): BlogPost[] =>
  extractItems(payload, fieldMap)
    .map((item) => normalizeBlogPost(item, fieldMap))
    .filter((post): post is BlogPost => post !== null);

const loadLocalPosts = async (): Promise<BlogPost[]> => sortByDateDesc(blogPosts);

const loadRemotePosts = async (): Promise<BlogPost[]> => {
  const { url, token } = getRemoteConfig();
  const fieldMap = getFieldMap();

  if (!url) {
    return loadLocalPosts();
  }

  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error(`Blog API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as RemoteBlogPayload;
  const posts = parseRemotePayload(payload, fieldMap);

  if (posts.length === 0) {
    throw new Error("Blog API returned no valid posts");
  }

  return sortByDateDesc(posts);
};

export const listBlogPosts = async (): Promise<BlogPost[]> => {
  if (!postsPromise) {
    postsPromise = loadRemotePosts().catch((error) => {
      console.error("Blog API okunamadi, yerel yedek veriye geciliyor.", error);
      return loadLocalPosts();
    });
  }

  return postsPromise;
};

export const listLatestBlogPosts = async (limit = 3): Promise<BlogPost[]> => {
  const posts = await listBlogPosts();
  return posts.slice(0, limit);
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const posts = await listBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
};

export const resetBlogRepositoryCache = () => {
  postsPromise = null;
};
