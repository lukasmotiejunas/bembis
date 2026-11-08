"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import {
  buildLightSet,
  LightSet,
  lightSetItems,
  MAX_SET_METERS,
  SECTION_METERS,
} from "@/lib/data/lightSet";
import { pricing } from "@/lib/data/pricing";
import { guarantee, seriesNames } from "@/lib/data/products";
import { formatMeters, formatPrice, money } from "@/lib/format";
import { discountedPrice } from "@/lib/orders/order";
import { useCartStore, useWheelDiscount } from "@/lib/store/cartStore";
import { useSiteTheme } from "../SiteTheme";
import { extensionsLabel, lineLabel, seriesText } from "../shop/LightSetBuilder";
import MetersInput from "../shop/MetersInput";
import Price, { DiscountNote } from "../shop/Price";
import SectionHeading from "../ui/SectionHeading";

const copy = {
  christmas: {
    title: "Kiek metrų lempučių reikia jūsų namams?",
    text: "Įveskite ilgį — iš karto matysite XP ir LLinks lempučių kainą, montavimo kainą ir galutinę sumą.",
  },
  halloween: {
    title: "Kiek metrų šviesos atbaidys tamsą?",
    text: "Įveskite ilgį — iš karto matysite XP ir LLinks lempučių kainą, montavimo kainą ir galutinę sumą. Be siaubingų staigmenų.",
  },
};

const included = [
  `Lemputės lieka jums · ${guarantee.label}`,
  "Atvežame ir sumontuojame",
  "Nuėmimas po sezono įskaičiuotas",
  "Nemokama apžiūra prieš darbus",
];

/** e.g. "Komplektas, 45 m + 2 papildomos sekcijos" */
const composition = (set: LightSet) =>
  set.lines
    .map((line) =>
      line.product.kind === "extension"
        ? extensionsLabel(line.quantity)
        : lineLabel(line.product),
    )
    .join(" + ");

/** Home page: bought lights plus our installation and removal, for both series at once. */
export default function LightsCalculator() {
  const [value, setValue] = useState("30");
  const t = copy[useSiteTheme()];
  const meters = value === "" ? NaN : Number(value);
  const sets = (["xp", "llinks"] as const).map((series) =>
    buildLightSet(series, meters),
  );
  const tooLong = Number.isFinite(meters) && meters > MAX_SET_METERS;

  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const setService = useCartStore((s) => s.setService);
  // The set joins the cart and checkout opens with "Atvešime ir sumontuosime" already picked.
  const order = (set: LightSet) => {
    for (const item of lightSetItems(set))
      addItem(item.productId, item.mode, item.quantity);
    setService("installation", true);
    setService("removal", true);
    router.push("/checkout");
  };

  return (
    <section id="kaina" className="scroll-mt-20 bg-cream py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading eyebrow="Kainos skaičiuoklė" title={t.title} text={t.text} />

        <div className="mt-12 grid items-start gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] bg-white p-6 sm:p-8">
            <MetersInput value={value} onChange={setValue} />
            {sets[0] && sets[0].meters !== meters && (
              <p className="mt-4 text-sm leading-relaxed text-stone">
                Girliandos parduodamos {formatMeters(SECTION_METERS)} sekcijomis,
                todėl skaičiuojame {formatMeters(sets[0].meters)}.
              </p>
            )}
            <ul className="mt-7 space-y-2.5 border-t border-sand pt-6 text-sm text-pine-900">
              {included.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-glow-deep" strokeWidth={3} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {sets[0] && sets[1] ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {[sets[0], sets[1]].map((set) => (
                <OfferCard key={set.series} set={set} onOrder={() => order(set)} />
              ))}
            </div>
          ) : (
            <div
              role="status"
              className="flex h-full min-h-48 flex-col items-center justify-center rounded-[2rem] bg-white p-8 text-center"
            >
              {tooLong ? (
                <>
                  <p className="font-bold text-pine-900">
                    Daugiau nei {formatMeters(MAX_SET_METERS)}?
                  </p>
                  <p className="mt-1 text-stone">Paruošime pasiūlymą jūsų objektui.</p>
                  <Link href="/kontaktai#forma" className="btn btn-dark mt-5">
                    Susisiekti
                  </Link>
                </>
              ) : (
                <p className="text-pine-900">Įveskite reikalingą ilgį metrais.</p>
              )}
            </div>
          )}
        </div>

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-stone">
          Tai standartinė kaina pagal viešus tarifus. Galutinę darbų kainą ir laiką
          suderiname įvertinę jūsų namą, prieš apmokėjimą.{" "}
          <DiscountNote />
        </p>
      </div>
    </section>
  );
}

function OfferCard({ set, onOrder }: { set: LightSet; onOrder: () => void }) {
  const discount = useWheelDiscount();
  // Work is priced on the length of lights bought, the same way the order counts it (buildOrder).
  const work = money(set.meters * pricing.installPerMeter);
  // The wheel discount applies to the lights only, unit by unit as the order charges them.
  const lightsCents = set.lines.reduce(
    (sum, line) =>
      sum +
      Math.round(
        (discount ? discountedPrice(line.product.price, discount.percent) : line.product.price) * 100,
      ) *
        line.quantity,
    0,
  );
  const total = (lightsCents + Math.round(work * 100)) / 100;

  return (
    <article className="flex flex-col rounded-[2rem] border-[1.5px] border-sand bg-white p-6 sm:p-7">
      <h3 className="font-sans text-xl font-bold tracking-normal text-pine-900">
        {seriesNames[set.series]} lemputės
      </h3>
      <p className="text-sm text-stone">{seriesText[set.series]}</p>

      <dl className="mt-6 space-y-4 border-t border-sand pt-5 text-sm">
        <div className="flex justify-between gap-3">
          <dt>
            <span className="block font-bold text-pine-900">Lemputės</span>
            <span className="text-xs text-stone">
              {composition(set)} · {formatMeters(set.meters)}
            </span>
          </dt>
          <dd className="shrink-0 text-right font-bold text-pine-900">
            <Price
              price={set.lines.map((l) => ({ price: l.product.price, quantity: l.quantity }))}
              className="justify-end"
            />
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>
            <span className="block font-bold text-pine-900">Montavimas ir nuėmimas</span>
            <span className="text-xs text-stone">
              {formatMeters(set.meters)} × {formatPrice(pricing.installPerMeter)}/m
            </span>
          </dt>
          <dd className="shrink-0 font-bold text-pine-900">{formatPrice(work)}</dd>
        </div>
      </dl>

      <div className="mt-5 border-t border-sand pt-5">
        <p className="text-sm font-bold text-stone">Galutinė kaina</p>
        <p
          className="mt-1 font-display text-4xl font-semibold tracking-tight text-pine-900"
          aria-live="polite"
        >
          {formatPrice(total)}
        </p>
      </div>

      <div className="mt-auto pt-6">
        <button type="button" onClick={onOrder} className="btn btn-primary w-full">
          Užsakyti su montavimu
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
