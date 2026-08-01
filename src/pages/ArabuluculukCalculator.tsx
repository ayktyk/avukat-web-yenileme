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
import {
  calculateArabulucuUcreti,
  type ArabulucuResult,
} from "@/lib/calculators/arabuluculuk";
import {
  ARABULUCU_TUR_LABELS,
  type ArabulucuTur,
} from "@/lib/calculator-data/arabuluculuk-tarifesi";
import { formatCurrency } from "@/lib/format-currency";

const meta = getCalculatorBySlug("arabuluculuk-ucreti")!;

const ArabuluculukCalculator = () => {
  const [tur, setTur] = useState<ArabulucuTur>("isci-isveren");
  const [sure, setSure] = useState<number>(3);
  const [tarafSayisi, setTarafSayisi] = useState<"2" | "1">("2");
  const [anlasmaSaglandi, setAnlasmaSaglandi] = useState(false);
  const [uyusmazlikDegeri, setUyusmazlikDegeri] = useState<number>(0);
  const [result, setResult] = useState<ArabulucuResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = calculateArabulucuUcreti({
        tur,
        sure,
        tarafSayisi: tarafSayisi === "2" ? 2 : 1,
        anlasmaSaglandi,
        uyusmazlikDegeri,
      });
      setResult(r);
      setTimeout(() => {
        document
          .getElementById("arabuluculuk-sonuc")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setTur("isci-isveren");
    setSure(3);
    setTarafSayisi("2");
    setAnlasmaSaglandi(false);
    setUyusmazlikDegeri(0);
    setResult(null);
  };

  return (
    <CalculatorLayout
      title={meta.title}
      shortTitle={meta.shortTitle}
      description={meta.description}
      canonicalPath="/hesaplamalar/arabuluculuk-ucreti"
      seoTitle="Arabuluculuk Ücreti Hesaplama 2026 — Saatlik ve Nispi"
      seoDescription="Arabuluculuk Asgari Ücret Tarifesi'ne göre saatlik ve nispi arabuluculuk ücretini, KDV ve stopaj dahil net ödemeyi hesaplayın."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-primary-deep">
            Uyuşmazlık Bilgileri
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Uyuşmazlık türü, görüşme süresi ve taraf sayısını girin.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Uyuşmazlık türü
              </label>
              <Select value={tur} onValueChange={(v) => setTur(v as ArabulucuTur)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ARABULUCU_TUR_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Görüşme süresi (saat)
              </label>
              <Input
                type="number"
                min={1}
                step="1"
                value={sure}
                onChange={(e) => setSure(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Taraf sayısı
              </label>
              <Select
                value={tarafSayisi}
                onValueChange={(v) => setTarafSayisi(v as "2" | "1")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">İki taraf (yarı yarıya)</SelectItem>
                  <SelectItem value="1">Tek taraf (işveren öder)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {anlasmaSaglandi ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Uyuşmazlık değeri (TL)
                </label>
                <Input
                  type="number"
                  min={0}
                  step="1000"
                  value={uyusmazlikDegeri}
                  onChange={(e) => setUyusmazlikDegeri(Number(e.target.value))}
                />
              </div>
            ) : null}
          </div>

          <label className="mt-5 flex items-center gap-2">
            <Checkbox
              checked={anlasmaSaglandi}
              onCheckedChange={(v) => setAnlasmaSaglandi(Boolean(v))}
            />
            <span className="text-sm text-foreground">
              Anlaşma sağlandı (nispi ücret karşılaştırılır)
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
        <section id="arabuluculuk-sonuc" className="mt-10 space-y-6">
          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold text-primary-deep">
                Hesaplama Sonucu
              </h2>
            </div>
            <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Uygulanan arabuluculuk ücreti
                </dt>
                <dd className="mt-1 text-3xl font-bold text-primary-deep">
                  {formatCurrency(result.uygulananUcret)}
                </dd>
              </div>
              <div className="space-y-1 text-sm">
                <div>
                  Saatlik toplam: <strong>{formatCurrency(result.saatlikToplam)}</strong>
                </div>
                <div>
                  Nispi toplam: <strong>{formatCurrency(result.nispiToplam)}</strong>
                </div>
                <div className="pt-2 text-muted-foreground">
                  KDV (%20): <strong>{formatCurrency(result.kdv)}</strong>
                </div>
                <div className="text-muted-foreground">
                  Stopaj (%20): <strong>-{formatCurrency(result.stopaj)}</strong>
                </div>
                <div className="pt-2 font-semibold text-primary-deep">
                  Net ödeme: {formatCurrency(result.netOdeme)}
                </div>
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
              Hesap 2026 yılı Arabuluculuk Asgari Ücret Tarifesi'ne göredir. Kesin
              tutar arabulucu ile taraflar arasındaki anlaşmaya göre belirlenir.
            </p>
          </div>
        </section>
      ) : null}
    </CalculatorLayout>
  );
};

export default ArabuluculukCalculator;
