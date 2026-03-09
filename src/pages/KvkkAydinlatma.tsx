import LegalPageLayout from "@/components/LegalPageLayout";

const KvkkAydinlatma = () => (
  <LegalPageLayout
    title="KVKK Aydinlatma Metni"
    description="Vega Hukuk web sitesi uzerinden iletilen temel iletisim verileri icin taslak aydinlatma yapisi."
    canonicalPath="/kvkk-aydinlatma"
    sections={[
      {
        heading: "Yayin Durumu",
        paragraphs: [
          "Bu icerik su anda canli oncesi taslak iskelet olarak tutulmaktadir.",
          "Nihai KVKK metni, veri sorumlusu bilgileri ve guncel isleme senaryolari netlestikten sonra yayinlanacaktir.",
        ],
      },
      {
        heading: "Hazirlanacak Kapsam",
        paragraphs: [
          "Nihai metinde form uzerinden alinan kimlik, iletisim ve mesaj verilerinin islenme amaci acikca listelenecektir.",
          "Ayrica saklama suresi, aktarim yapilan hizmet saglayicilar ve ilgili kisi haklari son metinde detaylandirilacaktir.",
        ],
      },
      {
        heading: "Gecici Not",
        paragraphs: [
          "Bu sayfa kullaniciyi bos bir baglantiya dusurmemek icin olusturulmustur; yayin oncesi son metinle degistirilmelidir.",
        ],
      },
    ]}
  />
);

export default KvkkAydinlatma;
