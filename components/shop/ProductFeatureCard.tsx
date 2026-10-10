import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Check } from "lucide-react";
import { productHref } from "@/lib/data/products";
import { cheapestDelivery } from "@/lib/data/delivery";
import { formatMeters, formatPrice } from "@/lib/format";
import { Product } from "@/lib/types";
import AddToCartButton from "./AddToCartButton";

export default function ProductFeatureCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[2rem] border border-sand bg-white transition hover:border-pine-900/20 hover:shadow-[0_32px_64px_-36px_rgb(18_42_31/0.45)]">
      <Link
        href={productHref(product)}
        className={clsx(
          "relative block aspect-[4/3]",
          product.photos ? "bg-white" : "bg-cream",
        )}
        aria-label={product.name}
      >
        <Image
          src={product.image}
          alt={
            product.photos
              ? product.name
              : `${product.series === "xp" ? "XP" : "LLinks"} LED girliandos schema`
          }
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={clsx(
            "object-contain",
            product.photos ? "p-4" : "p-8",
          )}
        />
        <span className="absolute top-5 left-5 rounded-full bg-pine-900 px-3 py-1 text-xs font-extrabold text-snow">
          {product.kind === "bundle"
            ? "Komplektas"
            : product.kind === "starter"
              ? "Motininė girlianda"
              : "Papildoma sekcija"}
        </span>
        {!product.photos && (
          <span className="absolute right-5 bottom-4 text-xs text-stone">
            Apšvietimo schema
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col border-t border-sand p-7 sm:p-9">
        <p className="text-sm text-stone">
          {product.color} · {formatMeters(product.meters)}
        </p>
        <h3 className="mt-1 text-2xl font-semibold text-pine-900 sm:text-3xl">
          <Link href={productHref(product)} className="hover:text-pine-700">
            {product.name}
          </Link>
        </h3>
        <p className="mt-3 leading-relaxed text-stone">{product.description}</p>
        <ul className="mt-5 space-y-2.5">
          {product.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-pine-900">
              <Check
                className="mt-0.5 size-5 shrink-0 text-glow-deep"
                aria-hidden="true"
              />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
          <p>
            <span className="font-display text-4xl font-semibold text-pine-900">
              {formatPrice(product.price)}
            </span>
            <span className="ml-1 block text-sm text-stone">
              {product.kind === "bundle"
                ? "už visą komplektą"
                : "už vieną sekciją"}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href={productHref(product)} className="btn btn-outline">
              Plačiau
            </Link>
            <AddToCartButton product={product} />
          </div>
        </div>
        <p className="mt-4 text-sm font-semibold text-pine-700">
          Pristatymas nuo {formatPrice(cheapestDelivery)}
        </p>
      </div>
    </article>
  );
}
