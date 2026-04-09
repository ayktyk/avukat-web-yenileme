export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  title: string;
  heading: string;
  description: string;
  content: string;
  icon: string;
  orderIndex: number;
  seoTitle?: string;
  seoDescription?: string;
  heroImage?: string;
  publishedAt: string;
  updatedAt?: string;
  faq: ServiceFAQ[];
}
