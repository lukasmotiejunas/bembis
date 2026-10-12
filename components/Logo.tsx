import Link from "next/link";
import clsx from "clsx";
import { site } from "@/lib/site";
import type { SiteTheme } from "@/lib/theme";
import { BAT_PATH } from "./halloween/Decor";

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

const HALLOWEEN_LIGHTS = ["#ff8a1f", "#b46cff", "#8be35b", "#8be35b", "#b46cff", "#ff8a1f"];

/** Halloween version of the mark: a crescent moon instead of the star, spooky roof lights and a bat. */
export function HalloweenLogoMark({ id, className }: { id: string; className?: string }) {
  const line = "#f6ecdf";
  return (
    <svg viewBox="2 0 44 44" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" stopColor="#ff8a1f" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ff8a1f" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-moon`}>
          <circle cx="24" cy="6.4" r="4.6" fill="white" />
          <circle cx="26.2" cy="5" r="3.9" fill="black" />
        </mask>
      </defs>
      <path d="M11 21.5 V41 H37 V21.5" fill="none" stroke={line} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="35" r="9" fill={`url(#${id}-glow)`} className="hw-flicker" />
      <path d="M20.5 41 V34 A3.5 3.5 0 0 1 27.5 34 V41 Z" fill="#ff8a1f" />
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
        <circle key={i} cx={x} cy={y} r="2.3" fill={HALLOWEEN_LIGHTS[i]} />
      ))}
      <rect x="18" y="0" width="12" height="12" fill="#f3e6c8" mask={`url(#${id}-moon)`} />
      <path d={BAT_PATH} transform="translate(32 1.2) scale(0.2)" fill={line} />
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

export default function Logo({ id, light = false, theme = "christmas" }: { id: string; light?: boolean; theme?: SiteTheme }) {
  const markClass = "size-11 shrink-0 transition-transform duration-300 group-hover:-rotate-3";
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label={`${site.name} — pradžia`}>
      {theme === "halloween" ? (
        <HalloweenLogoMark id={id} className={markClass} />
      ) : (
        <LogoMark id={id} light={light} className={markClass} />
      )}
      <Wordmark light={light} />
    </Link>
  );
}
