import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronRight, Wrench } from "lucide-react";
import {
  getProductBySlug,
  productHref,
  products,
  returnPolicy,
  seriesNames,
} from "@/lib/data/products";
import { pricing } from "@/lib/data/pricing";
import { formatMeters, formatPrice } from "@/lib/format";
import { GuaranteeBadge } from "@/components/Guarantee";
import { QualityPoints } from "@/components/sections/LightsSection";
import ProductPurchase from "@/components/shop/ProductPurchase";
import ProductFeatureCard from "@/components/shop/ProductFeatureCard";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata, productSchema } from "@/lib/seo";
import { inquiryHref, INSTALLATION_SERVICE } from "@/lib/inquiry";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata(
  props: PageProps<"/kaledines-lemputes/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return pageMetadata({
    title: product.seoTitle,
    description: product.seoDescription,
    path: productHref(product),
  });
}
export default async function ProductPage(
  props: PageProps<"/kaledines-lemputes/[slug]">,
) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const related = products
    .filter(
      (p) =>
        p.series === product.series &&
        p.id !== product.id &&
        (p.kind === "starter" || p.kind === "bundle"),
    )
    .slice(0, 2);
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
        <nav
          aria-label="Kelias"
          className="flex flex-wrap items-center gap-1.5 text-sm text-stone"
        >
          <Link href="/" className="hover:text-pine-900">
            Pradžia
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <Link href="/kaledines-lemputes" className="hover:text-pine-900">
            Kalėdinės lemputės
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="font-semibold text-pine-900">{product.name}</span>
        </nav>
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-sand bg-cream lg:sticky lg:top-28 lg:self-start">
            <Image
              src={product.image}
              alt={`${seriesNames[product.series]} LED apšvietimo schema`}
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-8"
            />
            <GuaranteeBadge className="absolute top-5 left-5" />
            <p className="absolute right-6 bottom-6 text-sm text-stone">
              Apšvietimo schema
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-glow-deep">
              {product.kind === "bundle"
                ? "Visas komplektas"
                : product.kind === "starter"
                  ? "Motininė girlianda"
                  : "Papildoma sekcija"}{" "}
              · {product.color}
            </p>
            <h1 className="mt-3 text-4xl leading-tight font-semibold text-pine-900 sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-stone">
              {product.description}
            </p>
            {product.kind === "extension" && (
              <p className="mt-4 rounded-2xl bg-glow-soft p-4 text-sm font-semibold text-pine-900">
                Ši sekcija skirta tos pačios serijos motininei girliandai
                papildyti. Pradiniam rinkiniui rinkitės motininę girliandą arba
                komplektą.
              </p>
            )}
            <div className="mt-7 rounded-[1.75rem] border border-sand bg-white p-6">
              <p className="font-display text-5xl font-semibold text-pine-900">
                {formatPrice(product.price)}
              </p>
              <p className="mt-2 text-stone">
                {product.kind === "bundle"
                  ? `Už visą ${formatMeters(product.meters)} komplektą`
                  : `Už vieną ${formatMeters(product.meters)} sekciją`}
              </p>
              <p className="mt-3 text-sm font-bold text-pine-700">
                Turime sandėlyje
              </p>
              <p className="mt-2 text-sm text-stone">
                Nemokamas prekių pristatymas. Laiką suderiname su jumis.
                Lemputės lieka jums.
              </p>
              <p className="mt-1 text-sm text-stone">
                Prekes galite grąžinti per {returnPolicy.days} dienų,
                grąžinimo išlaidas apmoka pirkėjas.
              </p>
              <div className="mt-5">
                <ProductPurchase product={product} />
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link
                href={inquiryHref(
                  [INSTALLATION_SERVICE, "Lempučių pirkimas"],
                  `Domina ${product.name} ir montavimas bei nuėmimas po sezono. Prašau pasiūlymo mano objektui.`,
                )}
                className="group flex gap-3 rounded-2xl bg-cream p-5"
              >
                <Wrench
                  className="mt-1 size-5 shrink-0 text-glow-deep"
                  aria-hidden="true"
                />
                <span>
                  <strong className="block text-pine-900">
                    Papuošime už jus
                  </strong>
                  <span className="mt-1 block text-sm text-stone">
                    Montavimas ir nuėmimas su mūsų lemputėmis —{" "}
                    {formatPrice(pricing.installPerMeter)}/m. Galutinė darbo
                    kaina pagal objektą.
                  </span>
                </span>
              </Link>
              <Link
                href={`/nuoma#${product.series}`}
                className="rounded-2xl bg-glow-soft p-5"
              >
                <strong className="block text-pine-900">
                  Norite išsinuomoti?
                </strong>
                <span className="mt-1 block text-sm text-stone">
                  {seriesNames[product.series]} nuoma —{" "}
                  {formatPrice(pricing.rentalPerMeter[product.series])}/m.
                  Nuomos ir darbų pasiūlymą suderiname atskirai.
                </span>
              </Link>
            </div>
            <div className="mt-9 border-t border-sand pt-7">
              <h2 className="font-sans text-sm font-extrabold tracking-widest text-pine-900 uppercase">
                Kas įeina
              </h2>
              <ul className="mt-4 space-y-3">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-3 text-pine-900">
                    <Check
                      className="mt-0.5 size-5 shrink-0 text-glow-deep"
                      aria-hidden="true"
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-9 border-t border-sand pt-7">
              <h2 className="font-sans text-sm font-extrabold tracking-widest text-pine-900 uppercase">
                Specifikacijos ir sudėtis
              </h2>
              <dl className="mt-4 divide-y divide-sand rounded-2xl border border-sand bg-white">
                {product.specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex justify-between gap-4 px-5 py-3.5"
                  >
                    <dt className="text-stone">{s.label}</dt>
                    <dd className="text-right font-semibold text-pine-900">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-cream py-20">
        <div className="container-page">
          <h2 className="text-3xl font-semibold text-pine-900">
            Kiti {seriesNames[product.series]} pasirinkimai
          </h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {related.map((p) => (
              <ProductFeatureCard key={p.id} product={p} />
            ))}
          </div>
          <Link href="/kaledines-lemputes" className="btn btn-dark mt-7">
            Visas katalogas
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <div className="mt-7">
            <QualityPoints onCream />
          </div>
        </div>
      </section>
    </>
  );
}
