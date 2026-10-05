import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Check } from "lucide-react";
import { productHref } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { Product } from "@/lib/types";
import { GuaranteeBadge } from "../Guarantee";
import AddToCartButton from "./AddToCartButton";

const modeTitle = { buy: "Pirkti", rent: "Nuomotis sezonui" } as const;

export default function ProductFeatureCard({ product }: { product: Product }) {
  const rent = product.mode === "rent";

  return (
    <article
      id={rent ? "nuoma" : "pirkti"}
      className="group flex scroll-mt-28 flex-col overflow-hidden rounded-[2rem] border border-sand bg-white transition hover:border-pine-900/20 hover:shadow-[0_32px_64px_-36px_rgb(18_42_31/0.45)]"
    >
      <Link href={productHref(product)} className="relative block aspect-[4/3]" aria-label={product.name}>
        <Image
          src={product.image}
          alt={`${product.name} kalėdinės lemputės`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-10 transition-transform duration-500 group-hover:scale-105 sm:p-12"
        />
        <span
          className={clsx(
            "absolute top-5 left-5 rounded-full px-3 py-1 text-xs font-extrabold",
            rent ? "bg-glow-soft text-glow-deep" : "bg-pine-900 text-snow"
          )}
        >
          {modeTitle[product.mode]}
        </span>
        <GuaranteeBadge className="absolute top-5 right-5" />
      </Link>

      <div className="flex flex-1 flex-col border-t border-sand p-7 sm:p-9">
        <p className="text-sm text-stone">
          {product.color} · {product.meters} m
        </p>
        <h3 className="mt-1 text-3xl font-semibold text-pine-900">
          <Link href={productHref(product)} className="hover:text-pine-700">
            {product.name}
          </Link>
        </h3>
        <p className="mt-3 leading-relaxed text-stone">{product.description}</p>
        <ul className="mt-5 space-y-2.5">
          {product.features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-start gap-3 text-pine-900">
              <Check className="mt-0.5 size-5 shrink-0 text-glow-deep" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
          <p>
            <span className="font-display text-4xl font-semibold text-pine-900">{formatPrice(product.price)}</span>
            <span className="ml-1 text-stone">{rent ? "/ sezonui" : "/ 10 m"}</span>
          </p>
          <div className="flex gap-2">
            <Link href={productHref(product)} className="btn btn-outline">
              Plačiau
            </Link>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </article>
  );
}
