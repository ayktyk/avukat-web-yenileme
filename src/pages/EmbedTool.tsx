import { lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "@/components/Seo";

const calculatorLoaders: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  "iscilik-alacaklari": () => import("./IscilikCalculator"),
  "vekalet-ucreti": () => import("./VekaletCalculator"),
  "arabuluculuk-ucreti": () => import("./ArabuluculukCalculator"),
  faiz: () => import("./FaizCalculator"),
  harc: () => import("./HarcCalculator"),
  "kira-sureleri": () => import("./KiraSureleriCalculator"),
  "kaza-tazminati": () => import("./KazaTazminatiCalculator"),
  "miras-payi": () => import("./MirasCalculator"),
  infaz: () => import("./InfazCalculator"),
};

const EmbedTool = () => {
  const { tool } = useParams<{ tool: string }>();
  const loader = tool ? calculatorLoaders[tool] : undefined;

  if (!loader) {
    return (
      <main className="min-h-screen bg-background">
        <Seo
          title="Hesaplama aracı bulunamadı | Vega Hukuk İstanbul"
          description="Aradığınız hesaplama aracı bulunamadı. Mevcut araçlar için tam liste."
          canonicalPath="/embed"
          noindex
        />
        <section className="section-container py-12">
          <h1 className="font-display text-2xl font-bold text-primary-deep">Araç bulunamadı</h1>
          <p className="mt-3 max-w-[60ch] text-sm text-muted-foreground">
            Belirtilen embed aracı yüklenemedi. Tüm hesaplama araçları için ana siteyi ziyaret edin.
          </p>
          <Link
            to="/hesaplamalar"
            className="mt-5 inline-flex rounded-[10px] border border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-deep"
          >
            Hesaplama araçları
          </Link>
        </section>
      </main>
    );
  }

  const CalculatorComponent = lazy(loader);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Hesaplama aracı yükleniyor…</p>
        </div>
      }
    >
      <CalculatorComponent />
    </Suspense>
  );
};

export default EmbedTool;
