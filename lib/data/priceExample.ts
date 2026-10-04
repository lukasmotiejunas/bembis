import { formatPrice } from "../format";
import { PurchaseMode } from "../types";
import { pricing } from "./pricing";
import { productFor } from "./products";

// Pavyzdinis užsakymas Montavimo puslapyje. Pakeitus skaičius, sumos persiskaičiuoja automatiškai.
export const priceExample = {
  title: "Dviaukštis namas",
  location: "Vilniaus r.",
  /** Nuotrauka keičiasi kartu su lemputėmis: pirkimui — šiltos baltos, nuomai — spalvotos */
  images: { buy: "/work/modern-villa.jpg", rent: "/work/multicolor-house.jpg" },
  areas: [
    { name: "stogo kraštai", meters: 40 },
    { name: "langai ir įėjimas", meters: 20 },
  ],
  installDuration: "1 diena",
  // Lemputės ir jų kainos — lib/data/products.ts, darbų kainos — lib/data/pricing.ts
};

export interface EstimateLine {
  name: string;
  detail?: string;
  total: number;
}

const sum = (lines: EstimateLine[]) => lines.reduce((s, l) => s + l.total, 0);

export function buildEstimate(mode: PurchaseMode) {
  const { areas } = priceExample;
  const { installPerMeter, removalPerMeter } = pricing;
  const product = productFor(mode);

  const meters = areas.reduce((s, a) => s + a.meters, 0);
  const strings = Math.ceil(meters / product.meters);
  const unitPrice = product.price;

  const decor: EstimateLine[] = [
    {
      name: `${product.name}, ${product.meters} m`,
      detail: `${strings} vnt. × ${formatPrice(unitPrice)}${mode === "rent" ? " / sezonui" : ""}`,
      total: strings * unitPrice,
    },
  ];

  const work: EstimateLine[] = [
    { name: "Apžiūra ir dekoro planas", total: 0 },
    { name: "Montavimas", detail: `${meters} m × ${formatPrice(installPerMeter)}`, total: meters * installPerMeter },
    { name: "Laikmačio nustatymas", total: 0 },
    { name: "Demontavimas po švenčių", detail: `${meters} m × ${formatPrice(removalPerMeter)}`, total: meters * removalPerMeter },
    { name: "Atvykimas Vilniuje", total: 0 },
  ];

  const workTotal = sum(work);
  return { meters, decor, work, workTotal, total: sum(decor) + workTotal };
}
