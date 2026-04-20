/**
 * Dönem bazlı kıdem tazminatı tavanları (brüt, TL).
 * Kaynak: Resmî Gazete — Memur maaş katsayısı değişiklikleri.
 * Tavan = en yüksek Devlet memuru emekli ikramiyesi (1475 s.K. m.14).
 */

export type KidemTavan = {
  start: string;
  end: string;
  asgariUcretBrut: number;
  kidemTavan: number;
};

export const KIDEM_TAVANLARI: KidemTavan[] = [
  {
    start: "2026-01-01",
    end: "2026-06-30",
    asgariUcretBrut: 33030,
    kidemTavan: 64948.77,
  },
  {
    start: "2025-07-01",
    end: "2025-12-31",
    asgariUcretBrut: 26005.5,
    kidemTavan: 46655.43,
  },
  {
    start: "2025-01-01",
    end: "2025-06-30",
    asgariUcretBrut: 26005.5,
    kidemTavan: 41828.42,
  },
  {
    start: "2024-07-01",
    end: "2024-12-31",
    asgariUcretBrut: 20002.5,
    kidemTavan: 35058.58,
  },
  {
    start: "2024-01-01",
    end: "2024-06-30",
    asgariUcretBrut: 20002.5,
    kidemTavan: 35058.58,
  },
  {
    start: "2023-07-01",
    end: "2023-12-31",
    asgariUcretBrut: 13414.5,
    kidemTavan: 23489.83,
  },
  {
    start: "2023-01-01",
    end: "2023-06-30",
    asgariUcretBrut: 10008,
    kidemTavan: 19982.83,
  },
  {
    start: "2022-07-01",
    end: "2022-12-31",
    asgariUcretBrut: 6471,
    kidemTavan: 15371.4,
  },
  {
    start: "2022-01-01",
    end: "2022-06-30",
    asgariUcretBrut: 5004,
    kidemTavan: 10848.59,
  },
  {
    start: "2021-07-01",
    end: "2021-12-31",
    asgariUcretBrut: 3577.5,
    kidemTavan: 8284.51,
  },
  {
    start: "2021-01-01",
    end: "2021-06-30",
    asgariUcretBrut: 3577.5,
    kidemTavan: 7638.96,
  },
  {
    start: "2020-07-01",
    end: "2020-12-31",
    asgariUcretBrut: 2943,
    kidemTavan: 7117.17,
  },
  {
    start: "2020-01-01",
    end: "2020-06-30",
    asgariUcretBrut: 2943,
    kidemTavan: 6730.15,
  },
  {
    start: "2019-07-01",
    end: "2019-12-31",
    asgariUcretBrut: 2558.4,
    kidemTavan: 6379.86,
  },
  {
    start: "2019-01-01",
    end: "2019-06-30",
    asgariUcretBrut: 2558.4,
    kidemTavan: 6017.6,
  },
  {
    start: "2018-07-01",
    end: "2018-12-31",
    asgariUcretBrut: 2029.5,
    kidemTavan: 5434.42,
  },
  {
    start: "2018-01-01",
    end: "2018-06-30",
    asgariUcretBrut: 2029.5,
    kidemTavan: 5001.76,
  },
];

export const findKidemTavanForDate = (date: Date): KidemTavan => {
  const iso = date.toISOString().slice(0, 10);
  const match = KIDEM_TAVANLARI.find((k) => iso >= k.start && iso <= k.end);
  if (match) return match;
  // Tabloda olmayan eski tarihler için en eski tavanı döndür.
  // Güncel tarihin üstünde kalırsa en yeni tavanı döndür.
  const earliest = KIDEM_TAVANLARI[KIDEM_TAVANLARI.length - 1];
  const latest = KIDEM_TAVANLARI[0];
  return iso < earliest.start ? earliest : latest;
};
