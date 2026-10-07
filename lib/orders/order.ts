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
export interface OrderLine {
  key: string;
  kind: "product" | "service" | "delivery";
  productId?: string;
  name: string;
  detail?: string;
  image?: string;
  mode?: PurchaseMode;
  unitPrice: number;
  quantity: number;
  total: number;
}
export function buildOrder(
  items: CartItem[],
  services: OrderServices,
  delivery?: OrderDelivery | null,
) {
  const products: OrderLine[] = [];
  let meters = 0;
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
    meters += product.meters * item.quantity;
    products.push({
      key: `${product.id}-${item.mode}`,
      kind: "product",
      productId: product.id,
      name: product.name,
      detail: `${formatMeters(product.meters)} · ${product.kind === "bundle" ? "visas komplektas" : "viena sekcija"}`,
      image: product.image,
      mode: item.mode,
      unitPrice: unitCents / 100,
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
    productsTotal:
      products.reduce((s, l) => s + Math.round(l.total * 100), 0) / 100,
    total: lines.reduce((s, l) => s + Math.round(l.total * 100), 0) / 100,
  };
}
export type Order = ReturnType<typeof buildOrder>;
export function describeLine(line: OrderLine) {
  const detail = line.detail ? ` (${line.detail})` : "";
  const qty = line.quantity > 1 ? ` × ${line.quantity}` : "";
  return `${line.name}${detail}${qty} — ${formatPrice(line.total)}`;
}
export function describeOrderInquiry(order: Order) {
  return [
    "Domina šios prekės:",
    ...order.products.map(describeLine),
    `Prekių suma: ${formatPrice(order.productsTotal)}.`,
    order.serviceRequested
      ? `Domina ir montavimas bei nuėmimas po sezono, lemputes atvešite montavimo metu. Pagal prekių ilgį (${formatMeters(order.meters)}) standartinis darbų įvertis yra ${formatPrice(order.installationEstimate)}. Prašau galutinio pasiūlymo mano objektui.`
      : "Prašau suderinti galutinį užsakymo pasiūlymą.",
  ].join("\n");
}
