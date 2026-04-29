import { Calculator, CreditCard, Menu, Scale, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type NavItem =
  | { label: string; kind: "route"; to: string }
  | { label: string; kind: "anchor"; href: string };

const navLinks: NavItem[] = [
  { label: "Hakkımızda", kind: "route", to: "/hakkimizda" },
  { label: "Çalışma Alanları", kind: "route", to: "/hizmetler" },
  { label: "Ekibimiz", kind: "route", to: "/ekip" },
  { label: "Yayınlar", kind: "route", to: "/blog" },
  { label: "Hukuk Gündemi", kind: "route", to: "/guncel-hukuk-gundemi" },
  { label: "SSS", kind: "anchor", href: "#sss" },
];

const HOME_PATH = "/";
const CALCULATORS_PATH = "/hesaplamalar";
const PAYMENT_PATH = "/e-tahsilat";

const scrollToSection = (href: string) => {
  const el = document.querySelector(href);
  if (!el) {
    return false;
  }

  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: "smooth" });
  return true;
};

const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === HOME_PATH;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHomePage || !location.hash) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      scrollToSection(location.hash);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [isHomePage, location.hash]);

  const navigateToSection = (href: string) => {
    setMobileOpen(false);

    if (isHomePage) {
      scrollToSection(href);
      return;
    }

    void navigate({ pathname: HOME_PATH, hash: href });
  };

  const desktopClass =
    "group relative rounded-lg px-3.5 py-2 text-[14.5px] font-medium text-foreground transition-all hover:bg-primary/[0.04] hover:text-primary";
  const mobileClass =
    "rounded-xl px-6 py-3 font-display text-[28px] font-semibold text-foreground transition-all hover:bg-primary/[0.05] hover:text-primary";

  const renderNavItem = (item: NavItem, mobile = false) => {
    const className = mobile ? mobileClass : desktopClass;
    const underline = !mobile ? (
      <span className="absolute bottom-1 left-1/2 right-1/2 h-[1.5px] bg-accent transition-all duration-300 group-hover:left-3.5 group-hover:right-3.5" />
    ) : null;

    if (item.kind === "route") {
      return (
        <Link
          key={item.to}
          to={item.to}
          onClick={() => setMobileOpen(false)}
          className={className}
        >
          {item.label}
          {underline}
        </Link>
      );
    }

    return (
      <button
        key={item.href}
        type="button"
        onClick={() => navigateToSection(item.href)}
        className={className}
      >
        {item.label}
        {underline}
      </button>
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-background/90 shadow-sm backdrop-blur-xl"
            : "border-b border-transparent bg-background/60 backdrop-blur-md"
        }`}
      >
        <div className="section-container flex items-center justify-between py-4">
          <Link
            to="/"
            onClick={(e) => {
              setMobileOpen(false);

              if (isHomePage) {
                e.preventDefault();
                scrollToSection("#ana-sayfa");
              }
            }}
            className="group flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-navy shadow-md transition-transform group-hover:scale-105">
              <Scale className="h-6 w-6 text-accent-light" />
            </div>
            <div>
              <span className="block font-display text-3xl font-bold leading-tight tracking-tight text-primary-deep lg:text-4xl">
                Vega Hukuk
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[3px] text-accent">
                Danışmanlık & Arabuluculuk
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => renderNavItem(link))}
            <Link
              to={CALCULATORS_PATH}
              onClick={() => setMobileOpen(false)}
              className="group relative rounded-lg px-3.5 py-2 text-[14.5px] font-medium text-foreground transition-all hover:bg-primary/[0.04] hover:text-primary"
            >
              <span className="inline-flex items-center gap-1.5">
                <Calculator className="h-4 w-4" />
                Hesaplamalar
              </span>
              <span className="absolute bottom-1 left-1/2 right-1/2 h-[1.5px] bg-accent transition-all duration-300 group-hover:left-3.5 group-hover:right-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => navigateToSection("#iletisim")}
              className="ml-2 rounded-[10px] border border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-deep hover:shadow-elegant"
            >
              İletişim
            </button>
            <Link
              to={PAYMENT_PATH}
              onClick={() => setMobileOpen(false)}
              aria-label="E-Tahsilat — kredi kartı ile güvenli online ödeme"
              className="ml-2 inline-flex items-center gap-1.5 rounded-[10px] border border-emerald-600 bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-elegant"
            >
              <CreditCard className="h-4 w-4" />
              E-Tahsilat
            </Link>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to={PAYMENT_PATH}
              onClick={() => setMobileOpen(false)}
              aria-label="E-Tahsilat — kredi kartı ile güvenli online ödeme"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-emerald-700"
            >
              <CreditCard className="h-4 w-4" />
              Ödeme
            </Link>
            <button
              className="rounded-lg border border-border p-2 transition-colors hover:bg-cream"
              onClick={() => setMobileOpen(true)}
              aria-label="Menüyü aç"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[99] flex flex-col items-center justify-center gap-2 bg-background/98 backdrop-blur-xl">
          <button className="absolute top-5 right-6 p-2" onClick={() => setMobileOpen(false)} aria-label="Kapat">
            <X className="h-7 w-7" />
          </button>
          {navLinks.map((link) => renderNavItem(link, true))}
          <Link
            to={CALCULATORS_PATH}
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-display text-[28px] font-semibold text-foreground transition-all hover:bg-primary/[0.05] hover:text-primary"
          >
            <Calculator className="h-6 w-6" />
            Hesaplamalar
          </Link>
          <button
            type="button"
            onClick={() => navigateToSection("#iletisim")}
            className="rounded-xl px-6 py-3 font-display text-[28px] font-semibold text-foreground transition-all hover:bg-primary/[0.05] hover:text-primary"
          >
            İletişim
          </button>
          <Link
            to={PAYMENT_PATH}
            onClick={() => setMobileOpen(false)}
            aria-label="E-Tahsilat — kredi kartı ile güvenli online ödeme"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-600 bg-emerald-600 px-6 py-3 font-display text-[22px] font-semibold text-white transition-all hover:bg-emerald-700"
          >
            <CreditCard className="h-5 w-5" />
            E-Tahsilat
          </Link>
        </div>
      ) : null}
    </>
  );
};

export default SiteHeader;
