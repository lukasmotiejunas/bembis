// Server only: reads the secret key. Never import this from a Client Component.
import Stripe from "stripe";
import { stripeConfigurationError, stripePaymentMode } from "./stripe-config";

let client: Stripe | undefined;

export function getStripe() {
  const error = stripeConfigurationError();
  if (error) throw new Error(error);
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  client ??= new Stripe(key);
  return client;
}

export const paymentsConfigured = () => stripeConfigurationError() === null;

/** Test keys = fake payments with Stripe test cards (e.g. 4242 4242 4242 4242). */
export const isStripeTestMode = () => stripePaymentMode() === "test";
