import type { Metadata } from "next";
import Link from "next/link";
import type Stripe from "stripe";
import { CalendarCheck, Check, Clock, Phone, Truck } from "lucide-react";
import ClearCartOnSuccess from "@/components/checkout/ClearCartOnSuccess";
import { formatPrice } from "@/lib/format";
import { fromChunks } from "@/lib/orders/checkout";
import { phoneHref, site } from "@/lib/site";
import { getStripe, paymentsConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Užsakymas apmokėtas",
  robots: { index: false },
};

async function loadSession(id: string | undefined) {
  if (!id || !paymentsConfigured()) return null;
  try {
    return await getStripe().checkout.sessions.retrieve(id);
  } catch (err) {
    console.error("[checkout/success] Could not load session", id, err);
    return null;
  }
}

function NextStep({ icon: Icon, title, text }: { icon: typeof Clock; title: string; text: string }) {
  return (
    <li className="flex gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-glow-soft">
        <Icon className="size-5 text-glow-deep" aria-hidden="true" />
      </span>
      <div>
        <p className="font-bold text-pine-900">{title}</p>
        <p className="text-stone">{text}</p>
      </div>
    </li>
  );
}

function Paid({ session }: { session: Stripe.Checkout.Session }) {
  const m = session.metadata ?? {};
  const lines = fromChunks(m, "items").split("\n").filter(Boolean);
  const installation = m.installation === "yes";
  const removal = m.removal === "yes";

  return (
    <>
      <ClearCartOnSuccess />
      <div className="text-center">
        <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-glow shadow-[0_0_60px_rgb(244_176_62/0.55)]">
          <Check className="size-10 text-pine-950" strokeWidth={3} aria-hidden="true" />
        </span>
        <p className="eyebrow mt-8">Užsakymas apmokėtas</p>
        <h1 className="mt-3 text-4xl font-semibold text-pine-900 sm:text-5xl">Ačiū, {m.name?.split(" ")[0] ?? "jūsų užsakymas priimtas"}!</h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-stone">
          Gavome jūsų užsakymą ir apmokėjimą. Netrukus susisieksime telefonu{m.phone ? ` ${m.phone}` : ""}.
        </p>
        {m.order_number && (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 font-bold text-pine-900">
            Užsakymo nr. <span className="tabular-nums">{m.order_number}</span>
          </p>
        )}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-[2rem] border border-sand bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-pine-900">Jūsų užsakymas</h2>
          <ul className="mt-5 space-y-2.5 text-stone">
            {lines.map((line) => {
              const cut = line.lastIndexOf(" — ");
              const [label, price] = [line.slice(0, cut), line.slice(cut + 3)];
              return (
                <li key={line} className="flex justify-between gap-4">
                  <span>{label}</span>
                  <span className="shrink-0 font-semibold text-pine-900 tabular-nums">{price}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 flex items-baseline justify-between border-t border-dashed border-sand pt-4">
            <span className="font-bold text-pine-900">Apmokėta</span>
            <span className="font-display text-3xl font-semibold text-pine-900">{formatPrice((session.amount_total ?? 0) / 100)}</span>
          </p>
          {(m.address || m.city) && (
            <p className="mt-4 text-sm text-stone">
              Adresas: {[m.address, m.city].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        <div className="rounded-[2rem] bg-cream p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-pine-900">Kas toliau?</h2>
          <ol className="mt-5 space-y-5">
            <NextStep icon={Phone} title="Susisieksime" text="Paskambinsime ir suderinsime jums patogų laiką." />
            {installation ? (
              <NextStep
                icon={CalendarCheck}
                title="Sumontuosime"
                text={m.install_date ? `Pageidaujama data: ${m.install_date}. Lemputes atvešime patys.` : "Atvešime lemputes ir jas sumontuosime."}
              />
            ) : (
              <NextStep icon={Truck} title="Pristatysime" text="Lemputes atvešime nurodytu adresu." />
            )}
            {removal && <NextStep icon={Clock} title="Po švenčių nuimsime" text="Sausį atvažiuosime ir viską nuimsime." />}
          </ol>
        </div>
      </div>
    </>
  );
}

export default async function CheckoutSuccessPage(props: PageProps<"/checkout/success">) {
  const { session_id } = await props.searchParams;
  const session = await loadSession(typeof session_id === "string" ? session_id : undefined);
  const paid = session?.payment_status === "paid";

  return (
    <section className="container-page max-w-4xl py-16 sm:py-24">
      {paid ? (
        <Paid session={session} />
      ) : (
        <div className="text-center">
          <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-cream">
            <Clock className="size-9 text-pine-700" aria-hidden="true" />
          </span>
          <h1 className="mt-8 text-4xl font-semibold text-pine-900">
            {session ? "Mokėjimas dar apdorojamas" : "Užsakymo neradome"}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-stone">
            {session
              ? "Kai tik mokėjimas bus patvirtintas, užsakymą gausime automatiškai ir su jumis susisieksime."
              : "Jei apmokėjote, bet matote šį pranešimą, paskambinkite mums — viską patikrinsime."}
          </p>
        </div>
      )}

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-dark">
          Į pradžią
        </Link>
        <a href={phoneHref} className="btn btn-outline">
          <Phone className="size-4" aria-hidden="true" />
          {site.phone}
        </a>
      </div>
    </section>
  );
}
