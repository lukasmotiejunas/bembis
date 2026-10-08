export type StripePaymentMode = "live" | "test";

interface StripeEnvironment {
  [key: string]: string | undefined;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PAYMENT_MODE?: string;
  VERCEL_ENV?: string;
}

export function stripePaymentMode(env: StripeEnvironment = process.env): StripePaymentMode | null {
  if (/^(sk|rk)_live_/.test(env.STRIPE_SECRET_KEY ?? "")) return "live";
  if (/^(sk|rk)_test_/.test(env.STRIPE_SECRET_KEY ?? "")) return "test";
  return null;
}

/** A production deployment must never silently charge in sandbox mode. */
export function stripeConfigurationError(env: StripeEnvironment = process.env) {
  const mode = stripePaymentMode(env);
  if (!mode) return "Stripe secret key is missing or invalid";
  const required = env.STRIPE_PAYMENT_MODE ?? (env.VERCEL_ENV === "production" ? "live" : mode);
  if (required !== "live" && required !== "test") return "Invalid STRIPE_PAYMENT_MODE";
  if (required !== mode) return "Stripe key does not match the requested payment mode";
  if (env.VERCEL_ENV === "production" && mode !== "live") return "Production requires live Stripe payments";
  if (mode === "live" && !env.STRIPE_WEBHOOK_SECRET?.startsWith("whsec_")) {
    return "Live payments require a webhook signing secret";
  }
  return null;
}
