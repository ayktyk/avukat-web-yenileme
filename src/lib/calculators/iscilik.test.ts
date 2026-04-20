import { describe, it, expect } from "vitest";
import { calculateIscilikAlacaklari } from "./iscilik";

describe("calculateIscilikAlacaklari — hizmet süresi", () => {
  it("1 yıldan kısa çalışmada kıdem tazminatı hesaplanmaz", () => {
    const r = calculateIscilikAlacaklari({
      iseGiris: "2024-06-01",
      istenCikis: "2024-12-01",
      sonNetUcret: 25000,
      fesihNedeni: "isveren_haksiz",
    });
    expect(r.kidem.brut).toBe(0);
    expect(r.kidem.aciklama).toContain("1 yıllık");
  });

  it("Yıl/ay/gün ayrıştırmasını doğru yapar", () => {
    const r = calculateIscilikAlacaklari({
      iseGiris: "2020-01-01",
      istenCikis: "2025-03-15",
      sonNetUcret: 30000,
      fesihNedeni: "isveren_haksiz",
    });
    expect(r.hizmetSuresi.yil).toBe(5);
    expect(r.hizmetSuresi.ay).toBe(2);
    expect(r.hizmetSuresi.gun).toBe(15);
  });
});

describe("calculateIscilikAlacaklari — ihbar öneli", () => {
  it("6 ay – 1.5 yıl arasında 2 hafta (14 gün)", () => {
    const r = calculateIscilikAlacaklari({
      iseGiris: "2024-01-01",
      istenCikis: "2024-12-01",
      sonNetUcret: 20000,
      fesihNedeni: "isveren_haksiz",
    });
    expect(r.ihbar.onelHafta).toBe(2);
  });

  it("3-6 yıl arası 6 hafta", () => {
    const r = calculateIscilikAlacaklari({
      iseGiris: "2020-01-01",
      istenCikis: "2025-01-01",
      sonNetUcret: 30000,
      fesihNedeni: "isveren_haksiz",
    });
    expect(r.ihbar.onelHafta).toBe(6);
  });

  it("6+ yılda 8 hafta", () => {
    const r = calculateIscilikAlacaklari({
      iseGiris: "2015-01-01",
      istenCikis: "2025-01-01",
      sonNetUcret: 30000,
      fesihNedeni: "isveren_haksiz",
    });
    expect(r.ihbar.onelHafta).toBe(8);
  });

  it("İstifada ihbar tazminatı 0 olur", () => {
    const r = calculateIscilikAlacaklari({
      iseGiris: "2020-01-01",
      istenCikis: "2025-01-01",
      sonNetUcret: 30000,
      fesihNedeni: "istifa",
    });
    expect(r.ihbar.brut).toBe(0);
  });
});

describe("calculateIscilikAlacaklari — kıdem tazminatı", () => {
  it("Net ücret brüt'e çevrilir (yaklaşık 1.4 katsayı)", () => {
    const r = calculateIscilikAlacaklari({
      iseGiris: "2020-01-01",
      istenCikis: "2025-01-01",
      sonNetUcret: 30000,
      fesihNedeni: "isveren_haksiz",
    });
    expect(r.brutUcret).toBeGreaterThan(30000 * 1.35);
    expect(r.brutUcret).toBeLessThan(30000 * 1.45);
  });

  it("5 yıllık kıdem için net kıdem pozitif ve tavanlar uygulanır", () => {
    const r = calculateIscilikAlacaklari({
      iseGiris: "2020-01-01",
      istenCikis: "2025-01-01",
      sonNetUcret: 30000,
      fesihNedeni: "isveren_haksiz",
    });
    // 2020-2024 dönem tavanları: 6730 → 35058. 5 yıl × ortalama 12-17k tavan ≈ 70-90k brüt
    expect(r.kidem.brut).toBeGreaterThan(50000);
    expect(r.kidem.brut).toBeLessThan(250000);
    expect(r.kidem.tavanaTakildi).toBe(true);
    expect(r.kidem.net).toBeLessThan(r.kidem.brut);
    // Sadece damga vergisi kesintisi (%0.759)
    expect(r.kidem.brut - r.kidem.net).toBeCloseTo(r.kidem.brut * 0.00759, 0);
  });

  it("Yüksek ücrette kıdem tavanına takılır ve uyarı verir", () => {
    const r = calculateIscilikAlacaklari({
      iseGiris: "2020-01-01",
      istenCikis: "2025-01-01",
      sonNetUcret: 200000, // çok yüksek
      fesihNedeni: "isveren_haksiz",
    });
    expect(r.kidem.tavanaTakildi).toBe(true);
    expect(r.uyarilar.some((u) => u.includes("tavan"))).toBe(true);
  });
});

describe("calculateIscilikAlacaklari — ek alacaklar", () => {
  it("Yıllık izin bakiyesi hesaplanır", () => {
    const r = calculateIscilikAlacaklari({
      iseGiris: "2020-01-01",
      istenCikis: "2025-01-01",
      sonNetUcret: 30000,
      fesihNedeni: "isveren_haksiz",
      toplamIzinHakki: 70,
      kullandirilmisIzin: 40,
    });
    expect(r.yillikIzin?.bakiyeGun).toBe(30);
    expect(r.yillikIzin?.brut).toBeGreaterThan(0);
  });

  it("Fazla mesai girildiğinde hesaplanır", () => {
    const r = calculateIscilikAlacaklari({
      iseGiris: "2020-01-01",
      istenCikis: "2025-01-01",
      sonNetUcret: 30000,
      fesihNedeni: "isveren_haksiz",
      fazlaMesaiHaftalikSaat: 10,
    });
    expect(r.fazlaMesai?.brut).toBeGreaterThan(0);
    expect(r.fazlaMesai?.net).toBeGreaterThan(0);
  });

  it("UBGT yılları verildiğinde hesaplanır", () => {
    const r = calculateIscilikAlacaklari({
      iseGiris: "2020-01-01",
      istenCikis: "2025-01-01",
      sonNetUcret: 30000,
      fesihNedeni: "isveren_haksiz",
      ubgtYillari: [2023, 2024],
    });
    expect(r.ubgt?.brut).toBeGreaterThan(0);
  });
});

describe("calculateIscilikAlacaklari — işe iade", () => {
  it("İşe iade talebinde tazminat ve boşta geçen süre hesaplanır", () => {
    const r = calculateIscilikAlacaklari({
      iseGiris: "2020-01-01",
      istenCikis: "2025-01-01",
      sonNetUcret: 30000,
      fesihNedeni: "isveren_haksiz",
      iseIadeTalep: true,
      iseBaslamamaKatsayi: 6,
    });
    expect(r.iseIade?.tazminat.brut).toBeGreaterThan(0);
    expect(r.iseIade?.bostaGecen.brut).toBeGreaterThan(0);
  });
});

describe("calculateIscilikAlacaklari — toplamlar", () => {
  it("Toplam brüt, tüm kalemlerin brütlerinin toplamına eşit", () => {
    const r = calculateIscilikAlacaklari({
      iseGiris: "2020-01-01",
      istenCikis: "2025-01-01",
      sonNetUcret: 30000,
      fesihNedeni: "isveren_haksiz",
      toplamIzinHakki: 50,
      kullandirilmisIzin: 20,
      fazlaMesaiHaftalikSaat: 5,
      ubgtYillari: [2023, 2024],
    });
    const manuelToplam =
      r.kidem.brut +
      r.ihbar.brut +
      (r.fazlaMesai?.brut ?? 0) +
      (r.ubgt?.brut ?? 0) +
      (r.yillikIzin?.brut ?? 0);
    expect(r.toplamBrut).toBeCloseTo(manuelToplam, 1);
  });
});
