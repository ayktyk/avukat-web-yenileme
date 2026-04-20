import {
  Calculator,
  Scale,
  Gavel,
  Briefcase,
  Handshake,
  Percent,
  Coins,
  Home,
  Car,
} from "lucide-react";
import type { CalculatorMeta } from "@/types/calculator";

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: "iscilik-alacaklari",
    title: "İşçilik Alacakları Hesaplama",
    shortTitle: "İşçilik Alacakları",
    description:
      "Kıdem, ihbar, fazla mesai, ulusal bayram ve genel tatil, hafta tatili ve yıllık izin alacaklarını dönem bazlı tavan ve kademeli vergi kurallarıyla hesaplayın.",
    icon: Calculator,
    status: "active",
    keywords: [
      "kıdem tazminatı hesaplama",
      "ihbar tazminatı",
      "fazla mesai",
      "yıllık izin alacağı",
      "işçilik alacakları",
    ],
  },
  {
    slug: "vekalet-ucreti",
    title: "Vekalet Ücreti Hesaplama",
    shortTitle: "Vekalet Ücreti",
    description:
      "2026 yılı AAÜT tarifesine göre nispi ve maktu vekalet ücretini; mahkeme türü, dava aşaması ve seri dava indirimini dikkate alarak hesaplayın.",
    icon: Briefcase,
    status: "active",
    keywords: [
      "vekalet ücreti hesaplama",
      "AAÜT 2026",
      "avukatlık asgari ücret tarifesi",
      "nispi vekalet ücreti",
    ],
  },
  {
    slug: "arabuluculuk-ucreti",
    title: "Arabuluculuk Ücreti Hesaplama",
    shortTitle: "Arabuluculuk Ücreti",
    description:
      "Arabuluculuk Asgari Ücret Tarifesi uyarınca saatlik tarife ve nispi (uyuşmazlık değerine göre) ücretlerden yüksek olanı; KDV ve stopaj hesabıyla net ödenecek tutarı görün.",
    icon: Handshake,
    status: "active",
    keywords: [
      "arabuluculuk ücreti hesaplama",
      "arabulucu tarifesi",
      "nispi arabulucu ücreti",
      "stopaj KDV",
    ],
  },
  {
    slug: "faiz",
    title: "Faiz Hesaplama",
    shortTitle: "Faiz",
    description:
      "Yasal faiz (3095 SK m.1), ticari temerrüt faizi (TCMB avans oranı) veya özel faiz oranı üzerinden, dönem değişikliklerini dikkate alarak kümülatif faiz hesaplayın.",
    icon: Percent,
    status: "active",
    keywords: [
      "yasal faiz hesaplama",
      "ticari faiz",
      "temerrüt faizi",
      "TCMB avans oranı",
      "3095 sayılı Kanun",
    ],
  },
  {
    slug: "harc",
    title: "Harç ve Gider Avansı Hesaplama",
    shortTitle: "Harç",
    description:
      "492 sayılı Harçlar Kanunu ve güncel Gider Avansı Tarifesi kapsamında nispi/maktu harç, peşin harç, tebligat, bilirkişi ve posta giderlerini topluca hesaplayın.",
    icon: Coins,
    status: "active",
    keywords: [
      "harç hesaplama",
      "peşin harç",
      "başvurma harcı",
      "gider avansı",
      "492 sayılı Kanun",
    ],
  },
  {
    slug: "kira-sureleri",
    title: "Kira Süreleri ve Artış Hesaplama",
    shortTitle: "Kira Süreleri",
    description:
      "TBK m.315-352 kapsamındaki tahliye nedenleri için ihtar, dava açma ve fesih sürelerini; ayrıca TÜFE 12 aylık ortalamaya göre yıllık kira artış üst sınırını hesaplayın.",
    icon: Home,
    status: "active",
    keywords: [
      "kira tahliye süreleri",
      "kira artışı TÜFE",
      "TBK m.344",
      "tahliye taahhüdü",
      "iki haklı ihtar",
    ],
  },
  {
    slug: "kaza-tazminati",
    title: "Kaza (Maluliyet) Tazminatı Hesaplama",
    shortTitle: "Kaza Tazminatı",
    description:
      "Trafik ve iş kazalarında TRH2010 ömür tablosu ve %10 progresif rant yöntemiyle sürekli maluliyet tazminatını; aktif-pasif dönem ayrımı ve kusur indirimiyle hesaplayın.",
    icon: Car,
    status: "active",
    keywords: [
      "maluliyet tazminatı hesaplama",
      "kaza tazminatı",
      "progresif rant",
      "TRH2010",
      "destekten yoksun kalma",
    ],
  },
  {
    slug: "miras-payi",
    title: "Miras Payı Hesaplama",
    shortTitle: "Miras Payı",
    description:
      "Türk Medeni Kanunu zümre sistemine göre mirasçıların paylarını ve saklı pay oranlarını otomatik olarak hesaplayın.",
    icon: Scale,
    status: "coming-soon",
    keywords: ["miras payı", "TMK zümre", "saklı pay", "halefiyet"],
  },
  {
    slug: "infaz",
    title: "İnfaz Hesaplama",
    shortTitle: "İnfaz",
    description:
      "5275 sayılı Kanun ve 7242/7456 sayılı değişikliklere göre koşullu salıverilme, denetimli serbestlik, açık cezaevine ayrılma ve bihakkin tahliye tarihlerini hesaplayın.",
    icon: Gavel,
    status: "active",
    keywords: [
      "infaz hesaplama",
      "koşullu salıverilme",
      "denetimli serbestlik",
      "5275 sayılı Kanun",
      "7456 sayılı Kanun",
    ],
  },
];

export const getCalculatorBySlug = (slug: string): CalculatorMeta | undefined =>
  CALCULATORS.find((c) => c.slug === slug);
