const eur = new Intl.NumberFormat("lt-LT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(value: number) {
  return eur.format(value);
}

const meters = new Intl.NumberFormat("lt-LT", { maximumFractionDigits: 2 });
export const formatMeters = (value: number) => `${meters.format(value)} m`;
export const money = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;
