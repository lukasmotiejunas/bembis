// Vienas kainų skaičiavimas krepšeliui, checkout ir serveriui.
import { formatMeters, formatPrice, money } from "../format";
import {
  DeliveryMethod,
  deliveryOptions,
  ParcelMachine,
} from "../data/delivery";
import { pricing } from "../data/pricing";
import { getProduct } from "../data/products";
import { CartItem, PurchaseMode } from "../types";

export const modeLabel: Record<PurchaseMode, string> = {
  buy: "Pirkimas",
  rent: "Nuoma sezonui",
};
export interface OrderServices {
  installation: boolean;
  removal: boolean;
}
/** How bought lights reach the customer. Not used when we install them: we bring them along. */
export interface OrderDelivery {
  method: DeliveryMethod;
  parcelMachine?: ParcelMachine | null;
}
/** A checked wheel code (lib/discount.ts). Applies to products only, never to delivery. */
export interface OrderDiscount {
  code: string;
  percent: number;
}
export interface OrderLine {
  key: string;
  kind: "product" | "service" | "delivery";
  productId?: string;
  name: string;
  detail?: string;
  image?: string;
  mode?: PurchaseMode;
  /** Catalog price */
  unitPrice: number;
  /** What is charged per unit: the catalog price less any discount */
  paidUnitPrice: number;
  quantity: number;
  /** At catalog price; the discount is a separate amount (discountTotal) */
  total: number;
}
export function buildOrder(
  items: CartItem[],
  services: OrderServices,
  delivery?: OrderDelivery | null,
  discount?: OrderDiscount | null,
) {
  const products: OrderLine[] = [];
  let meters = 0;
  let deliveryDays = 0;
  let discountCents = 0;
  for (const item of items) {
    const product = getProduct(item.productId, item.mode);
    if (
      !product ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99
    )
      continue;
    const unitCents = Math.round(product.price * 100);
    const paidCents = discount ? Math.round((unitCents * (100 - discount.percent)) / 100) : unitCents;
    discountCents += (unitCents - paidCents) * item.quantity;
    meters += product.meters * item.quantity;
    deliveryDays = Math.max(deliveryDays, product.deliveryDays ?? 0);
    products.push({
      key: `${product.id}-${item.mode}`,
      kind: "product",
      productId: product.id,
      name: product.name,
      detail: product.kind === "decoration"
        ? `Helovyno dekoracija · pristatymas per ${product.deliveryDays} dienas`
        : `${formatMeters(product.meters)} · ${product.kind === "bundle" ? "visas komplektas" : "viena sekcija"}`,
      image: product.image,
      mode: item.mode,
      unitPrice: unitCents / 100,
      paidUnitPrice: paidCents / 100,
      quantity: item.quantity,
      total: (unitCents * item.quantity) / 100,
    });
  }
  const serviceRequested = services.installation || services.removal;
  // Individualūs darbai į apmokėtiną sumą neįtraukiami. Nuėmimas įeina į kabinimo tarifą.
  const requiresQuote = serviceRequested;
  const extras: OrderLine[] = [];
  // Montuojant lemputes atvežame patys, todėl pristatymas skaičiuojamas tik siunčiant.
  const shipped = products.length > 0 && !serviceRequested ? delivery : null;
  if (shipped) {
    const fee = pricing.delivery[shipped.method];
    const machine = shipped.method === "parcel" ? shipped.parcelMachine : null;
    extras.push({
      key: "delivery",
      kind: "delivery",
      name: deliveryOptions[shipped.method].lineName,
      detail: machine ? `${machine.name}, ${machine.address}` : undefined,
      unitPrice: fee,
      paidUnitPrice: fee,
      quantity: 1,
      total: fee,
    });
  }
  const lines = [...products, ...extras];
  return {
    lines,
    products,
    extras,
    meters: money(meters),
    deliveryDays,
    installationEstimate: money(meters * pricing.installPerMeter),
    serviceRequested,
    requiresQuote,
    delivery: shipped ?? null,
    /** Paid orders need a delivery method (and a parcel machine when one is used). */
    deliveryMissing:
      !serviceRequested &&
      (!delivery || (delivery.method === "parcel" && !delivery.parcelMachine)),
    hasRentals: products.some((l) => l.mode === "rent"),
    itemCount: products.reduce((s, l) => s + l.quantity, 0),
    /** At catalog prices, before the discount */
    productsTotal:
      products.reduce((s, l) => s + Math.round(l.total * 100), 0) / 100,
    discount: discount && products.length ? discount : null,
    discountTotal: discountCents / 100,
    total: (lines.reduce((s, l) => s + Math.round(l.total * 100), 0) - discountCents) / 100,
  };
}
export type Order = ReturnType<typeof buildOrder>;
export function describeLine(line: OrderLine) {
  const detail = line.detail ? ` (${line.detail})` : "";
  const qty = line.quantity > 1 ? ` × ${line.quantity}` : "";
  return `${line.name}${detail}${qty} — ${formatPrice(line.total)}`;
}
/** e.g. "Nuolaida RATAS5-… (−5 %) — −3,90 €"; null without a discount. */
export function describeDiscount(order: Order) {
  return order.discount
    ? `Nuolaida ${order.discount.code} (−${order.discount.percent} %) — −${formatPrice(order.discountTotal)}`
    : null;
}
export function describeOrderInquiry(order: Order) {
  return [
    "Domina šios prekės:",
    ...order.products.map(describeLine),
    `Prekių suma: ${formatPrice(order.productsTotal)}.`,
    order.discount &&
      `${describeDiscount(order)}. Suma su nuolaida: ${formatPrice(order.productsTotal - order.discountTotal)}.`,
    order.serviceRequested
      ? order.meters > 0
        ? `Domina ir montavimas bei nuėmimas po sezono, lemputes atvešite montavimo metu. Pagal prekių ilgį (${formatMeters(order.meters)}) standartinis darbų įvertis yra ${formatPrice(order.installationEstimate)}. Prašau galutinio pasiūlymo mano objektui.`
        : "Domina dekoracijų montavimas. Prašau suderinti galutinę darbų kainą ir laiką mano objektui."
      : "Prašau suderinti galutinį užsakymo pasiūlymą.",
  ]
    .filter(Boolean)
    .join("\n");
}
