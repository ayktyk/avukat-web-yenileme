/**
 * TBK Kira Uyuşmazlıkları — Tahliye Nedenleri ve Süreleri
 *
 * Her neden için: TBK maddesi, ihtar süresi, dava açma süresi, tetikleme tarihi.
 */

export type TahliyeNedeni =
  | "konut-ihtiyaci"
  | "yeni-malik"
  | "esasli-tadilat"
  | "tahliye-taahhut"
  | "ayni-ilce-konut"
  | "iki-hakli-ihtar"
  | "10-yillik-uzama"
  | "kira-odememe"
  | "ozenle-kullanma"
  | "komsulara-saygisizlik"
  | "kira-artis";

export type TahliyeNedeniBilgi = {
  key: TahliyeNedeni;
  etiket: string;
  madde: string;
  aciklama: string;
};

export const TAHLIYE_NEDENLERI: ReadonlyArray<TahliyeNedeniBilgi> = [
  {
    key: "konut-ihtiyaci",
    etiket: "Kiraya verenin konut/işyeri ihtiyacı",
    madde: "TBK m.350/1",
    aciklama:
      "Kiraya veren, kendisi veya yakını için konuta/işyerine ihtiyacı olduğunu ispat ederse tahliye talep edebilir.",
  },
  {
    key: "yeni-malik",
    etiket: "Yeni malikin ihtiyacı",
    madde: "TBK m.351",
    aciklama:
      "Kiralananı sonradan iktisap eden kişi, kendisi veya yakınları için kullanma ihtiyacını ispat ederek tahliye isteyebilir.",
  },
  {
    key: "esasli-tadilat",
    etiket: "Yeniden inşa / esaslı onarım ihtiyacı",
    madde: "TBK m.350/2",
    aciklama:
      "Kiraya veren, kiralananın esaslı onarım, genişletme veya yeniden inşası nedeniyle tahliye talep edebilir.",
  },
  {
    key: "tahliye-taahhut",
    etiket: "Yazılı tahliye taahhüdü",
    madde: "TBK m.352/1",
    aciklama:
      "Kiracı, kira ilişkisinin devamında verdiği yazılı tahliye taahhüdü ile belirli tarihte tahliye etmezse icra/dava açılabilir.",
  },
  {
    key: "ayni-ilce-konut",
    etiket: "Aynı ilçe/belde sınırları içinde konut sahipliği",
    madde: "TBK m.352/3",
    aciklama:
      "Kiracının veya birlikte yaşadığı eşinin aynı ilçe/belde sınırları içinde oturmaya elverişli konutu varsa tahliye istenebilir.",
  },
  {
    key: "iki-hakli-ihtar",
    etiket: "Bir kira yılı içinde iki haklı ihtar",
    madde: "TBK m.352/2",
    aciklama:
      "Kira bedelinin ödenmemesi nedeniyle bir kira yılında iki haklı ihtarname çekilmişse, sonraki kira yılı için tahliye davası açılabilir.",
  },
  {
    key: "10-yillik-uzama",
    etiket: "10 yıllık uzama süresi sonunda fesih",
    madde: "TBK m.347",
    aciklama:
      "Kira sözleşmesi on yıllık uzama süresinin bitiminden önce 3 ay önceden bildirim ile sona erdirilebilir.",
  },
  {
    key: "kira-odememe",
    etiket: "Kira bedelinin ödenmemesi",
    madde: "TBK m.315",
    aciklama:
      "Kiracı kira bedelini ödemezse, 30 günlük süreli ihtar ile temerrüde düşürülür; süre sonunda sözleşme feshedilebilir.",
  },
  {
    key: "ozenle-kullanma",
    etiket: "Kiralananı özenle kullanmama",
    madde: "TBK m.316",
    aciklama:
      "Kiracının kiralananı özenle kullanmaması halinde yazılı ihtar ile 30 gün verilir; süre sonunda fesih mümkündür.",
  },
  {
    key: "komsulara-saygisizlik",
    etiket: "Komşulara saygısızlık",
    madde: "TBK m.316",
    aciklama:
      "Komşulara gereken saygıyı göstermeme halinde yazılı ihtar ile 30 gün verilir; düzelmezse fesih mümkündür.",
  },
  {
    key: "kira-artis",
    etiket: "Yıllık kira artışı (TÜFE hesabı)",
    madde: "TBK m.344",
    aciklama:
      "Yıllık kira artışı, bir önceki kira yılı sonu itibarıyla 12 aylık TÜFE ortalamasını geçemez.",
  },
];

export const getTahliyeNedeniByKey = (key: TahliyeNedeni): TahliyeNedeniBilgi | undefined =>
  TAHLIYE_NEDENLERI.find((n) => n.key === key);
