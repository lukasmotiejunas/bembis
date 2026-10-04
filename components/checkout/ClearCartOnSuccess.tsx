"use client";
import { useEffect } from "react";
import { useCartHydrated, useCartStore } from "@/lib/store/cartStore";

/** Empties the cart once the saved cart has loaded (clearing earlier would be undone by hydration). */
export default function ClearCartOnSuccess() {
  const hydrated = useCartHydrated();
  const resetAfterOrder = useCartStore((s) => s.resetAfterOrder);

  useEffect(() => {
    if (hydrated) resetAfterOrder();
  }, [hydrated, resetAfterOrder]);

  return null;
}
