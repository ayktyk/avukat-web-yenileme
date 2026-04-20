/**
 * Arabuluculuk Ücret Tarifesi — 2026
 *
 * İki tarafça ödenecek saatlik arabuluculuk ücretleri ([ilk3Saat, sonrakiSaat, ilk3Tek, sonrakiTek]).
 * Nispi dilim ücretleri anlaşma sağlanması halinde uygulanır.
 */

export type ArabulucuTur =
  | "isci-isveren"
  | "ticari"
  | "tuketici"
  | "aile"
  | "kira"
  | "ortaklik"
  | "diger";

export const ARABULUCU_TUR_LABELS: Record<ArabulucuTur, string> = {
  "isci-isveren": "İşçi-İşveren Uyuşmazlığı",
  "ticari": "Ticari Uyuşmazlık",
  "tuketici": "Tüketici Uyuşmazlığı",
  "aile": "Aile Hukuku",
  "kira": "Kira İlişkisi",
  "ortaklik": "Ortaklığın Giderilmesi",
  "diger": "Diğer Uyuşmazlıklar",
};

/**
 * Saatlik ücretler [ikiTarafIlk3, ikiTarafSonraki, tekTarafIlk3, tekTarafSonraki]
 * — anlaşma olmasa dahi arabulucu ücreti taraflarca ödenir.
 */
export const ARABULUCU_SAATLIK_TARIFE: Record<
  ArabulucuTur,
  [number, number, number, number]
> = {
  "isci-isveren": [1200, 900, 900, 600],
  "ticari": [1800, 1200, 1200, 900],
  "tuketici": [750, 550, 550, 400],
  "aile": [1100, 800, 800, 600],
  "kira": [1000, 750, 750, 550],
  "ortaklik": [1500, 1100, 1100, 800],
  "diger": [900, 650, 650, 500],
};

/**
 * Nispi Arabuluculuk Tarifesi — anlaşma sağlanması halinde uygulanır.
 * Dilim limit ve oranları 2026 tarifesi.
 */
export const ARABULUCU_NISPI_DILIMLER: ReadonlyArray<{
  limit: number;
  oran: number;
}> = [
  { limit: 150_000, oran: 0.06 },
  { limit: 300_000, oran: 0.05 },
  { limit: 750_000, oran: 0.04 },
  { limit: 1_500_000, oran: 0.03 },
  { limit: 3_000_000, oran: 0.02 },
  { limit: 7_500_000, oran: 0.015 },
  { limit: 15_000_000, oran: 0.01 },
  { limit: Number.POSITIVE_INFINITY, oran: 0.005 },
];

export const KDV_ORANI = 0.2;
export const STOPAJ_ORANI = 0.2;
