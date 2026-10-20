"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import ProductFeatureCard from "./ProductFeatureCard";

const categories = [
  ["all", "Visos prekės"],
  ["lights", "Lauko LED girliandos"],
  ["folklore", "Folkloriniai žaisliukai"],
  ["advent", "Advento kalendoriai"],
  ["decorations", "Kalėdinės dekoracijos"],
  ["gifts", "Dovanos ir aksesuarai"],
] as const;
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function ProductCatalog({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const shown = products.filter((p) =>
    (category === "all" || (category === "lights" ? p.kind !== "decoration" : p.category === category)) &&
    normalize(p.name).includes(normalize(query.trim())),
  );
  if (sort !== "default") shown.sort((a, b) => sort === "asc" ? a.price - b.price : b.price - a.price);

  const lights = shown.filter((p) => p.kind !== "decoration");
  const decorations = shown.filter((p) => p.kind === "decoration");

  return <div>
    <div className="mb-6 grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-bold text-pine-900">Ieškoti prekės
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} className="mt-2 block w-full rounded-2xl border border-sand bg-white px-4 py-3" />
      </label>
      <label className="text-sm font-bold text-pine-900">Rikiuoti
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="mt-2 block w-full rounded-2xl border border-sand bg-white px-4 py-3">
          <option value="default">Rekomenduojama tvarka</option>
          <option value="asc">Kaina: nuo mažiausios</option>
          <option value="desc">Kaina: nuo didžiausios</option>
        </select>
      </label>
    </div>
    <div className="mb-5 flex flex-wrap gap-2" aria-label="Prekių kategorijos">
      {categories.map(([id, label]) => <button key={id} type="button" aria-pressed={category === id} onClick={() => setCategory(id)} className={`btn text-sm ${category === id ? "btn-dark" : "btn-outline"}`}>{label}</button>)}
    </div>
    <p className="mb-5 text-sm text-stone" role="status">Rasta prekių: {shown.length}</p>
    {lights.length > 0 && <section aria-labelledby="catalog-lights-title">
      <h2 id="catalog-lights-title" className="mb-6 text-3xl font-semibold text-pine-900">Lauko LED girliandos</h2>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-5 xl:gap-4">
        {lights.map((p) => <ProductFeatureCard key={p.id} product={p} />)}
      </div>
    </section>}
    {decorations.length > 0 && <section aria-labelledby="catalog-decorations-title" className={lights.length > 0 ? "mt-16 border-t border-sand pt-12 sm:mt-20 sm:pt-16" : undefined}>
      <h2 id="catalog-decorations-title" className="text-3xl font-semibold text-pine-900">Papildomos dekoracijos</h2>
      <p className="mt-3 mb-7 text-stone">Eglutės žaisliukai, advento kalendoriai, kalėdinės dekoracijos ir dovanos.</p>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-5 xl:gap-4">
        {decorations.map((p) => <ProductFeatureCard key={p.id} product={p} />)}
      </div>
    </section>}
    {shown.length === 0 && <p className="py-10 text-center text-stone">Prekių nerasta. Pabandykite kitą pavadinimą arba kategoriją.</p>}
  </div>;
}
