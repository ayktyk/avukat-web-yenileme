import { Calculator, Scale, Gavel } from "lucide-react";
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
      "5275 sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun kapsamında koşullu salıverme ve denetimli serbestlik sürelerini hesaplayın.",
    icon: Gavel,
    status: "coming-soon",
    keywords: ["infaz hesaplama", "koşullu salıverme", "denetimli serbestlik"],
  },
];

export const getCalculatorBySlug = (slug: string): CalculatorMeta | undefined =>
  CALCULATORS.find((c) => c.slug === slug);
