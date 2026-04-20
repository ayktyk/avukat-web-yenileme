/**
 * Arabuluculuk Ücret Hesaplama — 2026 Tarifesi
 *
 * Formül:
 *  1. Saatlik ücret = ilk 3 saat x ilk3Saat + kalan saat x sonrakiSaat
 *     (taraf sayısına göre ikiTaraf veya tekTaraf kolonu)
 *  2. Anlaşma varsa: nispi ücret = uyuşmazlık değerinin kademeli dilim hesabı
 *  3. Uygulanacak ücret = max(saatlik, nispi)
 *  4. KDV: %20 eklenir. Stopaj: %20 düşülür.
 *     Net ödeme = uygulananÜcret - stopaj + KDV
 */

import {
  ARABULUCU_NISPI_DILIMLER,
  ARABULUCU_SAATLIK_TARIFE,
  KDV_ORANI,
  STOPAJ_ORANI,
  type ArabulucuTur,
} from "@/lib/calculator-data/arabuluculuk-tarifesi";

export type ArabulucuInput = {
  tur: ArabulucuTur;
  sure: number; // saat
  tarafSayisi: 2 | 1; // 2 = iki taraf, 1 = tek taraf (işveren öder)
  anlasmaSaglandi: boolean;
  uyusmazlikDegeri: number;
};

export type ArabulucuResult = {
  saatlikToplam: number;
  nispiToplam: number;
  uygulananUcret: number;
  kdv: number;
  stopaj: number;
  netOdeme: number;
  brutToplam: number;
  aciklamalar: string[];
};

const round2 = (n: number): number => Math.round(n * 100) / 100;

export const calculateArabulucuUcreti = (input: ArabulucuInput): ArabulucuResult => {
  const aciklamalar: string[] = [];
  const tarife = ARABULUCU_SAATLIK_TARIFE[input.tur];

  const [ikiIlk3, ikiSonraki, tekIlk3, tekSonraki] = tarife;
  const ilk3Saat = input.tarafSayisi === 2 ? ikiIlk3 : tekIlk3;
  const sonrakiSaat = input.tarafSayisi === 2 ? ikiSonraki : tekSonraki;

  const ilk3 = Math.min(input.sure, 3);
  const sonraki = Math.max(0, input.sure - 3);
  const saatlikToplam = ilk3 * ilk3Saat + sonraki * sonrakiSaat;

  let nispiToplam = 0;
  if (input.anlasmaSaglandi && input.uyusmazlikDegeri > 0) {
    let remaining = input.uyusmazlikDegeri;
    let prevLimit = 0;
    for (const d of ARABULUCU_NISPI_DILIMLER) {
      const band = Math.min(remaining, d.limit - prevLimit);
      if (band <= 0) break;
      nispiToplam += band * d.oran;
      remaining -= band;
      prevLimit = d.limit;
      if (remaining <= 0) break;
    }
    aciklamalar.push(
      "Anlaşma sağlandı; saatlik ve nispi ücretten yüksek olan uygulanır (AUT m.6).",
    );
  }

  const uygulananUcret = Math.max(saatlikToplam, nispiToplam);
  const kdv = uygulananUcret * KDV_ORANI;
  const stopaj = uygulananUcret * STOPAJ_ORANI;
  const brutToplam = uygulananUcret + kdv;
  const netOdeme = uygulananUcret - stopaj + kdv;

  if (input.tarafSayisi === 2) {
    aciklamalar.push("Ücret kural olarak taraflarca yarı yarıya ödenir (AUT m.7).");
  }

  return {
    saatlikToplam: round2(saatlikToplam),
    nispiToplam: round2(nispiToplam),
    uygulananUcret: round2(uygulananUcret),
    kdv: round2(kdv),
    stopaj: round2(stopaj),
    brutToplam: round2(brutToplam),
    netOdeme: round2(netOdeme),
    aciklamalar,
  };
};
