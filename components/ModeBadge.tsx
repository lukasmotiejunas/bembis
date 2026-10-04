import clsx from "clsx";
import { modeLabel } from "@/lib/orders/order";
import { PurchaseMode } from "@/lib/types";

export default function ModeBadge({ mode, className }: { mode: PurchaseMode; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold",
        mode === "rent" ? "bg-glow-soft text-glow-deep" : "bg-cream text-pine-800",
        className
      )}
    >
      {modeLabel[mode]}
    </span>
  );
}
