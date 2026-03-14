export type SearchDocumentType =
  | "section"
  | "practice-area"
  | "faq"
  | "team"
  | "blog"
  | "legal-update"
  | "page";

export interface SearchDocument {
  id: string;
  title: string;
  description: string;
  href: string;
  type: SearchDocumentType;
  badge?: string;
  keywords?: string[];
  searchText?: string;
  publishedAt?: string;
  featured?: boolean;
}
