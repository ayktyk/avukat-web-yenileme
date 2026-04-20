import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format-currency";
import type { AlacakKalemi, IscilikResult as IscilikResultType } from "@/lib/calculators/iscilik";

type Row = {
  kalem: string;
  brut: number;
  net: number;
  aciklama?: string;
};

const buildRows = (result: IscilikResultType): Row[] => {
  const rows: Row[] = [];

  rows.push({
    kalem: `Kıdem Tazminatı${result.kidem.tavanaTakildi ? " (tavan uygulandı)" : ""}`,
    brut: result.kidem.brut,
    net: result.kidem.net,
    aciklama: result.kidem.aciklama,
  });

  rows.push({
    kalem: `İhbar Tazminatı (${result.ihbar.onelHafta} hafta)`,
    brut: result.ihbar.brut,
    net: result.ihbar.net,
  });

  const optional = (kalem: string, k?: AlacakKalemi) => {
    if (!k || (k.brut === 0 && k.net === 0)) return;
    rows.push({ kalem, brut: k.brut, net: k.net });
  };

  optional("Fazla Mesai", result.fazlaMesai);
  optional("UBGT Ücreti", result.ubgt);
  optional("Hafta Tatili", result.haftaTatili);

  if (result.yillikIzin && result.yillikIzin.bakiyeGun > 0) {
    rows.push({
      kalem: `Yıllık İzin (${result.yillikIzin.bakiyeGun} gün)`,
      brut: result.yillikIzin.brut,
      net: result.yillikIzin.net,
    });
  }

  optional("Ödenmemiş Ücret Alacağı", result.ucretAlacagi);

  if (result.iseIade) {
    rows.push({
      kalem: "İşe Başlatmama Tazminatı",
      brut: result.iseIade.tazminat.brut,
      net: result.iseIade.tazminat.net,
    });
    rows.push({
      kalem: "Boşta Geçen Süre (4 ay)",
      brut: result.iseIade.bostaGecen.brut,
      net: result.iseIade.bostaGecen.net,
    });
  }

  return rows;
};

type Props = {
  result: IscilikResultType;
};

const IscilikResultView = ({ result }: Props) => {
  const rows = buildRows(result);
  const hizmet = result.hizmetSuresi;

  return (
    <section className="mt-10 space-y-6">
      <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl font-bold text-primary-deep">Hesaplama Sonucu</h2>
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Hizmet Süresi</dt>
            <dd className="mt-1 text-lg font-semibold text-foreground">
              {hizmet.yil} yıl {hizmet.ay} ay {hizmet.gun} gün
            </dd>
            <dd className="text-xs text-muted-foreground">Toplam {hizmet.toplamGun} gün</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Brüt Ücret (aylık)</dt>
            <dd className="mt-1 text-lg font-semibold text-foreground">
              {formatCurrency(result.brutUcret)}
            </dd>
            <dd className="text-xs text-muted-foreground">Net → brüt katsayı: {result.brutNetKatsayi}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Giydirilmiş Brüt</dt>
            <dd className="mt-1 text-lg font-semibold text-foreground">
              {formatCurrency(result.giydirilmisBrut)}
            </dd>
            <dd className="text-xs text-muted-foreground">Ek ödemeler dahil</dd>
          </div>
        </dl>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[45%]">Alacak Kalemi</TableHead>
              <TableHead className="text-right">Brüt (TL)</TableHead>
              <TableHead className="text-right">Net (TL)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.kalem}>
                <TableCell>
                  <div className="font-medium text-foreground">{r.kalem}</div>
                  {r.aciklama ? (
                    <p className="mt-1 text-xs text-muted-foreground">{r.aciklama}</p>
                  ) : null}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(r.brut)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(r.net)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-primary/10 text-primary-deep">
              <TableCell className="font-bold">TOPLAM</TableCell>
              <TableCell className="text-right tabular-nums font-bold">
                {formatCurrency(result.toplamBrut)}
              </TableCell>
              <TableCell className="text-right tabular-nums font-bold">
                {formatCurrency(result.toplamNet)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {result.uyarilar.length > 0 ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            <h3 className="font-semibold">Dikkat Edilmesi Gerekenler</h3>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-amber-900">
            {result.uyarilar.map((u, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Sonuçlar güncel mevzuat, dönem bazlı kıdem tazminatı tavanı ve kademeli gelir
          vergisi oranlarına göre üretilmiştir. Kesin hesap; bordro, SGK dökümü, ibraname
          ve tanık beyanı gibi belgelerin incelenmesiyle dosyaya özel çıkarılmalıdır.
        </p>
      </div>
    </section>
  );
};

export default IscilikResultView;
