import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getBlogPostBySlug, listBlogPosts, resetBlogRepositoryCache } from "@/lib/blog-repository";

describe("blog repository", () => {
  beforeEach(() => {
    resetBlogRepositoryCache();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    resetBlogRepositoryCache();
    vi.unstubAllEnvs();
  });

  it("returns local posts sorted by publication date", async () => {
    vi.stubEnv("VITE_BLOG_API_URL", "");

    const posts = await listBlogPosts();

    expect(posts).toHaveLength(3);
    expect(posts[0]?.slug).toBe("ise-iade-arabuluculukta-kritik-noktalar");
    expect(posts[1]?.slug).toBe("menfi-tespit-davasinda-ispat-yuku");
    expect(posts[2]?.slug).toBe("kira-uyarlama-davasi-yol-haritasi");
  });

  it("maps nested CMS payloads with env-based field paths", async () => {
    vi.stubEnv("VITE_BLOG_API_URL", "https://cms.example.test/posts");
    vi.stubEnv("VITE_BLOG_ITEMS_PATH", "data.items");
    vi.stubEnv("VITE_BLOG_FIELD_SLUG", "fields.slug");
    vi.stubEnv("VITE_BLOG_FIELD_TITLE", "fields.title");
    vi.stubEnv("VITE_BLOG_FIELD_EXCERPT", "fields.summary");
    vi.stubEnv("VITE_BLOG_FIELD_CONTENT", "fields.body");
    vi.stubEnv("VITE_BLOG_FIELD_CATEGORY", "fields.category");
    vi.stubEnv("VITE_BLOG_FIELD_AUTHOR", "fields.author.name");
    vi.stubEnv("VITE_BLOG_FIELD_PUBLISHED_AT", "fields.publishDate");
    vi.stubEnv("VITE_BLOG_FIELD_UPDATED_AT", "fields.updatedDate");
    vi.stubEnv("VITE_BLOG_FIELD_SEO_TITLE", "fields.seo.title");
    vi.stubEnv("VITE_BLOG_FIELD_SEO_DESCRIPTION", "fields.seo.description");
    vi.stubEnv("VITE_BLOG_FIELD_COVER_IMAGE", "fields.cover.url");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            items: [
              {
                fields: {
                  slug: "cms-uyumlu-yazi",
                  title: "CMS Uyumlu Yazi",
                  summary: "Ozet metni",
                  body: "Birinci paragraf\n\nIkinci paragraf",
                  category: "Blog",
                  author: { name: "Editor" },
                  publishDate: "2026-03-08",
                  updatedDate: "2026-03-09",
                  seo: {
                    title: "CMS SEO Baslik",
                    description: "CMS SEO Aciklama",
                  },
                  cover: { url: "/images/cms-cover.jpg" },
                },
              },
            ],
          },
        }),
      }),
    );

    const posts = await listBlogPosts();

    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      slug: "cms-uyumlu-yazi",
      title: "CMS Uyumlu Yazi",
      excerpt: "Ozet metni",
      category: "Blog",
      author: "Editor",
      publishedAt: "2026-03-08",
      updatedAt: "2026-03-09",
      seoTitle: "CMS SEO Baslik",
      seoDescription: "CMS SEO Aciklama",
      coverImage: "/images/cms-cover.jpg",
    });
    expect(posts[0]?.content).toEqual(["Birinci paragraf", "Ikinci paragraf"]);
  });

  it("falls back to local posts when remote API fails", async () => {
    vi.stubEnv("VITE_BLOG_API_URL", "https://cms.example.test/posts");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      }),
    );

    const posts = await listBlogPosts();

    expect(posts[0]?.slug).toBe("ise-iade-arabuluculukta-kritik-noktalar");
  });

  it("finds a post by slug", async () => {
    const post = await getBlogPostBySlug("menfi-tespit-davasinda-ispat-yuku");

    expect(post?.title).toBe("Menfi Tespit Davasında İspat Yükü");
  });
});

