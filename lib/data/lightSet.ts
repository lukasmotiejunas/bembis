// Rinkinio skaičiuoklė: pagal reikiamą ilgį sudaro vieną motininę girliandą su papildomomis sekcijomis.
import { CartItem, LightSeries, ProductKind } from "../types";
import { products } from "./products";

export const SECTION_METERS = 7.5;
/** Krepšelio eilutėje telpa iki 99 vienetų, todėl ilgiausias rinkinys — 1 motininė ir 99 papildomos sekcijos. */
export const MAX_SET_METERS = 100 * SECTION_METERS;

const cents = (price: number) => Math.round(price * 100);
// The small tolerance keeps exact multiples (45 m = 6 sections) from rounding up.
export const sectionsFor = (meters: number) =>
  Math.ceil(meters / SECTION_METERS - 1e-9);

export function buildLightSet(series: LightSeries, meters: number) {
  if (!Number.isFinite(meters) || meters <= 0 || meters > MAX_SET_METERS)
    return null;
  const needed = sectionsFor(meters);
  const ofKind = (kind: ProductKind) =>
    products.filter((p) => p.series === series && p.kind === kind);
  const [starter] = ofKind("starter");
  const [extension] = ofKind("extension");
  if (!starter || !extension) return null;

  // Komplektas — ta pati motininė su papildomomis sekcijomis, todėl renkamės pigiausią variantą.
  let best: { base: typeof starter; sections: number; cents: number } | null =
    null;
  for (const base of [starter, ...ofKind("bundle")]) {
    const sections = Math.max(needed, base.sections);
    const extensions = sections - base.sections;
    if (extensions > 99) continue;
    const total = cents(base.price) + extensions * cents(extension.price);
    if (
      !best ||
      total < best.cents ||
      (total === best.cents && sections < best.sections)
    )
      best = { base, sections, cents: total };
  }
  if (!best) return null;

  const extensions = best.sections - best.base.sections;
  const lines = [
    { product: best.base, quantity: 1 },
    ...(extensions ? [{ product: extension, quantity: extensions }] : []),
  ].map((line) => ({
    ...line,
    total: (cents(line.product.price) * line.quantity) / 100,
  }));
  const separately =
    cents(starter.price) + (best.sections - 1) * cents(extension.price);
  return {
    series,
    sections: best.sections,
    meters: best.sections * SECTION_METERS,
    leds: best.sections * 50,
    lines,
    total: best.cents / 100,
    /** Kiek pigiau nei ta pati sudėtis atskiromis sekcijomis */
    savings: (separately - best.cents) / 100,
  };
}
export type LightSet = NonNullable<ReturnType<typeof buildLightSet>>;

export const lightSetItems = (set: LightSet): CartItem[] =>
  set.lines.map((line) => ({
    productId: line.product.id,
    mode: "buy",
    quantity: line.quantity,
  }));
