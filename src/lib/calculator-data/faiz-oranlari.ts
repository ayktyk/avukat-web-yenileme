/**
 * Yasal Faiz Oranları — 3095 sayılı Kanun m.1 ve m.2 kapsamında
 *
 * Dönem başlangıç tarihleri ve yıllık oran (% olarak).
 * En yeni tarih en üstte. Tarihten itibaren yeni dönem uygulanır.
 *
 * Ticari (avans) faiz: TCMB tarafından açıklanan kısa vadeli avans faizi.
 */

export type FaizTuru = "yasal" | "ticari" | "ozel";

export const FAIZ_TUR_LABELS: Record<FaizTuru, string> = {
  yasal: "Yasal Faiz (%)",
  ticari: "Ticari Avans Faizi (%)",
  ozel: "Özel Oran",
};

export type FaizDonemi = { start: string; oran: number };

/**
 * Yasal faiz oranları (yıllık).
 * 3095 s.K. m.1 kapsamında, BK m.88'e göre.
 */
export const YASAL_FAIZ_DONEMLERI: ReadonlyArray<FaizDonemi> = [
  { start: "2024-06-01", oran: 9 },
  { start: "2005-05-01", oran: 9 },
  { start: "2004-07-01", oran: 15 },
  { start: "2000-01-01", oran: 60 },
  { start: "1998-01-01", oran: 50 },
  { start: "1997-01-01", oran: 30 },
];

/**
 * Ticari avans faiz oranları (yıllık).
 * TCMB kısa vadeli avans faizi + 3095 s.K. m.2 kapsamında.
 */
export const TICARI_FAIZ_DONEMLERI: ReadonlyArray<FaizDonemi> = [
  { start: "2025-06-21", oran: 48 },
  { start: "2024-12-26", oran: 51.75 },
  { start: "2024-03-21", oran: 54 },
  { start: "2024-02-22", oran: 50.75 },
  { start: "2024-01-25", oran: 48.5 },
  { start: "2023-12-21", oran: 45.75 },
  { start: "2023-11-23", oran: 42.25 },
  { start: "2023-10-26", oran: 36.75 },
  { start: "2023-09-21", oran: 31.25 },
  { start: "2023-08-24", oran: 26.25 },
  { start: "2023-07-20", oran: 20 },
  { start: "2023-06-22", oran: 16.5 },
  { start: "2023-02-01", oran: 10.75 },
  { start: "2022-12-22", oran: 10.75 },
  { start: "2022-11-24", oran: 10.75 },
  { start: "2022-10-20", oran: 13 },
  { start: "2022-09-22", oran: 14 },
  { start: "2022-08-18", oran: 15 },
  { start: "2021-12-16", oran: 16 },
  { start: "2021-09-23", oran: 19 },
  { start: "2021-03-18", oran: 20 },
];
