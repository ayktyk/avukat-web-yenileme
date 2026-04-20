/**
 * Kademeli gelir vergisi dilimleri (GVK m.103).
 * Yıl bazlı. Kaynak: GİB Resmî Gazete duyuruları.
 */

export type VergiDilimi = {
  ustSinir: number; // null = üstü yok
  oran: number; // ondalık (örn 0.15)
};

export type YilVergiDilimi = {
  year: number;
  dilimler: VergiDilimi[];
};

export const GELIR_VERGISI_DILIMLERI: YilVergiDilimi[] = [
  {
    year: 2026,
    dilimler: [
      { ustSinir: 158000, oran: 0.15 },
      { ustSinir: 330000, oran: 0.2 },
      { ustSinir: 1200000, oran: 0.27 },
      { ustSinir: 4300000, oran: 0.35 },
      { ustSinir: Number.POSITIVE_INFINITY, oran: 0.4 },
    ],
  },
  {
    year: 2025,
    dilimler: [
      { ustSinir: 158000, oran: 0.15 },
      { ustSinir: 330000, oran: 0.2 },
      { ustSinir: 1200000, oran: 0.27 },
      { ustSinir: 4300000, oran: 0.35 },
      { ustSinir: Number.POSITIVE_INFINITY, oran: 0.4 },
    ],
  },
  {
    year: 2024,
    dilimler: [
      { ustSinir: 110000, oran: 0.15 },
      { ustSinir: 230000, oran: 0.2 },
      { ustSinir: 870000, oran: 0.27 },
      { ustSinir: 3000000, oran: 0.35 },
      { ustSinir: Number.POSITIVE_INFINITY, oran: 0.4 },
    ],
  },
  {
    year: 2023,
    dilimler: [
      { ustSinir: 70000, oran: 0.15 },
      { ustSinir: 150000, oran: 0.2 },
      { ustSinir: 550000, oran: 0.27 },
      { ustSinir: 1900000, oran: 0.35 },
      { ustSinir: Number.POSITIVE_INFINITY, oran: 0.4 },
    ],
  },
  {
    year: 2022,
    dilimler: [
      { ustSinir: 32000, oran: 0.15 },
      { ustSinir: 70000, oran: 0.2 },
      { ustSinir: 250000, oran: 0.27 },
      { ustSinir: 880000, oran: 0.35 },
      { ustSinir: Number.POSITIVE_INFINITY, oran: 0.4 },
    ],
  },
];

export const DAMGA_VERGISI_ORAN = 0.00759;
export const SGK_ISSIZLIK_TOPLAM = 0.15;

export const getDilimlerForYear = (year: number): VergiDilimi[] => {
  const match = GELIR_VERGISI_DILIMLERI.find((y) => y.year === year);
  if (match) return match.dilimler;
  // Yıl tabloda yoksa en yakın yıla git
  const sorted = [...GELIR_VERGISI_DILIMLERI].sort((a, b) => b.year - a.year);
  if (year > sorted[0].year) return sorted[0].dilimler;
  return sorted[sorted.length - 1].dilimler;
};

export const hesaplaKademeliGelirVergisi = (matrah: number, year: number): number => {
  if (matrah <= 0) return 0;
  const dilimler = getDilimlerForYear(year);
  let kalan = matrah;
  let vergi = 0;
  let altSinir = 0;
  for (const d of dilimler) {
    const dilimGenislik = d.ustSinir - altSinir;
    if (kalan <= dilimGenislik) {
      vergi += kalan * d.oran;
      return vergi;
    }
    vergi += dilimGenislik * d.oran;
    kalan -= dilimGenislik;
    altSinir = d.ustSinir;
    if (!Number.isFinite(altSinir)) break;
  }
  return vergi;
};
