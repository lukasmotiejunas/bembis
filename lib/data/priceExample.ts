import { formatMeters, formatPrice, money } from "../format";
import { LightSeries } from "../types";
import { pricing } from "./pricing";
import { seriesNames } from "./products";

export type EstimateChoice = LightSeries | "client";
export const priceExample = {
  width: 12,
  length: 12,
  extraMeters: 0,
  choice: "xp" as EstimateChoice,
};

export const estimateOptions: {
  value: EstimateChoice;
  label: string;
  text: string;
}[] = [
  { value: "xp", label: "XP nuoma", text: "Aukščiausios kokybės lauko LED" },
  {
    value: "llinks",
    label: "LLinks nuoma",
    text: "Komercinės klasės profesionalios LED",
  },
  { value: "client", label: "Jūsų lemputės", text: "Kabiname jūsų turimas lemputes" },
];

/** Tarifai už metrą: lempučių nuoma ir darbas (kabinimas kartu su nuėmimu po sezono). */
export function estimateRates(choice: EstimateChoice) {
  return choice === "client"
    ? { rental: 0, work: pricing.clientLightsPerMeter }
    : { rental: pricing.rentalPerMeter[choice], work: pricing.installPerMeter };
}

export function buildEstimate(
  choice: EstimateChoice = priceExample.choice,
  width = priceExample.width,
  length = priceExample.length,
  extraMeters = 0,
) {
  if (!["xp", "llinks", "client"].includes(choice)) return null;
  if (
    ![width, length, extraMeters].every(Number.isFinite) ||
    width <= 0 ||
    length <= 0 ||
    extraMeters < 0
  )
    return null;
  const perimeter = money(2 * (width + length));
  const meters = money(perimeter + extraMeters);
  const { rental: rentalRate, work: workRate } = estimateRates(choice);
  const rentalTotal = money(meters * rentalRate);
  const workTotal = money(meters * workRate);
  const total = money(rentalTotal + workTotal);
  if (
    ![perimeter, meters, rentalTotal, workTotal, total].every(
      Number.isFinite,
    ) ||
    total * 100 > Number.MAX_SAFE_INTEGER
  )
    return null;
  return {
    perimeter,
    meters,
    rentalRate,
    workRate,
    rentalTotal,
    workTotal,
    total,
    choice,
  };
}

export function describeEstimate(
  e: NonNullable<ReturnType<typeof buildEstimate>>,
) {
  return [
    `Domina montavimas ir nuėmimas po sezono. Apšvietimo ilgis: ${formatMeters(e.meters)}.`,
    e.choice === "client"
      ? "Naudosiu savo lemputes."
      : `Lempučių nuoma: ${seriesNames[e.choice]}, ${formatPrice(e.rentalRate)}/m, iš viso ${formatPrice(e.rentalTotal)}.`,
    `Montavimas ir nuėmimas: ${formatPrice(e.workRate)}/m, iš viso ${formatPrice(e.workTotal)}.`,
    `Standartinės sąmatos suma: ${formatPrice(e.total)}. Prašau suderinti galutinį pasiūlymą mano objektui.`,
  ].join("\n");
}
