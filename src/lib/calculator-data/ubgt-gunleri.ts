/**
 * Yıllara göre toplam ulusal bayram ve genel tatil (UBGT) gün sayısı.
 * Resmî ve dinî bayramlar ile yarım gün tatiller birleşerek kesirli olabilir.
 * Kaynak: 2429 sayılı Ulusal Bayram ve Genel Tatiller Hakkında Kanun + yıllık takvim.
 */

export const UBGT_GUNLERI: Record<number, number> = {
  2026: 15.5,
  2025: 15.5,
  2024: 15.5,
  2023: 15,
  2022: 15.5,
  2021: 15.5,
  2020: 15.5,
  2019: 15.5,
  2018: 15.5,
};

export const getUbgtGunForYear = (year: number): number => {
  if (UBGT_GUNLERI[year] !== undefined) return UBGT_GUNLERI[year];
  // Varsayılan: 15.5 (son yılların standardı)
  return 15.5;
};
