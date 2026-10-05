import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronRight, ShieldCheck, Wrench } from "lucide-react";
import { getProductBySlug, guarantee, productFor, productHref, products } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { GuaranteeBadge } from "@/components/Guarantee";
import { QualityPoints } from "@/components/sections/LightsSection";
import ProductPurchase from "@/components/shop/ProductPurchase";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata, productSchema } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/kaledines-lemputes/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return pageMetadata({
    title: product.seoTitle,
    description: product.seoDescription,
    path: productHref(product),
    images: [{ url: product.image, width: 679, height: 655, alt: `${product.name} kalėdinės lemputės` }],
  });
}

export default async function ProductPage(props: PageProps<"/kaledines-lemputes/[slug]">) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const rent = product.mode === "rent";
  const other = productFor(rent ? "buy" : "rent");
  const alt = `${product.name} kalėdinės lemputės`;

  return (
    <>
      <JsonLd
        data={[
          productSchema(product),
          breadcrumbSchema([
            { name: "Pradžia", path: "/" },
            { name: "Kalėdinės lemputės", path: "/kaledines-lemputes" },
            { name: product.name, path: productHref(product) },
          ]),
        ]}
      />
      <section className="container-page pt-8 pb-20 sm:pb-28">
        <nav aria-label="Kelias" className="flex items-center gap-1.5 text-sm text-stone">
          <Link href="/kaledines-lemputes" className="hover:text-pine-900">
            Dekoracijos
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="truncate font-semibold text-pine-900">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-sand bg-white lg:sticky lg:top-28 lg:self-start">
            <Image
              src={product.image}
              alt={alt}
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-10"
            />
            <GuaranteeBadge className="absolute top-5 left-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={
                  rent
                    ? "rounded-full bg-glow-soft px-3 py-1 text-xs font-extrabold text-glow-deep"
                    : "rounded-full bg-pine-900 px-3 py-1 text-xs font-extrabold text-snow"
                }
              >
                {rent ? "Nuoma sezonui" : "Pirkimas"}
              </span>
              <span className="text-sm text-stone">
                {product.color} · {product.meters} m
              </span>
            </div>
            <h1 className="mt-3 text-4xl leading-tight font-semibold text-pine-900 sm:text-5xl">{product.name}</h1>
            <p className="mt-5 text-lg leading-relaxed text-stone">{product.description}</p>

            <div className="mt-8 rounded-[1.75rem] border border-sand bg-white p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p>
                  <span className="font-display text-5xl font-semibold text-pine-900">{formatPrice(product.price)}</span>
                  <span className="ml-1.5 text-stone">{rent ? "už visą sezoną" : "už 10 m girliandą"}</span>
                </p>
                <p className="flex items-center gap-1.5 text-sm font-bold text-pine-700">
                  <ShieldCheck className="size-4 text-glow-deep" aria-hidden="true" />
                  {guarantee.label}
                </p>
              </div>
              <p className="mt-2 text-sm text-stone">
                {rent ? (
                  <>
                    Nuoma nuo lapkričio iki sausio. Po švenčių lemputes pasiimame.{" "}
                    <Link href="/nuoma" className="font-bold text-pine-900 underline underline-offset-4">
                      Kaip veikia nuoma?
                    </Link>
                  </>
                ) : (
                  "Lemputės lieka jums ir tarnaus daugelį sezonų."
                )}
              </p>
              <div className="mt-5">
                <ProductPurchase product={product} />
              </div>
            </div>

            <Link
              href="/montavimas"
              className="group mt-4 flex items-center gap-4 rounded-2xl bg-cream p-5 transition-colors hover:bg-glow-soft"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-pine-900 text-glow">
                <Wrench className="size-5" aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block font-bold text-pine-900">Sumontuosime už jus</span>
                <span className="block text-sm text-stone">Montavimą ir nuėmimą po švenčių pasirinksite apmokėdami.</span>
              </span>
              <ArrowRight className="size-5 text-pine-900 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>

            <div className="mt-10 border-t border-sand pt-8">
              <h2 className="font-sans text-sm font-extrabold tracking-widest text-pine-900 uppercase">Kodėl šios lemputės</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {[guarantee.label, ...product.features].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-pine-900">
                    <Check className="mt-0.5 size-5 shrink-0 text-glow-deep" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 border-t border-sand pt-8">
              <h2 className="font-sans text-sm font-extrabold tracking-widest text-pine-900 uppercase">Specifikacijos</h2>
              <dl className="mt-4 divide-y divide-sand overflow-hidden rounded-2xl border border-sand bg-white">
                {product.specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-4 px-5 py-3.5">
                    <dt className="text-stone">{s.label}</dt>
                    <dd className="text-right font-semibold text-pine-900">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20">
        <div className="container-page">
          <h2 className="text-3xl font-semibold text-pine-900 sm:text-4xl">{rent ? "Norite lempučių visam laikui?" : "Lempučių reikia tik vienam sezonui?"}</h2>
          <Link
            href={productHref(other)}
            className="group mt-8 flex flex-col gap-6 rounded-[2rem] bg-white p-6 transition hover:shadow-[0_24px_48px_-28px_rgb(18_42_31/0.35)] sm:flex-row sm:items-center sm:p-8"
          >
            <div className="relative size-32 shrink-0">
              <Image src={other.image} alt="" fill sizes="128px" className="object-contain" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-glow-deep">{other.mode === "rent" ? "Nuoma sezonui" : "Pirkimas"}</p>
              <p className="mt-1 font-display text-2xl font-semibold text-pine-900">{other.name}</p>
              <p className="mt-1 text-stone">
                {other.mode === "rent"
                  ? `Išsinuomokite spalvotas lemputes visam sezonui — ${formatPrice(other.price)}.`
                  : `Pirkite šiltas baltas lemputes su 2 metų garantija — ${formatPrice(other.price)}.`}
              </p>
            </div>
            <span className="btn btn-dark shrink-0">
              Žiūrėti
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
          <div className="mt-6">
            <QualityPoints onCream />
          </div>
        </div>
      </section>
    </>
  );
}
