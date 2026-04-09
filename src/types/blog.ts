import type { InternalLinkRule } from "@/lib/internal-linking";

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
