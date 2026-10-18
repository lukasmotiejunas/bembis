"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Check, Copy, Gift, Loader2, X } from "lucide-react";
import { spinWheel } from "@/app/checkout/actions";
import { maxWheelPercent, wheelSlices } from "@/lib/data/wheel";
import { useCartStore } from "@/lib/store/cartStore";
import type { SiteTheme } from "@/lib/theme";
import { useSiteTheme } from "../SiteTheme";

// Shown on every page load until this browser spins it, then not again for a week.
// Never during checkout or in the admin.
const STORAGE_KEY = "laimes-ratas";
const SPIN_EVERY_DAYS = 7;
const HIDDEN_ON = ["/checkout", "/admin", "/mokejimo-patikra"];
const SPIN_MS = 5600;

const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, visitor's time zone
/** Spun within the last week: a spin on the 18th shows the wheel again on the 25th. */
function spunRecently() {
  try {
    const { day, code } = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    // Records without a code are from closing the wheel unspun, which no longer counts.
    if (!code || typeof day !== "string") return false;
    return (Date.parse(today()) - Date.parse(day)) / 86_400_000 < SPIN_EVERY_DAYS;
  } catch {
    return false;
  }
}
function rememberSpin(win: Win) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ day: today(), ...win }));
  } catch {
    // Private mode or blocked storage: the wheel may simply show again.
  }
}

// Each prize has one colour, so the colour's share of the wheel is its chance of winning.
const themes: Record<
  SiteTheme,
  {
    card: string;
    accent: string;
    rim: [string, string, string];
    inner: string;
    bulb: string;
    hub: string;
    hubText: string;
    prizes: Record<number, { fill: string; text: string }>;
    confetti: string[];
    chip: string;
    title: string;
    subtitle?: string;
  }
> = {
  christmas: {
    card: "bg-[radial-gradient(120%_70%_at_50%_0%,#d32a3f_0%,#9b1529_55%,#5c0b17_100%)] text-white",
    accent: "text-[#ffe08a]",
    rim: ["#fff0b3", "#f4b03e", "#a8640e"],
    inner: "#4a0812",
    bulb: "#fff6c9",
    hub: "bg-[radial-gradient(circle_at_35%_30%,#fff3c4,#f4b03e_55%,#b8720f)] text-[#7a1020]",
    hubText: "#7a1020",
    prizes: {
      3: { fill: "#fff7ea", text: "#b3122b" },
      5: { fill: "#d62839", text: "#ffffff" },
      7: { fill: "#1f6b45", text: "#ffffff" },
      10: { fill: "#f4b03e", text: "#7a1020" },
    },
    confetti: ["#ffe08a", "#ffffff", "#f4b03e", "#3fa36b", "#ff6b6b"],
    chip: "Savaitės dovana",
    title: "Sukite laimės ratą!",
    subtitle: `Laimėkite iki ${maxWheelPercent} % nuolaidą prekėms`,
  },
  halloween: {
    card: "bg-[radial-gradient(120%_70%_at_50%_0%,#4c1d95_0%,#26103f_55%,#0e0915_100%)] text-[#f6ecdf]",
    accent: "text-[#ff9b45]",
    rim: ["#ffd08a", "#ff7a1a", "#9a3a07"],
    inner: "#12081c",
    bulb: "#ffe7b0",
    hub: "bg-[radial-gradient(circle_at_35%_30%,#ffd9a8,#ff7a1a_55%,#a3420a)] text-[#1a0d05]",
    hubText: "#1a0d05",
    prizes: {
      3: { fill: "#ffe8cc", text: "#3b1d5c" },
      5: { fill: "#ff7a1a", text: "#1a0d05" },
      7: { fill: "#5b2a86", text: "#ffffff" },
      10: { fill: "#8be35b", text: "#10200a" },
    },
    confetti: ["#ff7a1a", "#a66cff", "#8be35b", "#ffe7b0", "#ff4d5a"],
    chip: "Helovyno dovana",
    title: "Sukite Helovyno ratą!",
  },
};

const R = 172;
/** Point at `deg` clockwise from the top. */
const polar = (deg: number, r: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [r * Math.cos(a), r * Math.sin(a)].map((n) => n.toFixed(2)).join(" ");
};
const slicePath = (start: number, end: number) =>
  `M0 0 L${polar(start, R)} A${R} ${R} 0 ${end - start > 180 ? 1 : 0} 1 ${polar(end, R)} Z`;
const BULBS = 24;

/** Deterministic scatter in [0, 1): the confetti looks random but renders the same every time. */
const scatter = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const CONFETTI = Array.from({ length: 90 }, (_, i) => ({
  dx: Math.round(scatter(i, 1) * 520 - 260),
  dy: Math.round(-80 - scatter(i, 2) * 260),
  rot: Math.round(scatter(i, 3) * 1440 - 720),
  delay: (scatter(i, 4) * 0.25).toFixed(2),
  size: 6 + Math.round(scatter(i, 5) * 6),
  round: i % 3 === 0,
}));

interface Win {
  percent: number;
  code: string;
  validUntil: string;
}

export default function LuckyWheel({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const t = themes[useSiteTheme()];
  const setDiscount = useCartStore((s) => s.setDiscount);
  const dialog = useRef<HTMLDialogElement>(null);
  // At most once per page load, so closing it doesn't bring it straight back.
  const shown = useRef(false);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"ready" | "spinning" | "won" | "error">("ready");
  const [rotation, setRotation] = useState(0);
  const [win, setWin] = useState<Win | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!enabled || shown.current || HIDDEN_ON.some((p) => pathname.startsWith(p)) || spunRecently()) return;
    const timer = setTimeout(() => {
      shown.current = true;
      setOpen(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [enabled, pathname]);

  useEffect(() => {
    if (open && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [open]);

  // Finish the spin even if the browser skips the transition event (e.g. a background tab).
  useEffect(() => {
    if (phase !== "spinning" || !win) return;
    const timer = setTimeout(() => setPhase("won"), SPIN_MS + 400);
    return () => clearTimeout(timer);
  }, [phase, win]);

  async function spin() {
    if (phase !== "ready") return;
    setPhase("spinning");
    try {
      const result = await spinWheel();
      if (!result.ok) {
        setError(result.error);
        setPhase("error");
        return;
      }
      // The prize is decided on the server; apply it at once so closing early loses nothing.
      setDiscount({ code: result.code, percent: result.percent });
      rememberSpin({ code: result.code, percent: result.percent, validUntil: result.validUntil });
      setWin(result);
      // Turn clockwise so the server's stopping point ends under the pointer at the top.
      setRotation(7 * 360 + (360 - result.angle));
    } catch {
      setError("Ratas šiuo metu nesisuka. Bandykite vėliau.");
      setPhase("error");
    }
  }

  async function copy() {
    if (!win) return;
    try {
      await navigator.clipboard.writeText(win.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the code stays visible and selectable.
    }
  }

  if (!open) return null;
  const spinning = phase === "spinning";
  const close = () => dialog.current?.close();

  return (
    <dialog
      ref={dialog}
      aria-labelledby="wheel-title"
      onClose={() => setOpen(false)}
      onClick={(e) => e.target === e.currentTarget && close()}
      className="m-auto w-[min(27rem,calc(100vw-1.5rem))] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-black/70 backdrop:backdrop-blur-[3px]"
    >
      <div
        className={clsx(
          "animate-wheel-pop relative overflow-hidden rounded-[2rem] px-5 pt-6 pb-5 text-center shadow-[0_40px_100px_-20px_rgb(0_0_0/0.8)] sm:px-7",
          t.card,
        )}
      >
        {/* Twinkling sparkles in the background */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(255_255_255/0.5)_1px,transparent_1.5px)] [background-size:26px_26px] opacity-30"
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={close}
          aria-label="Uždaryti"
          className="absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-full bg-black/25 text-current transition-colors hover:bg-black/40"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        {phase !== "won" ? (
          <div className="relative">
            <span className={clsx("inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-xs font-extrabold tracking-[0.16em] uppercase", t.accent)}>
              <Gift className="size-3.5" aria-hidden="true" />
              {t.chip}
            </span>
            <h2 id="wheel-title" className="mt-3 font-display text-[2rem] leading-tight font-semibold">
              {t.title}
            </h2>
            {t.subtitle && <p className="mt-1 text-[0.95rem] font-semibold opacity-85">{t.subtitle}</p>}

            <div className="relative mx-auto mt-6 aspect-square w-[min(76vw,330px)]">
              {/* Rim with chasing bulbs (fixed) */}
              <svg viewBox="-200 -200 400 400" className="absolute inset-0 size-full drop-shadow-[0_18px_30px_rgb(0_0_0/0.45)]" aria-hidden="true">
                <defs>
                  <linearGradient id="wheel-rim" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={t.rim[0]} />
                    <stop offset="50%" stopColor={t.rim[1]} />
                    <stop offset="100%" stopColor={t.rim[2]} />
                  </linearGradient>
                  <radialGradient id="wheel-bulb-glow">
                    <stop offset="0%" stopColor={t.bulb} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={t.bulb} stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle r="198" fill="url(#wheel-rim)" />
                <circle r="180" fill={t.inner} />
                {Array.from({ length: BULBS }, (_, i) => {
                  const [x, y] = polar((i * 360) / BULBS, 189).split(" ");
                  return (
                    <g
                      key={i}
                      className={spinning ? "animate-wheel-bulb-fast" : "animate-wheel-bulb"}
                      style={{ animationDelay: i % 2 ? (spinning ? "0.12s" : "0.45s") : "0s" }}
                    >
                      <circle cx={x} cy={y} r="11" fill="url(#wheel-bulb-glow)" />
                      <circle cx={x} cy={y} r="5" fill={t.bulb} />
                    </g>
                  );
                })}
              </svg>

              {/* The turning part */}
              <div
                className="absolute inset-[6%]"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.8, 0.16, 1)`,
                }}
                onTransitionEnd={() => win && setPhase("won")}
              >
                <svg viewBox={`${-R} ${-R} ${2 * R} ${2 * R}`} className="size-full" aria-hidden="true">
                  {wheelSlices.map((slice, i) => (
                    <path key={i} d={slicePath(slice.start, slice.end)} fill={t.prizes[slice.percent].fill} />
                  ))}
                  {wheelSlices.map((slice, i) => (
                    <line key={i} x1="0" y1="0" x2={polar(slice.start, R).split(" ")[0]} y2={polar(slice.start, R).split(" ")[1]} stroke="rgb(255 255 255 / 0.6)" strokeWidth="2" />
                  ))}
                  {wheelSlices.map((slice, i) => {
                    const mid = (slice.start + slice.end) / 2;
                    const thin = slice.end - slice.start < 20;
                    // Labels run along the radius; on the left half they turn the other way so none is upside down.
                    const turn = mid < 180 ? -90 : 90;
                    return (
                      <g key={i} transform={`rotate(${mid.toFixed(2)})`}>
                        <text
                          x="0"
                          y="-112"
                          transform={`rotate(${turn} 0 -112)`}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={t.prizes[slice.percent].text}
                          fontSize={thin ? 19 : 25}
                          fontWeight="800"
                          style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                        >
                          −{slice.percent}%
                        </text>
                      </g>
                    );
                  })}
                  <circle r={R - 1} fill="none" stroke="rgb(255 255 255 / 0.35)" strokeWidth="3" />
                </svg>
              </div>

              {/* Pointer */}
              <svg
                viewBox="-22 -4 44 56"
                className={clsx("absolute top-[-5%] left-1/2 w-[13%] -translate-x-1/2 origin-[50%_20%] drop-shadow-[0_4px_6px_rgb(0_0_0/0.45)]", spinning && "animate-wheel-tick")}
                aria-hidden="true"
              >
                <path d="M0 50 C-5 38 -18 24 -18 12 A18 18 0 1 1 18 12 C18 24 5 38 0 50 Z" fill="url(#wheel-rim)" stroke={t.rim[2]} strokeWidth="1.5" />
                <circle cy="12" r="7" fill={t.prizes[5].fill} stroke="white" strokeWidth="2" />
              </svg>

              {/* Hub: the spin button */}
              <button
                type="button"
                onClick={spin}
                disabled={phase !== "ready"}
                className={clsx(
                  "absolute top-1/2 left-1/2 flex size-[26%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[5px] text-[0.95rem] font-black tracking-wider shadow-[inset_0_-6px_12px_rgb(0_0_0/0.25),0_6px_16px_rgb(0_0_0/0.4)] transition-transform enabled:hover:scale-105 disabled:cursor-default",
                  t.hub,
                  phase === "ready" && "animate-wheel-pulse",
                )}
                style={{ borderColor: t.rim[0], color: t.hubText }}
              >
                {spinning ? <Loader2 className="size-6 animate-spin" aria-hidden="true" /> : "SUKTI"}
                <span className="sr-only">laimės ratą</span>
              </button>
            </div>

            {phase === "error" ? (
              <p role="alert" className="mt-5 rounded-2xl bg-black/30 p-4 text-sm font-semibold">
                {error}
              </p>
            ) : (
              <button
                type="button"
                onClick={spin}
                disabled={phase !== "ready"}
                className="btn btn-primary mt-6 w-full text-base disabled:opacity-70"
              >
                {spinning ? "Sukasi…" : "Sukti ratą"}
              </button>
            )}
            <button type="button" onClick={close} className="mt-2 py-2 text-sm font-semibold opacity-70 hover:opacity-100">
              {phase === "error" ? "Uždaryti" : "Ne, ačiū"}
            </button>
          </div>
        ) : (
          win && (
            <div className="relative animate-wheel-pop py-2" role="status">
              <p className={clsx("text-sm font-extrabold tracking-[0.22em] uppercase", t.accent)}>Sveikiname!</p>
              <h2 id="wheel-title" className="mt-2 font-display text-[2rem] leading-tight font-semibold">
                Laimėjote nuolaidą
              </h2>
              <div className="relative mx-auto mt-6 rounded-3xl bg-[linear-gradient(135deg,#fff8e6,#ffe3a3)] px-6 py-6 text-[#5c0b17] shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)]">
                {/* Ticket notches */}
                <span className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full bg-black/40" aria-hidden="true" />
                <span className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full bg-black/40" aria-hidden="true" />
                <p className="font-display text-7xl leading-none font-semibold">−{win.percent}&nbsp;%</p>
                <p className="mt-1 text-sm font-bold tracking-wider uppercase opacity-70">nuolaida prekėms</p>
                <div className="mt-5 flex items-center gap-2 rounded-2xl border-2 border-dashed border-[#5c0b17]/30 bg-[#ffffffb3] p-2 pl-3">
                  <span className="min-w-0 flex-1 text-left font-mono text-[0.72rem] font-bold break-all select-all sm:text-sm">
                    {win.code}
                  </span>
                  <button
                    type="button"
                    onClick={copy}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#5c0b17] px-3 py-2 text-sm font-bold text-[#fff]"
                  >
                    {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                    {copied ? "Nukopijuota" : "Kopijuoti"}
                  </button>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed opacity-85">
                Nuolaida jau pritaikyta jūsų krepšeliui. Kodas galioja iki{" "}
                {new Date(win.validUntil).toLocaleDateString("lt-LT", { timeZone: "UTC" })} imtinai.
              </p>
              <button type="button" onClick={close} className="btn btn-primary mt-5 w-full text-base">
                Apsipirkti
              </button>
            </div>
          )
        )}
      </div>

      {/* Confetti bursts over everything once the prize is shown */}
      {phase === "won" && (
        <div className="pointer-events-none absolute inset-x-0 top-[38%]" aria-hidden="true">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className="animate-wheel-confetti absolute left-1/2"
              style={
                {
                  width: c.size,
                  height: c.round ? c.size : c.size * 0.45,
                  borderRadius: c.round ? "9999px" : "2px",
                  background: t.confetti[i % t.confetti.length],
                  animationDelay: `${c.delay}s`,
                  "--dx": `${c.dx}px`,
                  "--dy": `${c.dy}px`,
                  "--rot": `${c.rot}deg`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
    </dialog>
  );
}
