import ContentPageHeader from "@/components/ContentPageHeader";
import GoogleReviewsPanel from "@/components/GoogleReviewsPanel";
import { useSeo } from "@/hooks/use-seo";

const ClientReviewsPage = () => {
  useSeo({
    title: "Müvekkil Yorumları | Vega Hukuk",
    description:
      "Vega Hukuk için Google Haritalar üzerinde paylaşılan müvekkil yorumlarını ve değerlendirme ortalamasını inceleyin.",
    canonicalPath: "/muvekkil-yorumlari",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Müvekkil Yorumları",
      description:
        "Vega Hukuk için Google Haritalar üzerinde paylaşılan müvekkil yorumlarının yer aldığı sayfa.",
      url: `${window.location.origin}/muvekkil-yorumlari`,
    },
  });

  return (
    <main className="min-h-screen bg-background">
      <ContentPageHeader />
      <div className="pt-16">
        <GoogleReviewsPanel
          variant="page"
          title="Müvekkil Yorumları"
          description="Bu sayfada Google Haritalar işletme profilimizdeki mevcut yorumlar canlı olarak listelenir. Yeni eklenen yorumlar da otomatik olarak burada görünür."
        />
      </div>
    </main>
  );
};

export default ClientReviewsPage;
