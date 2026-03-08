import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const FloatCTA = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* WhatsApp & Call */}
      <div className="fixed right-5 bottom-5 flex flex-col gap-2.5 z-[60]">
        <a
          href="https://wa.me/905519814937"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] text-primary-foreground font-semibold text-sm shadow-elegant-lg hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_16px_40px_rgba(0,0,0,.2)] transition-all duration-300"
        >
          📱 WhatsApp
        </a>
        <a
          href="tel:+905519814937"
          className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-accent text-accent-foreground font-semibold text-sm shadow-elegant-lg hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_16px_40px_rgba(0,0,0,.2)] transition-all duration-300"
        >
          📞 Ara
        </a>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed left-5 bottom-5 w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-elegant z-[60] transition-all duration-300 hover:bg-primary-deep ${
          showTop ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-5 pointer-events-none"
        }`}
        aria-label="Sayfa başına dön"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </>
  );
};

export default FloatCTA;
