const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat("tr-TR", {
  maximumFractionDigits: 0,
});

export const formatCurrency = (value: number): string => {
  if (!Number.isFinite(value)) return "—";
  return currencyFormatter.format(value);
};

export const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return "—";
  return numberFormatter.format(value);
};

export const formatInteger = (value: number): string => {
  if (!Number.isFinite(value)) return "—";
  return integerFormatter.format(value);
};

export const parseCurrencyInput = (raw: string): number => {
  if (!raw) return 0;
  const cleaned = raw.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};
