import { useState } from "react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import IscilikForm, {
  mapFormToInput,
  type IscilikFormValues,
} from "@/components/calculators/IscilikForm";
import IscilikResultView from "@/components/calculators/IscilikResult";
import { getCalculatorBySlug } from "@/lib/calculators-meta";
import {
  calculateIscilikAlacaklari,
  type IscilikResult,
} from "@/lib/calculators/iscilik";

const meta = getCalculatorBySlug("iscilik-alacaklari")!;

const IscilikCalculator = () => {
  const [result, setResult] = useState<IscilikResult | null>(null);

  const handleSubmit = (values: IscilikFormValues) => {
    try {
      const input = mapFormToInput(values);
      const r = calculateIscilikAlacaklari(input);
      setResult(r);
      // Sonuca kaydır
      setTimeout(() => {
        const el = document.getElementById("iscilik-sonuc");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (e) {
      console.error("İşçilik hesaplama hatası", e);
      setResult(null);
    }
  };

  const handleReset = () => setResult(null);

  return (
    <CalculatorLayout
      title={meta.title}
      shortTitle={meta.shortTitle}
      description={meta.description}
      canonicalPath="/hesaplamalar/iscilik-alacaklari"
      seoTitle="İşçilik Alacakları Hesaplama 2026 — Kıdem, İhbar, Fazla Mesai | Vega Hukuk"
      seoDescription="Kıdem tazminatı, ihbar tazminatı, fazla mesai, UBGT, hafta tatili ve yıllık izin alacaklarını dönem bazlı tavan ve kademeli vergi kurallarıyla hesaplayın."
    >
      <IscilikForm onSubmit={handleSubmit} onReset={handleReset} />
      {result ? (
        <div id="iscilik-sonuc">
          <IscilikResultView result={result} />
        </div>
      ) : null}
    </CalculatorLayout>
  );
};

export default IscilikCalculator;
