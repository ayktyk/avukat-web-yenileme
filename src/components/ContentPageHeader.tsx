import { Scale } from "lucide-react";
import { Link } from "react-router-dom";

const ContentPageHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/92 backdrop-blur-xl">
      <div className="section-container flex items-center justify-between py-4">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg gradient-navy shadow-md transition-transform group-hover:scale-105">
            <Scale className="h-5 w-5 text-accent-light" />
          </div>
          <div>
            <span className="block font-display text-2xl font-bold leading-tight tracking-tight text-primary-deep">
              Vega Hukuk
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[2.5px] text-accent">
              Ana Sayfaya Dön
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="rounded-full border border-primary/10 bg-primary/[0.04] px-4 py-2 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/[0.08]"
        >
          Ana Sayfa
        </Link>
      </div>
    </header>
  );
};

export default ContentPageHeader;
