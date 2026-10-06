"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import {
  CheckCircle2,
  CreditCard,
  Info,
  Loader2,
  Lock,
  Minus,
  Plus,
  Send,
  ShoppingBag,
  Trash2,
  Truck,
  Wrench,
} from "lucide-react";
import { sendOrderInquiry, startCheckout } from "@/app/checkout/actions";
import { pricing } from "@/lib/data/pricing";
import { formatMeters, formatPrice } from "@/lib/format";
import { CustomerDetails } from "@/lib/orders/checkout";
import { buildOrder } from "@/lib/orders/order";
import { phoneHref, site } from "@/lib/site";
import { useCartHydrated, useCartStore } from "@/lib/store/cartStore";

function Section({
  step,
  title,
  text,
  children,
}: {
  step: number;
  title: string;
  text?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-sand bg-white p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-pine-900 text-sm font-extrabold text-snow">
          {step}
        </span>
        <div>
          <h2 className="text-2xl font-semibold text-pine-900">{title}</h2>
          {text && <p className="mt-1 text-stone">{text}</p>}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
function Field({
  label,
  hint,
  className,
  ...props
}: {
  label: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={clsx("block", className)}>
      <span className="mb-1.5 block text-sm font-bold text-pine-900">
        {label}
        {props.required && <span className="text-glow-deep"> *</span>}
      </span>
      <input className="field" {...props} />
      {hint && <span className="mt-1.5 block text-sm text-stone">{hint}</span>}
    </label>
  );
}
export default function CheckoutView({
  cancelled,
  testMode,
  paymentsReady,
}: {
  cancelled: boolean;
  testMode: boolean;
  paymentsReady: boolean;
}) {
  const hydrated = useCartHydrated();
  const {
    items,
    services,
    customer,
    setService,
    setCustomerField,
    updateQuantity,
    removeItem,
  } = useCartStore();
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();
  const busy = pending || redirecting;
  if (!hydrated)
    return (
      <div className="container-page pb-24" aria-busy="true">
        <div className="h-72 animate-pulse rounded-[2rem] bg-cream" />
      </div>
    );
  const order = buildOrder(items, services);
  if (sent)
    return (
      <div className="container-page pb-24">
        <div
          role="status"
          className="rounded-[2rem] border border-sand bg-white p-8 sm:p-12"
        >
          <CheckCircle2 className="size-12 text-pine-700" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-semibold text-pine-900">
            Užsakymo užklausą gavome
          </h2>
          <p className="mt-3 max-w-xl text-lg text-stone">
            Susisieksime ir suderinsime galutinį pasiūlymą, pristatymą bei
            pageidaujamus darbus. Šiame žingsnyje mokėjimas neatliktas.
          </p>
          <Link href="/kaledines-lemputes" className="btn btn-dark mt-7">
            Grįžti į katalogą
          </Link>
        </div>
      </div>
    );
  if (!order.products.length)
    return (
      <div className="container-page pb-24">
        <div className="flex flex-col items-center rounded-[2rem] border border-sand bg-white px-6 py-16 text-center">
          <ShoppingBag className="size-10 text-pine-700" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-semibold text-pine-900">
            Krepšelis tuščias
          </h2>
          <p className="mt-2 max-w-md text-stone">
            {items.length
              ? "Katalogas atnaujintas. Pasirinkite prekes iš naujo pagal tikrą XP ir LLinks pasiūlą."
              : "Išsirinkite girliandas ar komplektą, o dėl nuomos suderinsime atskirą pasiūlymą."}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/kaledines-lemputes" className="btn btn-dark">
              Pirkti lemputes
            </Link>
            <Link href="/nuoma" className="btn btn-outline">
              Nuomos pasirinkimai
            </Link>
          </div>
        </div>
      </div>
    );
  const field = (name: keyof CustomerDetails) => ({
    name,
    value: customer[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setCustomerField(name, e.target.value),
  });
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const website = String(new FormData(e.currentTarget).get("website") ?? "");
    setError(null);
    const selectedItems = order.products.map((line) => ({
      productId: line.productId!,
      mode: line.mode!,
      quantity: line.quantity,
    }));
    startTransition(async () => {
      try {
        if (order.requiresQuote) {
          const result = await sendOrderInquiry({
            items: selectedItems,
            services,
            customer,
            website,
          });
          if (result.ok) setSent(true);
          else setError(result.error);
        } else {
          const result = await startCheckout({
            items: selectedItems,
            services,
            customer,
          });
          if ("url" in result) {
            setRedirecting(true);
            window.location.assign(result.url);
          } else setError(result.error);
        }
      } catch {
        setError(`Nepavyko pateikti užsakymo. Paskambinkite ${site.phone}.`);
      }
    });
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="container-page grid items-start gap-6 pb-24 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8"
    >
      <div className="space-y-6">
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label>
            Svetainė
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        {cancelled && (
          <p className="rounded-2xl bg-cream p-4 text-sm text-pine-900">
            Mokėjimas atšauktas. Jūsų krepšelis ir duomenys išsaugoti.
          </p>
        )}
        {items.length !== order.products.length && (
          <p className="rounded-2xl bg-cream p-4 text-sm text-pine-900">
            Kai kurios ankstesnio katalogo prekės nebesiūlomos. Į šį užsakymą
            įtrauktos tik žemiau parodytos prekės.
          </p>
        )}
        {testMode && !order.requiresQuote && (
          <p className="flex gap-3 rounded-2xl bg-glow-soft p-4 text-sm text-pine-900">
            <CreditCard className="size-5 shrink-0" aria-hidden="true" />
            <span>
              <strong>Testinis mokėjimų režimas.</strong> Mokėjimai netikri.
              Bandymams naudokite kortelę 4242 4242 4242 4242, būsimą galiojimo
              datą ir bet kokį CVC.
            </span>
          </p>
        )}
        <Section step={1} title="Jūsų prekės">
          <ul className="divide-y divide-sand">
            {order.products.map((line) => (
              <li
                key={line.key}
                className="flex gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-sand bg-cream">
                  <Image
                    src={line.image!}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold leading-snug text-pine-900">
                        {line.name}
                      </p>
                      <p className="mt-1 text-sm text-stone">
                        {line.detail} · {formatPrice(line.unitPrice)} / vnt.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.productId!, line.mode!)}
                      className="p-1 text-stone hover:text-berry"
                      aria-label={`Pašalinti ${line.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border-[1.5px] border-sand">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            line.productId!,
                            line.mode!,
                            line.quantity - 1,
                          )
                        }
                        className="flex size-9 items-center justify-center text-pine-900"
                        aria-label="Mažiau"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm font-bold">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={line.quantity >= 99}
                        onClick={() =>
                          updateQuantity(
                            line.productId!,
                            line.mode!,
                            line.quantity + 1,
                          )
                        }
                        className="flex size-9 items-center justify-center text-pine-900 disabled:opacity-40"
                        aria-label="Daugiau"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <p className="font-bold text-pine-900">
                      {formatPrice(line.total)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
        <Section
          step={2}
          title="Montavimas ir pristatymas"
          text="Individualaus objekto darbų ir pristatymo sąlygas suderiname pasiūlyme."
        >
          <label className="flex cursor-pointer gap-4 rounded-3xl border-2 border-sand p-5 has-checked:border-pine-900">
            <input
              type="checkbox"
              checked={order.serviceRequested}
              onChange={(e) => {
                setService("installation", e.target.checked);
                setService("removal", e.target.checked);
              }}
              className="mt-1 size-5 shrink-0 accent-pine-900"
            />
            <span>
              <strong className="flex items-center gap-2 text-lg text-pine-900">
                <Wrench className="size-5" aria-hidden="true" />
                Domina montavimas ir nuėmimas
              </strong>
              <span className="mt-2 block text-sm text-stone">
                Standartinis darbo tarifas su mūsų lemputėmis —{" "}
                {formatPrice(pricing.installPerMeter)}/m, įskaitant nuėmimą po
                sezono.
              </span>
              {order.serviceRequested && (
                <span className="mt-3 block text-sm font-semibold text-pine-900">
                  Pagal prekių ilgį: {formatMeters(order.meters)} ×{" "}
                  {formatPrice(pricing.installPerMeter)}/m ={" "}
                  {formatPrice(order.installationEstimate)}. Galutinė darbų
                  kaina bus suderinta pagal objektą.
                </span>
              )}
            </span>
          </label>
          <div className="mt-4 flex gap-3 rounded-2xl bg-cream p-4 text-sm text-pine-900">
            <Truck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>
              {order.deliveryNeedsQuote
                ? "Pristatymo sąlygas ir kainą suderiname su jumis."
                : `Prekių pristatymas (${pricing.deliveryArea}) nemokamas. Laiką suderiname su jumis.`}
            </p>
          </div>
        </Section>
        <Section
          step={3}
          title="Kontaktai ir adresas"
          text="Šiais kontaktais susisieksime dėl jūsų užsakymo."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Vardas ir pavardė"
              required
              autoComplete="name"
              {...field("name")}
            />
            <Field
              label="Telefonas"
              required
              type="tel"
              autoComplete="tel"
              {...field("phone")}
            />
            <Field
              label="El. paštas"
              required
              type="email"
              autoComplete="email"
              className="sm:col-span-2"
              hint={
                order.requiresQuote
                  ? "Šiuo adresu galėsime suderinti pasiūlymą."
                  : "Šiuo adresu atsiųsime mokėjimo patvirtinimą."
              }
              {...field("email")}
            />
            <Field
              label="Adresas"
              required
              autoComplete="street-address"
              {...field("address")}
            />
            <Field
              label="Miestas ar gyvenvietė"
              required
              autoComplete="address-level2"
              {...field("city")}
            />
            {order.serviceRequested && (
              <Field
                label="Pageidaujama montavimo data"
                type="date"
                className="sm:col-span-2"
                hint="Galutinę darbų datą suderiname."
                {...field("installDate")}
              />
            )}
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-bold text-pine-900">
                Pastabos
              </span>
              <textarea
                rows={3}
                maxLength={1000}
                className="field resize-y"
                {...field("notes")}
              />
            </label>
          </div>
        </Section>
      </div>
      <aside className="lg:sticky lg:top-28">
        <div className="rounded-[2rem] bg-pine-900 p-6 text-snow sm:p-8">
          <h2 className="text-2xl font-semibold">Užsakymo suvestinė</h2>
          <ul className="mt-6 space-y-3 text-sm">
            {order.lines.map((line) => (
              <li key={line.key} className="flex justify-between gap-4">
                <span className="text-snow/75">
                  {line.name}
                  {line.quantity > 1 && ` × ${line.quantity}`}
                </span>
                <span className="shrink-0 font-semibold">
                  {line.kind === "delivery" && line.total === 0
                    ? "Nemokamai"
                    : formatPrice(line.total)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4 border-t border-dashed border-snow/20 pt-5">
            <span className="font-semibold">
              {order.requiresQuote ? "Prekių suma" : "Iš viso"}
            </span>
            <strong className="font-display text-4xl text-glow">
              {formatPrice(order.total)}
            </strong>
          </div>
          {order.requiresQuote && (
            <p className="mt-4 flex gap-2 text-sm text-snow/75">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                Pateikiate užklausą. Galutinį pasiūlymą su pristatymu ir
                pageidaujamais darbais suderinsime prieš apmokėjimą.
              </span>
            </p>
          )}
          <button
            type="submit"
            disabled={busy || (!order.requiresQuote && !paymentsReady)}
            className="btn btn-primary mt-6 w-full disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : order.requiresQuote ? (
              <Send className="size-4" aria-hidden="true" />
            ) : (
              <Lock className="size-4" aria-hidden="true" />
            )}
            {busy
              ? "Pateikiama…"
              : order.requiresQuote
                ? "Pateikti užsakymo užklausą"
                : `Apmokėti ${formatPrice(order.total)}`}
          </button>
          {error && (
            <p
              role="alert"
              className="mt-4 rounded-2xl bg-berry/90 p-4 text-sm font-semibold"
            >
              {error}
            </p>
          )}
          {!order.requiresQuote && !paymentsReady && (
            <p className="mt-4 text-sm text-snow/75">
              Apmokėjimas internetu dar neįjungtas. Skambinkite{" "}
              <a href={phoneHref} className="font-bold text-glow">
                {site.phone}
              </a>
              .
            </p>
          )}
          {!order.requiresQuote && (
            <p className="mt-5 text-center text-xs text-snow/60">
              Saugų mokėjimą užtikrina Stripe
            </p>
          )}
        </div>
        <p className="mt-4 text-center text-sm text-stone">
          Klausimų?{" "}
          <a href={phoneHref} className="font-bold text-pine-900">
            {site.phone}
          </a>
        </p>
      </aside>
    </form>
  );
}
