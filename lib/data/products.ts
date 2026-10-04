import { Product, PurchaseMode } from "../types";

export const guarantee = { years: 2, label: "2 metų garantija" };

// Viena lemputė parduodama, viena — nuomojama sezonui.
export const products: Product[] = [
  {
    id: "1",
    slug: "siltos-baltos-filamentines-c9",
    name: "Šiltos baltos filamentinės C9",
    mode: "buy",
    price: 89,
    image: "/product-1.jpg",
    color: "Šilta balta",
    meters: 10,
    description:
      "Aukščiausios kokybės šiltos baltos lemputės su skaidriu stiklu ir filamentu. Jaukus, elegantiškas švytėjimas, kuris lieka jums ilgiems metams.",
    features: [
      "Tarnauja 50 000+ valandų",
      "IP65 — nebijo lietaus, sniego ir šalčio",
      "Taupo iki 80 % elektros",
      "Išlaiko formą sezonas po sezono",
    ],
    specs: [
      { label: "Garantija", value: "2 metai" },
      { label: "Ilgis", value: "10 m" },
      { label: "Lempučių skaičius", value: "25" },
      { label: "Spalva", value: "Šilta balta (2700K)" },
      { label: "Apsauga", value: "IP65, lauko" },
      { label: "Maitinimas", value: "230 V, ES kištukas" },
      { label: "Jungiamasis laidas", value: "5 m" },
    ],
  },
  {
    id: "2",
    slug: "spalvotos-c9",
    name: "Spalvotos C9",
    mode: "rent",
    price: 32,
    image: "/product-2.jpg",
    color: "Spalvota",
    meters: 10,
    description:
      "Ryškios raudonos, žalios, oranžinės, mėlynos ir geltonos lemputės — linksmos, tradicinės Kalėdos jūsų kieme. Išnuomojame visam sezonui, o po švenčių pasiimame.",
    features: [
      "5 spalvų derinys ir 8 šviesos režimai",
      "Tinka lauke — atsparios lietui ir sniegui",
      "Nereikia pirkti ir sandėliuoti",
      "Po švenčių lemputes pasiimame",
    ],
    specs: [
      { label: "Garantija", value: "2 metai" },
      { label: "Ilgis", value: "10 m" },
      { label: "Lempučių skaičius", value: "25" },
      { label: "Spalva", value: "Spalvota" },
      { label: "Apsauga", value: "IP44, lauko" },
      { label: "Maitinimas", value: "230 V, ES kištukas" },
      { label: "Jungiamasis laidas", value: "3 m" },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

/** A product is only orderable the way it is offered (the sale light can't be rented and vice versa). */
export function getProduct(id: string, mode?: PurchaseMode) {
  const product = products.find((p) => p.id === id);
  return product && (mode === undefined || product.mode === mode) ? product : undefined;
}

/** The light offered for sale or for rent. */
export function productFor(mode: PurchaseMode) {
  const product = products.find((p) => p.mode === mode);
  if (!product) throw new Error(`No product offered for ${mode}`);
  return product;
}

export const productHref = (product: Product) => `/shop/${product.slug}`;
