"use server";
import { headers } from "next/headers";
import {
  buildSessionParams,
  newOrderNumber,
  validateCheckout,
} from "@/lib/orders/checkout";
import { buildOrder } from "@/lib/orders/order";
import { site } from "@/lib/site";
import { getStripe, paymentsConfigured } from "@/lib/stripe";
import { sendInquiry, SendInquiryResult } from "@/app/kontaktai/actions";
import { prepareOrderInquiry } from "@/lib/orders/inquiry";

export type StartCheckoutResult = { url: string } | { error: string };

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

  const order = buildOrder(parsed.value.items, parsed.value.services);
  if (order.products.length === 0) return { error: "Krepšelis tuščias." };
  if (order.requiresQuote) {
    return {
      error:
        "Šiam užsakymui reikia suderinti pristatymo arba individualių darbų pasiūlymą. Pateikite krepšelio užklausą.",
    };
  }

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
