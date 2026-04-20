/**
 * Kaza (Maluliyet) Tazminatı Hesaplama — Progresif Rant Metodu
 *
 * Formül:
 *   - Ortalama ömür (TRH2010): erkek 74.2, kadın 79.1.
 *   - Aktif dönem: yaş'tan 65'e kadar çalışma süresi.
 *   - Pasif dönem: 65'ten ömür sonuna kadar asgari ücret üzerinden hesap.
 *   - Aktif dönemde yıllık gelir %10 artışla rantlanır, %10 iskonto ile bugünkü değere indirilir.
 *   - Sürekli maluliyet tazminatı = aktif + pasif toplam x maluliyet katsayısı.
 *   - Kusur indirimi: hesaplanan tutar x (1 - kusurOrani).
 */

export type Cinsiyet = "E" | "K";

export type KazaInput = {
  dogum: string; // YYYY-MM-DD
  kaza: string; // YYYY-MM-DD
  cinsiyet: Cinsiyet;
  maluliyetOrani: number; // % (0-100)
  kusurOrani: number; // % müteveffanın kusur oranı
  aylikGelir: number; // TL (brüt veya net, dosyaya göre)
  asgariUcret: number; // 2026 için brüt aylık asgari ücret TL
};

export type KazaResult = {
  yas: number;
  ortalamOmur: number;
  bakiyeOmur: number;
  calismaSuresi: number;
  pasifDonem: number;
  aktiveTazminat: number;
  pasifTazminat: number;
  toplamTazminat: number;
  kusurluTazminat: number;
  uyarilar: string[];
};

const round2 = (n: number): number => Math.round(n * 100) / 100;

const parseDate = (iso: string): Date => {
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) throw new Error(`Geçersiz tarih: ${iso}`);
  return d;
};

const yearsBetween = (a: Date, b: Date): number => {
  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
  return Math.floor((b.getTime() - a.getTime()) / msPerYear);
};

export const calculateKazaTazminati = (input: KazaInput): KazaResult => {
  const uyarilar: string[] = [];
  const dogum = parseDate(input.dogum);
  const kaza = parseDate(input.kaza);

  const yas = yearsBetween(dogum, kaza);
  if (yas < 0) {
    uyarilar.push("Kaza tarihi doğum tarihinden önce olamaz.");
  }

  const ortalamOmur = input.cinsiyet === "E" ? 74.2 : 79.1;
  const bakiyeOmur = Math.max(0, ortalamOmur - yas);
  const calismaSuresi = Math.max(0, Math.min(65 - yas, bakiyeOmur));
  const pasifDonem = Math.max(0, bakiyeOmur - calismaSuresi);

  const maluliyetKatsayi = Math.max(0, Math.min(1, input.maluliyetOrani / 100));
  const kusurKatsayi = Math.max(0, Math.min(1, input.kusurOrani / 100));

  const yillikGelir = Math.max(0, input.aylikGelir) * 12;

  // Aktif dönem: %10 artış, %10 iskonto → birim değer yıl başına 1
  // Toplam = yillikGelir * calismaSuresi
  let aktiveToplam = 0;
  for (let y = 0; y < Math.floor(calismaSuresi); y++) {
    aktiveToplam += yillikGelir; // (1.1^y) / (1.1^y) = 1
  }
  // Kalan fraksiyon
  const aktiveKalan = calismaSuresi - Math.floor(calismaSuresi);
  if (aktiveKalan > 0) aktiveToplam += yillikGelir * aktiveKalan;

  const aktiveTazminat = aktiveToplam * maluliyetKatsayi;

  // Pasif dönem: asgari ücret üzerinden, %10 iskonto
  const asgariYillik = Math.max(0, input.asgariUcret) * 12;
  let pasifToplam = 0;
  for (let y = 0; y < Math.floor(pasifDonem); y++) {
    pasifToplam += asgariYillik / Math.pow(1.1, y + Math.floor(calismaSuresi));
  }
  const pasifKalan = pasifDonem - Math.floor(pasifDonem);
  if (pasifKalan > 0) {
    pasifToplam +=
      (asgariYillik * pasifKalan) /
      Math.pow(1.1, Math.floor(pasifDonem) + Math.floor(calismaSuresi));
  }
  const pasifTazminat = pasifToplam * maluliyetKatsayi;

  const toplam = aktiveTazminat + pasifTazminat;
  const kusurluTazminat = toplam * (1 - kusurKatsayi);

  if (input.maluliyetOrani > 100 || input.maluliyetOrani < 0) {
    uyarilar.push("Maluliyet oranı 0-100 aralığında olmalıdır.");
  }
  if (input.kusurOrani > 100 || input.kusurOrani < 0) {
    uyarilar.push("Kusur oranı 0-100 aralığında olmalıdır.");
  }
  uyarilar.push(
    "Bu hesap TRH2010 ömür tablosu ve %10 progresif rant esasına dayanır. Mahkeme, aktüer bilirkişi raporuna göre farklı iskonto/artış oranları uygulayabilir.",
  );

  return {
    yas,
    ortalamOmur,
    bakiyeOmur: round2(bakiyeOmur),
    calismaSuresi: round2(calismaSuresi),
    pasifDonem: round2(pasifDonem),
    aktiveTazminat: round2(aktiveTazminat),
    pasifTazminat: round2(pasifTazminat),
    toplamTazminat: round2(toplam),
    kusurluTazminat: round2(kusurluTazminat),
    uyarilar,
  };
};
