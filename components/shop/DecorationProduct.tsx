import Link from "next/link";
import type { Product } from "@/lib/types";
import { products, productHref, returnPolicy } from "@/lib/data/products";
import { deliveryPricesText } from "@/lib/data/delivery";
import { breadcrumbSchema, productSchema } from "@/lib/seo";
import JsonLd from "../JsonLd";
import ProductGallery from "./ProductGallery";
import ProductPurchase from "./ProductPurchase";
import ProductFeatureCard from "./ProductFeatureCard";
import Price from "./Price";

export default function DecorationProduct({ product }: { product: Product }) {
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 5);
  return <>
    <JsonLd data={[productSchema(product), breadcrumbSchema([{ name: "Pradžia", path: "/" }, { name: "Parduotuvė", path: "/kaledines-lemputes" }, { name: product.name, path: productHref(product) }])]} />
    <section className="container-page pt-8 pb-20 sm:pb-28">
      <nav aria-label="Kelias" className="flex flex-wrap gap-2 text-sm text-stone"><Link href="/">Pradžia</Link><span>/</span><Link href="/kaledines-lemputes">Parduotuvė</Link><span>/</span><span>{product.name}</span></nav>
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery photos={product.photos!} alt={product.name}>
          <span className="absolute top-5 left-5 rounded-full bg-pine-900 px-4 py-2 text-sm font-bold text-snow">Pristatymas per {product.deliveryBusinessDays} darbo dienas</span>
        </ProductGallery>
        <div>
          <p className="text-sm font-bold text-glow-deep">Kalėdinės prekės</p>
          <h1 className="mt-3 text-4xl leading-tight font-semibold text-pine-900 sm:text-5xl">{product.name}</h1>
          <p className="mt-5 text-lg leading-relaxed text-stone">{product.description}</p>
          <div className="mt-7 rounded-[1.75rem] border border-sand bg-white p-6">
            <p className="font-display text-5xl font-semibold text-pine-900"><Price price={product.price} /></p>
            <p className="mt-2 text-stone">Už prekę arba pavadinime nurodytą rinkinį.</p>
            <p className="mt-3 text-sm font-bold text-pine-700">Užsakoma prekė. Pristatymas per {product.deliveryBusinessDays} darbo dienas visoje Lietuvoje.</p>
            <p className="mt-2 text-sm text-stone">Pristatymas: {deliveryPricesText}.</p>
            <div className="mt-5"><ProductPurchase product={product} /></div>
            <p className="mt-4 text-sm text-stone">Prekes galite grąžinti per {returnPolicy.days} dienų. Grąžinimo išlaidas apmoka pirkėjas.</p>
          </div>
          <h2 className="mt-9 text-xl font-semibold text-pine-900">Prekės informacija</h2>
          <dl className="mt-4 divide-y divide-sand rounded-2xl border border-sand bg-white">{product.specs.map((s) => <div key={s.label} className="flex justify-between gap-4 px-5 py-3.5"><dt className="text-stone">{s.label}</dt><dd className="text-right font-semibold text-pine-900">{s.value}</dd></div>)}</dl>
        </div>
      </div>
      <h2 className="mt-16 mb-7 text-3xl font-semibold text-pine-900">Daugiau šventinių prekių</h2>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-5 xl:gap-4">{related.map((p) => <ProductFeatureCard key={p.id} product={p} />)}</div>
    </section>
  </>;
}
