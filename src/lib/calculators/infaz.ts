/**
 * Ceza İnfaz Hesaplama — 5275/7242/7456 sayılı Kanunlar
 *
 * Adımlar:
 *   1) Toplam ceza (gün) = yıl*365 + ay*30 + gün
 *   2) Mahsup (tutukluluk) düşülür
 *   3) Çocuk indirimi (TCK m.31/2 ve 31/3)
 *   4) İnfaz oranı (suç kategorisi + tekerrür)
 *   5) Koşullu salıverme = net*oran, min 1 yıl
 *   6) Denetimli serbestlik (7456 SK: 1/2 veya 7242 SK: 3 yıl)
 *   7) Tarihler hesaplanır
 *   8) Kapalı cezaevi ve açık cezaevi tarihi
 */

import {
  CRIME_CATEGORIES,
  MUEBBET_TEKERRUR,
  AGIR_MUEBBET_TEKERRUR,
  DS_CUTOFF_7242,
  DS_CUTOFF_7456,
  type CrimeCategory,
  type Tekerrur,
} from "@/lib/calculator-data/infaz-suc-kategorileri";

export type PenaltyType = "sureli" | "muebbet" | "agir_muebbet";

export type InfazInput = {
  penaltyType: PenaltyType;
  years: number;
  months: number;
  days: number;
  crimeCategory: string;
  crimeDate: string; // YYYY-MM-DD (opsiyonel ama DS doğru oranı için gerekir)
  executionStartDate: string; // YYYY-MM-DD
  detentionDays: number;
  isJuvenile: boolean;
  birthDate?: string; // YYYY-MM-DD
  tekerrur: Tekerrur;
  iyiHal: boolean;
};

export type InfazResult = {
  toplamCezaGun: number;
  mahsupGun: number;
  cocukIndirimiGun: number;
  netCezaGun: number;
  infazOrani: string;
  kosulluGun: number;
  kosulluTarih: string; // DD.MM.YYYY
  denetimliSerbestlikGun: number;
  denetimliSerbestlikBaslangic: string;
  bihakkinTarih: string;
  kapaliCezaeviGun: number;
  acikCezaeviTarih: string | null;
  uygulananMevzuat: string[];
  penaltyType: PenaltyType;
  uyarilar: string[];
};

const addDays = (d: Date, days: number): Date => {
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const formatTR = (d: Date): string => {
  const gun = String(d.getUTCDate()).padStart(2, "0");
  const ay = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yil = d.getUTCFullYear();
  return `${gun}.${ay}.${yil}`;
};

const parseDate = (iso: string): Date | null => {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00Z");
  return Number.isNaN(d.getTime()) ? null : d;
};

const getAgeAtDate = (birth: Date, target: Date): number => {
  let age = target.getUTCFullYear() - birth.getUTCFullYear();
  const m = target.getUTCMonth() - birth.getUTCMonth();
  if (m < 0 || (m === 0 && target.getUTCDate() < birth.getUTCDate())) age--;
  return age;
};

const calculateDenetimliSerbestlik = (
  kosulluGun: number,
  crimeDate: Date | null,
  category: CrimeCategory,
  mevzuat: string[],
): number => {
  if (!crimeDate) {
    return Math.min(1095, kosulluGun);
  }
  if (crimeDate >= DS_CUTOFF_7456) {
    mevzuat.push("7456 SK");
    if (category.noDenetimliSerbestlik7456) return 0;
    let ds = Math.ceil(kosulluGun / 2);
    if (ds < 365) ds = 365;
    if (category.id === "genel" && ds > 1095) ds = 1095;
    return ds;
  }
  if (crimeDate > DS_CUTOFF_7242) {
    mevzuat.push("7242 SK");
    return Math.min(1095, kosulluGun);
  }
  mevzuat.push("5275 SK m.105/A");
  return Math.min(1095, kosulluGun);
};

export const calculateInfaz = (input: InfazInput): InfazResult | null => {
  const executionStart = parseDate(input.executionStartDate);
  if (!executionStart) return null;
  const crimeDate = parseDate(input.crimeDate);
  const category = CRIME_CATEGORIES.find((c) => c.id === input.crimeCategory);
  if (!category) return null;

  const uyarilar: string[] = [];
  const mevzuat: string[] = ["5275 SK m.107"];

  // ─── Müebbet / Ağırlaştırılmış Müebbet ───
  if (input.penaltyType !== "sureli") {
    const isAgir = input.penaltyType === "agir_muebbet";
    const tekerrurMap = isAgir ? AGIR_MUEBBET_TEKERRUR : MUEBBET_TEKERRUR;
    const baseYil = tekerrurMap[input.tekerrur];
    const kosulluGun = baseYil * 365 - input.detentionDays;

    if (input.tekerrur !== "yok") mevzuat.push("5275 SK m.108 (tekerrür)");

    let dsGun = 0;
    if (input.iyiHal) {
      dsGun = calculateDenetimliSerbestlik(kosulluGun, crimeDate, category, mevzuat);
    }

    const kosulluTarih = addDays(executionStart, kosulluGun);
    const dsBaslangic = addDays(kosulluTarih, -dsGun);
    const kapaliGun = Math.max(0, kosulluGun - dsGun);

    if (isAgir) mevzuat.unshift("5275 SK m.107/1");
    else mevzuat.unshift("5275 SK m.107/2");

    if (input.detentionDays > 0) {
      uyarilar.push(`${input.detentionDays} gün tutukluluk süresi mahsup edildi.`);
    }
    uyarilar.push(
      "Müebbet hapis cezasının infazında bihakkin tahliye mümkün değildir; sadece koşullu salıverilme rejimi uygulanır.",
    );

    return {
      toplamCezaGun: baseYil * 365,
      mahsupGun: input.detentionDays,
      cocukIndirimiGun: 0,
      netCezaGun: baseYil * 365,
      infazOrani: `${isAgir ? "Ağırlaştırılmış " : ""}Müebbet — ${baseYil} yıl`,
      kosulluGun,
      kosulluTarih: formatTR(kosulluTarih),
      denetimliSerbestlikGun: dsGun,
      denetimliSerbestlikBaslangic: formatTR(dsBaslangic),
      bihakkinTarih: "-",
      kapaliCezaeviGun: kapaliGun,
      acikCezaeviTarih:
        kapaliGun > 0
          ? formatTR(addDays(executionStart, Math.ceil(kapaliGun / 2)))
          : null,
      uygulananMevzuat: [...new Set(mevzuat)],
      penaltyType: input.penaltyType,
      uyarilar,
    };
  }

  // ─── Süreli Hapis ───
  const toplamGun = input.years * 365 + input.months * 30 + input.days;
  if (toplamGun <= 0) return null;

  const mahsupSonrasi = toplamGun - input.detentionDays;
  if (mahsupSonrasi <= 0) {
    uyarilar.push("Tutukluluk süresi ceza süresinden fazla veya eşit.");
    return null;
  }

  let cocukIndirimi = 0;
  let netGun = mahsupSonrasi;

  if (input.isJuvenile && input.birthDate && crimeDate) {
    const birth = parseDate(input.birthDate);
    if (birth) {
      const age = getAgeAtDate(birth, crimeDate);
      if (age >= 12 && age < 15) {
        cocukIndirimi = Math.floor(netGun * (1 / 3));
        netGun = netGun - cocukIndirimi;
        uyarilar.push(`Suç tarihinde ${age} yaş (12-15): cezanın 2/3'ü uygulanır.`);
        mevzuat.push("TCK m.31/2");
      } else if (age >= 15 && age < 18) {
        cocukIndirimi = Math.floor(netGun * (1 / 2));
        netGun = netGun - cocukIndirimi;
        uyarilar.push(`Suç tarihinde ${age} yaş (15-18): cezanın 1/2'si uygulanır.`);
        mevzuat.push("TCK m.31/3");
      } else if (age < 12) {
        uyarilar.push("12 yaşından küçük çocuklara ceza verilemez (TCK m.31/1).");
        return null;
      } else {
        uyarilar.push("Suç tarihinde 18 yaş ve üzeri — çocuk indirimi uygulanmaz.");
      }
    }
  }

  let oran = category.ratio;
  let oranLabel = category.ratioLabel;

  if (input.tekerrur === "1") {
    if (oran < 2 / 3) {
      oran = 2 / 3;
      oranLabel = "2/3 (1. tekerrür)";
      mevzuat.push("5275 SK m.108");
    }
  } else if (input.tekerrur === "2") {
    oran = 3 / 4;
    oranLabel = "3/4 (2. tekerrür — mükerrir)";
    mevzuat.push("5275 SK m.108");
  }

  let kosulluGun = Math.ceil(netGun * oran);
  if (kosulluGun < 365 && netGun >= 365) {
    kosulluGun = 365;
    uyarilar.push("Koşullu salıverilme süresi 1 yıldan az olamaz (5275 SK m.107/2).");
  }

  let dsGun = 0;
  if (input.iyiHal) {
    dsGun = calculateDenetimliSerbestlik(kosulluGun, crimeDate, category, mevzuat);
    if (dsGun > netGun) dsGun = netGun;
    if (dsGun > kosulluGun) dsGun = kosulluGun;
  }

  const kosulluTarih = addDays(executionStart, kosulluGun);
  const dsBaslangic = addDays(kosulluTarih, -dsGun);
  const bihakkinTarih = addDays(executionStart, netGun);
  const kapaliGun = Math.max(0, kosulluGun - dsGun);
  const acikCezaeviTarih =
    kapaliGun > 0 && input.iyiHal
      ? formatTR(addDays(executionStart, Math.ceil(kapaliGun / 2)))
      : null;

  if (input.detentionDays > 0) {
    uyarilar.push(`${input.detentionDays} gün tutukluluk/gözaltı süresi mahsup edildi.`);
  }

  return {
    toplamCezaGun: toplamGun,
    mahsupGun: input.detentionDays,
    cocukIndirimiGun: cocukIndirimi,
    netCezaGun: netGun,
    infazOrani: oranLabel,
    kosulluGun,
    kosulluTarih: formatTR(kosulluTarih),
    denetimliSerbestlikGun: dsGun,
    denetimliSerbestlikBaslangic: formatTR(dsBaslangic),
    bihakkinTarih: formatTR(bihakkinTarih),
    kapaliCezaeviGun: kapaliGun,
    acikCezaeviTarih,
    uygulananMevzuat: [...new Set(mevzuat)],
    penaltyType: input.penaltyType,
    uyarilar,
  };
};

export const daysToYMD = (totalDays: number): string => {
  if (totalDays <= 0) return "0 gün";
  const years = Math.floor(totalDays / 365);
  const remaining = totalDays % 365;
  const months = Math.floor(remaining / 30);
  const days = remaining % 30;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yıl`);
  if (months > 0) parts.push(`${months} ay`);
  if (days > 0) parts.push(`${days} gün`);
  return parts.length > 0 ? parts.join(" ") : "0 gün";
};
