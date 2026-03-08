import { Scale } from "lucide-react";

const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }
};

const SiteFooter = () => {
  return (
    <footer className="bg-primary-deep text-primary-foreground/60 pt-14 relative">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="section-container grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10">
        <div>
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-11 h-11 rounded-md gradient-navy border border-primary-foreground/10 flex items-center justify-center shadow-md">
              <Scale className="w-5 h-5 text-accent-light" />
            </div>
            <div>
              <strong className="text-primary-foreground font-display text-lg block">Vega Hukuk</strong>
              <small className="text-[11px] tracking-[2px] uppercase text-primary-foreground/35">Danışmanlık & Arabuluculuk</small>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-[38ch]">
            Avukatlık Kanunu ve meslek kurallarına uygun olarak hizmet veririz. Bilgilendirme niteliğindedir; hukuki danışmanlık değildir.
          </p>
        </div>

        <div>
          <h5 className="text-primary-foreground font-display text-base font-bold mb-4 tracking-wide">Bağlantılar</h5>
          <ul className="space-y-2.5">
            {[
              { label: "Hakkımızda", href: "#hakkimizda" },
              { label: "Çalışma Alanları", href: "#calisma-alanlari" },
              { label: "Yayınlar", href: "#yayinlar" },
              { label: "İletişim", href: "#iletisim" },
            ].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className="text-sm hover:text-accent-light transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-primary-foreground font-display text-base font-bold mb-4 tracking-wide">Yasal</h5>
          <ul className="space-y-2.5">
            <li><a href="#" className="text-sm hover:text-accent-light transition-colors">KVKK Aydınlatma Metni</a></li>
            <li><a href="#" className="text-sm hover:text-accent-light transition-colors">Çerez Politikası</a></li>
            <li><a href="#" className="text-sm hover:text-accent-light transition-colors">Hukuki Uyarı</a></li>
          </ul>
        </div>
      </div>

      <div className="section-container border-t border-primary-foreground/[0.08] mt-10 py-5 text-center text-[13px] text-primary-foreground/35">
        © {new Date().getFullYear()} Vega Hukuk & Danışmanlık Arabuluculuk. Tüm hakları saklıdır.
      </div>
    </footer>
  );
};

export default SiteFooter;
