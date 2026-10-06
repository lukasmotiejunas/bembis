import type Stripe from "stripe";
import { getProduct } from "../data/products";
import { CartItem } from "../types";
import { describeLine, modeLabel, Order, OrderServices } from "./order";

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  /** YYYY-MM-DD, only used when installation is ordered */
  installDate: string;
  notes: string;
}

export const emptyCustomer: CustomerDetails = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  installDate: "",
  notes: "",
};

export interface CheckoutInput {
  items: CartItem[];
  services: OrderServices;
  customer: CustomerDetails;
}

type Result = { ok: true; value: CheckoutInput } | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s()-]{6,20}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;
const text = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/** Server-side validation: the checkout action can be called directly, so nothing from the client is trusted. */
export function validateCheckout(raw: unknown): Result {
  if (
    !isRecord(raw) ||
    !Array.isArray(raw.items) ||
    !isRecord(raw.services) ||
    !isRecord(raw.customer)
  ) {
    return {
      ok: false,
      error:
        "Neteisingi užsakymo duomenys. Atnaujinkite puslapį ir bandykite dar kartą.",
    };
  }
  if (raw.items.length === 0) return { ok: false, error: "Krepšelis tuščias." };
  if (raw.items.length > 30)
    return { ok: false, error: "Per daug prekių viename užsakyme." };

  const items: CartItem[] = [];
  for (const item of raw.items) {
    if (!isRecord(item))
      return { ok: false, error: "Neteisinga prekė krepšelyje." };
    const { productId, mode, quantity } = item;
    if (mode !== "buy" && mode !== "rent")
      return { ok: false, error: "Neteisinga prekė krepšelyje." };
    if (typeof productId !== "string" || !getProduct(productId, mode)) {
      return {
        ok: false,
        error: "Vienos prekės nebeturime. Atnaujinkite krepšelį.",
      };
    }
    if (
      !Number.isInteger(quantity) ||
      (quantity as number) < 1 ||
      (quantity as number) > 99
    ) {
      return { ok: false, error: "Neteisingas prekės kiekis." };
    }
    items.push({ productId, mode, quantity: quantity as number });
  }

  const services: OrderServices = {
    installation: raw.services.installation === true,
    removal: raw.services.removal === true,
  };

  const c = raw.customer;
  const customer: CustomerDetails = {
    name: text(c.name, 100),
    phone: text(c.phone, 30),
    email: text(c.email, 200),
    address: text(c.address, 200),
    city: text(c.city, 80),
    installDate: services.installation ? text(c.installDate, 10) : "",
    notes: text(c.notes, 1000),
  };

  if (customer.name.length < 2)
    return { ok: false, error: "Įrašykite vardą ir pavardę." };
  if (!PHONE.test(customer.phone))
    return { ok: false, error: "Įrašykite teisingą telefono numerį." };
  if (!EMAIL.test(customer.email))
    return { ok: false, error: "Įrašykite teisingą el. pašto adresą." };
  if (customer.address.length < 3)
    return { ok: false, error: "Įrašykite adresą." };
  if (customer.city.length < 2)
    return { ok: false, error: "Įrašykite miestą ar gyvenvietę." };
  if (customer.installDate && !DATE.test(customer.installDate)) {
    return { ok: false, error: "Neteisinga montavimo data." };
  }

  return { ok: true, value: { items, services, customer } };
}

/** e.g. KD-261004-7QX2 — short enough to read over the phone. */
export function newOrderNumber(now = new Date()) {
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const random = Array.from(
    crypto.getRandomValues(new Uint8Array(4)),
    (b) => alphabet[b % alphabet.length],
  ).join("");
  return `KD-${date}-${random}`;
}

// Stripe metadata values are limited to 500 characters, so long text is split across numbered keys.
const CHUNK = 490;

function toChunks(key: string, value: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i * CHUNK < value.length; i++)
    out[`${key}_${i}`] = value.slice(i * CHUNK, (i + 1) * CHUNK);
  return out;
}

export function fromChunks(metadata: Record<string, string>, key: string) {
  let value = "";
  for (let i = 0; metadata[`${key}_${i}`] !== undefined; i++)
    value += metadata[`${key}_${i}`];
  return value;
}

export function buildSessionParams(
  input: CheckoutInput,
  order: Order,
  origin: string,
  orderNumber: string,
): Stripe.Checkout.SessionCreateParams {
  if (order.requiresQuote)
    throw new Error(
      "Individualus pasiūlymas negali būti apmokestintas standartine sąmata.",
    );
  const { customer, services } = input;
  // Stripe can only show product images that are publicly reachable.
  const imageUrl = (path?: string) =>
    path && !path.endsWith(".svg") && origin.startsWith("https://")
      ? [new URL(path, origin).toString()]
      : undefined;

  const metadata: Record<string, string> = {
    order_number: orderNumber,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    city: customer.city,
    installation: services.installation ? "yes" : "no",
    removal: services.removal ? "yes" : "no",
    install_date: customer.installDate,
    notes: customer.notes.slice(0, 500),
    meters: String(order.meters),
    ...toChunks("items", order.lines.map(describeLine).join("\n")),
  };

  return {
    mode: "payment",
    locale: "lt",
    customer_email: customer.email,
    client_reference_id: orderNumber,
    line_items: order.lines.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(line.unitPrice * 100),
        product_data: {
          name: line.mode
            ? `${line.name} — ${modeLabel[line.mode].toLowerCase()}`
            : line.name,
          ...(line.detail ? { description: line.detail } : {}),
          ...(imageUrl(line.image) ? { images: imageUrl(line.image) } : {}),
        },
      },
    })),
    // Empty values are left out — Stripe treats them as "unset".
    metadata: Object.fromEntries(
      Object.entries(metadata).filter(([, v]) => v !== ""),
    ),
    payment_intent_data: {
      description: `Užsakymas ${orderNumber}`,
      metadata: { order_number: orderNumber },
    },
    custom_text: {
      submit: {
        message:
          "Po apmokėjimo susisieksime ir suderinsime pristatymo ar montavimo laiką.",
      },
    },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout?atsaukta=1`,
  };
}
