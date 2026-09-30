import clsx from "clsx";

const palettes = {
  warm: ["#ffc65a", "#ffd98a", "#ffb640", "#ffe3a3"],
  multi: ["#e5483d", "#f4b03e", "#3fa36b", "#4d8fe0", "#f7d44a"],
};

type Palette = keyof typeof palettes;

const BULB_PATH =
  "M-3.5 7 C -7 10, -7.5 18, -3 25 C -1.5 27.5, -0.5 29.5, 0 30 C 0.5 29.5, 1.5 27.5, 3 25 C 7.5 18, 7 10, 3.5 7 Z";

function BulbShape({ color, glowId, delay = 0 }: { color: string; glowId: string; delay?: number }) {
  return (
    <>
      <circle
        cx="0"
        cy="18"
        r="17"
        fill={`url(#${glowId})`}
        className="animate-twinkle"
        style={delay ? { animationDelay: `${delay.toFixed(2)}s` } : undefined}
      />
      <rect x="-3.5" y="-1" width="7" height="9" rx="1.5" fill="#1a3b2c" />
      <path d={BULB_PATH} fill={color} />
      <ellipse cx="-2.6" cy="14" rx="1.1" ry="3.4" fill="white" opacity="0.55" />
    </>
  );
}

function GlowDefs({ id, colors }: { id: string; colors: string[] }) {
  return (
    <defs>
      {colors.map((c, i) => (
        <radialGradient key={c} id={`${id}-${i}`}>
          <stop offset="0%" stopColor={c} stopOpacity="0.75" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </radialGradient>
      ))}
    </defs>
  );
}

/** A single hanging C9 bulb, e.g. for the logo or step markers. */
export function Bulb({
  id,
  color = palettes.warm[0],
  className,
}: {
  id: string;
  color?: string;
  className?: string;
}) {
  return (
    <svg viewBox="-18 -2 36 50" className={className} aria-hidden="true">
      <GlowDefs id={id} colors={[color]} />
      <BulbShape color={color} glowId={`${id}-0`} />
    </svg>
  );
}

const SEGMENT = 200;
const SEGMENTS = 12;
const HEIGHT = 84;
const WIRE_Y = 6;
const SAG = 18;
const BULB_T = [0.125, 0.375, 0.625, 0.875];

/**
 * A string of lights draped across the full width of its container.
 * Drawn at a fixed pixel size and cropped, so bulbs stay the same size on every screen.
 */
export function Garland({
  id,
  palette = "warm",
  className,
}: {
  id: string;
  palette?: Palette;
  className?: string;
}) {
  const colors = palettes[palette];
  const width = SEGMENT * SEGMENTS;
  const cy = WIRE_Y + 2 * SAG;

  let wire = `M0 ${WIRE_Y}`;
  const bulbs: { x: number; y: number; angle: number; color: number; delay: number }[] = [];

  for (let s = 0; s < SEGMENTS; s++) {
    const x0 = s * SEGMENT;
    const x2 = x0 + SEGMENT;
    const x1 = x0 + SEGMENT / 2;
    wire += ` Q ${x1} ${cy} ${x2} ${WIRE_Y}`;

    BULB_T.forEach((t, i) => {
      const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * x1 + t ** 2 * x2;
      const y = (1 - t) ** 2 * WIRE_Y + 2 * (1 - t) * t * cy + t ** 2 * WIRE_Y;
      const dy = 2 * (1 - t) * (cy - WIRE_Y) + 2 * t * (WIRE_Y - cy);
      const angle = (Math.atan2(dy, SEGMENT) * 180) / Math.PI;
      const n = s * BULB_T.length + i;
      bulbs.push({ x, y, angle: angle * 0.5, color: n % colors.length, delay: (n * 0.73) % 3.2 });
    });
  }

  return (
    <div className={clsx("pointer-events-none relative overflow-hidden", className)} style={{ height: HEIGHT }} aria-hidden="true">
      <svg
        width={width}
        height={HEIGHT}
        viewBox={`0 0 ${width} ${HEIGHT}`}
        className="absolute top-0 left-1/2 max-w-none -translate-x-1/2"
      >
        <GlowDefs id={id} colors={colors} />
        <path d={wire} fill="none" stroke="#1a3b2c" strokeWidth="1.6" />
        {bulbs.map((b, i) => (
          <g key={i} transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.angle.toFixed(1)})`}>
            <BulbShape color={colors[b.color]} glowId={`${id}-${b.color}`} delay={b.delay} />
          </g>
        ))}
      </svg>
    </div>
  );
}
