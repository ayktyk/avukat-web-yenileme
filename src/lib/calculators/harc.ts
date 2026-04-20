/**
 * Harç ve Gider Avansı Hesaplama — 492 sayılı Harçlar Kanunu
 *
 * Formül:
 *   nispiBasvurma = davaDegeri x 6.831/1000
 *   nispiKararIlam = davaDegeri x 11.40/1000
 *   pesinHarc = nispiKararIlam / 4
 *   basvurmaHarci = max(maktuBasvurma, nispiBasvurma)
 *   Gider avansı = tebligat x tarafSayisi + bilirkisi + kesif + tanik + posta
 */

import { HARC_SABITLERI, type HarcKalemi } from "@/lib/calculator-data/harc-sabitleri";

export type HarcDavaTuru = "nispi" | "maktu";

export type HarcInput = {
  davaTuru: HarcDavaTuru;
  davaDegeri: number;
  tarafSayisi: number;
  tanikSayisi: number;
  bilirkisiGerekli: boolean;
  kesifGerekli: boolean;
  apsTebligat: boolean;
};

export type HarcResult = {
  basvurmaHarci: HarcKalemi;
  pesinHarc: HarcKalemi;
  nispiKararIlamHarci: HarcKalemi;
  vekaletHarci: HarcKalemi;
  toplamHarc: number;
  giderAvansiKalemleri: HarcKalemi[];
  toplamGiderAvansi: number;
  toplamOdeme: number;
  aciklamalar: string[];
};

const round2 = (n: number): number => Math.round(n * 100) / 100;

export const calculateHarc = (input: HarcInput): HarcResult => {
  const aciklamalar: string[] = [];
  const value = Math.max(0, input.davaDegeri);

  const nispiBasvurma = input.davaTuru === "nispi"
    ? value * (HARC_SABITLERI.nispiBasvurmaBinde / 1000)
    : 0;
  const nispiKararIlam = input.davaTuru === "nispi"
    ? value * (HARC_SABITLERI.nispiKararBinde / 1000)
    : 0;
  const pesinHarcTutar = nispiKararIlam / 4;
  const basvurmaTutar = Math.max(HARC_SABITLERI.maktuBasvurmaHarci, nispiBasvurma);

  if (input.davaTuru === "nispi" && nispiBasvurma > HARC_SABITLERI.maktuBasvurmaHarci) {
    aciklamalar.push("Nispi başvurma harcı maktu tutarı aştığı için nispi uygulandı.");
  }

  const basvurmaHarci: HarcKalemi = {
    etiket: "Başvurma Harcı",
    tutar: round2(basvurmaTutar),
    aciklama: input.davaTuru === "maktu"
      ? "Maktu tutar (492 s.K. (1) sayılı tarife A)"
      : `Dava değerinin %o${HARC_SABITLERI.nispiBasvurmaBinde}'i`,
  };
  const nispiKararIlamHarci: HarcKalemi = {
    etiket: "Karar ve İlam Harcı (Nispi)",
    tutar: round2(nispiKararIlam),
    aciklama: `Dava değerinin %o${HARC_SABITLERI.nispiKararBinde}'i (1/4'ü peşin)`,
  };
  const pesinHarc: HarcKalemi = {
    etiket: "Peşin Harç",
    tutar: round2(pesinHarcTutar),
    aciklama: "Karar ve ilam harcının 1/4'ü, dava açılırken yatırılır.",
  };
  const vekaletHarci: HarcKalemi = {
    etiket: "Vekaletname Suret Harcı",
    tutar: HARC_SABITLERI.vekaletSuretHarci,
  };

  const toplamHarc = basvurmaHarci.tutar + pesinHarc.tutar + vekaletHarci.tutar;

  const giderKalemleri: HarcKalemi[] = [];

  const tebligatBirim = input.apsTebligat
    ? HARC_SABITLERI.tebligatAps
    : HARC_SABITLERI.tebligatNormal;
  const tebligatToplam = tebligatBirim * Math.max(1, input.tarafSayisi);
  giderKalemleri.push({
    etiket: `Tebligat (${input.tarafSayisi} taraf)`,
    tutar: round2(tebligatToplam),
    aciklama: input.apsTebligat ? "APS ile ivedi tebligat" : "Standart tebligat",
  });

  if (input.bilirkisiGerekli) {
    giderKalemleri.push({
      etiket: "Bilirkişi Ücreti",
      tutar: HARC_SABITLERI.bilirkisiOrtalama,
      aciklama: "Ortalama — dosya zorluğuna göre değişir.",
    });
  }

  if (input.kesifGerekli) {
    giderKalemleri.push({
      etiket: "Keşif Ücreti",
      tutar: HARC_SABITLERI.kesifOrtalama,
      aciklama: "Ortalama — yol ve konuta bağlı olarak değişir.",
    });
  }

  if (input.tanikSayisi > 0) {
    giderKalemleri.push({
      etiket: `Tanık Tazminatı (${input.tanikSayisi} kişi)`,
      tutar: HARC_SABITLERI.tanikTazminati * input.tanikSayisi,
    });
  }

  giderKalemleri.push({
    etiket: "Posta ve Müzekkere",
    tutar: HARC_SABITLERI.postaMuzekkere,
    aciklama: "Gider avansı tarifesine göre standart tutar.",
  });

  const toplamGiderAvansi = giderKalemleri.reduce((sum, k) => sum + k.tutar, 0);

  aciklamalar.push(
    "Bu tutarlar 492 sayılı Harçlar Kanunu ve güncel Gider Avansı Tarifesi'ne dayanır. Güncel tarife için UYAP harç tahsil bildirimini kontrol ediniz.",
  );

  return {
    basvurmaHarci,
    pesinHarc,
    nispiKararIlamHarci,
    vekaletHarci,
    toplamHarc: round2(toplamHarc),
    giderAvansiKalemleri: giderKalemleri,
    toplamGiderAvansi: round2(toplamGiderAvansi),
    toplamOdeme: round2(toplamHarc + toplamGiderAvansi),
    aciklamalar,
  };
};
