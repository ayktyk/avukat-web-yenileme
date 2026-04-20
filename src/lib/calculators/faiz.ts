/**
 * Faiz Hesaplama — Kademeli Dönem Bazlı
 *
 * Formül:
 *   - Başlangıç ile bitiş tarihleri arası, her faiz dönemi için
 *     parçalara bölünür.
 *   - Parça faizi = anapara x oran x gün / (100 x 365)
 *   - Toplam faiz = tüm parça faizlerinin toplamı.
 *   - Brüt alacak = anapara + toplam faiz
 */

import {
  TICARI_FAIZ_DONEMLERI,
  YASAL_FAIZ_DONEMLERI,
  type FaizDonemi,
  type FaizTuru,
} from "@/lib/calculator-data/faiz-oranlari";

export type FaizInput = {
  anapara: number;
  baslangic: string; // YYYY-MM-DD
  bitis: string; // YYYY-MM-DD (varsayılan: bugün)
  faizTuru: FaizTuru;
  ozelOran?: number; // % yıllık, faizTuru=ozel ise kullanılır
};

export type FaizDonemDetay = {
  start: string;
  end: string;
  oran: number;
  gun: number;
  faiz: number;
};

export type FaizResult = {
  anapara: number;
  toplamFaiz: number;
  toplamBrut: number;
  toplamGun: number;
  donemler: FaizDonemDetay[];
};

const round2 = (n: number): number => Math.round(n * 100) / 100;

const parseDate = (iso: string): Date => {
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) throw new Error(`Geçersiz tarih: ${iso}`);
  return d;
};

const getSortedRates = (faizTuru: FaizTuru, ozelOran?: number): FaizDonemi[] => {
  if (faizTuru === "ozel") {
    return [{ start: "1970-01-01", oran: ozelOran ?? 0 }];
  }
  const src = faizTuru === "yasal" ? YASAL_FAIZ_DONEMLERI : TICARI_FAIZ_DONEMLERI;
  // En eskiden en yeniye sırala (cursor-bazlı ilerleme için)
  return [...src].sort((a, b) => a.start.localeCompare(b.start));
};

const formatISO = (d: Date): string => d.toISOString().slice(0, 10);

export const calculateFaiz = (input: FaizInput): FaizResult => {
  const anapara = Math.max(0, input.anapara);
  const start = parseDate(input.baslangic);
  const end = parseDate(input.bitis);
  if (end <= start) {
    return {
      anapara,
      toplamFaiz: 0,
      toplamBrut: anapara,
      toplamGun: 0,
      donemler: [],
    };
  }

  const rates = getSortedRates(input.faizTuru, input.ozelOran);

  const donemler: FaizDonemDetay[] = [];
  let cursor = new Date(start);
  let toplamFaiz = 0;
  let toplamGun = 0;

  while (cursor < end) {
    // Cursor'a ait oranı bul (en büyük start <= cursor olan)
    let oran = rates[0].oran;
    for (const r of rates) {
      if (cursor >= new Date(r.start + "T00:00:00Z")) {
        oran = r.oran;
      } else {
        break;
      }
    }
    // Bir sonraki oran değişimine kadar ilerle
    let periodEnd = new Date(end);
    for (const r of rates) {
      const rDate = new Date(r.start + "T00:00:00Z");
      if (rDate > cursor && rDate < periodEnd) {
        periodEnd = rDate;
        break;
      }
    }
    const gun = Math.floor(
      (periodEnd.getTime() - cursor.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (gun > 0) {
      const faiz = (anapara * oran * gun) / (100 * 365);
      toplamFaiz += faiz;
      toplamGun += gun;
      donemler.push({
        start: formatISO(cursor),
        end: formatISO(periodEnd),
        oran,
        gun,
        faiz: round2(faiz),
      });
    }
    cursor = periodEnd;
  }

  return {
    anapara: round2(anapara),
    toplamFaiz: round2(toplamFaiz),
    toplamBrut: round2(anapara + toplamFaiz),
    toplamGun,
    donemler,
  };
};
