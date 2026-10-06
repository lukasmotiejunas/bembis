import { LightSeries, Product, ProductKind, PurchaseMode } from "../types";
import { formatMeters } from "../format";

export const guarantee = { years: 2, label: "2 metų garantija" };
/** Vartotojo patvirtinta: pirktas prekes galima grąžinti per 14 d., grąžinimo išlaidas apmoka pirkėjas. */
export const returnPolicy = { days: 14 };
export const seriesNames: Record<LightSeries, string> = {
  xp: "XP",
  llinks: "LLinks",
};

function light(
  series: LightSeries,
  kind: ProductKind,
  sections: number,
  price: number,
  sku: string,
): Product {
  const family = seriesNames[series];
  const meters = 7.5 * sections;
  const length = formatMeters(meters);
  const part =
    kind === "starter"
      ? "motininė girlianda"
      : kind === "extension"
        ? "papildoma sekcija"
        : "girliandų komplektas";
  const slug = `${series}-${kind === "starter" ? "motinine" : kind === "extension" ? "papildoma" : "komplektas"}-${String(meters).replace(".", "-")}-m`;
  const name = `${family} ${part}, ${length}`;
  const description =
    kind === "bundle"
      ? `Šiltai baltas ${family} lauko LED girliandų komplektas: viena 7,5 m motininė girlianda ir ${sections - 1} papildomos 7,5 m sekcijos. Bendras girliandų ilgis — ${length}. Tinka pasirinkusiems daugiau apšvietimo viename komplekte.`
      : kind === "starter"
        ? `Šiltai balta ${family} lauko LED motininė girlianda su 50 LED. ${length} ilgio pradinis rinkinys šios serijos apšvietimui. Ilgesniam kontūrui rinkitės papildomas tos pačios serijos sekcijas arba komplektą.`
        : `Šiltai balta ${family} lauko LED papildoma sekcija su 50 LED. Ji papildo tos pačios serijos motininę girliandą ${length} ilgiu. Tai papildoma sekcija, todėl pradiniam rinkiniui reikalinga ir motininė girlianda.`;
  return {
    id: sku,
    slug,
    name,
    mode: "buy",
    series,
    kind,
    sections,
    price,
    image: `/products/${series}.svg`,
    color: "Šilta balta",
    meters,
    description,
    seoTitle: `${family} lauko LED ${part}, ${length}`,
    seoDescription: `${family} šiltai balta lauko LED ${part}, ${length}. ${kind === "bundle" ? `1 motininė girlianda ir ${sections - 1} papildomos sekcijos.` : "50 LED."} Peržiūrėkite sudėtį ir kainą.`,
    features: [
      `${series === "llinks" ? "Komercinės klasės LLinks" : "XP serijos"} lauko LED`,
      `${sections * 50} LED · ${length} bendras ilgis`,
      kind === "extension"
        ? "Papildoma sekcija tos pačios serijos rinkiniui"
        : kind === "bundle"
          ? "Motininė girlianda ir papildomos sekcijos viename komplekte"
          : "Motininė girlianda pradiniam rinkiniui",
    ],
    specs: [
      { label: "Serija", value: family },
      { label: "Paskirtis", value: "Lauko apšvietimas" },
      { label: "Ilgis", value: length },
      { label: "LED skaičius", value: String(sections * 50) },
      { label: "Spalva", value: "Šilta balta" },
      {
        label: "Sudėtis",
        value:
          kind === "bundle"
            ? `1 motininė + ${sections - 1} papildomos sekcijos`
            : kind === "starter"
              ? "1 motininė girlianda"
              : "1 papildoma sekcija",
      },
      ...(kind !== "bundle" ? [{ label: "Prekės kodas", value: sku }] : []),
    ],
  };
}

// Tik viešos pardavimo kainos. Vidinių kiekių ir savikainų nėra.
export const products: Product[] = [
  light("llinks", "starter", 1, 38.99, "61030"),
  light("llinks", "extension", 1, 31.99, "61040"),
  light("xp", "starter", 1, 24.99, "63100"),
  light("xp", "extension", 1, 17.99, "63110"),
  light("llinks", "bundle", 6, 168.99, "llinks-45"),
  light("llinks", "bundle", 8, 209.99, "llinks-60"),
  light("xp", "bundle", 6, 97.99, "xp-45"),
  light("xp", "bundle", 8, 120.99, "xp-60"),
];
export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);
export function getProduct(id: string, mode?: PurchaseMode) {
  const p = products.find((p) => p.id === id);
  return p && (mode === undefined || p.mode === mode) ? p : undefined;
}
export function productFor(mode: PurchaseMode) {
  const p = products.find((p) => p.mode === mode);
  if (!p) throw new Error(`No product offered for ${mode}`);
  return p;
}
export const productHref = (product: Product) =>
  `/kaledines-lemputes/${product.slug}`;
