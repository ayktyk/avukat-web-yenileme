import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { RelatedContentSuggestion } from "@/lib/internal-linking";

type RelatedContentBoxProps = {
  items: RelatedContentSuggestion[];
};

const resolveTypeLabel = (href: string) => (href.startsWith("/blog/") ? "Blog Yazısı" : "Hukuk Gündemi");

const RelatedContentBox = ({ items }: RelatedContentBoxProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-14 rounded-3xl border border-border bg-card p-6">
      <div className="mb-5">
        <span className="text-xs font-bold uppercase tracking-[2px] text-accent">İlgili İçerikler</span>
        <h2 className="mt-2 font-display text-2xl font-bold text-primary-deep">Bu yazıyla bağlantılı diğer içerikler</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="group rounded-2xl border border-border bg-background px-5 py-4 transition-all hover:-translate-y-1 hover:border-accent/25 hover:shadow-elegant"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-accent">
              {item.category ?? resolveTypeLabel(item.href)}
            </p>
            <h3 className="mt-2 font-display text-lg font-bold leading-snug text-primary-deep transition-colors group-hover:text-primary">
              {item.title}
            </h3>
            {item.excerpt && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>}
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              İçeriğe git <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedContentBox;
