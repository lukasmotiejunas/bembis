"use client";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, Check, Minus, Phone, Plus } from "lucide-react";
import {
  buildEstimate,
  describeEstimate,
  EstimateChoice,
  estimateOptions,
  estimateRates,
  priceExample,
} from "@/lib/data/priceExample";
import { formatMeters, formatPrice, money } from "@/lib/format";
import { inquiryHref, INSTALLATION_SERVICE } from "@/lib/inquiry";
import { phoneHref, site } from "@/lib/site";

/** Quick sizes (length × width) so visitors see a price without measuring first. */
const presets = [
  [10, 8],
  [12, 10],
  [12, 12],
  [16, 12],
] as const;

export default function PriceCalculator() {
  const [length, setLength] = useState(String(priceExample.length));
  const [width, setWidth] = useState(String(priceExample.width));
  const [extra, setExtra] = useState(String(priceExample.extraMeters));
  const [choice, setChoice] = useState<EstimateChoice>(priceExample.choice);

  const dims = [
    Number(width),
    Number(length),
    extra === "" ? NaN : Number(extra),
  ] as const;
  const estimateFor = (c: EstimateChoice) => buildEstimate(c, ...dims);
  const estimate = estimateFor(choice);
  const selected = estimateOptions.find((o) => o.value === choice)!;

  // On phones a live total stays pinned to the bottom until the full result card scrolls into view.
  const resultRef = useRef<HTMLElement>(null);
  const [resultVisible, setResultVisible] = useState(false);
  useEffect(() => {
    const el = resultRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setResultVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const offerHref = estimate
    ? inquiryHref(
        choice === "client"
          ? [INSTALLATION_SERVICE]
          : [INSTALLATION_SERVICE, "Lempučių nuoma"],
        describeEstimate(estimate),
      )
    : "/kontaktai#forma";

  return (
    <section
      id="skaiciuokle"
      className="container-page grid items-start gap-6 py-12 sm:py-16 lg:grid-cols-[1.3fr_1fr] lg:gap-8"
    >
      <div className="space-y-8 rounded-[2rem] border border-sand bg-white p-6 sm:p-9">
        <Step
          n={1}
          title="Pastato matmenys"
          text="Įveskite stogo kraštų ilgį ir plotį — skaičiuosime visas keturias kraštines."
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 w-full text-sm text-stone sm:w-auto">
              Greitas pasirinkimas:
            </span>
            {presets.map(([l, w]) => {
              const active = Number(length) === l && Number(width) === w;
              return (
                <button
                  key={`${l}x${w}`}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setLength(String(l));
                    setWidth(String(w));
                  }}
                  className={clsx(
                    "rounded-full border-[1.5px] px-3.5 py-1.5 text-sm font-bold transition-colors",
                    active
                      ? "border-pine-900 bg-pine-900 text-snow"
                      : "border-sand bg-white text-pine-900 hover:border-pine-900",
                  )}
                >
                  {l} × {w} m
                </button>
              );
            })}
          </div>
          <Outline
            length={Number(length)}
            width={Number(width)}
            perimeter={estimate?.perimeter ?? null}
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <NumberField label="Ilgis" value={length} onChange={setLength} min={1} />
            <NumberField label="Plotis" value={width} onChange={setWidth} min={1} />
          </div>
        </Step>

        <Step
          n={2}
          title="Papildomi kontūrai"
          text="Langai, durys, terasos turėklai, tvora ar medžiai. Jei puošite tik stogą, palikite 0."
        >
          <div className="sm:max-w-[calc(50%-0.5rem)]">
            <NumberField
              label="Papildomas ilgis"
              value={extra}
              onChange={setExtra}
              min={0}
            />
          </div>
        </Step>

        <Step n={3} title="Kokias lemputes naudosime?">
          <fieldset>
            <legend className="sr-only">Lemputės</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {estimateOptions.map((option) => {
                const total = estimateFor(option.value)?.total;
                const { rental, work } = estimateRates(option.value);
                return (
                  <label
                    key={option.value}
                    className="group flex cursor-pointer items-center gap-4 rounded-2xl border-[1.5px] border-sand bg-white p-4 transition-colors hover:border-pine-700/60 has-checked:border-pine-900 has-checked:bg-glow-soft/50 has-focus-visible:ring-4 has-focus-visible:ring-glow/40 sm:flex-col sm:items-start sm:gap-3 sm:p-5"
                  >
                    <input
                      type="radio"
                      name="estimate-lights"
                      value={option.value}
                      checked={choice === option.value}
                      onChange={() => setChoice(option.value)}
                      className="sr-only"
                    />
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-sand bg-white text-transparent group-has-checked:border-pine-900 group-has-checked:bg-pine-900 group-has-checked:text-snow">
                      <Check className="size-3" strokeWidth={3.5} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-pine-900">
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-stone">
                        {option.text}
                      </span>
                    </span>
                    <span className="shrink-0 text-right sm:mt-auto sm:text-left">
                      <span className="block font-display text-2xl font-semibold text-pine-900">
                        {total === undefined ? "—" : formatPrice(total)}
                      </span>
                      <span className="block text-xs text-stone">
                        {formatPrice(money(rental + work))}/m
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </Step>
      </div>

      <aside
        ref={resultRef}
        aria-labelledby="calc-result"
        className="rounded-[2rem] bg-pine-900 p-6 text-snow sm:p-9 lg:sticky lg:top-28"
      >
        <h2 id="calc-result" className="eyebrow font-sans text-glow">
          Jūsų standartinė kaina
        </h2>
        {estimate ? (
          <>
            <p
              className="mt-4 font-display text-6xl font-semibold tracking-tight"
              aria-live="polite"
            >
              {formatPrice(estimate.total)}
            </p>
            <p className="mt-2 text-snow/70">
              {formatMeters(estimate.meters)} apšvietimo · {selected.label}
            </p>
            <dl className="mt-7 space-y-4 border-t border-snow/15 pt-6">
              <Row
                label="Lempučių nuoma sezonui"
                detail={
                  choice === "client"
                    ? "Naudojame jūsų lemputes"
                    : `${formatMeters(estimate.meters)} × ${formatPrice(estimate.rentalRate)}/m`
                }
                value={
                  choice === "client" ? "Netaikoma" : formatPrice(estimate.rentalTotal)
                }
              />
              <Row
                label="Montavimas ir nuėmimas"
                detail={`${formatMeters(estimate.meters)} × ${formatPrice(estimate.workRate)}/m`}
                value={formatPrice(estimate.workTotal)}
              />
            </dl>
            <ul className="mt-7 space-y-2.5 rounded-2xl bg-snow/[0.06] p-5 text-sm">
              {[
                "Kabinimas ir nuėmimas po sezono",
                choice === "client"
                  ? "Jūsų lemputės lieka jums"
                  : "Po sezono lemputes pasiimame",
                "Nemokama apžiūra prieš darbus",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-glow" strokeWidth={3} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href={offerHref} className="btn btn-primary mt-7 w-full">
              Gauti tikslų pasiūlymą
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a href={phoneHref} className="btn btn-ghost-light mt-3 w-full">
              <Phone className="size-4" aria-hidden="true" />
              {site.phone}
            </a>
          </>
        ) : (
          <p role="status" className="mt-5 rounded-2xl bg-snow/[0.06] p-5">
            Įveskite teigiamą pastato ilgį ir plotį. Papildomas ilgis gali būti
            0 arba daugiau.
          </p>
        )}
        <p className="mt-6 text-xs leading-relaxed text-snow/55">
          Tai standartinė kaina pagal viešus tarifus. Galutinę kainą ir sąlygas
          suderiname įvertinę konkretų objektą. Ši sąmata nėra užsakymas.
        </p>
      </aside>

      {estimate && (
        <div
          inert={resultVisible}
          className={clsx(
            "fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-snow/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 md:hidden",
            resultVisible && "translate-y-full",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs text-stone">
                {formatMeters(estimate.meters)} · {selected.label}
              </p>
              <p className="font-display text-2xl leading-tight font-semibold text-pine-900">
                {formatPrice(estimate.total)}
              </p>
            </div>
            <Link href={offerHref} className="btn btn-primary shrink-0">
              Gauti pasiūlymą
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

function Step({
  n,
  title,
  text,
  children,
}: {
  n: number;
  title: string;
  text?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-sand pt-8 first:pt-0 [&:not(:first-child)]:border-t">
      <div className="flex items-start gap-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-pine-900 text-sm font-extrabold text-snow">
          {n}
        </span>
        <div>
          <h2 className="font-sans text-xl font-bold tracking-normal text-pine-900">
            {title}
          </h2>
          {text && <p className="mt-1 text-stone">{text}</p>}
        </div>
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
}) {
  const id = useId();
  const current = Number(value);
  const step = (delta: number) =>
    onChange(
      String(
        Math.max(min, money((Number.isFinite(current) ? current : min) + delta)),
      ),
    );
  const button =
    "flex w-10 shrink-0 items-center justify-center text-pine-900 transition-colors hover:bg-cream disabled:opacity-35 disabled:hover:bg-transparent sm:w-12";
  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold text-pine-900">
        {label}, m
      </label>
      <div className="mt-2 flex h-13 overflow-hidden rounded-[0.875rem] border-[1.5px] border-sand bg-white transition-shadow focus-within:border-pine-700 focus-within:shadow-[0_0_0_4px_rgb(36_80_57/0.12)]">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={Number.isFinite(current) && current <= min}
          aria-label={`${label}: 1 m mažiau`}
          className={clsx(button, "border-r border-sand")}
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min === 0 ? 0 : 0.1}
          step="0.1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 [appearance:textfield] bg-transparent text-center text-lg font-bold text-pine-900 outline-none focus-visible:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => step(1)}
          aria-label={`${label}: 1 m daugiau`}
          className={clsx(button, "border-l border-sand")}
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  detail,
  value,
}: {
  label: string;
  detail: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt>
        <span className="block font-bold">{label}</span>
        <span className="text-sm text-snow/60">{detail}</span>
      </dt>
      <dd className="shrink-0 font-bold">{value}</dd>
    </div>
  );
}

/** Top-down roof drawn to the entered proportions, with the lit edge around it. */
function Outline({
  length,
  width,
  perimeter,
}: {
  length: number;
  width: number;
  perimeter: number | null;
}) {
  const valid = perimeter !== null;
  const ratio = valid ? Math.min(Math.max(width / length, 0.3), 1.5) : 0.7;
  let w = 250;
  let h = w * ratio;
  if (h > 150) {
    h = 150;
    w = h / ratio;
  }
  const x = 220 - w / 2;
  const y = 40 + (150 - h) / 2;
  const formula = valid
    ? `2 × (${formatMeters(length)} + ${formatMeters(width)})`
    : null;
  return (
    <div className="rounded-3xl bg-cream px-4 pt-4 pb-5">
      <svg
        viewBox="30 5 360 195"
        role="img"
        aria-label={
          valid
            ? `Stogo kontūras: ${formula} = ${formatMeters(perimeter)}`
            : "Stogo kontūras"
        }
        className="mx-auto max-h-60 w-full"
      >
        <defs>
          <filter id="calc-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <rect x={x} y={y} width={w} height={h} rx="6" fill="#122a1f" />
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx="6"
          fill="none"
          stroke="#f4b03e"
          strokeOpacity="0.55"
          strokeWidth="8"
          filter="url(#calc-glow)"
        />
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx="6"
          fill="none"
          stroke="#f4b03e"
          strokeWidth="5"
          strokeDasharray="0.1 11"
          strokeLinecap="round"
        />
        <text
          x={x + w / 2}
          y={y + h / 2 + 9}
          textAnchor="middle"
          fill="#fbf8f3"
          fontSize="26"
          fontWeight="600"
          className="font-display"
        >
          {valid ? formatMeters(perimeter) : "?"}
        </text>
        <text
          x={x + w / 2}
          y={y - 14}
          textAnchor="middle"
          fill="#122a1f"
          fontSize="18"
          fontWeight="700"
        >
          {valid ? formatMeters(length) : "— m"}
        </text>
        <text
          x={x - 14}
          y={y + h / 2 + 6}
          textAnchor="end"
          fill="#122a1f"
          fontSize="18"
          fontWeight="700"
        >
          {valid ? formatMeters(width) : "— m"}
        </text>
      </svg>
      <p className="mt-2 text-center text-sm text-stone">
        {valid ? (
          <>
            Stogo kontūras: {formula} ={" "}
            <strong className="text-pine-900">{formatMeters(perimeter)}</strong>
          </>
        ) : (
          "Įveskite ilgį ir plotį"
        )}
      </p>
    </div>
  );
}
