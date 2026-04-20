/**
 * İşçilik alacakları hesaplama — MODÜL 1-9 implementasyonu.
 * Formüller hukuk başasistanı CLAUDE.md'sinde tanımlanmıştır.
 *
 * Pure function — dışarıdan girdi alır, deterministik sonuç üretir.
 * UI bağlantısı yoktur, kolayca test edilebilir.
 */

import {
  DAMGA_VERGISI_ORAN,
  SGK_ISSIZLIK_TOPLAM,
  hesaplaKademeliGelirVergisi,
} from "@/lib/calculator-data/gelir-vergisi-dilimleri";
import { findKidemTavanForDate } from "@/lib/calculator-data/kidem-tavanlari";
import { getUbgtGunForYear } from "@/lib/calculator-data/ubgt-gunleri";
import { getYemekIstisnasiForYear } from "@/lib/calculator-data/yemek-istisnasi";

// -----------------------------
// Tipler
// -----------------------------

export type FesihNedeni = "isveren_haksiz" | "isci_hakli" | "ikale" | "istifa";

export type IscilikInput = {
  iseGiris: string; // YYYY-MM-DD
  istenCikis: string; // YYYY-MM-DD
  sonNetUcret: number;
  fesihNedeni: FesihNedeni;

  // Ek ödemeler (aylık, net)
  yemekAylik?: number;
  servisAylik?: number;
  ikramiyeAylik?: number;
  primAylik?: number;
  digerAylik?: number;

  // Yıllık izin
  toplamIzinHakki?: number;
  kullandirilmisIzin?: number;

  // Fazla mesai
  fazlaMesaiHaftalikSaat?: number;

  // UBGT yılları
  ubgtYillari?: number[];

  // Hafta tatili
  haftaTatiliHaftalikGun?: number;
  haftaTatiliHaftaSayisi?: number;

  // Ödenmemiş ücret alacağı (net)
  ucretAlacagi?: number;

  // İşe iade
  iseIadeTalep?: boolean;
  iseBaslamamaKatsayi?: number; // 4-8 ay
};

export type AlacakKalemi = {
  brut: number;
  net: number;
  aciklama?: string;
};

export type IscilikResult = {
  hizmetSuresi: { yil: number; ay: number; gun: number; toplamGun: number };
  brutNetKatsayi: number;
  brutUcret: number;
  giydirilmisBrut: number;

  kidem: AlacakKalemi & { tavanaTakildi: boolean; esasUcret: number };
  ihbar: AlacakKalemi & { onelHafta: number };
  fazlaMesai?: AlacakKalemi;
  ubgt?: AlacakKalemi;
  haftaTatili?: AlacakKalemi;
  yillikIzin?: AlacakKalemi & { bakiyeGun: number };
  ucretAlacagi?: AlacakKalemi;
  iseIade?: {
    tazminat: AlacakKalemi;
    bostaGecen: AlacakKalemi;
  };

  toplamBrut: number;
  toplamNet: number;
  uyarilar: string[];
};

// -----------------------------
// Yardımcılar
// -----------------------------

const parseDate = (iso: string): Date => {
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Geçersiz tarih: ${iso}`);
  }
  return d;
};

const diffInDays = (start: Date, end: Date): number => {
  const MS = 24 * 60 * 60 * 1000;
  return Math.floor((end.getTime() - start.getTime()) / MS);
};

const round2 = (n: number): number => Math.round(n * 100) / 100;

// Hizmet süresi: yıl, ay, gün ayrıştırması (Excel DATEDIF mantığı)
const calcHizmetSuresi = (giris: Date, cikis: Date) => {
  let yil = cikis.getUTCFullYear() - giris.getUTCFullYear();
  let ay = cikis.getUTCMonth() - giris.getUTCMonth();
  let gun = cikis.getUTCDate() - giris.getUTCDate();

  if (gun < 0) {
    const prevMonth = new Date(Date.UTC(cikis.getUTCFullYear(), cikis.getUTCMonth(), 0));
    gun += prevMonth.getUTCDate();
    ay -= 1;
  }
  if (ay < 0) {
    ay += 12;
    yil -= 1;
  }
  const toplamGun = diffInDays(giris, cikis);
  return { yil, ay, gun: gun + 1, toplamGun };
};

// -----------------------------
// MODÜL 2: Ücret hesabı
// -----------------------------

// Sabit %15 gelir vergisi ile net→brüt katsayısı.
// 1 - 0.15 (SGK+iş) - 0.15*(1-0.15) (GV) - 0.00759 (damga) = 0.71491
const BRUT_NET_KATSAYI = 1 / (1 - SGK_ISSIZLIK_TOPLAM - 0.15 * (1 - SGK_ISSIZLIK_TOPLAM) - DAMGA_VERGISI_ORAN);

const netToBrut = (net: number): number => net * BRUT_NET_KATSAYI;

const yemekAylikBrut = (yemekAylik: number, cikisYili: number): number => {
  if (yemekAylik <= 0) return 0;
  const gunlukIstisna = getYemekIstisnasiForYear(cikisYili);
  // Aylık yemek istisnası: gunluk_istisna * 26 (aylık çalışma günü) / 2
  // Not: CLAUDE.md → "yıla_göre_istisna_tutarı / 2 x 26 gün". Ancak net hesapta
  // istisna tutarı gelir vergisinden düşürülür. Basitleştirilmiş yaklaşım:
  // Aylık yemek brüt kısmı = max(aylık_yemek - (istisna * 26), 0)
  const istisnaAylik = gunlukIstisna * 26;
  return Math.max(yemekAylik - istisnaAylik, 0);
};

// -----------------------------
// MODÜL 3: Kıdem tazminatı (dönem bazlı tavan)
// -----------------------------

type Donem = { start: Date; end: Date; };

const donemleriBol = (giris: Date, cikis: Date): Donem[] => {
  // Kıdem hesabı için dönemleri kıdem tavanı dönemlerine göre böl.
  // Her dönemde o döneme ait tavan uygulanır.
  const donemler: Donem[] = [];
  let cursor = new Date(giris);
  // Basit bölme: her yıl için 01.01 ve 01.07 dönüm noktaları.
  while (cursor < cikis) {
    const year = cursor.getUTCFullYear();
    const month = cursor.getUTCMonth(); // 0-based
    let sonrakiDonemBaslangic: Date;
    if (month < 6) {
      sonrakiDonemBaslangic = new Date(Date.UTC(year, 6, 1));
    } else {
      sonrakiDonemBaslangic = new Date(Date.UTC(year + 1, 0, 1));
    }
    const donemEnd = sonrakiDonemBaslangic < cikis ? sonrakiDonemBaslangic : cikis;
    donemler.push({ start: new Date(cursor), end: donemEnd });
    cursor = donemEnd;
  }
  return donemler;
};

const calcKidem = (
  giydirilmisBrut: number,
  giris: Date,
  cikis: Date,
  fesihNedeni: FesihNedeni,
): IscilikResult["kidem"] => {
  const toplamGun = diffInDays(giris, cikis);
  if (toplamGun < 365) {
    return {
      brut: 0,
      net: 0,
      tavanaTakildi: false,
      esasUcret: 0,
      aciklama: "Kıdem tazminatı için asgari 1 yıllık kıdem gereklidir (1475 s.K. m.14).",
    };
  }

  // İstifa ve ikale halinde kural: kural olarak kıdem ödenmez;
  // ancak istifa "haklı nedenle istifa" sayılırsa hak doğar. Burada sadece
  // genel bir uyarı ekliyor, hesaplamayı yine de üretiyoruz.
  const _ = fesihNedeni;

  // Dönemlere böl ve her dönem için kendi tavanına göre hesapla
  const donemler = donemleriBol(giris, cikis);
  let toplamBrut = 0;
  let tavanaTakildi = false;

  for (const d of donemler) {
    const donemGun = diffInDays(d.start, d.end);
    if (donemGun <= 0) continue;
    const tavan = findKidemTavanForDate(d.start);
    const esasUcret = Math.min(giydirilmisBrut, tavan.kidemTavan);
    if (giydirilmisBrut > tavan.kidemTavan) tavanaTakildi = true;
    // Günlük kıdem tazminatı: esasUcret / 365 (yıllık bir brüt ücret)
    const donemBrut = (esasUcret * donemGun) / 365;
    toplamBrut += donemBrut;
  }

  const damga = toplamBrut * DAMGA_VERGISI_ORAN;
  const net = toplamBrut - damga;

  // Hesabın "esas ücreti" son dönemdeki ücret
  const sonDonemTavan = findKidemTavanForDate(cikis);
  const sonEsasUcret = Math.min(giydirilmisBrut, sonDonemTavan.kidemTavan);

  return {
    brut: round2(toplamBrut),
    net: round2(net),
    tavanaTakildi,
    esasUcret: round2(sonEsasUcret),
  };
};

// -----------------------------
// MODÜL 4: İhbar tazminatı
// -----------------------------

const ihbarOnelGun = (toplamGun: number): number => {
  const yilCiroAsagi = toplamGun / 365;
  // 6 ay – 1,5 yıl → 2 hafta; 1,5 – 3 yıl → 4 hafta; 3 – 6 yıl → 6 hafta; 6+ → 8 hafta
  if (yilCiroAsagi < 0.5) return 0;
  if (yilCiroAsagi < 1.5) return 14;
  if (yilCiroAsagi < 3) return 28;
  if (yilCiroAsagi < 6) return 42;
  return 56;
};

const calcIhbar = (
  giydirilmisBrut: number,
  toplamGun: number,
  fesihNedeni: FesihNedeni,
): IscilikResult["ihbar"] => {
  const onelGun = ihbarOnelGun(toplamGun);
  if (onelGun === 0 || fesihNedeni === "istifa" || fesihNedeni === "ikale") {
    return { brut: 0, net: 0, onelHafta: onelGun / 7 };
  }
  const brut = (giydirilmisBrut / 30) * onelGun;
  const gv = brut * 0.15;
  const damga = brut * DAMGA_VERGISI_ORAN;
  const net = brut - gv - damga;
  return { brut: round2(brut), net: round2(net), onelHafta: onelGun / 7 };
};

// -----------------------------
// MODÜL 5-8: SGK + kademeli GV + damga ile bileşen hesabı
// -----------------------------

const calcKademeliBuNet = (brut: number, year: number): number => {
  const sgk = brut * SGK_ISSIZLIK_TOPLAM;
  const matrah = brut - sgk;
  const gv = hesaplaKademeliGelirVergisi(matrah, year);
  const damga = brut * DAMGA_VERGISI_ORAN;
  return brut - sgk - gv - damga;
};

const calcSabitGvNet = (brut: number): number => {
  const sgk = brut * SGK_ISSIZLIK_TOPLAM;
  const matrah = brut - sgk;
  const gv = matrah * 0.15;
  const damga = brut * DAMGA_VERGISI_ORAN;
  return brut - sgk - gv - damga;
};

const calcFazlaMesai = (
  brutUcret: number,
  haftalikSaat: number,
  haftaSayisi: number,
  year: number,
): AlacakKalemi => {
  if (haftalikSaat <= 0 || haftaSayisi <= 0) return { brut: 0, net: 0 };
  const saatlikUcret = brutUcret / 225; // 225 = aylık 45*5 (haftada 45 saat fiili)
  const brut = saatlikUcret * 1.5 * haftalikSaat * haftaSayisi;
  const net = calcKademeliBuNet(brut, year);
  return { brut: round2(brut), net: round2(net) };
};

const calcUbgt = (brutUcret: number, yillar: number[]): AlacakKalemi => {
  if (!yillar || yillar.length === 0) return { brut: 0, net: 0 };
  let toplamBrut = 0;
  let toplamNet = 0;
  for (const y of yillar) {
    const gun = getUbgtGunForYear(y);
    const brut = (brutUcret / 30) * gun;
    toplamBrut += brut;
    toplamNet += calcSabitGvNet(brut);
  }
  return { brut: round2(toplamBrut), net: round2(toplamNet) };
};

const calcHaftaTatili = (
  brutUcret: number,
  haftalikGun: number,
  haftaSayisi: number,
): AlacakKalemi => {
  if (haftalikGun <= 0 || haftaSayisi <= 0) return { brut: 0, net: 0 };
  const brut = (brutUcret / 30) * 1.5 * haftalikGun * haftaSayisi;
  const net = calcSabitGvNet(brut);
  return { brut: round2(brut), net: round2(net) };
};

const calcYillikIzin = (
  giydirilmisBrut: number,
  bakiyeGun: number,
): AlacakKalemi => {
  if (bakiyeGun <= 0) return { brut: 0, net: 0 };
  const brut = (giydirilmisBrut / 30) * bakiyeGun;
  const net = calcSabitGvNet(brut);
  return { brut: round2(brut), net: round2(net) };
};

// -----------------------------
// Ana fonksiyon
// -----------------------------

export const calculateIscilikAlacaklari = (input: IscilikInput): IscilikResult => {
  const uyarilar: string[] = [];

  if (input.sonNetUcret <= 0) {
    uyarilar.push("Son net ücret sıfır veya altında; hesaplama yapılamadı.");
  }

  const giris = parseDate(input.iseGiris);
  const cikis = parseDate(input.istenCikis);
  if (cikis <= giris) {
    uyarilar.push("İşten çıkış tarihi, işe giriş tarihinden büyük olmalıdır.");
  }

  const hizmet = calcHizmetSuresi(giris, cikis);
  const cikisYili = cikis.getUTCFullYear();

  // Brüt/Net: son ücret → brüt
  const brutUcret = netToBrut(input.sonNetUcret);

  // Giydirilmiş brüt (ek ödemeler dahil — ikramiye/prim net→brüt katsayısıyla düzeltildi)
  const yemekBrut = yemekAylikBrut(input.yemekAylik ?? 0, cikisYili);
  const servisBrut = netToBrut(input.servisAylik ?? 0);
  const ikramiyeBrut = netToBrut(input.ikramiyeAylik ?? 0);
  const primBrut = netToBrut(input.primAylik ?? 0);
  const digerBrut = netToBrut(input.digerAylik ?? 0);

  const giydirilmisBrut =
    brutUcret + yemekBrut + servisBrut + ikramiyeBrut + primBrut + digerBrut;

  // Kıdem
  const kidem = calcKidem(giydirilmisBrut, giris, cikis, input.fesihNedeni);
  if (kidem.tavanaTakildi) {
    uyarilar.push(
      "Giydirilmiş brüt ücret kıdem tazminatı tavanını aştığı için tavan uygulanmıştır.",
    );
  }
  if (input.fesihNedeni === "istifa") {
    uyarilar.push(
      "İstifa halinde kural olarak kıdem tazminatı ödenmez; yalnızca haklı nedenle istifada ödenir. Ödenmemiş alacak bulunuyorsa haklı fesih argümanı değerlendirilebilir.",
    );
  }
  if (input.fesihNedeni === "ikale") {
    uyarilar.push(
      "İkale sözleşmesi halinde kıdem/ihbar ödemesi sözleşme şartlarına bağlıdır.",
    );
  }

  // İhbar
  const ihbar = calcIhbar(giydirilmisBrut, hizmet.toplamGun, input.fesihNedeni);
  if (ihbar.brut === 0 && input.fesihNedeni === "isveren_haksiz" && hizmet.toplamGun >= 180) {
    uyarilar.push("İhbar tazminatı hesaplanamadı — ihbar öneli kontrol ediniz.");
  }

  // Fazla mesai
  let fazlaMesai: AlacakKalemi | undefined;
  if (input.fazlaMesaiHaftalikSaat && input.fazlaMesaiHaftalikSaat > 0) {
    // Hesap için: hizmet süresince toplam hafta sayısı. Zamanaşımı 5 yıl.
    const toplamHafta = Math.min(Math.floor(hizmet.toplamGun / 7), 52 * 5);
    fazlaMesai = calcFazlaMesai(
      brutUcret,
      input.fazlaMesaiHaftalikSaat,
      toplamHafta,
      cikisYili,
    );
    if (hizmet.toplamGun / 7 > 52 * 5) {
      uyarilar.push(
        "Fazla mesai talebinde 5 yıllık zamanaşımı uygulanmıştır (İş Kanunu m.32).",
      );
    }
  }

  // UBGT
  const ubgt = calcUbgt(brutUcret, input.ubgtYillari ?? []);

  // Hafta tatili
  let haftaTatili: AlacakKalemi | undefined;
  if (
    input.haftaTatiliHaftalikGun &&
    input.haftaTatiliHaftalikGun > 0 &&
    input.haftaTatiliHaftaSayisi &&
    input.haftaTatiliHaftaSayisi > 0
  ) {
    haftaTatili = calcHaftaTatili(
      brutUcret,
      input.haftaTatiliHaftalikGun,
      input.haftaTatiliHaftaSayisi,
    );
  }

  // Yıllık izin
  let yillikIzin: (AlacakKalemi & { bakiyeGun: number }) | undefined;
  if (
    input.toplamIzinHakki !== undefined &&
    input.kullandirilmisIzin !== undefined
  ) {
    const bakiyeGun = Math.max(input.toplamIzinHakki - input.kullandirilmisIzin, 0);
    const yi = calcYillikIzin(giydirilmisBrut, bakiyeGun);
    yillikIzin = { ...yi, bakiyeGun };
  }

  // Ücret alacağı (net→brüt geri çevirisi)
  let ucretAlacagi: AlacakKalemi | undefined;
  if (input.ucretAlacagi && input.ucretAlacagi > 0) {
    const brut = netToBrut(input.ucretAlacagi);
    const net = input.ucretAlacagi;
    ucretAlacagi = { brut: round2(brut), net: round2(net) };
  }

  // İşe iade
  let iseIade: IscilikResult["iseIade"];
  if (input.iseIadeTalep) {
    const katsayi = input.iseBaslamamaKatsayi ?? 4;
    if (katsayi < 4 || katsayi > 8) {
      uyarilar.push(
        "İşe başlatmama tazminatı 4-8 aylık brüt ücret aralığında takdir edilir (İş K. m.21).",
      );
    }
    const tazminatBrut = brutUcret * katsayi;
    const tazminatDamga = tazminatBrut * DAMGA_VERGISI_ORAN;
    const tazminatNet = tazminatBrut - tazminatDamga;

    const bostaBrut = brutUcret * 4;
    const bostaNet = calcSabitGvNet(bostaBrut);

    iseIade = {
      tazminat: { brut: round2(tazminatBrut), net: round2(tazminatNet) },
      bostaGecen: { brut: round2(bostaBrut), net: round2(bostaNet) },
    };
  }

  // Zamanaşımı uyarısı
  const bugun = new Date();
  const gecenGun = diffInDays(cikis, bugun);
  if (gecenGun > 365 * 5 - 180) {
    uyarilar.push(
      "Fesihten itibaren 5 yıllık zamanaşımı süresine yaklaşılmıştır (İş K. m.32, eklenti). Dava açma süresi kontrol edilmelidir.",
    );
  }

  // Toplam
  const toplamBrut =
    kidem.brut +
    ihbar.brut +
    (fazlaMesai?.brut ?? 0) +
    ubgt.brut +
    (haftaTatili?.brut ?? 0) +
    (yillikIzin?.brut ?? 0) +
    (ucretAlacagi?.brut ?? 0) +
    (iseIade ? iseIade.tazminat.brut + iseIade.bostaGecen.brut : 0);

  const toplamNet =
    kidem.net +
    ihbar.net +
    (fazlaMesai?.net ?? 0) +
    ubgt.net +
    (haftaTatili?.net ?? 0) +
    (yillikIzin?.net ?? 0) +
    (ucretAlacagi?.net ?? 0) +
    (iseIade ? iseIade.tazminat.net + iseIade.bostaGecen.net : 0);

  return {
    hizmetSuresi: hizmet,
    brutNetKatsayi: round2(BRUT_NET_KATSAYI),
    brutUcret: round2(brutUcret),
    giydirilmisBrut: round2(giydirilmisBrut),
    kidem,
    ihbar,
    fazlaMesai,
    ubgt: ubgt.brut > 0 ? ubgt : undefined,
    haftaTatili,
    yillikIzin,
    ucretAlacagi,
    iseIade,
    toplamBrut: round2(toplamBrut),
    toplamNet: round2(toplamNet),
    uyarilar,
  };
};
