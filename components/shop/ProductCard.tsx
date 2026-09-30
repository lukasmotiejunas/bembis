import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { Product, PurchaseMode } from "@/lib/types";

export default function ProductCard({ product, mode }: { product: Product; mode?: PurchaseMode }) {
  const href = mode === "rent" ? `/shop/${product.slug}?mode=rent` : `/shop/${product.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-3xl border border-sand bg-white transition duration-300 hover:-translate-y-1 hover:border-pine-900/20 hover:shadow-[0_24px_48px_-24px_rgb(18_42_31/0.35)]"
    >
      <div className="relative aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute top-4 left-4 rounded-full bg-pine-900 px-3 py-1 text-xs font-bold text-snow">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col border-t border-sand p-5">
        <p className="text-sm text-stone">
          {product.color} · {product.length}
        </p>
        <h3 className="mt-1 text-xl leading-snug font-medium text-pine-900">{product.name}</h3>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          {mode === "rent" ? (
            <p>
              <span className="text-2xl font-extrabold text-pine-900">{formatPrice(product.rentPrice)}</span>
              <span className="ml-1 text-sm text-stone">/ sezonui</span>
            </p>
          ) : mode === "buy" ? (
            <p className="text-2xl font-extrabold text-pine-900">{formatPrice(product.price)}</p>
          ) : (
            <div>
              <p className="text-2xl font-extrabold text-pine-900">{formatPrice(product.price)}</p>
              <p className="text-sm text-stone">arba nuoma {formatPrice(product.rentPrice)} / sezonui</p>
            </div>
          )}
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-cream text-pine-900 transition-colors group-hover:bg-glow">
            <ArrowRight className="size-5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
