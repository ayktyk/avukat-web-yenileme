/**
 * Kira Süreleri Hesaplama — TBK m.315-352
 *
 * Tahliye nedenine göre:
 *   - İhtar çekme son tarihi
 *   - Dava açma son tarihi
 *   - Fesih/tahliye tarihleri
 *   - İlgili TBK maddesi açıklamaları
 *
 * Ayrıca TÜFE üzerinden yıllık kira artış hesabı.
 */

import {
  getTahliyeNedeniByKey,
  type TahliyeNedeni,
} from "@/lib/calculator-data/tahliye-nedenleri";

export type KiraSureleriInput = {
  neden: TahliyeNedeni;
  kiraBaslangic: string; // YYYY-MM-DD
  kiraBitis?: string;
  tetikleyiciTarih?: string; // temerrüt, ihtar, tapu devri vb.
  taahutTarihi?: string;
  mevcutKira?: number;
  tufeOrani?: number; // % (TÜİK 12 aylık ortalama)
};

export type KiraAdim = {
  etiket: string;
  tarih: string;
  not?: string;
};

export type KiraSureleriResult = {
  madde: string;
  aciklama: string;
  adimlar: KiraAdim[];
  uyarilar: string[];
  yeniKira?: number;
};

const parseDate = (iso: string): Date => {
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) throw new Error(`Geçersiz tarih: ${iso}`);
  return d;
};

const formatISO = (d: Date): string => d.toISOString().slice(0, 10);
const formatTR = (d: Date): string => {
  const gun = String(d.getUTCDate()).padStart(2, "0");
  const ay = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yil = d.getUTCFullYear();
  return `${gun}.${ay}.${yil}`;
};

const addMonths = (d: Date, months: number): Date => {
  const next = new Date(d);
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
};

const addDays = (d: Date, days: number): Date => {
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

export const calculateKiraSureleri = (
  input: KiraSureleriInput,
): KiraSureleriResult => {
  const bilgi = getTahliyeNedeniByKey(input.neden);
  if (!bilgi) throw new Error(`Bilinmeyen tahliye nedeni: ${input.neden}`);

  const uyarilar: string[] = [];
  const adimlar: KiraAdim[] = [];

  const kiraBasDate = parseDate(input.kiraBaslangic);

  switch (input.neden) {
    case "konut-ihtiyaci": {
      const bitis = input.kiraBitis ? parseDate(input.kiraBitis) : null;
      if (!bitis) {
        uyarilar.push("Kira bitiş tarihi gereklidir.");
        break;
      }
      const ihtarSonTarih = addMonths(bitis, -3);
      const davaSonTarih = addMonths(bitis, 1);
      adimlar.push({
        etiket: "İhtar son tarihi",
        tarih: formatTR(ihtarSonTarih),
        not: "Sözleşme bitiminden en az 3 ay önce ihtarname gönderilmelidir.",
      });
      adimlar.push({
        etiket: "Kira bitiş tarihi",
        tarih: formatTR(bitis),
      });
      adimlar.push({
        etiket: "Dava açma son tarihi",
        tarih: formatTR(davaSonTarih),
        not: "Kira bitiminden itibaren 1 ay içinde dava açılmalıdır.",
      });
      break;
    }
    case "yeni-malik": {
      const iktisap = input.tetikleyiciTarih ? parseDate(input.tetikleyiciTarih) : null;
      const bitis = input.kiraBitis ? parseDate(input.kiraBitis) : null;
      if (!iktisap) {
        uyarilar.push("Tapu devir tarihi (iktisap) gereklidir.");
        break;
      }
      const ihtarSonTarih = addMonths(iktisap, 1);
      const erkenDavaTarihi = addMonths(iktisap, 6);
      adimlar.push({
        etiket: "Tapu devir tarihi",
        tarih: formatTR(iktisap),
      });
      adimlar.push({
        etiket: "İhtar son tarihi",
        tarih: formatTR(ihtarSonTarih),
        not: "İktisaptan itibaren 1 ay içinde kiracıya ihtarname gönderilmelidir.",
      });
      adimlar.push({
        etiket: "Dava açma süresi (erken yol)",
        tarih: formatTR(erkenDavaTarihi),
        not: "Tapu devrinden 6 ay sonra dava açılabilir.",
      });
      if (bitis) {
        const bitisDava = addMonths(bitis, 1);
        adimlar.push({
          etiket: "Dava açma süresi (geç yol)",
          tarih: formatTR(bitisDava),
          not: "Veya kira dönemi bitiminden itibaren 1 ay içinde.",
        });
      }
      break;
    }
    case "esasli-tadilat": {
      const bitis = input.kiraBitis ? parseDate(input.kiraBitis) : null;
      if (!bitis) {
        uyarilar.push("Kira bitiş tarihi gereklidir.");
        break;
      }
      adimlar.push({
        etiket: "Kira bitiş tarihi",
        tarih: formatTR(bitis),
      });
      adimlar.push({
        etiket: "Dava açma son tarihi",
        tarih: formatTR(addMonths(bitis, 1)),
        not: "Kira bitiminden itibaren 1 ay içinde.",
      });
      uyarilar.push(
        "Tadilat projesinin ruhsatlı/ciddi olduğu dosyada delillendirilmelidir.",
      );
      break;
    }
    case "tahliye-taahhut": {
      const taahut = input.taahutTarihi ? parseDate(input.taahutTarihi) : null;
      if (!taahut) {
        uyarilar.push("Tahliye taahhütname tarihi gereklidir.");
        break;
      }
      adimlar.push({
        etiket: "Taahhüt edilen tahliye tarihi",
        tarih: formatTR(taahut),
      });
      adimlar.push({
        etiket: "İcra/dava son tarihi",
        tarih: formatTR(addMonths(taahut, 1)),
        not: "Tahliye tarihinden itibaren 1 ay içinde.",
      });
      uyarilar.push(
        "Taahhütname, kira ilişkisi kurulduktan sonra ve kiracının serbest iradesiyle imzalanmış olmalıdır. Aksi halde geçersiz sayılabilir.",
      );
      break;
    }
    case "ayni-ilce-konut": {
      const bitis = input.kiraBitis ? parseDate(input.kiraBitis) : null;
      if (!bitis) {
        uyarilar.push("Kira bitiş tarihi gereklidir.");
        break;
      }
      adimlar.push({
        etiket: "Dava açma son tarihi",
        tarih: formatTR(addMonths(bitis, 1)),
        not: "Kira bitiminden itibaren 1 ay içinde.",
      });
      uyarilar.push(
        "Kiracının aynı ilçe sınırlarında oturmaya elverişli konut sahibi olduğu tapu kaydıyla ispatlanmalıdır.",
      );
      break;
    }
    case "iki-hakli-ihtar": {
      const bitis = input.kiraBitis ? parseDate(input.kiraBitis) : null;
      if (!bitis) {
        uyarilar.push("Kira dönemi bitiş tarihi gereklidir.");
        break;
      }
      adimlar.push({
        etiket: "İki ihtarın çekildiği dönem",
        tarih: formatTR(kiraBasDate) + " – " + formatTR(bitis),
      });
      adimlar.push({
        etiket: "Dava açma son tarihi",
        tarih: formatTR(addMonths(bitis, 1)),
        not: "Sonraki kira yılı bitiminden itibaren 1 ay içinde.",
      });
      uyarilar.push(
        "İki ihtarın kira bedelinin ödenmemesi nedeniyle çekilmiş ve haklı olması şarttır.",
      );
      break;
    }
    case "10-yillik-uzama": {
      const bitis = input.kiraBitis ? parseDate(input.kiraBitis) : null;
      if (!bitis) {
        uyarilar.push("Kira dönemi bitiş tarihi gereklidir.");
        break;
      }
      const ihtarSon = addMonths(bitis, -3);
      adimlar.push({
        etiket: "İhtar son tarihi",
        tarih: formatTR(ihtarSon),
        not: "Kira dönemi bitiminden en az 3 ay önce.",
      });
      adimlar.push({
        etiket: "Fesih/tahliye tarihi",
        tarih: formatTR(bitis),
      });
      break;
    }
    case "kira-odememe": {
      const tetik = input.tetikleyiciTarih ? parseDate(input.tetikleyiciTarih) : null;
      if (!tetik) {
        uyarilar.push("Temerrüt tarihi gereklidir.");
        break;
      }
      const ihtarSure = addDays(tetik, 30);
      adimlar.push({
        etiket: "Temerrüt tarihi",
        tarih: formatTR(tetik),
      });
      adimlar.push({
        etiket: "İhtar süresi sonu (30 gün)",
        tarih: formatTR(ihtarSure),
        not: "İhtardan sonra 30 gün içinde ödeme yapılmazsa fesih hakkı doğar.",
      });
      break;
    }
    case "ozenle-kullanma":
    case "komsulara-saygisizlik": {
      const tetik = input.tetikleyiciTarih ? parseDate(input.tetikleyiciTarih) : null;
      if (!tetik) {
        uyarilar.push("İhtar çekilme tarihi gereklidir.");
        break;
      }
      adimlar.push({
        etiket: "İhtar tarihi",
        tarih: formatTR(tetik),
      });
      adimlar.push({
        etiket: "Düzelme süresi sonu (30 gün)",
        tarih: formatTR(addDays(tetik, 30)),
        not: "30 gün içinde düzelmezse fesih mümkündür.",
      });
      break;
    }
    case "kira-artis": {
      if (!input.mevcutKira || !input.tufeOrani) {
        uyarilar.push("Mevcut kira tutarı ve 12 aylık TÜFE ortalama oranı gereklidir.");
        break;
      }
      const artisOrani = Math.max(0, input.tufeOrani);
      const yeniKira = input.mevcutKira * (1 + artisOrani / 100);
      adimlar.push({
        etiket: "Mevcut kira",
        tarih: input.mevcutKira.toLocaleString("tr-TR") + " TL",
      });
      adimlar.push({
        etiket: "TÜFE ortalama (12 aylık)",
        tarih: "%" + artisOrani.toFixed(2),
      });
      adimlar.push({
        etiket: "Yeni kira (TBK m.344 tavan)",
        tarih: yeniKira.toLocaleString("tr-TR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " TL",
        not: "Bu tutar yasal üst sınırdır; kiracı ile aşağısı kararlaştırılabilir.",
      });
      return {
        madde: bilgi.madde,
        aciklama: bilgi.aciklama,
        adimlar,
        uyarilar,
        yeniKira: Math.round(yeniKira * 100) / 100,
      };
    }
  }

  return {
    madde: bilgi.madde,
    aciklama: bilgi.aciklama,
    adimlar,
    uyarilar,
  };
};
