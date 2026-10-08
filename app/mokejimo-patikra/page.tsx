import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import PaymentTestForm from "@/components/checkout/PaymentTestForm";
import { paymentTestEnabled, paymentTestProduct } from "@/lib/orders/payment-test";
import { isStripeTestMode, paymentsConfigured } from "@/lib/stripe";

export const metadata: Metadata = { title: "Mokėjimo patikra", robots: { index: false, follow: false } };

export default async function PaymentTestPage() {
  await connection();
  if (!paymentTestEnabled()) notFound();
  const ready = paymentsConfigured();
  return (
    <section className="container-page max-w-xl py-16 sm:py-24">
      <p className="eyebrow">Laikinas produktas</p>
      <h1 className="mt-3 text-4xl font-semibold text-pine-900">{paymentTestProduct.name}</h1>
      <p className="mt-5 text-lg text-stone">{paymentTestProduct.description}</p>
      <p className="mt-6 font-display text-4xl font-semibold text-pine-900">1,00 €</p>
      {ready && <p className="mt-4 rounded-2xl bg-cream p-4 text-stone">
        {isStripeTestMode() ? "Šiuo metu naudojami bandomieji mokėjimai. Tikri pinigai nebus nuskaičiuoti." : "Tai tikras 1 € mokėjimas. Pinigai bus nuskaičiuoti iš jūsų kortelės."}
      </p>}
      <PaymentTestForm ready={ready} />
      <Link href="/kaledines-lemputes" className="mt-6 inline-block font-semibold text-pine-900 underline">Grįžti į parduotuvę</Link>
    </section>
  );
}
