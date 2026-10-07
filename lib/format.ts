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

/** Lithuanian noun form for a count: 1 sekcija, 2 sekcijos, 10 sekcijų. */
export function plural(n: number, one: string, few: string, many: string) {
  const lastTwo = n % 100;
  const last = n % 10;
  if (last === 0 || (lastTwo >= 11 && lastTwo <= 19)) return many;
  return last === 1 ? one : few;
}
