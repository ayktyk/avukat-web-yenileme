import { Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import { getCalculatorBySlug } from "@/lib/calculators-meta";

const meta = getCalculatorBySlug("miras-payi")!;

const MirasCalculator = () => {
  return (
    <CalculatorLayout
      title={meta.title}
      shortTitle={meta.shortTitle}
      description={meta.description}
      canonicalPath="/hesaplamalar/miras-payi"
      seoTitle="Miras Payı Hesaplama 2026 — TMK Zümre Sistemi | Vega Hukuk"
      seoDescription="Türk Medeni Kanunu zümre sistemine göre mirasçıların paylarını ve saklı pay oranlarını otomatik hesaplayan araç yakında yayında."
    >
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold text-primary-deep">Yakında</h2>
        <p className="mx-auto mt-2 max-w-prose text-muted-foreground">
          Miras payı hesaplama aracı üzerinde çalışıyoruz. Türk Medeni Kanunu zümre
          sistemine ve saklı pay kurallarına uygun, ağaç yapısında mirasçı girişine izin
          veren bu araç yakında yayında olacak.
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

export default MirasCalculator;
