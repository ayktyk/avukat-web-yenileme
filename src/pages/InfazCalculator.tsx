import { Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import { getCalculatorBySlug } from "@/lib/calculators-meta";

const meta = getCalculatorBySlug("infaz")!;

const InfazCalculator = () => {
  return (
    <CalculatorLayout
      title={meta.title}
      shortTitle={meta.shortTitle}
      description={meta.description}
      canonicalPath="/hesaplamalar/infaz"
      seoTitle="İnfaz Hesaplama — 5275 Sayılı Kanun | Vega Hukuk İstanbul"
      seoDescription="5275 sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun kapsamında koşullu salıverme ve denetimli serbestlik sürelerini hesaplayan araç yakında."
    >
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold text-primary-deep">Yakında</h2>
        <p className="mx-auto mt-2 max-w-prose text-muted-foreground">
          İnfaz hesaplama aracı üzerinde çalışıyoruz. Koşullu salıverme, denetimli
          serbestlik ve güncel mevzuat değişikliklerini dikkate alan bu araç yakında
          yayında olacak.
        </p>
        <Link
          to="/hesaplamalar"
          className="mt-6 inline-flex items-center gap-2 rounded-[10px] border border-border bg-background px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Hesaplamalara dön
        </Link>
      </div>
    </CalculatorLayout>
  );
};

export default InfazCalculator;
