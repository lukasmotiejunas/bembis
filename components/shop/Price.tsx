"use client";
import clsx from "clsx";
import { formatPrice } from "@/lib/format";
import { discountedPrice } from "@/lib/orders/order";
import { useWheelDiscount } from "@/lib/store/cartStore";

interface Line {
  price: number;
  quantity: number;
  previousPrice?: number;
}

/** Says the price shown already has the visitor's wheel win taken off; nothing without a discount. */
export function DiscountNote({ className }: { className?: string }) {
  const discount = useWheelDiscount();
  if (!discount) return null;
  return (
    <span className={className}>
      Į kainą įskaičiuota jūsų laimės rato nuolaida −{discount.percent}&nbsp;%.
    </span>
  );
}

/**
 * Shows the current price, sale label and prior price when a promotion is active.
 * `price` is a unit price or the lines of a total; each unit is discounted the way the order charges it.
 */
export default function Price({
  price,
  className,
  previousPrice,
}: {
  price: number | Line[];
  previousPrice?: number;
  className?: string;
}) {
  const discount = useWheelDiscount();
  const lines = typeof price === "number" ? [{ price, quantity: 1, previousPrice }] : price;
  const sum = (unit: (price: number) => number) =>
    lines.reduce((s, l) => s + Math.round(unit(l.price) * 100) * l.quantity, 0) / 100;
  const full = sum((p) => p);
  const previous = lines.reduce((s, line) => s + Math.round((line.previousPrice ?? line.price) * 100) * line.quantity, 0) / 100;
  const sale = previous > full;
  if (!discount && !sale) return <span className={className}>{formatPrice(full)}</span>;
  return (
    <span className={clsx("inline-flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      {sale && <span className="rounded-full bg-glow px-2 py-1 font-sans text-xs font-bold uppercase tracking-wide text-pine-950">Akcija</span>}
      <span className="whitespace-nowrap">
        {formatPrice(discount ? sum((p) => discountedPrice(p, discount.percent)) : full)}
      </span>
      <del className="text-[length:max(0.55em,0.75rem)] font-semibold whitespace-nowrap text-stone">
        <span className="sr-only">Ankstesnė kaina </span>
        {formatPrice(sale ? previous : full)}
      </del>
    </span>
  );
}
