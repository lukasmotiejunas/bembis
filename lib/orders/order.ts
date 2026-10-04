// Shared by the checkout page (to show prices) and the server (to charge them),
// so both always compute the exact same order from the catalog.
import { formatPrice } from "../format";
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

export function buildOrder(items: CartItem[], services: OrderServices) {
  const products: OrderLine[] = [];
  let meters = 0;

  for (const item of items) {
    const product = getProduct(item.productId, item.mode);
    if (!product) continue;
    const unitPrice = product.price;
    meters += product.meters * item.quantity;
    const length = product.name.includes(`${product.meters} m`) ? "" : `${product.meters} m · `;
    products.push({
      key: `${product.id}-${item.mode}`,
      kind: "product",
      productId: product.id,
      name: product.name,
      detail: `${length}${modeLabel[item.mode].toLowerCase()}`,
      image: product.image,
      mode: item.mode,
      unitPrice,
      quantity: item.quantity,
      total: unitPrice * item.quantity,
    });
  }

  const quotes = {
    installation: meters * pricing.installPerMeter,
    removal: meters * pricing.removalPerMeter,
  };

  const extras: OrderLine[] = [];
  if (products.length > 0) {
    if (services.installation) {
      extras.push({
        key: "installation",
        kind: "service",
        name: "Montavimas",
        detail: `${meters} m × ${formatPrice(pricing.installPerMeter)}`,
        unitPrice: quotes.installation,
        quantity: 1,
        total: quotes.installation,
      });
    }
    if (services.removal) {
      extras.push({
        key: "removal",
        kind: "service",
        name: "Nuėmimas po švenčių",
        detail: `${meters} m × ${formatPrice(pricing.removalPerMeter)}`,
        unitPrice: quotes.removal,
        quantity: 1,
        total: quotes.removal,
      });
    }
    // With installation we bring the lights ourselves, so delivery is free.
    if (!services.installation) {
      extras.push({
        key: "delivery",
        kind: "delivery",
        name: "Pristatymas į namus",
        detail: pricing.deliveryArea,
        unitPrice: pricing.deliveryFee,
        quantity: 1,
        total: pricing.deliveryFee,
      });
    }
  }

  const lines = [...products, ...extras];
  return {
    lines,
    products,
    extras,
    meters,
    quotes,
    hasRentals: products.some((l) => l.mode === "rent"),
    itemCount: products.reduce((s, l) => s + l.quantity, 0),
    total: lines.reduce((s, l) => s + l.total, 0),
  };
}

export type Order = ReturnType<typeof buildOrder>;

/** One human-readable line, used in the Google Sheet and on the success page. */
export function describeLine(line: OrderLine) {
  const detail = line.detail ? ` (${line.detail})` : "";
  const qty = line.quantity > 1 ? ` × ${line.quantity}` : "";
  return `${line.name}${detail}${qty} — ${formatPrice(line.total)}`;
}
