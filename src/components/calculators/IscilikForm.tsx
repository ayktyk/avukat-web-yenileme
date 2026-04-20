import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calculator, RotateCcw } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { IscilikInput } from "@/lib/calculators/iscilik";

const formSchema = z
  .object({
    iseGiris: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih gereklidir (YYYY-MM-DD)"),
    istenCikis: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih gereklidir (YYYY-MM-DD)"),
    sonNetUcret: z.coerce.number().min(1, "Net ücret sıfırdan büyük olmalı"),
    fesihNedeni: z.enum(["isveren_haksiz", "isci_hakli", "ikale", "istifa"]),
    yemekAylik: z.coerce.number().min(0).optional(),
    servisAylik: z.coerce.number().min(0).optional(),
    ikramiyeAylik: z.coerce.number().min(0).optional(),
    primAylik: z.coerce.number().min(0).optional(),
    toplamIzinHakki: z.coerce.number().min(0).optional(),
    kullandirilmisIzin: z.coerce.number().min(0).optional(),
    fazlaMesaiHaftalikSaat: z.coerce.number().min(0).optional(),
    ubgtYillariText: z.string().optional(),
    haftaTatiliHaftalikGun: z.coerce.number().min(0).optional(),
    haftaTatiliHaftaSayisi: z.coerce.number().min(0).optional(),
    ucretAlacagi: z.coerce.number().min(0).optional(),
    iseIadeTalep: z.boolean().optional(),
    iseBaslamamaKatsayi: z.coerce.number().min(4).max(8).optional(),
  })
  .refine(
    (v) => new Date(v.istenCikis) > new Date(v.iseGiris),
    {
      message: "İşten çıkış, işe giriş tarihinden büyük olmalı",
      path: ["istenCikis"],
    },
  );

export type IscilikFormValues = z.infer<typeof formSchema>;

const DEFAULTS: IscilikFormValues = {
  iseGiris: "",
  istenCikis: "",
  sonNetUcret: 0,
  fesihNedeni: "isveren_haksiz",
  yemekAylik: 0,
  servisAylik: 0,
  ikramiyeAylik: 0,
  primAylik: 0,
  toplamIzinHakki: 0,
  kullandirilmisIzin: 0,
  fazlaMesaiHaftalikSaat: 0,
  ubgtYillariText: "",
  haftaTatiliHaftalikGun: 0,
  haftaTatiliHaftaSayisi: 0,
  ucretAlacagi: 0,
  iseIadeTalep: false,
  iseBaslamamaKatsayi: 4,
};

const parseUbgtYears = (text?: string): number[] => {
  if (!text) return [];
  return text
    .split(/[,\s]+/)
    .map((x) => parseInt(x.trim(), 10))
    .filter((n) => Number.isFinite(n) && n >= 2000 && n <= 2100);
};

export const mapFormToInput = (v: IscilikFormValues): IscilikInput => ({
  iseGiris: v.iseGiris,
  istenCikis: v.istenCikis,
  sonNetUcret: v.sonNetUcret,
  fesihNedeni: v.fesihNedeni,
  yemekAylik: v.yemekAylik,
  servisAylik: v.servisAylik,
  ikramiyeAylik: v.ikramiyeAylik,
  primAylik: v.primAylik,
  toplamIzinHakki: v.toplamIzinHakki,
  kullandirilmisIzin: v.kullandirilmisIzin,
  fazlaMesaiHaftalikSaat: v.fazlaMesaiHaftalikSaat,
  ubgtYillari: parseUbgtYears(v.ubgtYillariText),
  haftaTatiliHaftalikGun: v.haftaTatiliHaftalikGun,
  haftaTatiliHaftaSayisi: v.haftaTatiliHaftaSayisi,
  ucretAlacagi: v.ucretAlacagi,
  iseIadeTalep: v.iseIadeTalep,
  iseBaslamamaKatsayi: v.iseBaslamamaKatsayi,
});

type IscilikFormProps = {
  onSubmit: (values: IscilikFormValues) => void;
  onReset: () => void;
};

const IscilikForm = ({ onSubmit, onReset }: IscilikFormProps) => {
  const form = useForm<IscilikFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULTS,
    mode: "onBlur",
  });

  const reset = () => {
    form.reset(DEFAULTS);
    onReset();
  };

  const iseIadeAcik = form.watch("iseIadeTalep");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* ADIM 1 — Kişisel */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-primary-deep">1. Temel Bilgiler</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Çalışma dönemi ve son ücret bilgileri.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="iseGiris"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İşe giriş tarihi</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="istenCikis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İşten çıkış tarihi</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sonNetUcret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Son net ücret (TL/ay)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="100" {...field} />
                  </FormControl>
                  <FormDescription>Elinize geçen net maaş</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fesihNedeni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fesih nedeni</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="isveren_haksiz">İşveren haksız fesih</SelectItem>
                      <SelectItem value="isci_hakli">İşçi haklı fesih</SelectItem>
                      <SelectItem value="ikale">İkale (karşılıklı anlaşma)</SelectItem>
                      <SelectItem value="istifa">İstifa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* ADIM 2 — Ek ödemeler */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-primary-deep">
            2. Ek Ödemeler (Aylık)
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Giydirilmiş brüt hesabına katılır. Bilinmiyorsa 0 bırakın.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "yemekAylik", label: "Yemek (TL/ay)" },
              { name: "servisAylik", label: "Servis (TL/ay)" },
              { name: "ikramiyeAylik", label: "İkramiye (TL/ay)" },
              { name: "primAylik", label: "Prim (TL/ay)" },
            ].map((f) => (
              <FormField
                key={f.name}
                control={form.control}
                name={f.name as keyof IscilikFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{f.label}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="50"
                        value={(field.value as number) ?? 0}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </section>

        {/* ADIM 3 — Ek talepler */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-primary-deep">3. Ek Talepler</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fazla mesai, UBGT, hafta tatili ve yıllık izin alacakları. Bilinmeyenleri boş
            bırakabilirsiniz.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fazlaMesaiHaftalikSaat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Haftalık fazla mesai (saat)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.5" {...field} />
                  </FormControl>
                  <FormDescription>Ortalama haftalık fazla çalışma saati</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ubgtYillariText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UBGT çalışılan yıllar</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: 2022, 2023, 2024" {...field} />
                  </FormControl>
                  <FormDescription>Virgülle ayırın</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="haftaTatiliHaftalikGun"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hafta tatili — haftalık gün</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="haftaTatiliHaftaSayisi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hafta tatili — toplam hafta</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toplamIzinHakki"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Toplam izin hakkı (gün)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kullandirilmisIzin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanılan izin (gün)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ucretAlacagi"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Ödenmemiş net ücret alacağı (TL)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="100" {...field} />
                  </FormControl>
                  <FormDescription>Varsa ödenmemiş aylara ait net alacak</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* ADIM 4 — İşe iade (opsiyonel) */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-primary-deep">
            4. İşe İade Talebi (Opsiyonel)
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            30'dan fazla işçi çalıştıran işyerinde 6 ay ve üzeri kıdem için uygulanabilir.
          </p>
          <div className="mt-5 space-y-4">
            <FormField
              control={form.control}
              name="iseIadeTalep"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) => field.onChange(Boolean(v))}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>İşe iade talep ediyorum</FormLabel>
                    <FormDescription>
                      İşe başlatmama tazminatı + 4 aylık boşta geçen süre hesaplanır.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {iseIadeAcik ? (
              <FormField
                control={form.control}
                name="iseBaslamamaKatsayi"
                render={({ field }) => (
                  <FormItem className="sm:w-56">
                    <FormLabel>İşe başlatmama tazminatı (ay)</FormLabel>
                    <FormControl>
                      <Input type="number" min={4} max={8} step="1" {...field} />
                    </FormControl>
                    <FormDescription>4-8 ay arası (İş K. m.21)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-[10px] border border-primary bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-deep hover:shadow-elegant"
          >
            <Calculator className="h-4 w-4" />
            Hesapla
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary hover:text-primary"
          >
            <RotateCcw className="h-4 w-4" />
            Sıfırla
          </button>
        </div>
      </form>
    </Form>
  );
};

export default IscilikForm;
