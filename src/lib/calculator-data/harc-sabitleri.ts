/**
 * Harç ve Yargı Gider Sabitleri — 2026
 *
 * 492 sayılı Harçlar Kanunu ve güncel Gider Avansı Tarifesi.
 */

export const HARC_SABITLERI = {
  /** Maktu başvurma harcı (tüm mahkemeler) — 2026 */
  maktuBasvurmaHarci: 1_427.6,
  /** Nispi başvurma harcı oranı (binde) */
  nispiBasvurmaBinde: 6.831,
  /** Nispi karar ve ilam harcı oranı (binde) */
  nispiKararBinde: 11.4,
  /** Vekaletname suret harcı */
  vekaletSuretHarci: 99.5,
  /** Tebligat normal */
  tebligatNormal: 185,
  /** Tebligat APS */
  tebligatAps: 225,
  /** Bilirkişi ücreti (ortalama) */
  bilirkisiOrtalama: 5_000,
  /** Keşif harcı (ortalama) */
  kesifOrtalama: 8_000,
  /** Tanık tazminatı (kişi başı) */
  tanikTazminati: 150,
  /** Posta müzekkere (ortalama) */
  postaMuzekkere: 700,
  /** Taraf başı tebligat */
  tarafBasinaTebligat: 280,
} as const;

export type HarcKalemi = {
  etiket: string;
  tutar: number;
  aciklama?: string;
};
