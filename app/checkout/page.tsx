import type { Metadata } from "next";
import CheckoutView from "@/components/checkout/CheckoutView";
import { isStripeTestMode, paymentsConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Apmokėjimas",
  robots: { index: false },
};

export default async function CheckoutPage(props: PageProps<"/checkout">) {
  const { atsaukta } = await props.searchParams;

  return (
    <>
      <div className="container-page pt-10 pb-8 sm:pt-14">
        <p className="eyebrow">Apmokėjimas</p>
        <h1 className="mt-2 text-4xl font-semibold text-pine-900 sm:text-5xl">Jūsų užsakymas</h1>
      </div>
      <CheckoutView cancelled={atsaukta === "1"} testMode={isStripeTestMode()} paymentsReady={paymentsConfigured()} />
    </>
  );
}
