import { Product, PurchaseMode } from "../types";

export const products: Product[] = [
  {
    id: "1",
    slug: "siltos-baltos-filamentines-c9",
    name: "Šiltos baltos filamentinės C9",
    price: 89,
    rentPrice: 35,
    image: "/product-1.jpg",
    color: "Šilta balta",
    length: "10 m",
    badge: "Populiariausia",
    description:
      "Klasikinės šiltos baltos lemputės su skaidriu stiklu ir filamentu. Jaukus, elegantiškas švytėjimas ant stogo kraštų, turėklų ar medžių.",
    features: [
      "Tarnauja 50 000+ valandų",
      "IP65 — nebijo lietaus ir sniego",
      "Taupo iki 80 % elektros",
      "Išlaiko formą sezonas po sezono",
    ],
    specs: [
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
    price: 79,
    rentPrice: 32,
    image: "/product-2.jpg",
    color: "Spalvota",
    length: "10 m",
    description:
      "Ryškios raudonos, žalios, oranžinės, mėlynos ir geltonos lemputės — linksmos, tradicinės Kalėdos jūsų kieme.",
    features: [
      "5 spalvų derinys",
      "8 šviesos režimai",
      "Galima sujungti kelias girliandas",
      "IP44 — tinka lauke",
    ],
    specs: [
      { label: "Ilgis", value: "10 m" },
      { label: "Lempučių skaičius", value: "25" },
      { label: "Spalva", value: "Spalvota" },
      { label: "Apsauga", value: "IP44, lauko" },
      { label: "Maitinimas", value: "230 V, ES kištukas" },
      { label: "Jungiamasis laidas", value: "3 m" },
    ],
  },
  {
    id: "3",
    slug: "melynos-ir-baltos-c9",
    name: "Mėlynos ir baltos C9",
    price: 79,
    rentPrice: 32,
    image: "/product-3.jpg",
    color: "Mėlyna ir balta",
    length: "10 m",
    description:
      "Žiemiškas mėlynos ir baltos derinys. Puikiai tinka moderniems namams ir skandinaviško stiliaus puošybai.",
    features: [
      "Mėlynos ir baltos derinys",
      "8 šviesos režimai",
      "Galima sujungti kelias girliandas",
      "IP44 — tinka lauke",
    ],
    specs: [
      { label: "Ilgis", value: "10 m" },
      { label: "Lempučių skaičius", value: "25" },
      { label: "Spalva", value: "Mėlyna ir balta" },
      { label: "Apsauga", value: "IP44, lauko" },
      { label: "Maitinimas", value: "230 V, ES kištukas" },
      { label: "Jungiamasis laidas", value: "3 m" },
    ],
  },
  {
    id: "5",
    slug: "raudonos-ir-baltos-c9",
    name: "Raudonos ir baltos C9",
    price: 79,
    rentPrice: 32,
    image: "/product-5.jpg",
    color: "Raudona ir balta",
    length: "10 m",
    description:
      "Klasikinis raudonos ir baltos derinys, primenantis kalėdinius saldainius. Tradicinė nuotaika fasadui, stogui ar medžiams.",
    features: [
      "Raudonos ir baltos derinys",
      "8 šviesos režimai",
      "Galima sujungti kelias girliandas",
      "IP44 — tinka lauke",
    ],
    specs: [
      { label: "Ilgis", value: "10 m" },
      { label: "Lempučių skaičius", value: "25" },
      { label: "Spalva", value: "Raudona ir balta" },
      { label: "Apsauga", value: "IP44, lauko" },
      { label: "Maitinimas", value: "230 V, ES kištukas" },
      { label: "Jungiamasis laidas", value: "3 m" },
    ],
  },
  {
    id: "4",
    slug: "spalvotos-c9-5m",
    name: "Spalvotos C9 — 5 m",
    price: 49,
    rentPrice: 19,
    image: "/product-4.jpg",
    color: "Spalvota",
    length: "5 m",
    description:
      "Trumpesnė spalvota girlianda — idealiai tinka įėjimui, turėklams ar papildyti jau turimą rinkinį.",
    features: [
      "5 spalvų derinys",
      "Kompaktiškas 5 m ilgis",
      "Galima sujungti su kitomis girliandomis",
      "IP44 — tinka lauke",
    ],
    specs: [
      { label: "Ilgis", value: "5 m" },
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

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function priceFor(product: Product, mode: PurchaseMode) {
  return mode === "rent" ? product.rentPrice : product.price;
}

export const lowestPrice = Math.min(...products.map((p) => p.price));
export const lowestRentPrice = Math.min(...products.map((p) => p.rentPrice));
