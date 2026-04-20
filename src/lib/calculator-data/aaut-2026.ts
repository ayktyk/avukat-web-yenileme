/**
 * Avukatlık Asgari Ücret Tarifesi — 2026 (AAÜT)
 * TBB tarafından belirlenir, Resmi Gazete'de yayımlanır.
 *
 * Kaynak: 2026 Yılı için TBB AAÜT (ilgili Resmi Gazete ile güncellenmiştir).
 */

export type AAUTMahkemeTuru =
  | "asliye-hukuk"
  | "sulh-hukuk"
  | "asliye-ticaret"
  | "is"
  | "aile"
  | "tuketici"
  | "kadastro"
  | "icra-hukuk"
  | "icra-ceza"
  | "agir-ceza"
  | "asliye-ceza"
  | "cocuk-agir-ceza"
  | "cocuk-ceza"
  | "sulh-ceza"
  | "idare"
  | "vergi"
  | "bolge-adliye"
  | "danistay"
  | "yargitay";

export const AAUT_MAHKEME_LABELS: Record<AAUTMahkemeTuru, string> = {
  "asliye-hukuk": "Asliye Hukuk Mahkemesi",
  "sulh-hukuk": "Sulh Hukuk Mahkemesi",
  "asliye-ticaret": "Asliye Ticaret Mahkemesi",
  "is": "İş Mahkemesi",
  "aile": "Aile Mahkemesi",
  "tuketici": "Tüketici Mahkemesi",
  "kadastro": "Kadastro Mahkemesi",
  "icra-hukuk": "İcra Hukuk Mahkemesi",
  "icra-ceza": "İcra Ceza Mahkemesi",
  "agir-ceza": "Ağır Ceza Mahkemesi",
  "asliye-ceza": "Asliye Ceza Mahkemesi",
  "cocuk-agir-ceza": "Çocuk Ağır Ceza Mahkemesi",
  "cocuk-ceza": "Çocuk Mahkemesi",
  "sulh-ceza": "Sulh Ceza Hakimliği",
  "idare": "İdare Mahkemesi",
  "vergi": "Vergi Mahkemesi",
  "bolge-adliye": "Bölge Adliye Mahkemesi",
  "danistay": "Danıştay",
  "yargitay": "Yargıtay",
};

/**
 * AAÜT Nispi Vekalet Ücreti Dilimleri (2026)
 * Dava değeri bu dilimlere göre kademeli hesaplanır.
 * Her dilimde, o dilim tutarı x oran oran formulü uygulanır.
 */
export const AAUT_NISPI_DILIMLER: ReadonlyArray<{ limit: number; oran: number }> = [
  { limit: 600_000, oran: 0.15 },
  { limit: 900_000, oran: 0.13 },
  { limit: 1_800_000, oran: 0.09 },
  { limit: 3_600_000, oran: 0.07 },
  { limit: 6_000_000, oran: 0.05 },
  { limit: 12_000_000, oran: 0.03 },
  { limit: 24_000_000, oran: 0.02 },
  { limit: 48_000_000, oran: 0.015 },
  { limit: 96_000_000, oran: 0.0125 },
  { limit: Number.POSITIVE_INFINITY, oran: 0.01 },
];

/**
 * AAÜT Maktu Vekalet Ücretleri (2026) — mahkeme türüne göre
 * Nispi hesaplamanın maktu tutarın altına düşmesi halinde maktu tutar uygulanır.
 */
export const AAUT_MAKTU_UCRETLER: Record<AAUTMahkemeTuru, number> = {
  "asliye-hukuk": 30_000,
  "sulh-hukuk": 18_750,
  "asliye-ticaret": 37_500,
  "is": 30_000,
  "aile": 22_500,
  "tuketici": 15_000,
  "kadastro": 18_750,
  "icra-hukuk": 12_500,
  "icra-ceza": 12_500,
  "agir-ceza": 37_500,
  "asliye-ceza": 22_500,
  "cocuk-agir-ceza": 37_500,
  "cocuk-ceza": 22_500,
  "sulh-ceza": 12_500,
  "idare": 30_000,
  "vergi": 30_000,
  "bolge-adliye": 22_500,
  "danistay": 37_500,
  "yargitay": 37_500,
};
