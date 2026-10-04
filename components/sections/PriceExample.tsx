"use client";
import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { buildEstimate, EstimateLine, priceExample } from "@/lib/data/priceExample";
import { formatPrice } from "@/lib/format";
import { PurchaseMode } from "@/lib/types";
import SectionHeading from "../ui/SectionHeading";

const modes: { mode: PurchaseMode; label: string }[] = [
  { mode: "rent", label: "Nuoma" },
  { mode: "buy", label: "Pirkimas" },
];

function Lines({ title, lines }: { title: string; lines: EstimateLine[] }) {
  return (
    <div>
      <p className="text-xs font-extrabold tracking-widest text-stone uppercase">{title}</p>
      <ul className="mt-3 space-y-3.5">
        {lines.map((l) => (
          <li key={l.name} className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-pine-900">{l.name}</p>
              {l.detail && <p className="text-sm text-stone">{l.detail}</p>}
            </div>
            {l.total === 0 ? (
              <span className="shrink-0 rounded-full bg-cream px-2.5 py-0.5 text-sm font-bold text-pine-700">Nemokamai</span>
            ) : (
              <span className="shrink-0 font-bold text-pine-900 tabular-nums">{formatPrice(l.total)}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PriceExample() {
  const [mode, setMode] = useState<PurchaseMode>("rent");
  const estimate = buildEstimate(mode);
  const { title, location, images, areas, installDuration } = priceExample;

  const facts = [
    ...areas.map((a) => ({ value: `${a.meters} m`, label: a.name })),
    { value: installDuration, label: "montavimas" },
  ];

  return (
    <section id="kainos" className="container-page py-20 sm:py-28">
      <SectionHeading
        eyebrow="Kainos pavyzdys"
        title="Kiek tai kainuoja?"
        text="Tipinis užsakymas: dviaukštis namas su apšviestais stogo kraštais, langais ir įėjimu."
      />

      <div className="mt-12 grid items-start gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-8">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            <Image
              key={mode}
              src={images[mode]}
              alt="Dviaukštis namas su lemputėmis ant stogo kraštų ir aplink langus"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <span className="absolute top-4 left-4 rounded-full bg-pine-950/70 px-3 py-1.5 text-xs font-bold text-snow backdrop-blur-sm">
              Pavyzdys · {title}, {location}
            </span>
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-3">
            {facts.map((f) => (
              <div key={f.label} className="rounded-2xl bg-cream px-4 py-4">
                <dt className="text-sm text-stone">{f.label}</dt>
                <dd className="mt-0.5 font-display text-2xl font-semibold text-pine-900">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-[2rem] border border-sand bg-white p-6 sm:p-9">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold text-pine-900">Sąmata</h3>
            <div className="inline-flex rounded-full bg-cream p-1" role="group" aria-label="Lemputės: nuoma ar pirkimas">
              {modes.map((m) => (
                <button
                  key={m.mode}
                  type="button"
                  onClick={() => setMode(m.mode)}
                  aria-pressed={mode === m.mode}
                  className={clsx(
                    "rounded-full px-4 py-2 text-sm font-bold transition-colors",
                    mode === m.mode ? "bg-pine-900 text-snow" : "text-stone hover:text-pine-900"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 space-y-7">
            <Lines title={mode === "rent" ? "Lemputės (nuoma sezonui)" : "Lemputės (pirkimas)"} lines={estimate.decor} />
            <Lines title="Darbai" lines={estimate.work} />
          </div>

          <div className="mt-7 border-t-2 border-dashed border-sand pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-bold text-pine-900">{mode === "rent" ? "Iš viso už sezoną" : "Iš viso"}</span>
              <span className="font-display text-4xl font-semibold text-pine-900 tabular-nums sm:text-5xl">
                {formatPrice(estimate.total)}
              </span>
            </div>
            <p className="mt-3 rounded-2xl bg-glow-soft px-4 py-3 text-sm font-semibold text-pine-900">
              {mode === "rent"
                ? "Po švenčių lemputes išsivežame — jums nieko nereikia sandėliuoti."
                : `Lemputės lieka jums. Kitą sezoną mokėsite tik už darbus — ${formatPrice(estimate.workTotal)}.`}
            </p>
          </div>

          <a href="#forma" className="btn btn-primary mt-7 w-full">
            Gauti kainą savo namams
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <p className="mt-3 text-center text-sm text-stone">
            Kainos pavyzdinės. Tikslią kainą pasakysime po nemokamos apžiūros.
          </p>
        </div>
      </div>
    </section>
  );
}
