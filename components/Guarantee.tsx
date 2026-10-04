import clsx from "clsx";
import { ShieldCheck } from "lucide-react";
import { guarantee } from "@/lib/data/products";

export function GuaranteeBadge({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold",
        dark ? "bg-pine-900 text-glow" : "bg-glow text-pine-950",
        className
      )}
    >
      <ShieldCheck className="size-3.5" aria-hidden="true" />
      {guarantee.label}
    </span>
  );
}

/** Round "2 metų garantija" seal. */
export function GuaranteeSeal({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "relative flex size-40 shrink-0 items-center justify-center rounded-full bg-glow text-pine-950 shadow-[0_0_70px_rgb(244_176_62/0.45)] sm:size-44",
        className
      )}
      role="img"
      aria-label={guarantee.label}
    >
      <div className="absolute inset-2.5 rounded-full border-2 border-dashed border-pine-950/25" />
      <div className="text-center leading-none" aria-hidden="true">
        <span className="block font-display text-7xl font-semibold">{guarantee.years}</span>
        <span className="mt-1.5 block text-[0.7rem] font-extrabold tracking-[0.22em] uppercase">metų</span>
        <span className="mt-1 block text-[0.7rem] font-extrabold tracking-[0.22em] uppercase">garantija</span>
      </div>
    </div>
  );
}
