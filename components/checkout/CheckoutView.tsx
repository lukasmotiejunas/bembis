"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import {
  AlertCircle,
  Check,
  CreditCard,
  Info,
  Loader2,
  Lock,
  Minus,
  Plus,
  RotateCcw,
  ShoppingBag,
  Trash2,
  Truck,
  Wrench,
} from "lucide-react";
import { startCheckout } from "@/app/checkout/actions";
import { pricing } from "@/lib/data/pricing";
import { productFor, productHref } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { CustomerDetails } from "@/lib/orders/checkout";
import { buildOrder, OrderServices } from "@/lib/orders/order";
import { phoneHref, site } from "@/lib/site";
import { useCartHydrated, useCartStore } from "@/lib/store/cartStore";
import ModeBadge from "../ModeBadge";

function Section({ step, title, text, children }: { step: number; title: string; text?: string; children: React.ReactNode }) {
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

function Notice({ tone, icon: Icon, children }: { tone: "info" | "warn" | "ok"; icon: typeof Info; children: React.ReactNode }) {
  return (
    <div
      className={clsx(
        "flex gap-3 rounded-2xl px-4 py-3.5 text-sm leading-relaxed",
        tone === "warn" && "bg-glow-soft text-pine-900",
        tone === "info" && "bg-cream text-pine-900",
        tone === "ok" && "bg-pine-900/5 text-pine-900"
      )}
    >
      <Icon className={clsx("mt-0.5 size-4 shrink-0", tone === "warn" ? "text-glow-deep" : "text-pine-700")} aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

const serviceCards: { key: keyof OrderServices; icon: typeof Wrench; title: string; text: string; perMeter: number }[] = [
  {
    key: "installation",
    icon: Wrench,
    title: "Montavimas",
    text: "Atvažiuojame ir sumontuojame lemputes ant jūsų namo. Lemputes atvešime patys.",
    perMeter: pricing.installPerMeter,
  },
  {
    key: "removal",
    icon: RotateCcw,
    title: "Nuėmimas po švenčių",
    text: "Sausį nuimame lemputes. Nuomotas išsivežame, pirktas supakuojame jums.",
    perMeter: pricing.removalPerMeter,
  },
];

function Field({
  label,
  hint,
  className,
  ...props
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
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

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
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
  const { items, services, customer, setService, setCustomerField, updateQuantity, removeItem } = useCartStore();
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [pending, startTransition] = useTransition();
  const busy = pending || redirecting;

  if (!hydrated) {
    return (
      <div className="container-page grid gap-6 pb-24 lg:grid-cols-[minmax(0,1fr)_400px]" aria-busy="true">
        <div className="space-y-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-[2rem] bg-cream" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-[2rem] bg-cream" />
      </div>
    );
  }

  const order = buildOrder(items, services);

  if (order.products.length === 0) {
    return (
      <div className="container-page pb-24">
        <div className="flex flex-col items-center rounded-[2rem] border border-sand bg-white px-6 py-16 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-cream">
            <ShoppingBag className="size-7 text-pine-700" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-3xl font-semibold text-pine-900">Krepšelis tuščias</h2>
          <p className="mt-2 max-w-md text-stone">Išsirinkite lemputes — jas galite pirkti arba išsinuomoti sezonui.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href={productHref(productFor("buy"))} className="btn btn-dark">
              Pirkti lemputes
            </Link>
            <Link href={productHref(productFor("rent"))} className="btn btn-outline">
              Nuomotis sezonui
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const field = (name: keyof CustomerDetails) => ({
    name,
    value: customer[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCustomerField(name, e.target.value),
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await startCheckout({ items, services, customer });
      if ("url" in result) {
        setRedirecting(true);
        window.location.assign(result.url);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="container-page grid items-start gap-6 pb-24 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
      <div className="space-y-6">
        {cancelled && (
          <Notice tone="info" icon={Info}>
            Mokėjimas atšauktas — pinigai nenuskaityti. Jūsų krepšelis ir duomenys išsaugoti.
          </Notice>
        )}
        {testMode && (
          <Notice tone="warn" icon={CreditCard}>
            <strong>Testinis režimas — mokėjimai netikri.</strong> Mokėdami naudokite kortelę{" "}
            <span className="font-bold whitespace-nowrap tabular-nums">4242 4242 4242 4242</span>, bet kokią būsimą
            galiojimo datą ir bet kokį CVC kodą.
          </Notice>
        )}

        <Section step={1} title="Jūsų prekės">
          <ul className="divide-y divide-sand">
            {order.products.map((line) => {
              const productId = line.productId!;
              const mode = line.mode!;
              return (
                <li key={line.key} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-sand bg-white">
                    <Image src={line.image!} alt="" fill sizes="80px" className="object-contain p-1.5" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="leading-snug font-bold text-pine-900">{line.name}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-stone">
                          <ModeBadge mode={mode} />
                          {formatPrice(line.unitPrice)}
                          {mode === "rent" ? " / sezonui" : ""}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(productId, mode)}
                        className="-m-1 p-1 text-stone hover:text-berry"
                        aria-label={`Pašalinti ${line.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border-[1.5px] border-sand bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(productId, mode, line.quantity - 1)}
                          className="flex size-9 items-center justify-center text-pine-900"
                          aria-label="Mažiau"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-bold">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(productId, mode, line.quantity + 1)}
                          className="flex size-9 items-center justify-center text-pine-900"
                          aria-label="Daugiau"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="font-bold text-pine-900 tabular-nums">{formatPrice(line.total)}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section
          step={2}
          title="Paslaugos"
          text={`Montavimą ir nuėmimą užsakote atskirai. Kaina skaičiuojama pagal lempučių ilgį — jūsų krepšelyje ${order.meters} m.`}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {serviceCards.map(({ key, icon: Icon, title, text, perMeter }) => {
              const checked = services[key];
              return (
                <label
                  key={key}
                  className={clsx(
                    "relative flex cursor-pointer flex-col rounded-3xl border-2 p-5 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-glow-deep",
                    checked ? "border-pine-900 bg-snow" : "border-sand bg-white hover:border-pine-900/30"
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => setService(key, e.target.checked)}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span className={clsx("flex size-12 items-center justify-center rounded-2xl", checked ? "bg-pine-900" : "bg-glow-soft")}>
                      <Icon className={clsx("size-6", checked ? "text-glow" : "text-glow-deep")} aria-hidden="true" />
                    </span>
                    <span
                      className={clsx(
                        "flex size-6 items-center justify-center rounded-lg border-2 transition-colors",
                        checked ? "border-pine-900 bg-pine-900 text-snow" : "border-sand"
                      )}
                    >
                      {checked && <Check className="size-4" strokeWidth={3} aria-hidden="true" />}
                    </span>
                  </div>
                  <span className="mt-4 text-lg font-bold text-pine-900">{title}</span>
                  <span className="mt-1 text-sm leading-relaxed text-stone">{text}</span>
                  <span className="mt-auto pt-4">
                    <span className="flex items-baseline justify-between gap-3 border-t border-sand pt-3 text-sm">
                      <span className="text-stone">
                        {order.meters} m × {formatPrice(perMeter)}
                      </span>
                      <span className="text-base font-extrabold text-pine-900 tabular-nums">
                        +{formatPrice(order.meters * perMeter)}
                      </span>
                    </span>
                  </span>
                </label>
              );
            })}
          </div>

          <div className="mt-4 space-y-3">
            {services.installation ? (
              <Notice tone="ok" icon={Truck}>
                Lemputes atvešime montavimo dieną — <strong>pristatymas nemokamas</strong>.
              </Notice>
            ) : (
              <Notice tone="info" icon={Truck}>
                Be montavimo lemputes pristatysime į namus ({pricing.deliveryArea}) —{" "}
                <strong>{formatPrice(pricing.deliveryFee)}</strong>.
              </Notice>
            )}
            {order.hasRentals && !services.removal && (
              <Notice tone="warn" icon={AlertCircle}>
                Nuomotas lemputes po švenčių reikės grąžinti. Užsisakykite nuėmimą — viską padarysime už jus.
              </Notice>
            )}
          </div>
        </Section>

        <Section step={3} title="Kontaktai ir adresas" text="Šiais kontaktais susisieksime ir suderinsime laiką.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Vardas ir pavardė" required autoComplete="name" placeholder="Vardenis Pavardenis" {...field("name")} />
            <Field label="Telefonas" required type="tel" autoComplete="tel" placeholder="+370 6.. ....." {...field("phone")} />
            <Field
              label="El. paštas"
              required
              type="email"
              autoComplete="email"
              placeholder="vardas@pastas.lt"
              className="sm:col-span-2"
              hint="Šiuo adresu atsiųsime mokėjimo patvirtinimą."
              {...field("email")}
            />
            <Field label="Adresas" required autoComplete="street-address" placeholder="Gatvė, namo nr." {...field("address")} />
            <Field label="Miestas ar gyvenvietė" required autoComplete="address-level2" placeholder="Vilnius" {...field("city")} />
            {services.installation && (
              <Field
                label="Pageidaujama montavimo data"
                type="date"
                min={tomorrow()}
                className="sm:col-span-2"
                hint="Montuojame lapkritį–gruodį. Tikslų laiką suderinsime telefonu."
                {...field("installDate")}
              />
            )}
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-bold text-pine-900">Pastabos</span>
              <textarea
                rows={3}
                className="field resize-y"
                placeholder="Pvz., kur yra lauko elektros lizdas, vartų kodas..."
                {...field("notes")}
              />
            </label>
          </div>
        </Section>
      </div>

      <aside className="lg:sticky lg:top-28">
        <div className="relative overflow-hidden rounded-[2rem] bg-pine-900 p-6 text-snow sm:p-8">
          <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-glow/20 blur-3xl" />
          <h2 className="relative text-2xl font-semibold">Užsakymo suvestinė</h2>

          <ul className="relative mt-6 space-y-3 text-sm">
            {order.lines.map((line) => (
              <li key={line.key} className="flex justify-between gap-4">
                <span className="text-snow/75">
                  {line.name}
                  {line.quantity > 1 && <span className="text-snow/50"> × {line.quantity}</span>}
                </span>
                <span className="shrink-0 font-semibold tabular-nums">{formatPrice(line.total)}</span>
              </li>
            ))}
            {services.installation && (
              <li className="flex justify-between gap-4">
                <span className="text-snow/75">Pristatymas</span>
                <span className="shrink-0 font-semibold text-glow">Nemokamai</span>
              </li>
            )}
          </ul>

          <div className="relative mt-6 flex items-baseline justify-between gap-4 border-t border-dashed border-snow/20 pt-5">
            <span className="font-semibold">Iš viso</span>
            <span className="font-display text-4xl font-semibold text-glow tabular-nums">{formatPrice(order.total)}</span>
          </div>

          <button type="submit" disabled={busy || !paymentsReady} className="btn btn-primary relative mt-6 w-full disabled:opacity-60">
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Nukreipiame į apmokėjimą…
              </>
            ) : (
              <>
                <Lock className="size-4" aria-hidden="true" />
                Apmokėti {formatPrice(order.total)}
              </>
            )}
          </button>

          {error && (
            <p role="alert" className="relative mt-4 rounded-2xl bg-berry/90 px-4 py-3 text-sm font-semibold">
              {error}
            </p>
          )}
          {!paymentsReady && (
            <p className="relative mt-4 text-sm text-snow/75">
              Apmokėjimas internetu dar neįjungtas. Užsakykite telefonu{" "}
              <a href={phoneHref} className="font-bold text-glow underline underline-offset-4">
                {site.phone}
              </a>
              .
            </p>
          )}

          <p className="relative mt-5 flex items-center justify-center gap-2 text-xs text-snow/60">
            <Lock className="size-3.5" aria-hidden="true" />
            Saugų mokėjimą užtikrina „Stripe“ · kortelė, Apple Pay, Google Pay
          </p>
        </div>

        <p className="mt-4 px-2 text-center text-sm text-stone">
          Klausimų? Skambinkite{" "}
          <a href={phoneHref} className="font-bold whitespace-nowrap text-pine-900">
            {site.phone}
          </a>
        </p>
      </aside>
    </form>
  );
}
