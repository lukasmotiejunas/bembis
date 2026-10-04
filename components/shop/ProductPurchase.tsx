"use client";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Product } from "@/lib/types";
import AddToCartButton from "./AddToCartButton";

export default function ProductPurchase({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex gap-3">
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
      <AddToCartButton product={product} quantity={quantity} className="flex-1" />
    </div>
  );
}
