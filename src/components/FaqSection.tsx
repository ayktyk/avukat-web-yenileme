import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Ücretlendirme nasıl belirleniyor?",
    a: "Dosyanın kapsamı, harcanacak emek ve süre, risk profili ve Avukatlık Asgari Ücret Tarifesi dikkate alınır. Şeffaf teklif verilir.",
  },
  {
    q: "Ne kadar sürede dönüş yaparsınız?",
    a: "Mesai saatlerinde aynı gün; acil durumlarda öncelikli dönüş yapılır.",
  },
  {
    q: "Danışmanlık sözleşmesi şart mı?",
    a: "Evet, tarafların hak ve yükümlülüklerini netleştirmek ve KVKK uyumu için yazılı sözleşme düzenlenir.",
  },
  {
    q: "Dosyanızda önce neye bakılır?",
    a: "Talep, süreler (zamanaşımı/hak düşürücü), yetkili merci ve delil durumu öncelikli incelenir. Ardından strateji ve yol haritası sunulur.",
  },
  {
    q: "İlk görüşme için belge getirmem gerekir mi?",
    a: "Elinizde bulunan sözleşme, yazışma, ihtarname, tebligat ve resmî belgeleri (dijital veya basılı) getirmeniz süreci hızlandırır. Eksik belgeler sonradan tamamlanabilir.",
  },
  {
    q: "Davayı açmadan önce alternatif çözüm yolları değerlendirilir mi?",
    a: "Evet. Arabuluculuk, uzlaşma ve ihtar yoluyla çözüm; dava açmadan önce değerlendirilir. Bazı uyuşmazlıklarda arabuluculuk zaten dava şartıdır.",
  },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const id = "faq-structured-data";
    let script = document.getElementById(id) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(faqStructuredData);

    return () => {
      script?.remove();
    };
  }, []);

  return (
    <section id="sss" className="bg-cream py-20">
      <div className="section-container">
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[2.5px] text-accent before:h-[1.5px] before:w-6 before:bg-accent before:content-['']">
            SSS
          </span>
          <h3 className="mt-3 font-display text-[clamp(30px,4vw,42px)] font-bold leading-[1.15] text-primary-deep">
            Sık Sorulan Sorular
          </h3>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">Kısa, net ve anlaşılır yanıtlar.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.q}
                className="cursor-pointer rounded-2xl border border-border bg-card p-7 transition-all duration-400 hover:-translate-y-1 hover:shadow-elegant-lg"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-display text-lg font-bold text-primary-deep">{faq.q}</h4>
                  <Plus className={`h-5 w-5 flex-shrink-0 text-accent transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                </div>
                <div className={`grid overflow-hidden transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="mt-3 pb-1 text-[14.5px] leading-relaxed text-muted-foreground">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
