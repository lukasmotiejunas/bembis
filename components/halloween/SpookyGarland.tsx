import clsx from "clsx";
import { BULB_PATH, garlandLayout } from "../Lights";
import { Spider } from "./Decor";

const HEIGHT = 104;
const SOCKET = "#1a1024";
const WIRE = "#3a2a50";
// What hangs at each spot, left to right: pumpkin, purple bulb, ghost, green bulb, ...
const KINDS = ["pumpkin", "purple", "ghost", "green"] as const;
const GLOW = { pumpkin: "#ff8a1f", purple: "#b46cff", ghost: "#c9f7d2", green: "#8be35b" };
// Spiders drop from the low point (y = 24) of these wire segments; threads fit within HEIGHT.
const SPIDERS = [{ segment: 1, thread: 26 }, { segment: 4, thread: 44 }, { segment: 7, thread: 34 }, { segment: 10, thread: 48 }];

function Lantern({ kind, id, delay }: { kind: (typeof KINDS)[number]; id: string; delay: number }) {
  return (
    <>
      <circle
        cx="0"
        cy="18"
        r="18"
        fill={`url(#${id}-${kind})`}
        className="animate-twinkle"
        style={delay ? { animationDelay: `${delay.toFixed(2)}s` } : undefined}
      />
      <rect x="-3.5" y="-1" width="7" height="8" rx="1.5" fill={SOCKET} />
      {kind === "pumpkin" && (
        <>
          <rect x="-1" y="6" width="2" height="3.5" fill="#4d6b22" />
          <ellipse cx="-5" cy="19" rx="6.5" ry="9" fill="#e8620c" />
          <ellipse cx="5" cy="19" rx="6.5" ry="9" fill="#e8620c" />
          <ellipse cx="0" cy="19" rx="6" ry="9.5" fill="#ff8a1f" />
          <path d="M-6 16 L -3.2 12.6 L -1.6 16.4 Z M1.6 16.4 L 3.2 12.6 L 6 16 Z M-6.5 20.5 Q 0 27 6.5 20.5 L 4 21.6 L 2 20.4 L 0 22.4 L -2 20.4 L -4 21.6 Z" fill="#ffe27a" />
        </>
      )}
      {kind === "ghost" && (
        <>
          <path d="M0 7 C -6 7 -8 12 -8 18 L -8 29 L -5 26.5 L -2.5 29 L 0 26.5 L 2.5 29 L 5 26.5 L 8 29 L 8 18 C 8 12 6 7 0 7 Z" fill="#f3eefc" />
          <circle cx="-2.6" cy="16" r="1.3" fill="#1d1429" />
          <circle cx="2.6" cy="16" r="1.3" fill="#1d1429" />
          <ellipse cx="0" cy="21" rx="1.4" ry="2" fill="#1d1429" />
        </>
      )}
      {(kind === "purple" || kind === "green") && (
        <>
          <path d={BULB_PATH} fill={GLOW[kind]} />
          <ellipse cx="-2.6" cy="14" rx="1.1" ry="3.4" fill="white" opacity="0.5" />
        </>
      )}
    </>
  );
}

/** The Halloween string of lights: jack-o'-lanterns, ghosts and coloured bulbs, with spiders dropping down. */
export default function SpookyGarland({ id, className }: { id: string; className?: string }) {
  const { width, wire, points } = garlandLayout();
  const segment = width / 12;

  return (
    <div className={clsx("pointer-events-none relative overflow-hidden", className)} style={{ height: HEIGHT }} aria-hidden="true">
      <svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} className="absolute top-0 left-1/2 max-w-none -translate-x-1/2">
        <defs>
          {Object.entries(GLOW).map(([kind, color]) => (
            <radialGradient key={kind} id={`${id}-${kind}`}>
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>
        <path d={wire} fill="none" stroke={WIRE} strokeWidth="1.6" />
        {points.map((p) => (
          <g key={p.n} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.angle.toFixed(1)})`}>
            <Lantern kind={KINDS[p.n % KINDS.length]} id={id} delay={(p.n * 0.73) % 3.2} />
          </g>
        ))}
        {SPIDERS.map(({ segment: s, thread }) => (
          <foreignObject key={s} x={s * segment + segment / 2 - 14} y={24} width={28} height={thread + 32}>
            <Spider thread={thread} />
          </foreignObject>
        ))}
      </svg>
    </div>
  );
}
