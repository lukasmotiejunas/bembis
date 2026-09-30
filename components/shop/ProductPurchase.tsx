"use client";
import { useState } from "react";
import clsx from "clsx";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/format";
import { Product, PurchaseMode } from "@/lib/types";

export default function ProductPurchase({ product, initialMode }: { product: Product; initialMode: PurchaseMode }) {
  const [mode, setMode] = useState<PurchaseMode>(initialMode);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const options = [
    { mode: "buy" as const, title: "Pirkti", price: formatPrice(product.price), note: "Lemputės lieka jums" },
    {
      mode: "rent" as const,
      title: "Nuomotis sezonui",
      price: formatPrice(product.rentPrice),
      note: "Po švenčių pasiimame",
    },
  ];

  return (
    <div>
      <fieldset>
        <legend className="sr-only">Pirkti ar nuomotis</legend>
        <div className="grid grid-cols-2 gap-3">
          {options.map((o) => (
            <label
              key={o.mode}
              className={clsx(
                "cursor-pointer rounded-2xl border-2 p-4 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-glow-deep sm:p-5",
                mode === o.mode ? "border-pine-900 bg-white" : "border-sand bg-white/60 hover:border-pine-900/30"
              )}
            >
              <input
                type="radio"
                name="mode"
                value={o.mode}
                checked={mode === o.mode}
                onChange={() => setMode(o.mode)}
                className="sr-only"
              />
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-pine-900">{o.title}</span>
                <span
                  className={clsx(
                    "size-4 rounded-full border-2",
                    mode === o.mode ? "border-pine-900 bg-pine-900 shadow-[inset_0_0_0_2.5px_white]" : "border-sand"
                  )}
                />
              </span>
              <span className="mt-2 block text-2xl font-extrabold text-pine-900">{o.price}</span>
              <span className="mt-0.5 block text-sm text-stone">{o.note}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 flex gap-3">
        <div className="flex items-center rounded-full border-[1.5px] border-sand bg-white">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex size-12 items-center justify-center text-pine-900 disabled:opacity-30"
            disabled={quantity <= 1}
            aria-label="Mažiau"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center font-bold" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex size-12 items-center justify-center text-pine-900"
            aria-label="Daugiau"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            addItem(product.id, mode, quantity);
            openCart();
          }}
          className="btn btn-primary flex-1"
        >
          <ShoppingBag className="size-4" aria-hidden="true" />
          Į krepšelį
        </button>
      </div>
    </div>
  );
}
