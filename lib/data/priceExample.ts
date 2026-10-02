import { formatPrice } from "../format";
import { PurchaseMode } from "../types";
import { getProductById, priceFor } from "./products";

// Pavyzdinis užsakymas Montavimo puslapyje. Pakeitus skaičius, sumos persiskaičiuoja automatiškai.
export const priceExample = {
  title: "Dviaukštis namas",
  location: "Vilniaus r.",
  image: "/work/modern-villa.jpg",
  areas: [
    { name: "stogo kraštai", meters: 40 },
    { name: "langai ir įėjimas", meters: 20 },
  ],
  installDuration: "1 diena",
  /** Lemputės iš katalogo (lib/data/products.ts) */
  productId: "1",
  /** € už metrą */
  installPerMeter: 3,
  removalPerMeter: 2,
};

export interface EstimateLine {
  name: string;
  detail?: string;
  total: number;
}

const sum = (lines: EstimateLine[]) => lines.reduce((s, l) => s + l.total, 0);

export function buildEstimate(mode: PurchaseMode) {
  const { areas, productId, installPerMeter, removalPerMeter } = priceExample;
  const product = getProductById(productId);
  if (!product) throw new Error(`priceExample: product ${productId} not found`);

  const meters = areas.reduce((s, a) => s + a.meters, 0);
  const strings = Math.ceil(meters / parseInt(product.length, 10));
  const unitPrice = priceFor(product, mode);

  const decor: EstimateLine[] = [
    {
      name: `${product.name}, ${product.length}`,
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
