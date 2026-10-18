"use server";
import { headers } from "next/headers";
import {
  buildSessionParams,
  newOrderNumber,
  validateCheckout,
} from "@/lib/orders/checkout";
import { buildOrder } from "@/lib/orders/order";
import {
  createDiscountCode,
  discountsEnabled,
  INVALID_DISCOUNT,
  spinWheelPrize,
  verifyDiscountCode,
} from "@/lib/discount";
import { findParcelMachine } from "@/lib/omniva";
import { site } from "@/lib/site";
import { getStripe, paymentsConfigured } from "@/lib/stripe";
import { sendInquiry, SendInquiryResult } from "@/app/kontaktai/actions";
import { prepareOrderInquiry } from "@/lib/orders/inquiry";

export type StartCheckoutResult = { url: string } | { error: string };

export type SpinResult =
  | { ok: true; angle: number; percent: number; code: string; validUntil: string }
  | { ok: false; error: string };

/**
 * One spin of the laimės ratas: the server picks where the wheel stops, so the prize can't be chosen in the browser.
 * The once-a-week limit lives in the visitor's browser, as asked; the prizes are capped at 10 % anyway.
 */
export async function spinWheel(): Promise<SpinResult> {
  if (!discountsEnabled())
    return { ok: false, error: "Laimės ratas šiuo metu nesisuka. Bandykite vėliau." };
  const { angle, percent } = spinWheelPrize();
  const { code, validUntil } = createDiscountCode(percent);
  return { ok: true, angle, percent, code, validUntil: validUntil.toISOString() };
}

export type DiscountCheck =
  | { ok: true; code: string; percent: number }
  | { ok: false; error: string };

export async function checkDiscountCode(raw: unknown): Promise<DiscountCheck> {
  const found = typeof raw === "string" ? verifyDiscountCode(raw.slice(0, 40)) : null;
  return found
    ? { ok: true, code: found.code, percent: found.percent }
    : { ok: false, error: INVALID_DISCOUNT };
}

export async function sendOrderInquiry(
  raw: unknown,
): Promise<SendInquiryResult> {
  if (
    typeof raw === "object" &&
    raw !== null &&
    "website" in raw &&
    raw.website
  )
    return { ok: true };
  const result = prepareOrderInquiry(raw);
  if (!result.ok) return result;
  return sendInquiry(result.formData);
}

/**
 * Creates a Stripe Checkout session from the cart and returns its URL.
 * Prices are recalculated here from the catalog — nothing price-related comes from the browser.
 */
export async function startCheckout(
  raw: unknown,
): Promise<StartCheckoutResult> {
  const parsed = validateCheckout(raw);
  if (!parsed.ok) return { error: parsed.error };

  if (!paymentsConfigured()) {
    return {
      error: `Apmokėjimas internetu dar neįjungtas. Užsakykite telefonu ${site.phone}.`,
    };
  }

  const { items, services, delivery, discountCode } = parsed.value;
  const discount = discountCode ? verifyDiscountCode(discountCode) : null;
  if (discountCode && !discount) return { error: INVALID_DISCOUNT };
  if (!delivery) {
    return {
      error:
        "Montavimo užsakymui suderinsime individualų pasiūlymą. Pateikite užsakymo užklausą.",
    };
  }
  // Only the code comes from the browser; name and address are taken from Omniva's list.
  let parcelMachine = null;
  if (delivery.method === "parcel") {
    try {
      parcelMachine = await findParcelMachine(delivery.parcelMachineId);
    } catch (err) {
      console.error("[checkout] Could not check the parcel machine:", err);
      return {
        error: `Nepavyko patikrinti paštomato. Bandykite dar kartą, rinkitės kurjerį arba skambinkite ${site.phone}.`,
      };
    }
    if (!parcelMachine)
      return { error: "Pasirinkto paštomato neradome. Pasirinkite kitą." };
  }
  const order = buildOrder(
    items,
    services,
    { method: delivery.method, parcelMachine },
    discount,
  );
  if (order.products.length === 0) return { error: "Krepšelis tuščias." };

  const h = await headers();
  const origin =
    h.get("origin") ??
    `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;

  try {
    const session = await getStripe().checkout.sessions.create(
      buildSessionParams(parsed.value, order, origin, newOrderNumber()),
    );
    if (!session.url)
      throw new Error("Stripe returned a session without a URL");
    return { url: session.url };
  } catch (err) {
    console.error("[checkout] Could not create Stripe session:", err);
    return {
      error: `Nepavyko pradėti apmokėjimo. Bandykite dar kartą arba skambinkite ${site.phone}.`,
    };
  }
}
