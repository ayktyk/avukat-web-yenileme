/**
 * İnfaz Hesaplama — Suç Kategorileri ve Sabitler
 *
 * 5275 SK m.107 koşullu salıverme oranları, 5275 SK m.108 tekerrür,
 * 7242 SK (30.03.2020) ve 7456 SK (01.08.2023) denetimli serbestlik değişiklikleri.
 */

export type CrimeCategory = {
  id: string;
  label: string;
  ratio: number;
  ratioLabel: string;
  noDenetimliSerbestlik7456?: boolean;
};

export const CRIME_CATEGORIES: ReadonlyArray<CrimeCategory> = [
  { id: "genel", label: "Genel suçlar", ratio: 1 / 2, ratioLabel: "1/2" },
  {
    id: "kasten_oldurme",
    label: "Kasten öldürme (TCK m.81, 82)",
    ratio: 2 / 3,
    ratioLabel: "2/3",
  },
  {
    id: "uyusturucu",
    label: "Uyuşturucu imal/ticareti (TCK m.188)",
    ratio: 3 / 4,
    ratioLabel: "3/4",
    noDenetimliSerbestlik7456: true,
  },
  {
    id: "cinsel",
    label: "Cinsel suçlar (TCK m.102, 103, 104)",
    ratio: 3 / 4,
    ratioLabel: "3/4",
    noDenetimliSerbestlik7456: true,
  },
  {
    id: "teror",
    label: "Terör suçları (TMK)",
    ratio: 3 / 4,
    ratioLabel: "3/4",
    noDenetimliSerbestlik7456: true,
  },
  {
    id: "devlet",
    label: "Devlete karşı suçlar (TCK m.302-339)",
    ratio: 3 / 4,
    ratioLabel: "3/4",
  },
  {
    id: "orgutlu",
    label: "Örgütlü suçlar (TCK m.314, 220)",
    ratio: 3 / 4,
    ratioLabel: "3/4",
  },
  {
    id: "mukerrir",
    label: "İkinci kez mükerrir (tekerrür)",
    ratio: 3 / 4,
    ratioLabel: "3/4",
  },
];

export type Tekerrur = "yok" | "1" | "2";

export const MUEBBET_TEKERRUR: Record<Tekerrur, number> = {
  yok: 24,
  "1": 28,
  "2": 32,
};

export const AGIR_MUEBBET_TEKERRUR: Record<Tekerrur, number> = {
  yok: 30,
  "1": 34,
  "2": 36,
};

/** 7242 sayılı Kanun — 30.03.2020 */
export const DS_CUTOFF_7242 = new Date("2020-03-30T00:00:00Z");
/** 7456 sayılı Kanun — 01.08.2023 */
export const DS_CUTOFF_7456 = new Date("2023-08-01T00:00:00Z");

export const getCrimeCategoryById = (id: string): CrimeCategory | undefined =>
  CRIME_CATEGORIES.find((c) => c.id === id);
