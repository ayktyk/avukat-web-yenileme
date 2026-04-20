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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCalculatorBySlug } from "@/lib/calculators-meta";
import { calculateHarc, type HarcResult } from "@/lib/calculators/harc";
import { formatCurrency } from "@/lib/format-currency";

const meta = getCalculatorBySlug("harc")!;

const HarcCalculator = () => {
  const [davaTuru, setDavaTuru] = useState<"nispi" | "maktu">("nispi");
  const [davaDegeri, setDavaDegeri] = useState<number>(0);
  const [tarafSayisi, setTarafSayisi] = useState<number>(2);
  const [tanikSayisi, setTanikSayisi] = useState<number>(0);
  const [bilirkisiGerekli, setBilirkisiGerekli] = useState(false);
  const [kesifGerekli, setKesifGerekli] = useState(false);
  const [apsTebligat, setApsTebligat] = useState(false);
  const [result, setResult] = useState<HarcResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = calculateHarc({
        davaTuru,
        davaDegeri,
        tarafSayisi,
        tanikSayisi,
        bilirkisiGerekli,
        kesifGerekli,
        apsTebligat,
      });
      setResult(r);
      setTimeout(() => {
        document
          .getElementById("harc-sonuc")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setDavaTuru("nispi");
    setDavaDegeri(0);
    setTarafSayisi(2);
    setTanikSayisi(0);
    setBilirkisiGerekli(false);
    setKesifGerekli(false);
    setApsTebligat(false);
    setResult(null);
  };

  return (
    <CalculatorLayout
      title={meta.title}
      shortTitle={meta.shortTitle}
      description={meta.description}
      canonicalPath="/hesaplamalar/harc"
      seoTitle="Harç ve Gider Avansı Hesaplama 2026 — 492 s.K. | Vega Hukuk"
      seoDescription="492 sayılı Harçlar Kanunu ve güncel Gider Avansı Tarifesi kapsamında başvurma harcı, peşin harç, vekalet ve gider avansını bir arada hesaplayın."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-primary-deep">
            Dava Bilgileri
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Dava türü
              </label>
              <Select
                value={davaTuru}
                onValueChange={(v) => setDavaTuru(v as "nispi" | "maktu")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nispi">Nispi (konusu para ile ölçülen)</SelectItem>
                  <SelectItem value="maktu">Maktu (konusu para ile ölçülmeyen)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {davaTuru === "nispi" ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Dava değeri (TL)
                </label>
                <Input
                  type="number"
                  min={0}
                  step="1000"
                  value={davaDegeri}
                  onChange={(e) => setDavaDegeri(Number(e.target.value))}
                />
              </div>
            ) : null}

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Taraf sayısı
              </label>
              <Input
                type="number"
                min={1}
                step="1"
                value={tarafSayisi}
                onChange={(e) => setTarafSayisi(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Tanık sayısı
              </label>
              <Input
                type="number"
                min={0}
                step="1"
                value={tanikSayisi}
                onChange={(e) => setTanikSayisi(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={bilirkisiGerekli}
                onCheckedChange={(v) => setBilirkisiGerekli(Boolean(v))}
              />
              <span className="text-sm text-foreground">
                Bilirkişi incelemesi gerekli
              </span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={kesifGerekli}
                onCheckedChange={(v) => setKesifGerekli(Boolean(v))}
              />
              <span className="text-sm text-foreground">Keşif gerekli</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={apsTebligat}
                onCheckedChange={(v) => setApsTebligat(Boolean(v))}
              />
              <span className="text-sm text-foreground">
                APS ile ivedi tebligat istenecek
              </span>
            </label>
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
        <section id="harc-sonuc" className="mt-10 space-y-6">
          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold text-primary-deep">
                Toplam Ödeme
              </h2>
            </div>
            <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Toplam harç
                </dt>
                <dd className="mt-1 text-xl font-bold text-primary-deep">
                  {formatCurrency(result.toplamHarc)}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Gider avansı
                </dt>
                <dd className="mt-1 text-xl font-bold text-primary-deep">
                  {formatCurrency(result.toplamGiderAvansi)}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Toplam ödeme
                </dt>
                <dd className="mt-1 text-2xl font-bold text-primary-deep">
                  {formatCurrency(result.toplamOdeme)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="border-b border-border bg-muted/30 px-5 py-3">
              <h3 className="font-display text-base font-semibold text-primary-deep">
                Harç Kalemleri
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kalem</TableHead>
                  <TableHead>Açıklama</TableHead>
                  <TableHead className="text-right">Tutar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[result.basvurmaHarci, result.pesinHarc, result.vekaletHarci].map(
                  (k, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{k.etiket}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {k.aciklama ?? "—"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(k.tutar)}
                      </TableCell>
                    </TableRow>
                  ),
                )}
                {davaTuru === "nispi" ? (
                  <TableRow className="bg-muted/20">
                    <TableCell className="font-medium">
                      {result.nispiKararIlamHarci.etiket}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {result.nispiKararIlamHarci.aciklama ?? "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(result.nispiKararIlamHarci.tutar)}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="border-b border-border bg-muted/30 px-5 py-3">
              <h3 className="font-display text-base font-semibold text-primary-deep">
                Gider Avansı Kalemleri
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kalem</TableHead>
                  <TableHead>Açıklama</TableHead>
                  <TableHead className="text-right">Tutar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.giderAvansiKalemleri.map((k, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{k.etiket}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {k.aciklama ?? "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(k.tutar)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
              Harç tarifeleri 492 sayılı Kanun ve güncel tebliğlere göre hesaplanır.
              Kesin tutar için UYAP harç tahsil bildirimini kontrol ediniz.
            </p>
          </div>
        </section>
      ) : null}
    </CalculatorLayout>
  );
};

export default HarcCalculator;
