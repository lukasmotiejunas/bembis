import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronRight, Wrench } from "lucide-react";
import { getProductBySlug, products } from "@/lib/data/products";
import ProductPurchase from "@/components/shop/ProductPurchase";
import ProductCard from "@/components/shop/ProductCard";

export async function generateMetadata(props: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return { title: product.name, description: product.description };
}

export default async function ProductPage(props: PageProps<"/shop/[slug]">) {
  const { slug } = await props.params;
  const { mode } = await props.searchParams;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const initialMode = mode === "rent" ? "rent" : "buy";
  const others = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <section className="container-page pt-8 pb-20 sm:pb-28">
        <nav aria-label="Kelias" className="flex items-center gap-1.5 text-sm text-stone">
          <Link href={initialMode === "rent" ? "/rent" : "/shop"} className="hover:text-pine-900">
            {initialMode === "rent" ? "Nuoma" : "Lemputės"}
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="truncate font-semibold text-pine-900">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-sand bg-white lg:sticky lg:top-28 lg:self-start">
            <Image
              src={product.image}
              alt={product.name}
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-10"
            />
            {product.badge && (
              <span className="absolute top-5 left-5 rounded-full bg-pine-900 px-3 py-1 text-xs font-bold text-snow">
                {product.badge}
              </span>
            )}
          </div>

          <div>
            <p className="text-stone">
              {product.color} · {product.length}
            </p>
            <h1 className="mt-2 text-4xl leading-tight font-semibold text-pine-900 sm:text-5xl">{product.name}</h1>
            <p className="mt-5 text-lg leading-relaxed text-stone">{product.description}</p>

            <div className="mt-8">
              <ProductPurchase product={product} initialMode={initialMode} />
            </div>

            <Link
              href="/installation"
              className="group mt-6 flex items-center gap-4 rounded-2xl bg-cream p-5 transition-colors hover:bg-glow-soft"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-pine-900 text-glow">
                <Wrench className="size-5" aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block font-bold text-pine-900">Sumontuosime už jus</span>
                <span className="block text-sm text-stone">Atvažiuosime, sumontuosime, o po švenčių — nuimsime.</span>
              </span>
              <ArrowRight className="size-5 text-pine-900 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>

            <div className="mt-10 border-t border-sand pt-8">
              <h2 className="font-sans text-sm font-extrabold tracking-widest text-pine-900 uppercase">Privalumai</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {product.features.map((f) => (
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
          <h2 className="text-3xl font-semibold text-pine-900 sm:text-4xl">Kitos lemputės</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <ProductCard key={p.id} product={p} mode={initialMode} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
