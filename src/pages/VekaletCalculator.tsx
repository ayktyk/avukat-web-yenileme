import { useState } from "react";
import { Calculator, RotateCcw, CheckCircle2, Info } from "lucide-react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getCalculatorBySlug } from "@/lib/calculators-meta";
import { calculateVekaletUcreti, type VekaletResult } from "@/lib/calculators/vekalet";
import {
  AAUT_MAHKEME_LABELS,
  type AAUTMahkemeTuru,
} from "@/lib/calculator-data/aaut-2026";
import { formatCurrency } from "@/lib/format-currency";

const meta = getCalculatorBySlug("vekalet-ucreti")!;

const VekaletCalculator = () => {
  const [mahkemeTuru, setMahkemeTuru] = useState<AAUTMahkemeTuru>("asliye-hukuk");
  const [davaTuru, setDavaTuru] = useState<"nispi" | "maktu">("nispi");
  const [asama, setAsama] = useState<"karar" | "on-inceleme-oncesi">("karar");
  const [davaDegeri, setDavaDegeri] = useState<number>(0);
  const [seriDava, setSeriDava] = useState(false);
  const [result, setResult] = useState<VekaletResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = calculateVekaletUcreti({
        mahkemeTuru,
        davaTuru,
        asama,
        davaDegeri,
        seriDava,
      });
      setResult(r);
      setTimeout(() => {
        document
          .getElementById("vekalet-sonuc")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setMahkemeTuru("asliye-hukuk");
    setDavaTuru("nispi");
    setAsama("karar");
    setDavaDegeri(0);
    setSeriDava(false);
    setResult(null);
  };

  return (
    <CalculatorLayout
      title={meta.title}
      shortTitle={meta.shortTitle}
      description={meta.description}
      canonicalPath="/hesaplamalar/vekalet-ucreti"
      seoTitle="Vekalet Ücreti Hesaplama 2026 — AAÜT Tarifesi | Vega Hukuk İstanbul"
      seoDescription="Avukatlık Asgari Ücret Tarifesi (AAÜT) 2026 kapsamında nispi/maktu vekalet ücretini, mahkeme türü ve dava aşamasına göre hesaplayın."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-primary-deep">Dava Bilgileri</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Mahkeme türü, dava türü ve (nispi ise) dava değerini girin.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Mahkeme türü</label>
              <Select value={mahkemeTuru} onValueChange={(v) => setMahkemeTuru(v as AAUTMahkemeTuru)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AAUT_MAHKEME_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Dava türü</label>
              <Select value={davaTuru} onValueChange={(v) => setDavaTuru(v as "nispi" | "maktu")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nispi">Nispi (konusu para ile ölçülen)</SelectItem>
                  <SelectItem value="maktu">Maktu (konusu para ile ölçülmeyen)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Dava aşaması</label>
              <Select value={asama} onValueChange={(v) => setAsama(v as "karar" | "on-inceleme-oncesi")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="karar">Karar verilmiş</SelectItem>
                  <SelectItem value="on-inceleme-oncesi">Ön inceleme öncesi (1/2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {davaTuru === "nispi" ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Dava değeri (TL)</label>
                <Input
                  type="number"
                  min={0}
                  step="1000"
                  value={davaDegeri}
                  onChange={(e) => setDavaDegeri(Number(e.target.value))}
                />
              </div>
            ) : null}
          </div>

          <label className="mt-5 flex items-center gap-2">
            <Checkbox checked={seriDava} onCheckedChange={(v) => setSeriDava(Boolean(v))} />
            <span className="text-sm text-foreground">
              Seri dava indirimi (AAÜT m.22) — ücretin %50'si
            </span>
          </label>
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-[10px] border border-primary bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary-deep hover:shadow-elegant"
          >
            <Calculator className="h-4 w-4" />
            Hesapla
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary hover:text-primary"
          >
            <RotateCcw className="h-4 w-4" />
            Sıfırla
          </button>
        </div>
      </form>

      {result ? (
        <section id="vekalet-sonuc" className="mt-10 space-y-6">
          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold text-primary-deep">Hesaplama Sonucu</h2>
            </div>
            <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Uygulanan vekalet ücreti</dt>
                <dd className="mt-1 text-3xl font-bold text-primary-deep">
                  {formatCurrency(result.ucret)}
                </dd>
                <dd className="mt-1 text-xs text-muted-foreground">
                  Uygulanan: {result.uygulananTur === "maktu" ? "Maktu" : "Nispi"}
                </dd>
              </div>
              <div className="space-y-1 text-sm">
                <div>
                  Nispi kademeli hesap: <strong>{formatCurrency(result.nispiTutar)}</strong>
                </div>
                <div>
                  Maktu taban: <strong>{formatCurrency(result.maktuTutar)}</strong>
                </div>
                {result.asamaIndirimi ? (
                  <div className="text-muted-foreground">Ön inceleme öncesi (1/2) uygulandı.</div>
                ) : null}
                {result.seriIndirimi ? (
                  <div className="text-muted-foreground">Seri dava (%50) uygulandı.</div>
                ) : null}
              </div>
            </dl>
          </div>

          {result.aciklamalar.length > 0 ? (
            <ul className="space-y-2 rounded-2xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
              {result.aciklamalar.map((a, i) => (
                <li key={i}>• {a}</li>
              ))}
            </ul>
          ) : null}

          <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Hesap 2026 yılı için yayımlanan Avukatlık Asgari Ücret Tarifesi'ne (AAÜT) göre
              yapılır. Kesin tutar mahkeme kararı ve dosyaya özgü koşullara göre belirlenir.
            </p>
          </div>
        </section>
      ) : null}
    </CalculatorLayout>
  );
};

export default VekaletCalculator;
