"use client";

import { useState } from "react";
import clsx from "clsx";
import type { DecorationCategory, Product } from "@/lib/types";
import ProductFeatureCard from "./ProductFeatureCard";

type Category = DecorationCategory | "all" | "lights";
const categories: { id: Category; label: string }[] = [
  { id: "all", label: "Visos prekės" },
  { id: "lights", label: "Lauko LED girliandos" },
  { id: "vorai", label: "Vorai ir voratinkliai" },
  { id: "vaiduokliai", label: "Vaiduokliai ir skeletai" },
  { id: "moliugai", label: "Moliūgai ir žibintai" },
  { id: "rinkiniai", label: "Rinkiniai ir balionai" },
  { id: "aksesuarai", label: "Kiti aksesuarai" },
];
const fold = (value: string) => value.toLocaleLowerCase("lt").normalize("NFD").replace(/\p{Diacritic}/gu, "");

export default function ProductCatalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [sort, setSort] = useState("default");
  const shown = products.filter((p) => (category === "all"
    || (category === "lights" ? p.kind !== "decoration" : p.decorationCategory === category))
    && fold(`${p.name} ${p.description}`).includes(fold(query.trim())));
  if (sort === "price-asc") shown.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") shown.sort((a, b) => b.price - a.price);

  return (
    <>
      <div className="mb-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-pine-900">Ieškoti prekės</span>
            <input className="field" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Girlianda, voras, moliūgas…" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-pine-900">Rikiuoti</span>
            <select className="field" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="default">Rekomenduojama tvarka</option>
              <option value="price-asc">Kaina: nuo mažiausios</option>
              <option value="price-desc">Kaina: nuo didžiausios</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Prekių kategorijos">
          {categories.map(({ id, label }) => (
            <button key={id} type="button" aria-pressed={category === id} onClick={() => setCategory(id)}
              className={clsx("rounded-full border px-4 py-2 text-sm font-bold transition", category === id ? "border-pine-900 bg-pine-900 text-snow" : "border-sand bg-white text-pine-900 hover:border-pine-700")}>
              {label}
            </button>
          ))}
        </div>
        <p className="text-sm text-stone" aria-live="polite">Rasta prekių: {shown.length}</p>
      </div>
      {shown.length ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {shown.map((product) => <ProductFeatureCard key={product.id} product={product} />)}
        </div>
      ) : <p className="rounded-2xl border border-sand bg-white p-8 text-center text-stone">Pagal šią paiešką prekių neradome. Pabandykite kitą pavadinimą arba kategoriją.</p>}
    </>
  );
}
