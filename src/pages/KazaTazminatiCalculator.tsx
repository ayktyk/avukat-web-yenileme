import { useState } from "react";
import { Calculator, RotateCcw, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCalculatorBySlug } from "@/lib/calculators-meta";
import {
  calculateKazaTazminati,
  type KazaResult,
  type Cinsiyet,
} from "@/lib/calculators/kaza-tazminati";
import { formatCurrency } from "@/lib/format-currency";

const meta = getCalculatorBySlug("kaza-tazminati")!;

const KazaTazminatiCalculator = () => {
  const [dogum, setDogum] = useState<string>("");
  const [kaza, setKaza] = useState<string>("");
  const [cinsiyet, setCinsiyet] = useState<Cinsiyet>("E");
  const [maluliyetOrani, setMaluliyetOrani] = useState<number>(0);
  const [kusurOrani, setKusurOrani] = useState<number>(0);
  const [aylikGelir, setAylikGelir] = useState<number>(0);
  const [asgariUcret, setAsgariUcret] = useState<number>(33030);
  const [result, setResult] = useState<KazaResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = calculateKazaTazminati({
        dogum,
        kaza,
        cinsiyet,
        maluliyetOrani,
        kusurOrani,
        aylikGelir,
        asgariUcret,
      });
      setResult(r);
      setTimeout(() => {
        document
          .getElementById("kaza-sonuc")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setDogum("");
    setKaza("");
    setCinsiyet("E");
    setMaluliyetOrani(0);
    setKusurOrani(0);
    setAylikGelir(0);
    setAsgariUcret(33030);
    setResult(null);
  };

  return (
    <CalculatorLayout
      title={meta.title}
      shortTitle={meta.shortTitle}
      description={meta.description}
      canonicalPath="/hesaplamalar/kaza-tazminati"
      seoTitle="Kaza (Maluliyet) Tazminatı Hesaplama 2026 — Progresif Rant | Vega Hukuk"
      seoDescription="Trafik ve iş kazalarında TRH2010 ömür tablosu ve %10 progresif rant yöntemiyle sürekli maluliyet tazminatını; aktif-pasif dönem ve kusur indirimiyle hesaplayın."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-primary-deep">
            Mağdur Bilgileri
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Doğum tarihi
              </label>
              <Input
                type="date"
                value={dogum}
                onChange={(e) => setDogum(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Kaza tarihi
              </label>
              <Input
                type="date"
                value={kaza}
                onChange={(e) => setKaza(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Cinsiyet
              </label>
              <Select value={cinsiyet} onValueChange={(v) => setCinsiyet(v as Cinsiyet)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="E">Erkek (ömür 74.2)</SelectItem>
                  <SelectItem value="K">Kadın (ömür 79.1)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Aylık gelir (TL)
              </label>
              <Input
                type="number"
                min={0}
                step="100"
                value={aylikGelir}
                onChange={(e) => setAylikGelir(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Maluliyet oranı (%)
              </label>
              <Input
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={maluliyetOrani}
                onChange={(e) => setMaluliyetOrani(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Müteveffanın kusur oranı (%)
              </label>
              <Input
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={kusurOrani}
                onChange={(e) => setKusurOrani(Number(e.target.value))}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">
                Aylık brüt asgari ücret (TL) — pasif dönem için
              </label>
              <Input
                type="number"
                min={0}
                step="1"
                value={asgariUcret}
                onChange={(e) => setAsgariUcret(Number(e.target.value))}
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                2026/I yarıyıl için 33.030 TL.
              </p>
            </div>
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
        <section id="kaza-sonuc" className="mt-10 space-y-6">
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
                  Kusur indirimi sonrası tazminat
                </dt>
                <dd className="mt-1 text-3xl font-bold text-primary-deep">
                  {formatCurrency(result.kusurluTazminat)}
                </dd>
                <dd className="mt-1 text-xs text-muted-foreground">
                  Brüt toplam: {formatCurrency(result.toplamTazminat)}
                </dd>
              </div>
              <div className="space-y-1 text-sm">
                <div>
                  Yaş: <strong>{result.yas}</strong>
                </div>
                <div>
                  Ortalama ömür: <strong>{result.ortalamOmur}</strong>
                </div>
                <div>
                  Bakiye ömür: <strong>{result.bakiyeOmur} yıl</strong>
                </div>
                <div>
                  Aktif dönem: <strong>{result.calismaSuresi} yıl</strong>
                </div>
                <div>
                  Pasif dönem: <strong>{result.pasifDonem} yıl</strong>
                </div>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Aktif dönem tazminatı
              </div>
              <div className="mt-1 text-xl font-bold text-primary-deep">
                {formatCurrency(result.aktiveTazminat)}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Çalışma süresi boyunca aylık gelir üzerinden, %10 artış/%10 iskonto.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Pasif dönem tazminatı
              </div>
              <div className="mt-1 text-xl font-bold text-primary-deep">
                {formatCurrency(result.pasifTazminat)}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                65 yaş sonrası asgari ücret üzerinden, %10 iskonto.
              </p>
            </div>
          </div>

          {result.uyarilar.length > 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-center gap-2 text-amber-900">
                <AlertTriangle className="h-4 w-4" />
                <h3 className="font-display text-base font-semibold">Uyarılar</h3>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-amber-800">
                {result.uyarilar.map((u, i) => (
                  <li key={i}>• {u}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Hesap TRH2010 ömür tablosu ve %10 progresif rant esasına dayanır. Mahkeme,
              aktüer bilirkişi raporuna göre farklı iskonto/artış oranları uygulayabilir.
            </p>
          </div>
        </section>
      ) : null}
    </CalculatorLayout>
  );
};

export default KazaTazminatiCalculator;
