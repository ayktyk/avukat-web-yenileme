import LegalPageLayout from "@/components/LegalPageLayout";

const HukukiUyari = () => (
  <LegalPageLayout
    title="Hukuki Uyari"
    description="Site iceriklerinin bilgilendirme amacina yonelik oldugunu belirten taslak hukuki uyari sayfasi."
    canonicalPath="/hukuki-uyari"
    sections={[
      {
        heading: "Yayin Durumu",
        paragraphs: [
          "Bu sayfa yayin oncesi taslak uyari metni olarak olusturulmustur.",
        ],
      },
      {
        heading: "Hazirlanacak Kapsam",
        paragraphs: [
          "Nihai metinde web sitesi iceriklerinin genel bilgilendirme niteliginde oldugu ve somut olay bazli hukuki gorus yerine gecmeyecegi netlestirilecektir.",
          "Ayrica baro reklam kurallari ve meslek ilkeleriyle uyumlu son ifade seti burada yer alacaktir.",
        ],
      },
      {
        heading: "Gecici Not",
        paragraphs: [
          "Canliya alma oncesinde bu sayfanin son icerigi ilgili hukuk birimi tarafindan onaylanmalidir.",
        ],
      },
    ]}
  />
);

export default HukukiUyari;
