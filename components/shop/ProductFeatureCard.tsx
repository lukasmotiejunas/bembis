import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Check } from "lucide-react";
import { productHref } from "@/lib/data/products";
import { cheapestDelivery } from "@/lib/data/delivery";
import { formatMeters, formatPrice } from "@/lib/format";
import { Product } from "@/lib/types";
import AddToCartButton from "./AddToCartButton";

/** Product grids show five cards per row on desktop (xl), so from there the card is compact: every xl: class below. */
export default function ProductFeatureCard({ product }: { product: Product }) {
  return (
    <article className="hw-web group flex flex-col overflow-hidden rounded-[2rem] border border-sand bg-white transition hover:border-pine-900/20 hover:shadow-[0_32px_64px_-36px_rgb(18_42_31/0.45)] xl:rounded-3xl">
      <Link
        href={productHref(product)}
        className={clsx(
          "relative block aspect-[4/3] xl:aspect-square",
          product.photos ? "hw-photo bg-white" : "bg-cream",
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
          sizes="(max-width: 1024px) 100vw, (max-width: 1279px) 50vw, 240px"
          className={clsx(
            "object-contain xl:p-3",
            product.photos ? "p-4" : "p-8",
          )}
        />
        <span className="absolute top-5 left-5 rounded-full bg-pine-900 px-3 py-1 text-xs font-extrabold text-snow xl:top-3 xl:left-3 xl:px-2.5 xl:py-0.5 xl:text-[0.65rem]">
          {product.kind === "decoration"
            ? product.category === "folklore"
              ? "Rankų darbo"
              : "Kalėdinė prekė"
            : product.kind === "bundle"
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
      <div className="flex flex-1 flex-col border-t border-sand p-7 sm:p-9 xl:p-4">
        <p className="text-sm text-stone xl:text-xs">
          {product.kind === "decoration"
            ? `Pristatymas per ${product.deliveryBusinessDays} darbo dienas`
            : `${product.color} · ${formatMeters(product.meters)}`}
        </p>
        <h3 className="mt-1 text-2xl font-semibold text-pine-900 sm:text-3xl xl:line-clamp-3 xl:text-base xl:leading-snug">
          <Link href={productHref(product)} className="hover:text-pine-700">
            {product.name}
          </Link>
        </h3>
        <ul className="mt-5 space-y-2.5 xl:hidden">
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
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8 xl:gap-3 xl:pt-4">
          <p>
            <span className="font-display text-4xl font-semibold text-pine-900 xl:text-2xl">
              {formatPrice(product.price)}
            </span>
            <span className="ml-1 block text-sm text-stone xl:ml-0 xl:text-xs">
              {product.kind === "decoration" ? "už prekę arba nurodytą rinkinį" : product.kind === "bundle" ? "už visą komplektą" : "už vieną sekciją"}
            </span>
          </p>
          <div className="flex flex-wrap gap-2 xl:w-full">
            {/* On desktop the photo and the name already open the product. */}
            <Link href={productHref(product)} className="btn btn-outline xl:hidden">
              Plačiau
            </Link>
            <AddToCartButton product={product} className="xl:min-h-10 xl:w-full xl:px-3 xl:text-sm" />
          </div>
        </div>
        <p className="mt-4 text-sm font-semibold text-pine-700 xl:mt-3 xl:text-xs">
          {/* Decorations show their delivery time at the top of the card instead. */}
          {product.kind === "decoration"
            ? `Pristatymas nuo ${formatPrice(cheapestDelivery)}`
            : `Pristatymas per ${product.deliveryBusinessDays} darbo dienas, nuo ${formatPrice(cheapestDelivery)}`}
        </p>
      </div>
    </article>
  );
}
