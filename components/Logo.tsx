import Link from "next/link";
import clsx from "clsx";
import { Bulb } from "./Lights";

export default function Logo({ id, light = false }: { id: string; light?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-1.5" aria-label="Bembis — pradžia">
      <Bulb id={id} className="-mt-2 h-11 w-8 transition-transform duration-300 group-hover:-rotate-6" />
      <span
        className={clsx(
          "font-display text-[1.6rem] leading-none font-semibold tracking-tight",
          light ? "text-snow" : "text-pine-900"
        )}
        style={{ fontVariationSettings: '"SOFT" 100, "opsz" 72' }}
      >
        bembis
      </span>
    </Link>
  );
}
