"use server";

import { headers } from "next/headers";
import { newOrderNumber } from "@/lib/orders/checkout";
import { buildPaymentTestParams, paymentTestEnabled, validatePaymentTestCustomer } from "@/lib/orders/payment-test";
import { site } from "@/lib/site";
import { getStripe, paymentsConfigured } from "@/lib/stripe";

export async function startPaymentTest(raw: unknown): Promise<{ url: string } | { error: string }> {
  if (!paymentTestEnabled()) return { error: "Mokėjimo patikra išjungta." };
  if (!paymentsConfigured()) return { error: "Apmokėjimas dar neparuoštas." };
  const customer = validatePaymentTestCustomer(raw);
  if (!customer) return { error: "Įrašykite vardą ir teisingą el. pašto adresą." };
  const h = await headers();
  // Local development may return to localhost; deployed payments always return to our own site.
  const origin = process.env.NODE_ENV === "development" ? h.get("origin") ?? site.url : site.url;
  try {
    const session = await getStripe().checkout.sessions.create(
      buildPaymentTestParams(customer, origin, `TEST-${newOrderNumber()}`),
    );
    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return { url: session.url };
  } catch (error) {
    console.error("[payment-test] Could not start checkout:", error);
    return { error: "Nepavyko pradėti mokėjimo. Bandykite dar kartą." };
  }
}
