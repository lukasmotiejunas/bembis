import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, Truck } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductPurchase from "@/components/shop/ProductPurchase";
import ProductFeatureCard from "@/components/shop/ProductFeatureCard";
import { getProductBySlug, productHref, returnPolicy } from "@/lib/data/products";
import { halloweenProducts } from "@/lib/data/halloweenProducts";
import { deliveryPricesText } from "@/lib/data/delivery";
import { formatPrice } from "@/lib/format";
import { breadcrumbSchema, pageMetadata, productSchema } from "@/lib/seo";

export function generateStaticParams() {
  return halloweenProducts.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata(props: PageProps<"/helovyno-dekoracijos/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getProductBySlug(slug);
  if (!p || p.kind !== "decoration") return {};
  return pageMetadata({ title: p.seoTitle, description: p.seoDescription, path: productHref(p) });
}
export default async function DecorationPage(props: PageProps<"/helovyno-dekoracijos/[slug]">) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product || product.kind !== "decoration" || !product.photos?.length) notFound();
  const related = halloweenProducts.filter((p) => p.id !== product.id && p.decorationCategory === product.decorationCategory).slice(0, 3);
  return (
    <>
      <JsonLd data={[productSchema(product), breadcrumbSchema([{ name: "Pradžia", path: "/" }, { name: "Parduotuvė", path: "/kaledines-lemputes" }, { name: product.name, path: productHref(product) }])]} />
      <section className="container-page pt-8 pb-20">
        <nav aria-label="Kelias" className="flex flex-wrap items-center gap-1.5 text-sm text-stone">
          <Link href="/">Pradžia</Link><ChevronRight className="size-3.5" aria-hidden="true" /><Link href="/kaledines-lemputes">Parduotuvė</Link><ChevronRight className="size-3.5" aria-hidden="true" /><span className="font-semibold text-pine-900">{product.name}</span>
        </nav>
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery photos={product.photos} alt={product.name}>
            <span className="absolute top-5 left-5 rounded-full bg-glow px-4 py-2 text-sm font-bold text-pine-950">Pristatymas per 4 dienas</span>
          </ProductGallery>
          <div>
            <p className="text-sm font-bold text-glow-deep">Helovyno dekoracija</p>
            <h1 className="mt-3 text-3xl leading-tight font-semibold text-pine-900 sm:text-4xl">{product.name}</h1>
            <p className="mt-5 text-lg leading-relaxed text-stone">{product.description}</p>
            <div className="mt-7 rounded-[1.75rem] border border-sand bg-white p-6">
              <p className="font-display text-5xl font-semibold text-pine-900">{formatPrice(product.price)}</p>
              <p className="mt-2 text-sm text-stone">Už prekę arba pavadinime nurodytą rinkinį.</p>
              <p className="mt-4 flex items-center gap-2 font-bold text-pine-700"><Truck className="size-5" aria-hidden="true" />Pristatymas per 4 dienas visoje Lietuvoje</p>
              <p className="mt-2 text-sm text-stone">Užsakoma prekė. Pristatymas: {deliveryPricesText}.</p>
              <div className="mt-5"><ProductPurchase product={product} /></div>
              <p className="mt-4 text-sm text-stone">Prekes galite grąžinti per {returnPolicy.days} dienų, grąžinimo išlaidas apmoka pirkėjas.</p>
            </div>
            <ul className="mt-7 space-y-3">
              {product.features.map((feature) => <li key={feature} className="flex gap-3 text-pine-900"><Check className="mt-0.5 size-5 shrink-0 text-glow-deep" aria-hidden="true" />{feature}</li>)}
            </ul>
            <h2 className="mt-9 font-sans text-sm font-extrabold tracking-widest text-pine-900 uppercase">Prekės informacija</h2>
            <dl className="mt-4 divide-y divide-sand rounded-2xl border border-sand bg-white">
              {product.specs.map((spec) => <div key={spec.label} className="flex justify-between gap-4 px-5 py-3.5"><dt className="text-stone">{spec.label}</dt><dd className="text-right font-semibold text-pine-900">{spec.value}</dd></div>)}
            </dl>
          </div>
        </div>
        {related.length > 0 && <div className="mt-20"><h2 className="text-3xl font-semibold text-pine-900">Derinkite su kitomis dekoracijomis</h2><div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5 xl:gap-4">{related.map((p) => <ProductFeatureCard key={p.id} product={p} />)}</div></div>}
      </section>
    </>
  );
}
