"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { cartTotals, resolveLines, useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/format";
import { modeLabel } from "./ModeBadge";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const lines = resolveLines(items);
  const { total } = cartTotals(lines);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div className="animate-fade-in absolute inset-0 bg-pine-950/40 backdrop-blur-[2px]" onClick={closeCart} />

      <aside className="animate-drawer-in absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-snow shadow-2xl">
        <div className="flex items-center justify-between border-b border-sand px-6 py-5">
          <h2 id="cart-title" className="text-2xl font-semibold text-pine-900">
            Krepšelis
          </h2>
          <button
            type="button"
            onClick={closeCart}
            autoFocus
            className="inline-flex size-10 items-center justify-center rounded-full text-stone hover:bg-cream hover:text-pine-900"
            aria-label="Uždaryti krepšelį"
          >
            <X className="size-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-cream">
              <ShoppingBag className="size-7 text-pine-700" aria-hidden="true" />
            </div>
            <p className="text-lg font-semibold text-pine-900">Krepšelis tuščias</p>
            <p className="text-stone">Išsirinkite lemputes — galite jas pirkti arba išsinuomoti sezonui.</p>
            <div className="mt-2 flex gap-3">
              <Link href="/shop" onClick={closeCart} className="btn btn-dark">
                Pirkti
              </Link>
              <Link href="/rent" onClick={closeCart} className="btn btn-outline">
                Nuomotis
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-sand overflow-y-auto px-6">
              {lines.map((line) => (
                <li key={`${line.productId}-${line.mode}`} className="flex gap-4 py-5">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-sand bg-white">
                    <Image src={line.product.image} alt="" fill sizes="80px" className="object-contain p-1.5" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="leading-snug font-bold text-pine-900">{line.product.name}</p>
                        <p className="mt-0.5 text-sm text-stone">
                          {modeLabel[line.mode]} · {formatPrice(line.unitPrice)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.productId, line.mode)}
                        className="-m-1 p-1 text-stone hover:text-berry"
                        aria-label={`Pašalinti ${line.product.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border-[1.5px] border-sand bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.productId, line.mode, line.quantity - 1)}
                          className="flex size-9 items-center justify-center text-pine-900"
                          aria-label="Mažiau"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-bold">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.productId, line.mode, line.quantity + 1)}
                          className="flex size-9 items-center justify-center text-pine-900"
                          aria-label="Daugiau"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="font-bold text-pine-900">{formatPrice(line.unitPrice * line.quantity)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-sand bg-white px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-stone">Iš viso</span>
                <span className="font-display text-3xl font-semibold text-pine-900">{formatPrice(total)}</span>
              </div>
              <p className="mt-2 text-sm text-stone">
                Pateikę užsakymą, susisieksime su jumis ir suderinsime pristatymą bei montavimą.
              </p>
              <Link href="/contact#forma" onClick={closeCart} className="btn btn-primary mt-5 w-full">
                Pateikti užsakymą
              </Link>
              <button type="button" onClick={closeCart} className="mt-3 w-full py-2 text-sm font-semibold text-stone hover:text-pine-900">
                Tęsti apsipirkimą
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
