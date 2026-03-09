import LegalPageLayout from "@/components/LegalPageLayout";

const CerezPolitikasi = () => (
  <LegalPageLayout
    title="Cerez Politikasi"
    description="Vega Hukuk sitesi icin taslak cerez politikasi iskeleti."
    canonicalPath="/cerez-politikasi"
    sections={[
      {
        heading: "Yayin Durumu",
        paragraphs: [
          "Bu metin canli oncesi taslak durumundadir ve son cerez envanteri cikartildiktan sonra tamamlanacaktir.",
        ],
      },
      {
        heading: "Hazirlanacak Kapsam",
        paragraphs: [
          "Nihai surumde zorunlu, analitik ve tercihe bagli cerez kategorileri ayri ayri listelenecektir.",
          "Kullanicinin cerez tercihlerini nasil yonetecegi ve gerekiyorsa onay mekanizmasi son metinde aciklanacaktir.",
        ],
      },
      {
        heading: "Gecici Not",
        paragraphs: [
          "Su anda site icin cerez kullanimi ve ucuncu taraf etiketleri canliya alma oncesi teknik olarak tekrar kontrol edilmelidir.",
        ],
      },
    ]}
  />
);

export default CerezPolitikasi;
