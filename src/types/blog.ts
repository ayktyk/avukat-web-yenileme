import type { InternalLinkRule } from "@/types/internal-links";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  coverClass?: string;
  coverImage?: string;
  internalLinkPriority?: string[];
  internalLinkMatches?: InternalLinkRule[];
}
