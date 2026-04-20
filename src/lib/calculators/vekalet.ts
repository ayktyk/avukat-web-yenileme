/**
 * Vekalet Ücreti Hesaplama — AAÜT 2026
 *
 * Formül:
 *   - Maktu dava: doğrudan mahkeme türü maktu tutarı.
 *   - Nispi dava: dava değeri, AAUT_NISPI_DILIMLER üzerinden kademeli hesaplanır.
 *     Nispi tutar, mahkeme türü maktu tutarının altında ise maktu uygulanır.
 *   - Karar öncesi aşama (ön inceleme öncesi): hesaplanan tutar /2.
 *   - Seri dava: hesaplanan tutar %50'sine indirilir.
 */

import {
  AAUT_MAKTU_UCRETLER,
  AAUT_NISPI_DILIMLER,
  type AAUTMahkemeTuru,
} from "@/lib/calculator-data/aaut-2026";

export type VekaletDavaTuru = "nispi" | "maktu";
export type VekaletAsama = "karar" | "on-inceleme-oncesi";

export type VekaletInput = {
  mahkemeTuru: AAUTMahkemeTuru;
  davaTuru: VekaletDavaTuru;
  asama: VekaletAsama;
  davaDegeri: number; // nispi dava için gerekli
  seriDava: boolean;
};

export type VekaletResult = {
  nispiTutar: number;
  maktuTutar: number;
  uygulananTur: VekaletDavaTuru;
  asamaIndirimi: boolean;
  seriIndirimi: boolean;
  ucret: number;
  aciklamalar: string[];
};

const round2 = (n: number): number => Math.round(n * 100) / 100;

export const calculateVekaletUcreti = (input: VekaletInput): VekaletResult => {
  const aciklamalar: string[] = [];
  const maktuAlt = AAUT_MAKTU_UCRETLER[input.mahkemeTuru] ?? 30_000;

  let nispiTutar = 0;
  if (input.davaTuru === "nispi" && input.davaDegeri > 0) {
    let remaining = input.davaDegeri;
    let prevLimit = 0;
    for (const d of AAUT_NISPI_DILIMLER) {
      const band = Math.min(remaining, d.limit - prevLimit);
      if (band <= 0) break;
      nispiTutar += band * d.oran;
      remaining -= band;
      prevLimit = d.limit;
      if (remaining <= 0) break;
    }
  }

  let ucret = input.davaTuru === "maktu" ? maktuAlt : nispiTutar;
  let uygulananTur: VekaletDavaTuru = input.davaTuru;

  if (input.davaTuru === "nispi" && ucret < maktuAlt) {
    aciklamalar.push(
      `Nispi hesap (${round2(ucret).toLocaleString("tr-TR")} TL) maktu tutarın (${maktuAlt.toLocaleString("tr-TR")} TL) altında kaldığından maktu ücret uygulandı.`,
    );
    ucret = maktuAlt;
    uygulananTur = "maktu";
  }

  let asamaIndirimi = false;
  if (input.asama === "on-inceleme-oncesi") {
    ucret = ucret / 2;
    asamaIndirimi = true;
    aciklamalar.push("Ön inceleme öncesi sulh/feragat nedeniyle ücret yarıya indirildi (AAÜT m.6).");
  }

  let seriIndirimi = false;
  if (input.seriDava) {
    ucret = ucret * 0.5;
    seriIndirimi = true;
    aciklamalar.push("Seri dava indirimi uygulandı (AAÜT m.22).");
  }

  return {
    nispiTutar: round2(nispiTutar),
    maktuTutar: maktuAlt,
    uygulananTur,
    asamaIndirimi,
    seriIndirimi,
    ucret: round2(ucret),
    aciklamalar,
  };
};
