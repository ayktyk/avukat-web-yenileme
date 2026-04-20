/**
 * Yıl bazlı günlük yemek bedeli gelir vergisi istisnası (TL).
 * GVK m.23/8'e göre işyerinde veya müştemilatında yemek verilmediği durumlarda
 * işverenin nakdî yemek yardımı için günlük istisnası.
 * Kaynak: GİB Gelir Vergisi Genel Tebliğleri.
 */

export const YEMEK_ISTISNASI: Record<number, number> = {
  2026: 240,
  2025: 240,
  2024: 170,
  2023: 110,
  2022: 51,
  2021: 25,
  2020: 23,
  2019: 19,
  2018: 16,
};

export const getYemekIstisnasiForYear = (year: number): number => {
  if (YEMEK_ISTISNASI[year] !== undefined) return YEMEK_ISTISNASI[year];
  if (year >= 2026) return YEMEK_ISTISNASI[2026];
  if (year <= 2018) return YEMEK_ISTISNASI[2018];
  return 170;
};
