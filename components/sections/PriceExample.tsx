"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  buildEstimate,
  describeEstimate,
  EstimateChoice,
} from "@/lib/data/priceExample";
import { pricing } from "@/lib/data/pricing";
import { formatMeters, formatPrice } from "@/lib/format";
import { inquiryHref, INSTALLATION_SERVICE } from "@/lib/inquiry";
import SectionHeading from "../ui/SectionHeading";

const choices: { value: EstimateChoice; label: string; text: string }[] = [
  {
    value: "llinks",
    label: "Nuomojamos LLinks",
    text: `Komercinės klasės LED · ${formatPrice(pricing.rentalPerMeter.llinks)}/m`,
  },
  {
    value: "xp",
    label: "Nuomojamos XP",
    text: `XP LED · ${formatPrice(pricing.rentalPerMeter.xp)}/m`,
  },
  {
    value: "client",
    label: "Jūsų lemputės",
    text: "Lempučių nuomos mokesčio nėra",
  },
];

export default function PriceExample() {
  const [width, setWidth] = useState("12");
  const [length, setLength] = useState("12");
  const [extra, setExtra] = useState("0");
  const [choice, setChoice] = useState<EstimateChoice>("llinks");
  const estimate = buildEstimate(
    choice,
    Number(width),
    Number(length),
    extra === "" ? NaN : Number(extra),
  );
  return (
    <section id="kainos" className="container-page py-20 sm:py-28">
      <SectionHeading
        eyebrow="Standartinės kainos"
        title="Kiek kainuotų papuošti jūsų namą?"
        text="Pavyzdys: 12 × 12 m stačiakampio pastato stogo kontūras. Visos keturios kraštinės sudaro 48 m. Pakeiskite matmenis ir palyginkite lempučių pasirinkimus."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="rounded-[2rem] border border-sand bg-cream p-6 sm:p-9">
          <svg
            viewBox="0 0 400 270"
            role="img"
            aria-label="Stačiakampio perimetras: dvi ilgio ir dvi pločio kraštinės"
            className="mx-auto max-h-72 w-full"
          >
            <rect
              x="80"
              y="45"
              width="245"
              height="160"
              rx="12"
              fill="#122a1f"
            />
            <rect
              x="86"
              y="51"
              width="233"
              height="148"
              rx="8"
              fill="none"
              stroke="#f4b03e"
              strokeWidth="4"
              strokeDasharray="2 12"
              strokeLinecap="round"
            />
            <text
              x="202"
              y="30"
              textAnchor="middle"
              fill="#122a1f"
              fontSize="18"
            >
              {length || "—"} m
            </text>
            <text
              x="55"
              y="132"
              textAnchor="middle"
              fill="#122a1f"
              fontSize="18"
            >
              {width || "—"} m
            </text>
            <text
              x="202"
              y="130"
              textAnchor="middle"
              fill="#fffaf0"
              fontSize="21"
            >
              {estimate
                ? formatMeters(estimate.perimeter)
                : "Įveskite matmenis"}
            </text>
            <text
              x="202"
              y="238"
              textAnchor="middle"
              fill="#59665f"
              fontSize="15"
            >
              Perimetras = 2 × (ilgis + plotis)
            </text>
          </svg>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-pine-900">
              Pastato ilgis, m
              <input
                type="number"
                min="0.1"
                step="0.1"
                className="field mt-2"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />
            </label>
            <label className="text-sm font-bold text-pine-900">
              Pastato plotis, m
              <input
                type="number"
                min="0.1"
                step="0.1"
                className="field mt-2"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </label>
            <label className="text-sm font-bold text-pine-900 sm:col-span-2">
              Papildomų kontūrų ilgis, m
              <input
                type="number"
                min="0"
                step="0.1"
                className="field mt-2"
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
              />
              <span className="mt-2 block font-normal text-stone">
                Jei puošite ir langus, terasą ar kitus kontūrus, pridėkite jų
                ilgį.
              </span>
            </label>
          </div>
          <fieldset className="mt-7 space-y-3">
            <legend className="mb-3 font-bold text-pine-900">
              Kokias lemputes naudosime?
            </legend>
            {choices.map((item) => (
              <label
                key={item.value}
                className="flex cursor-pointer items-start gap-3 rounded-2xl border border-sand bg-white p-4 has-checked:border-pine-900"
              >
                <input
                  type="radio"
                  name="estimate-lights"
                  value={item.value}
                  checked={choice === item.value}
                  onChange={() => setChoice(item.value)}
                  className="mt-1 accent-pine-900"
                />
                <span>
                  <span className="block font-bold text-pine-900">
                    {item.label}
                  </span>
                  <span className="text-sm text-stone">{item.text}</span>
                </span>
              </label>
            ))}
          </fieldset>
        </div>
        <div className="rounded-[2rem] border border-sand bg-white p-6 sm:p-9">
          <h3 className="text-2xl font-semibold text-pine-900">
            Jūsų standartinė sąmata
          </h3>
          {estimate ? (
            <>
              <p className="mt-2 text-stone">
                Bendras dekoruojamas ilgis:{" "}
                <strong className="text-pine-900">
                  {formatMeters(estimate.meters)}
                </strong>
              </p>
              <dl className="mt-7 divide-y divide-sand">
                <div className="flex justify-between gap-4 py-5">
                  <dt>
                    <span className="block font-bold text-pine-900">
                      Lempučių nuoma
                    </span>
                    <span className="text-sm text-stone">
                      {choice === "client"
                        ? "Naudojame jūsų lemputes"
                        : `${formatMeters(estimate.meters)} × ${formatPrice(estimate.rentalRate)}/m`}
                    </span>
                  </dt>
                  <dd className="shrink-0 font-bold text-pine-900">
                    {choice === "client"
                      ? "Netaikoma"
                      : formatPrice(estimate.rentalTotal)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-5">
                  <dt>
                    <span className="block font-bold text-pine-900">
                      Montavimas ir nuėmimas po sezono
                    </span>
                    <span className="text-sm text-stone">
                      {formatMeters(estimate.meters)} ×{" "}
                      {formatPrice(estimate.workRate)}/m
                    </span>
                  </dt>
                  <dd className="shrink-0 font-bold text-pine-900">
                    {formatPrice(estimate.workTotal)}
                  </dd>
                </div>
              </dl>
              <div
                className="mt-5 flex flex-wrap items-baseline justify-between gap-4 border-t-2 border-dashed border-sand pt-6"
                aria-live="polite"
              >
                <span className="font-bold text-pine-900">
                  Standartinė bendra suma
                </span>
                <strong className="font-display text-4xl text-pine-900">
                  {formatPrice(estimate.total)}
                </strong>
              </div>
              <p className="mt-5 rounded-2xl bg-glow-soft p-4 text-sm leading-relaxed text-pine-900">
                Darbo tarifas apima kabinimą ir nuėmimą po sezono. Papildomo
                nuėmimo mokesčio nėra. Nuoma skaičiuojama už dekoruojamą metrą;
                parduodamų 7,5 m sekcijų ir komplektų kainos pateiktos atskirame
                kataloge.
              </p>
              <Link
                href={inquiryHref(
                  choice === "client"
                    ? [INSTALLATION_SERVICE]
                    : [INSTALLATION_SERVICE, "Lempučių nuoma"],
                  describeEstimate(estimate),
                )}
                className="btn btn-primary mt-6 w-full"
              >
                Gauti pasiūlymą savo objektui
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </>
          ) : (
            <p
              role="status"
              className="mt-6 rounded-2xl bg-cream p-5 text-pine-900"
            >
              Įveskite teigiamą pastato ilgį ir plotį. Papildomas ilgis gali
              būti 0 arba daugiau.
            </p>
          )}
          <p className="mt-5 text-sm leading-relaxed text-stone">
            Tai standartinis kainos pavyzdys. Galutinę darbo kainą ir sąlygas
            suderiname įvertinę konkretų objektą. Ši sąmata nėra apmokėjimo
            užsakymas.
          </p>
        </div>
      </div>
    </section>
  );
}
