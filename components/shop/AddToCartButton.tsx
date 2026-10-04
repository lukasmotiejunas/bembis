"use client";
import clsx from "clsx";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { Product } from "@/lib/types";

export default function AddToCartButton({
  product,
  quantity = 1,
  className,
}: {
  product: Product;
  quantity?: number;
  className?: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(product.id, product.mode, quantity);
        openCart();
      }}
      className={clsx("btn btn-primary", className)}
    >
      <ShoppingBag className="size-4" aria-hidden="true" />
      Į krepšelį
    </button>
  );
}
