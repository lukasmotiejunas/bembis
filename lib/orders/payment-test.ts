import type Stripe from "stripe";

export const paymentTestProduct = {
  id: "payment-check-1-eur",
  name: "Mokėjimo patikra",
  price: 1,
  description: "Laikina 1 € mokėjimo patikra. Fizinių prekių ir pristatymo nėra.",
} as const;

export const paymentTestEnabled = () => process.env.PAYMENT_TEST_ENABLED === "true";

export function validatePaymentTestCustomer(raw: unknown) {
  if (typeof raw !== "object" || raw === null) return null;
  const value = raw as Record<string, unknown>;
  const name = typeof value.name === "string" ? value.name.trim().slice(0, 100) : "";
  const email = typeof value.email === "string" ? value.email.trim().slice(0, 200) : "";
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return { name, email };
}

/** Fixed amount and quantity, with the same paid-order webhook as ordinary purchases. */
export function buildPaymentTestParams(
  customer: { name: string; email: string }, origin: string, orderNumber: string,
): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "payment",
    locale: "lt",
    allowed_payment_method_types: ["card"],
    customer_email: customer.email,
    client_reference_id: orderNumber,
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: 100,
        product_data: {
          name: paymentTestProduct.name,
          description: paymentTestProduct.description,
          metadata: { product_id: paymentTestProduct.id },
        },
      },
    }],
    metadata: {
      order_number: orderNumber, payment_test: "yes", name: customer.name, email: customer.email,
      installation: "no", removal: "no", delivery: "none", meters: "0",
      items_0: `${paymentTestProduct.name} — 1,00 €`,
      notes: "Mokėjimo patikra. Prekių nepristatyti.",
    },
    payment_intent_data: {
      description: `${paymentTestProduct.name} ${orderNumber}`,
      metadata: { order_number: orderNumber, payment_test: "yes" },
    },
    custom_text: { submit: { message: paymentTestProduct.description } },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/mokejimo-patikra?atsaukta=1`,
  };
}
