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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCalculatorBySlug } from "@/lib/calculators-meta";
import { calculateFaiz, type FaizResult } from "@/lib/calculators/faiz";
import {
  FAIZ_TUR_LABELS,
  type FaizTuru,
} from "@/lib/calculator-data/faiz-oranlari";
import { formatCurrency } from "@/lib/format-currency";

const meta = getCalculatorBySlug("faiz")!;

const today = new Date().toISOString().slice(0, 10);

const FaizCalculator = () => {
  const [anapara, setAnapara] = useState<number>(0);
  const [baslangic, setBaslangic] = useState<string>("");
  const [bitis, setBitis] = useState<string>(today);
  const [faizTuru, setFaizTuru] = useState<FaizTuru>("yasal");
  const [ozelOran, setOzelOran] = useState<number>(0);
  const [result, setResult] = useState<FaizResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = calculateFaiz({
        anapara,
        baslangic,
        bitis,
        faizTuru,
        ozelOran: faizTuru === "ozel" ? ozelOran : undefined,
      });
      setResult(r);
      setTimeout(() => {
        document
          .getElementById("faiz-sonuc")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setAnapara(0);
    setBaslangic("");
    setBitis(today);
    setFaizTuru("yasal");
    setOzelOran(0);
    setResult(null);
  };

  return (
    <CalculatorLayout
      title={meta.title}
      shortTitle={meta.shortTitle}
      description={meta.description}
      canonicalPath="/hesaplamalar/faiz"
      seoTitle="Faiz Hesaplama 2026 — Yasal, Ticari, Özel Oran | Vega Hukuk"
      seoDescription="3095 sayılı Kanun kapsamında yasal faiz, TCMB avans oranı ile ticari temerrüt faizi veya özel oran üzerinden dönem kesişimli faiz hesaplama."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-primary-deep">
            Alacak Bilgileri
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Anapara, vade başlangıcı ve faiz türünü girin.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Anapara (TL)
              </label>
              <Input
                type="number"
                min={0}
                step="100"
                value={anapara}
                onChange={(e) => setAnapara(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Faiz türü
              </label>
              <Select value={faizTuru} onValueChange={(v) => setFaizTuru(v as FaizTuru)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FAIZ_TUR_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Başlangıç tarihi
              </label>
              <Input
                type="date"
                value={baslangic}
                onChange={(e) => setBaslangic(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Bitiş tarihi
              </label>
              <Input
                type="date"
                value={bitis}
                onChange={(e) => setBitis(e.target.value)}
                required
              />
            </div>

            {faizTuru === "ozel" ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Yıllık faiz oranı (%)
                </label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  value={ozelOran}
                  onChange={(e) => setOzelOran(Number(e.target.value))}
                />
              </div>
            ) : null}
          </div>
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
        <section id="faiz-sonuc" className="mt-10 space-y-6">
          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold text-primary-deep">
                Hesaplama Sonucu
              </h2>
            </div>
            <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Anapara
                </dt>
                <dd className="mt-1 text-xl font-bold text-primary-deep">
                  {formatCurrency(result.anapara)}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Toplam faiz
                </dt>
                <dd className="mt-1 text-xl font-bold text-primary-deep">
                  {formatCurrency(result.toplamFaiz)}
                </dd>
                <dd className="mt-1 text-xs text-muted-foreground">
                  {result.toplamGun} gün
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Toplam brüt alacak
                </dt>
                <dd className="mt-1 text-2xl font-bold text-primary-deep">
                  {formatCurrency(result.toplamBrut)}
                </dd>
              </div>
            </dl>
          </div>

          {result.donemler.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="border-b border-border bg-muted/30 px-5 py-3">
                <h3 className="font-display text-base font-semibold text-primary-deep">
                  Dönem Detayları
                </h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Başlangıç</TableHead>
                    <TableHead>Bitiş</TableHead>
                    <TableHead className="text-right">Oran (%)</TableHead>
                    <TableHead className="text-right">Gün</TableHead>
                    <TableHead className="text-right">Faiz</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.donemler.map((d, i) => (
                    <TableRow key={i}>
                      <TableCell>{d.start}</TableCell>
                      <TableCell>{d.end}</TableCell>
                      <TableCell className="text-right">{d.oran.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{d.gun}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(d.faiz)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}

          <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Faiz hesabı 3095 sayılı Kanun m.1-2 çerçevesinde dönem değişikliklerini
              dikkate alarak kümülatif hesaplanır. Kesin tutar mahkeme/icra müdürlüğünce
              belirlenir.
            </p>
          </div>
        </section>
      ) : null}
    </CalculatorLayout>
  );
};

export default FaizCalculator;
