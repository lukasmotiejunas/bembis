import Link from "next/link";
import clsx from "clsx";
import { site } from "@/lib/site";

const AMBER = "#f4b03e";
const STAR =
  "M24 2.4 L25.35 5.74 L28.95 5.99 L26.19 8.31 L27.06 11.81 L24 9.9 L20.94 11.81 L21.81 8.31 L19.05 5.99 L22.65 5.74 Z";
// Bulbs along the roofline (both slopes, below the star)
const ROOF_LIGHTS = [
  [8.16, 23.08],
  [13.56, 18.28],
  [18.96, 13.48],
  [29.04, 13.48],
  [34.44, 18.28],
  [39.84, 23.08],
];

/** House outline with lights along the roof, a star on top and a lit door. */
export function LogoMark({ id, light = false, className }: { id: string; light?: boolean; className?: string }) {
  const line = light ? "#fbf8f3" : "#122a1f";
  return (
    <svg viewBox="2 0 44 44" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" stopColor={AMBER} stopOpacity="0.65" />
          <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M11 21.5 V41 H37 V21.5" fill="none" stroke={line} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="20.5" y="30.5" width="7" height="10.5" rx="1.6" fill={AMBER} />
      {/* Glow sits behind the roof line so it only shines around it */}
      {ROOF_LIGHTS.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="5.5"
          fill={`url(#${id}-glow)`}
          className="animate-twinkle"
          style={{ animationDelay: `${(i * 0.55).toFixed(2)}s` }}
        />
      ))}
      <path d="M6 25 L24 9 L42 25" fill="none" stroke={line} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      {ROOF_LIGHTS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.3" fill={AMBER} />
      ))}
      <path d={STAR} fill={AMBER} stroke={AMBER} strokeWidth="0.6" strokeLinejoin="round" />
    </svg>
  );
}

/** "Kalėdų Dekoras" wordmark — the dot over the ė is a little glowing light. */
export function Wordmark({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span
      className={clsx("flex flex-col font-display text-[1.3rem] leading-[0.95] font-semibold tracking-tight", className)}
      style={{ fontVariationSettings: '"SOFT" 100, "opsz" 72' }}
      aria-hidden="true"
    >
      <span className={light ? "text-snow" : "text-pine-900"}>
        Kal
        <span className="relative">
          e
          <span className="absolute top-[0.25em] left-1/2 size-[0.17em] -translate-x-1/2 rounded-full bg-glow shadow-[0_0_0.3em_0.05em_var(--color-glow)]" />
        </span>
        dų
      </span>
      <span className={clsx("italic", light ? "text-glow" : "text-glow-deep")}>Dekoras</span>
    </span>
  );
}

export default function Logo({ id, light = false }: { id: string; light?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label={`${site.name} — pradžia`}>
      <LogoMark id={id} light={light} className="size-11 shrink-0 transition-transform duration-300 group-hover:-rotate-3" />
      <Wordmark light={light} />
    </Link>
  );
}
