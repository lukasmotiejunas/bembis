import type Stripe from "stripe";
import { appendOrderToSheet, sheetFieldsFromSession } from "@/lib/orders/sheet";
import { getStripe } from "@/lib/stripe";

/**
 * Stripe calls this after checkout. An order is written to Google Sheets only once the
 * payment is confirmed as paid. Any failure returns 5xx so Stripe retries (for up to 3 days);
 * the Apps Script skips rows it has already written, so retries never create duplicates.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) {
    return new Response("Webhook not configured", { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    return new Response(`Webhook error: ${(err as Error).message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    if (session.payment_status === "paid") {
      try {
        await appendOrderToSheet(sheetFieldsFromSession(session));
      } catch (err) {
        console.error(`[stripe-webhook] Could not write order ${session.id} to Google Sheets:`, err);
        return new Response("Could not record order", { status: 500 });
      }
    }
  }

  return Response.json({ received: true });
}
