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
  calculateKiraSureleri,
  type KiraSureleriResult,
} from "@/lib/calculators/kira-sureleri";
import {
  TAHLIYE_NEDENLERI,
  type TahliyeNedeni,
} from "@/lib/calculator-data/tahliye-nedenleri";
import { formatCurrency } from "@/lib/format-currency";

const meta = getCalculatorBySlug("kira-sureleri")!;

const KiraSureleriCalculator = () => {
  const [neden, setNeden] = useState<TahliyeNedeni>("konut-ihtiyaci");
  const [kiraBaslangic, setKiraBaslangic] = useState<string>("");
  const [kiraBitis, setKiraBitis] = useState<string>("");
  const [tetikleyiciTarih, setTetikleyiciTarih] = useState<string>("");
  const [taahutTarihi, setTaahutTarihi] = useState<string>("");
  const [mevcutKira, setMevcutKira] = useState<number>(0);
  const [tufeOrani, setTufeOrani] = useState<number>(0);
  const [result, setResult] = useState<KiraSureleriResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = calculateKiraSureleri({
        neden,
        kiraBaslangic,
        kiraBitis: kiraBitis || undefined,
        tetikleyiciTarih: tetikleyiciTarih || undefined,
        taahutTarihi: taahutTarihi || undefined,
        mevcutKira: mevcutKira || undefined,
        tufeOrani: tufeOrani || undefined,
      });
      setResult(r);
      setTimeout(() => {
        document
          .getElementById("kira-sonuc")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setNeden("konut-ihtiyaci");
    setKiraBaslangic("");
    setKiraBitis("");
    setTetikleyiciTarih("");
    setTaahutTarihi("");
    setMevcutKira(0);
    setTufeOrani(0);
    setResult(null);
  };

  const isKiraArtis = neden === "kira-artis";
  const needsTetikleyici =
    neden === "yeni-malik" ||
    neden === "kira-odememe" ||
    neden === "ozenle-kullanma" ||
    neden === "komsulara-saygisizlik";
  const needsTaahhut = neden === "tahliye-taahhut";
  const needsBitis =
    neden !== "kira-artis" &&
    neden !== "kira-odememe" &&
    neden !== "ozenle-kullanma" &&
    neden !== "komsulara-saygisizlik" &&
    neden !== "tahliye-taahhut";

  return (
    <CalculatorLayout
      title={meta.title}
      shortTitle={meta.shortTitle}
      description={meta.description}
      canonicalPath="/hesaplamalar/kira-sureleri"
      seoTitle="Kira Süreleri ve Artış Hesaplama 2026 — TBK m.315-352 | Vega Hukuk"
      seoDescription="Tahliye nedenine göre ihtar, dava ve fesih sürelerini; TBK m.344 kapsamında TÜFE ortalamasına göre yıllık kira artış üst sınırını hesaplayın."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-primary-deep">
            Kira İlişkisi
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">
                Neden
              </label>
              <Select value={neden} onValueChange={(v) => setNeden(v as TahliyeNedeni)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TAHLIYE_NEDENLERI.map((n) => (
                    <SelectItem key={n.key} value={n.key}>
                      {n.etiket} — {n.madde}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isKiraArtis ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Kira başlangıç tarihi
                </label>
                <Input
                  type="date"
                  value={kiraBaslangic}
                  onChange={(e) => setKiraBaslangic(e.target.value)}
                  required
                />
              </div>
            ) : null}

            {needsBitis ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Kira bitiş tarihi
                </label>
                <Input
                  type="date"
                  value={kiraBitis}
                  onChange={(e) => setKiraBitis(e.target.value)}
                />
              </div>
            ) : null}

            {needsTetikleyici ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {neden === "yeni-malik"
                    ? "Tapu devir tarihi"
                    : neden === "kira-odememe"
                    ? "Temerrüt tarihi"
                    : "İhtar tarihi"}
                </label>
                <Input
                  type="date"
                  value={tetikleyiciTarih}
                  onChange={(e) => setTetikleyiciTarih(e.target.value)}
                  required
                />
              </div>
            ) : null}

            {needsTaahhut ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Taahhüt edilen tahliye tarihi
                </label>
                <Input
                  type="date"
                  value={taahutTarihi}
                  onChange={(e) => setTaahutTarihi(e.target.value)}
                  required
                />
              </div>
            ) : null}

            {isKiraArtis ? (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Mevcut kira (TL)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    step="100"
                    value={mevcutKira}
                    onChange={(e) => setMevcutKira(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    12 aylık TÜFE ortalama (%)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={tufeOrani}
                    onChange={(e) => setTufeOrani(Number(e.target.value))}
                    required
                  />
                </div>
              </>
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
        <section id="kira-sonuc" className="mt-10 space-y-6">
          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold text-primary-deep">
                {result.madde}
              </h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{result.aciklama}</p>

            {result.yeniKira !== undefined ? (
              <div className="mt-5 rounded-xl border border-border bg-background p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Yasal üst sınır (yeni kira)
                </div>
                <div className="mt-1 text-3xl font-bold text-primary-deep">
                  {formatCurrency(result.yeniKira)}
                </div>
              </div>
            ) : null}
          </div>

          {result.adimlar.length > 0 ? (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-base font-semibold text-primary-deep">
                Süreç Adımları
              </h3>
              <ol className="mt-3 space-y-3">
                {result.adimlar.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-border bg-background p-3"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-medium text-foreground">{a.etiket}</span>
                        <span className="text-sm font-semibold text-primary-deep">
                          {a.tarih}
                        </span>
                      </div>
                      {a.not ? (
                        <p className="mt-1 text-xs text-muted-foreground">{a.not}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

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
              Hesap TBK m.315-352 hükümlerine göre yapılır. Somut olayın özelliklerine
              göre süreler ve koşullar değişebilir; kesin değerlendirme için avukatınıza
              başvurun.
            </p>
          </div>
        </section>
      ) : null}
    </CalculatorLayout>
  );
};

export default KiraSureleriCalculator;
