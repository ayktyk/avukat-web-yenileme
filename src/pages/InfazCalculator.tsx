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
import { Checkbox } from "@/components/ui/checkbox";
import { getCalculatorBySlug } from "@/lib/calculators-meta";
import {
  calculateInfaz,
  daysToYMD,
  type InfazResult,
  type PenaltyType,
} from "@/lib/calculators/infaz";
import {
  CRIME_CATEGORIES,
  type Tekerrur,
} from "@/lib/calculator-data/infaz-suc-kategorileri";

const meta = getCalculatorBySlug("infaz")!;

const InfazCalculator = () => {
  const [penaltyType, setPenaltyType] = useState<PenaltyType>("sureli");
  const [years, setYears] = useState<number>(0);
  const [months, setMonths] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [crimeCategory, setCrimeCategory] = useState<string>("genel");
  const [crimeDate, setCrimeDate] = useState<string>("");
  const [executionStartDate, setExecutionStartDate] = useState<string>("");
  const [detentionDays, setDetentionDays] = useState<number>(0);
  const [isJuvenile, setIsJuvenile] = useState<boolean>(false);
  const [birthDate, setBirthDate] = useState<string>("");
  const [tekerrur, setTekerrur] = useState<Tekerrur>("yok");
  const [iyiHal, setIyiHal] = useState<boolean>(true);
  const [result, setResult] = useState<InfazResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = calculateInfaz({
        penaltyType,
        years,
        months,
        days,
        crimeCategory,
        crimeDate,
        executionStartDate,
        detentionDays,
        isJuvenile,
        birthDate: birthDate || undefined,
        tekerrur,
        iyiHal,
      });
      setResult(r);
      setTimeout(() => {
        document
          .getElementById("infaz-sonuc")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setPenaltyType("sureli");
    setYears(0);
    setMonths(0);
    setDays(0);
    setCrimeCategory("genel");
    setCrimeDate("");
    setExecutionStartDate("");
    setDetentionDays(0);
    setIsJuvenile(false);
    setBirthDate("");
    setTekerrur("yok");
    setIyiHal(true);
    setResult(null);
  };

  return (
    <CalculatorLayout
      title={meta.title}
      shortTitle={meta.shortTitle}
      description={meta.description}
      canonicalPath="/hesaplamalar/infaz"
      seoTitle="İnfaz Hesaplama 2026 — 5275/7242/7456 SK Güncel | Vega Hukuk İstanbul"
      seoDescription="5275 sayılı Kanun ve 7242/7456 sayılı değişikliklere göre koşullu salıverilme, denetimli serbestlik, açık cezaevine ayrılma ve bihakkin tahliye tarihlerini hesaplayın."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-primary-deep">
            Ceza Bilgileri
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">
                Ceza türü
              </label>
              <Select
                value={penaltyType}
                onValueChange={(v) => setPenaltyType(v as PenaltyType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sureli">Süreli hapis</SelectItem>
                  <SelectItem value="muebbet">Müebbet hapis</SelectItem>
                  <SelectItem value="agir_muebbet">Ağırlaştırılmış müebbet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {penaltyType === "sureli" ? (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Yıl
                  </label>
                  <Input
                    type="number"
                    min={0}
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Ay
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={11}
                    step="1"
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Gün
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={29}
                    step="1"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Suç kategorisi
                  </label>
                  <Select value={crimeCategory} onValueChange={setCrimeCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CRIME_CATEGORIES.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.label} ({c.ratioLabel})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Suç kategorisi
                </label>
                <Select value={crimeCategory} onValueChange={setCrimeCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CRIME_CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Suç tarihi (DS oranı için)
              </label>
              <Input
                type="date"
                value={crimeDate}
                onChange={(e) => setCrimeDate(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                İnfaz başlama tarihi
              </label>
              <Input
                type="date"
                value={executionStartDate}
                onChange={(e) => setExecutionStartDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Tutukluluk/gözaltı gün (mahsup)
              </label>
              <Input
                type="number"
                min={0}
                step="1"
                value={detentionDays}
                onChange={(e) => setDetentionDays(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Tekerrür durumu
              </label>
              <Select value={tekerrur} onValueChange={(v) => setTekerrur(v as Tekerrur)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yok">Yok</SelectItem>
                  <SelectItem value="1">1. tekerrür</SelectItem>
                  <SelectItem value="2">2. tekerrür (mükerrir)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={iyiHal}
                onCheckedChange={(v) => setIyiHal(Boolean(v))}
              />
              <span className="text-sm text-foreground">
                İyi halli — denetimli serbestlik ve açık cezaevi uygulanır
              </span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={isJuvenile}
                onCheckedChange={(v) => setIsJuvenile(Boolean(v))}
              />
              <span className="text-sm text-foreground">
                Suç tarihinde çocuk/genç (TCK m.31)
              </span>
            </label>
            {isJuvenile ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Doğum tarihi
                </label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
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
        <section id="infaz-sonuc" className="mt-10 space-y-6">
          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold text-primary-deep">
                İnfaz Tarihleri
              </h2>
            </div>
            <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background p-4">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Koşullu salıverilme
                </dt>
                <dd className="mt-1 text-xl font-bold text-primary-deep">
                  {result.kosulluTarih}
                </dd>
                <dd className="mt-1 text-xs text-muted-foreground">
                  {daysToYMD(result.kosulluGun)} — infaz oranı: {result.infazOrani}
                </dd>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Denetimli serbestlik başlangıcı
                </dt>
                <dd className="mt-1 text-xl font-bold text-primary-deep">
                  {result.denetimliSerbestlikGun > 0
                    ? result.denetimliSerbestlikBaslangic
                    : "—"}
                </dd>
                <dd className="mt-1 text-xs text-muted-foreground">
                  {result.denetimliSerbestlikGun > 0
                    ? daysToYMD(result.denetimliSerbestlikGun)
                    : "Uygulanmadı"}
                </dd>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Açık cezaevine ayrılma
                </dt>
                <dd className="mt-1 text-xl font-bold text-primary-deep">
                  {result.acikCezaeviTarih ?? "—"}
                </dd>
                <dd className="mt-1 text-xs text-muted-foreground">
                  Kapalı cezaevi süresi: {daysToYMD(result.kapaliCezaeviGun)}
                </dd>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Bihakkin tahliye
                </dt>
                <dd className="mt-1 text-xl font-bold text-primary-deep">
                  {result.bihakkinTarih}
                </dd>
                <dd className="mt-1 text-xs text-muted-foreground">
                  Net ceza: {daysToYMD(result.netCezaGun)}
                </dd>
              </div>
            </dl>
          </div>

          {result.uygulananMevzuat.length > 0 ? (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-base font-semibold text-primary-deep">
                Uygulanan Mevzuat
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.uygulananMevzuat.map((m, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary-deep"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {result.uyarilar.length > 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-center gap-2 text-amber-900">
                <AlertTriangle className="h-4 w-4" />
                <h3 className="font-display text-base font-semibold">Notlar</h3>
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
              Hesap 5275 sayılı Kanun ile 7242 (30.03.2020) ve 7456 (01.08.2023)
              sayılı Kanunların infaz rejimine etkilerini dikkate alır. Kesin tarih,
              İnfaz Hakimliği kararına göre belirlenir.
            </p>
          </div>
        </section>
      ) : null}
    </CalculatorLayout>
  );
};

export default InfazCalculator;
