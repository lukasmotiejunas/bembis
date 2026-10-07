"use client";
import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import {
  buildLightSet,
  LightSet,
  lightSetItems,
  MAX_SET_METERS,
  SECTION_METERS,
  sectionsFor,
} from "@/lib/data/lightSet";
import { pricing } from "@/lib/data/pricing";
import { guarantee, seriesNames } from "@/lib/data/products";
import { formatMeters, formatPrice, money, plural } from "@/lib/format";
import { useCartStore } from "@/lib/store/cartStore";
import { LightSeries, Product } from "@/lib/types";

const presets = [15, 30, 45, 60];
const seriesText: Record<LightSeries, string> = {
  xp: "Aukščiausios kokybės lauko LED",
  llinks: "Komercinės klasės profesionalios LED",
};
/** Longest chain drawn segment by segment; longer ones end with "+N". */
const SHOWN_SEGMENTS = 24;

const extensionsLabel = (n: number) =>
  `${n} ${plural(n, "papildoma sekcija", "papildomos sekcijos", "papildomų sekcijų")}`;

export default function LightSetBuilder() {
  const [value, setValue] = useState("30");
  const meters = value === "" ? NaN : Number(value);
  const sets = (["xp", "llinks"] as const).map((series) =>
    buildLightSet(series, meters),
  );
  const sections = sets[0] ? sectionsFor(meters) : 0;
  const tooLong = Number.isFinite(meters) && meters > MAX_SET_METERS;

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  // Same as any product's "Į krepšelį": the set joins the cart and the cart opens.
  const order = (set: LightSet) => {
    for (const item of lightSetItems(set))
      addItem(item.productId, item.mode, item.quantity);
    openCart();
  };
  const step = (delta: number) => {
    const current = Number.isFinite(meters) ? meters : 0;
    setValue(String(Math.max(SECTION_METERS, money(current + delta))));
  };

  return (
    <div
      id="rinkinys"
      className="scroll-mt-28 rounded-[2rem] border border-sand bg-white p-6 shadow-[0_40px_80px_-48px_rgb(18_42_31/0.45)] sm:p-9"
    >
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <div>
          <p className="eyebrow">Rinkinio skaičiuoklė</p>
          <h2 className="mt-3 text-3xl leading-tight font-semibold text-pine-900 sm:text-4xl">
            Kiek metrų apšvietimo reikia?
          </h2>
          <p className="mt-3 leading-relaxed text-stone">
            Įveskite ilgį — sudarysime rinkinį iš vienos motininės girliandos ir
            tiek papildomų sekcijų, kiek reikia.
          </p>

          <label
            htmlFor="set-meters"
            className="mt-7 block text-sm font-bold text-pine-900"
          >
            Reikalingas ilgis
          </label>
          <div className="mt-2 flex h-16 overflow-hidden rounded-2xl border-[1.5px] border-sand bg-white transition-shadow focus-within:border-pine-700 focus-within:shadow-[0_0_0_4px_rgb(36_80_57/0.12)]">
            <button
              type="button"
              onClick={() => step(-SECTION_METERS)}
              disabled={!Number.isFinite(meters) || meters <= SECTION_METERS}
              aria-label="Viena sekcija mažiau"
              className="flex w-14 shrink-0 items-center justify-center border-r border-sand text-pine-900 transition-colors hover:bg-cream disabled:opacity-35 disabled:hover:bg-transparent"
            >
              <Minus className="size-5" aria-hidden="true" />
            </button>
            <div className="relative flex min-w-0 flex-1 items-center justify-center">
              <input
                id="set-meters"
                type="number"
                inputMode="decimal"
                min="0.1"
                max={MAX_SET_METERS}
                step="0.1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full min-w-0 [appearance:textfield] bg-transparent pr-8 pl-4 text-center font-display text-3xl font-semibold text-pine-900 outline-none focus-visible:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="pointer-events-none absolute right-4 text-lg font-semibold text-stone">
                m
              </span>
            </div>
            <button
              type="button"
              onClick={() => step(SECTION_METERS)}
              disabled={Number.isFinite(meters) && meters + SECTION_METERS > MAX_SET_METERS}
              aria-label="Viena sekcija daugiau"
              className="flex w-14 shrink-0 items-center justify-center border-l border-sand text-pine-900 transition-colors hover:bg-cream disabled:opacity-35 disabled:hover:bg-transparent"
            >
              <Plus className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {presets.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={meters === m}
                onClick={() => setValue(String(m))}
                className={clsx(
                  "rounded-full border-[1.5px] px-3.5 py-1.5 text-sm font-bold transition-colors",
                  meters === m
                    ? "border-pine-900 bg-pine-900 text-snow"
                    : "border-sand bg-white text-pine-900 hover:border-pine-900",
                )}
              >
                {m} m
              </button>
            ))}
          </div>

          {sections > 0 && (
            <div className="mt-7 rounded-2xl bg-cream p-5">
              <p className="font-bold text-pine-900">
                {formatMeters(sections * SECTION_METERS)} ·{" "}
                {sections}{" "}
                {plural(sections, "sekcija", "sekcijos", "sekcijų")}
              </p>
              <p className="text-sm text-stone">
                1 motininė girlianda
                {sections > 1 && ` + ${extensionsLabel(sections - 1)}`}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-1.5" aria-hidden="true">
                {Array.from(
                  { length: Math.min(sections, SHOWN_SEGMENTS) },
                  (_, i) => (
                    <span
                      key={i}
                      className={clsx(
                        "h-2.5 w-6 rounded-full",
                        i === 0
                          ? "bg-glow shadow-[0_0_10px_rgb(244_176_62/0.9)]"
                          : "bg-glow/45",
                      )}
                    />
                  ),
                )}
                {sections > SHOWN_SEGMENTS && (
                  <span className="ml-1 text-xs font-bold text-stone">
                    +{sections - SHOWN_SEGMENTS}
                  </span>
                )}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-stone">
                Girliandos parduodamos {formatMeters(SECTION_METERS)}{" "}
                sekcijomis, todėl ilgį apvaliname į didesnę pusę.
              </p>
            </div>
          )}
        </div>

        <div>
          {sets[0] && sets[1] ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[sets[0], sets[1]].map((set) => (
                <SetCard
                  key={set.series}
                  set={set}
                  onOrder={() => order(set)}
                />
              ))}
            </div>
          ) : (
            <div
              role="status"
              className="flex h-full min-h-48 flex-col items-center justify-center rounded-3xl bg-cream p-8 text-center"
            >
              {tooLong ? (
                <>
                  <p className="font-bold text-pine-900">
                    Daugiau nei {formatMeters(MAX_SET_METERS)}?
                  </p>
                  <p className="mt-1 text-stone">
                    Paruošime pasiūlymą jūsų objektui.
                  </p>
                  <Link href="/kontaktai#forma" className="btn btn-dark mt-5">
                    Susisiekti
                  </Link>
                </>
              ) : (
                <p className="text-pine-900">
                  Įveskite reikalingą ilgį metrais.
                </p>
              )}
            </div>
          )}
          <p className="mt-4 text-sm text-stone">
            {pricing.deliveryFee === 0 &&
              `Nemokamas pristatymas (${pricing.deliveryArea}) · `}
            {guarantee.label}
          </p>
        </div>
      </div>
    </div>
  );
}

const lineLabel = (product: Product) =>
  product.kind === "bundle"
    ? `Komplektas, ${formatMeters(product.meters)}`
    : product.kind === "starter"
      ? "Motininė girlianda"
      : "Papildoma sekcija";

function SetCard({
  set,
  onOrder,
}: {
  set: LightSet;
  onOrder: () => void;
}) {
  const name = seriesNames[set.series];
  return (
    <article className="flex flex-col rounded-3xl border-[1.5px] border-sand p-5 sm:p-6">
      <h3 className="font-sans text-xl font-bold tracking-normal text-pine-900">
        {name} rinkinys
      </h3>
      <p className="text-sm text-stone sm:min-h-[2lh]">{seriesText[set.series]}</p>
      <p className="mt-5 font-display text-4xl font-semibold text-pine-900">
        {formatPrice(set.total)}
      </p>
      <p className="mt-1 text-sm text-stone">
        {formatMeters(set.meters)} · {set.leds} LED
      </p>
      {set.savings > 0 && (
        <p className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full bg-glow-soft px-3 py-1 text-xs font-bold text-pine-900">
          <Sparkles className="size-3.5 text-glow-deep" aria-hidden="true" />
          Su komplektu {formatPrice(set.savings)} pigiau
        </p>
      )}
      <ul className="mt-5 space-y-2.5 border-t border-sand pt-4 text-sm">
        {set.lines.map((line) => (
          <li key={line.product.id} className="flex justify-between gap-3">
            <span className="text-pine-900">
              <span className="font-bold">{line.quantity} ×</span>{" "}
              {lineLabel(line.product)}
              <span className="block text-xs text-stone">
                {line.product.kind === "bundle"
                  ? `1 motininė + ${extensionsLabel(line.product.sections - 1)}`
                  : `${line.quantity > 1 ? "po " : ""}${formatMeters(line.product.meters)}`}
              </span>
            </span>
            <span className="shrink-0 font-bold text-pine-900">
              {formatPrice(line.total)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <button type="button" onClick={onOrder} className="btn btn-primary w-full">
          <ShoppingBag className="size-4" aria-hidden="true" />
          Užsakyti
        </button>
      </div>
    </article>
  );
}
