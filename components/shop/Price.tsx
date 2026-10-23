"use client";
import clsx from "clsx";
import { formatPrice } from "@/lib/format";
import { discountedPrice } from "@/lib/orders/order";
import { useWheelDiscount } from "@/lib/store/cartStore";

interface Line {
  price: number;
  quantity: number;
}

/**
 * A product price. With a laimės ratas discount it shows the discounted price and the old one struck through.
 * `price` is a unit price or the lines of a total; each unit is discounted the way the order charges it.
 */
export default function Price({
  price,
  className,
}: {
  price: number | Line[];
  className?: string;
}) {
  const discount = useWheelDiscount();
  const lines = typeof price === "number" ? [{ price, quantity: 1 }] : price;
  const sum = (unit: (price: number) => number) =>
    lines.reduce((s, l) => s + Math.round(unit(l.price) * 100) * l.quantity, 0) / 100;
  const full = sum((p) => p);
  if (!discount) return <span className={className}>{formatPrice(full)}</span>;
  return (
    <span className={clsx("inline-flex flex-wrap items-baseline gap-x-2", className)}>
      <span className="whitespace-nowrap">
        {formatPrice(sum((p) => discountedPrice(p, discount.percent)))}
      </span>
      <del className="text-[length:max(0.55em,0.75rem)] font-semibold whitespace-nowrap text-stone">
        <span className="sr-only">Įprasta kaina </span>
        {formatPrice(full)}
      </del>
    </span>
  );
}
