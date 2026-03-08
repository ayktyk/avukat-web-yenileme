import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Scale } from "lucide-react";

const navLinks = [
  { label: "Hakkımızda", href: "#hakkimizda" },
  { label: "Çalışma Alanları", href: "#calisma-alanlari" },
  { label: "Ekibimiz", href: "#ekibimiz" },
  { label: "Yayınlar", href: "#yayinlar" },
  { label: "SSS", href: "#sss" },
];

const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-background/60 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <div className="section-container flex items-center justify-between py-4">
          <a
            href="#ana-sayfa"
            onClick={(e) => { e.preventDefault(); scrollTo("#ana-sayfa"); }}
            className="flex items-center gap-3 group"
          >
            <div className="w-11 h-11 rounded-lg gradient-navy flex items-center justify-center transition-transform group-hover:scale-105">
              <Scale className="w-5 h-5 text-accent-light" />
            </div>
            <div>
              <span className="font-display text-2xl lg:text-3xl font-bold text-primary-deep block leading-tight tracking-tight">
                Vega Hukuk
              </span>
              <span className="text-[11px] font-semibold tracking-[3px] uppercase text-accent">
                Danışmanlık & Arabuluculuk
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className="relative px-3.5 py-2 rounded-lg text-[14.5px] font-medium text-foreground hover:text-primary hover:bg-primary/[0.04] transition-all group"
              >
                {link.label}
                <span className="absolute bottom-1 left-1/2 right-1/2 h-[1.5px] bg-accent group-hover:left-3.5 group-hover:right-3.5 transition-all duration-300" />
              </a>
            ))}
            <a
              href="#iletisim"
              onClick={(e) => { e.preventDefault(); scrollTo("#iletisim"); }}
              className="ml-2 px-5 py-2.5 rounded-[10px] bg-primary text-primary-foreground font-semibold text-sm border border-primary hover:bg-primary-deep hover:-translate-y-0.5 hover:shadow-elegant transition-all duration-300"
            >
              İletişim
            </a>
          </nav>

          <button
            className="lg:hidden p-2 rounded-lg border border-border hover:bg-cream transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Menüyü Aç"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] bg-background/98 backdrop-blur-xl flex flex-col items-center justify-center gap-2"
          >
            <button
              className="absolute top-5 right-6 p-2"
              onClick={() => setMobileOpen(false)}
              aria-label="Kapat"
            >
              <X className="w-7 h-7" />
            </button>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className="font-display text-[28px] font-semibold text-foreground px-6 py-3 rounded-xl hover:text-primary hover:bg-primary/[0.05] transition-all"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#iletisim"
              onClick={(e) => { e.preventDefault(); scrollTo("#iletisim"); }}
              className="font-display text-[28px] font-semibold text-foreground px-6 py-3 rounded-xl hover:text-primary hover:bg-primary/[0.05] transition-all"
            >
              İletişim
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SiteHeader;
