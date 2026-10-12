// Helovyno dizaino piešiniai. Animacijos (hw-*) aprašytos app/halloween.css.
import clsx from "clsx";

const FACE = "#ffe27a";

/** Carved face and body of a jack-o'-lantern, centred on 0,0 and about 64 × 56 units. */
export function PumpkinShape({ id, lit = true }: { id: string; lit?: boolean }) {
  const face = lit ? `url(#${id}-face)` : "#2a1406";
  return (
    <>
      <defs>
        <radialGradient id={`${id}-body`} cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#ff9a2e" />
          <stop offset="70%" stopColor="#f06a0f" />
          <stop offset="100%" stopColor="#b8440a" />
        </radialGradient>
        <radialGradient id={`${id}-face`}>
          <stop offset="0%" stopColor="#fff6c9" />
          <stop offset="100%" stopColor={FACE} />
        </radialGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" stopColor="#ff9b3d" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ff7a1a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {lit && <circle cx="0" cy="2" r="40" fill={`url(#${id}-glow)`} className="hw-flicker" />}
      <path d="M-1.5 -20 C -2.5 -25, -1 -29, 3.5 -30 L 4.5 -27 C 2 -26, 1.5 -24, 2.5 -20 Z" fill="#4d6b22" />
      <ellipse cx="-13" cy="2" rx="17" ry="21" fill={`url(#${id}-body)`} />
      <ellipse cx="13" cy="2" rx="17" ry="21" fill={`url(#${id}-body)`} />
      <ellipse cx="0" cy="2" rx="14" ry="22.5" fill={`url(#${id}-body)`} />
      <path d="M-7 -19 C -11 -8, -11 12, -7 24 M7 -19 C 11 -8, 11 12, 7 24" fill="none" stroke="#c24f0b" strokeWidth="1.6" opacity="0.7" />
      <path d="M-15 -4 L -8 -13 L -4 -3 Z M4 -3 L 8 -13 L 15 -4 Z M-2.5 2 L 0 -2.5 L 2.5 2 Z" fill={face} />
      <path
        d="M-18 6 Q 0 26 18 6 L 13.5 8.5 L 10 5.5 L 6.5 11 L 2 8 L -2 12 L -6 8 L -9.5 11 L -13 6.5 Z"
        fill={face}
      />
    </>
  );
}

/** A jack-o'-lantern. Unlit, it's the sad pumpkin of the 404 page. */
export function Pumpkin({ id, lit = true, className }: { id: string; lit?: boolean; className?: string }) {
  return (
    <svg viewBox="-42 -36 84 76" className={className} aria-hidden="true">
      <PumpkinShape id={id} lit={lit} />
    </svg>
  );
}

export const BAT_PATH =
  "M32 10 C30.5 7.5 29.5 6 28.3 3.5 L27.6 7.6 C23.8 6.3 19.6 3.6 13.6 2.4 C15.8 6.2 15 9.4 11 10.6 C8 9.6 4 9.6 0 12.6 C5 13.4 8 16.4 9 20.6 C12 17.6 16 17.4 19 19.6 C21 16.6 25 15.6 28 17.6 C29.2 19.6 31 21.8 32 24.6 C33 21.8 34.8 19.6 36 17.6 C39 15.6 43 16.6 45 19.6 C48 17.4 52 17.6 55 20.6 C56 16.4 59 13.4 64 12.6 C60 9.6 56 9.6 53 10.6 C49 9.4 48.2 6.2 50.4 2.4 C44.4 3.6 40.2 6.3 36.4 7.6 L35.7 3.5 C34.5 6 33.5 7.5 32 10 Z";

export function Bat({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 64 26" className={className} style={style} aria-hidden="true">
      <path d={BAT_PATH} fill="currentColor" />
      <circle cx="30.4" cy="12.4" r="0.9" fill="#ff9b45" />
      <circle cx="33.6" cy="12.4" r="0.9" fill="#ff9b45" />
    </svg>
  );
}

type BatSpot = { left: string; top: string; size: number; duration: number; delay: number };

const defaultBats: BatSpot[] = [
  { left: "78%", top: "10%", size: 46, duration: 7, delay: 0 },
  { left: "88%", top: "26%", size: 30, duration: 9, delay: -3 },
  { left: "64%", top: "20%", size: 24, duration: 8, delay: -5 },
  { left: "8%", top: "6%", size: 28, duration: 10, delay: -2 },
];

/** Bats circling in place, each flapping at its own pace. Static when motion is reduced. */
export function Bats({ spots = defaultBats, className }: { spots?: BatSpot[]; className?: string }) {
  return (
    <div className={clsx("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {spots.map((b, i) => (
        <span
          key={i}
          className="hw-hover absolute block text-[#1c0f2c] drop-shadow-[0_0_8px_rgb(166_108_255/0.85)]"
          style={{ left: b.left, top: b.top, animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }}
        >
          <Bat className="hw-flap block" style={{ width: b.size, animationDelay: `${(i * 0.13).toFixed(2)}s` }} />
        </span>
      ))}
    </div>
  );
}

/** Full moon with craters and a pale glow. Size it with width classes. */
export function Moon({ className }: { className?: string }) {
  return <span className={clsx("hw-moon pointer-events-none block aspect-square rounded-full", className)} aria-hidden="true" />;
}

export function Ghost({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 58" className={clsx("hw-float", className)} aria-hidden="true">
      <path
        d="M24 2 C11.5 2 6 11.5 6 24 L6 52 L12 46.5 L18 53 L24 46.5 L30 53 L36 46.5 L42 52 L42 24 C42 11.5 36.5 2 24 2 Z"
        fill="#f3eefc"
      />
      <ellipse cx="17.5" cy="23" rx="3" ry="4" fill="#1d1429" />
      <ellipse cx="30.5" cy="23" rx="3" ry="4" fill="#1d1429" />
      <ellipse cx="24" cy="33" rx="3.2" ry="4.4" fill="#1d1429" />
    </svg>
  );
}

/**
 * A spider hanging from a thread of the given length (px), slowly bobbing.
 * The thread starts above the drawing and is cropped, so it stays attached while the spider moves.
 */
export function Spider({ thread = 60, className }: { thread?: number; className?: string }) {
  const height = thread + 32;
  return (
    <svg
      viewBox={`-14 0 28 ${height}`}
      width="28"
      height={height}
      className={clsx("pointer-events-none overflow-hidden drop-shadow-[0_0_4px_rgb(166_108_255/0.9)]", className)}
      aria-hidden="true"
    >
      <g className="hw-dangle">
        <line x1="0" y1="-40" x2="0" y2={thread + 4} stroke="#d9cfe8" strokeOpacity="0.55" strokeWidth="0.8" />
        <g transform={`translate(0 ${thread + 10})`} fill="none" stroke="#0b0710" strokeWidth="1.4" strokeLinecap="round">
          <path d="M-3 -2 C-7 -6 -10 -5 -12 -1 M-3 0 C-7 -2 -10 0 -12 4 M-3 2 C-6 3 -9 6 -10 9 M-3 3 C-5 6 -6 9 -6 11" />
          <path d="M3 -2 C7 -6 10 -5 12 -1 M3 0 C7 -2 10 0 12 4 M3 2 C6 3 9 6 10 9 M3 3 C5 6 6 9 6 11" />
          <circle cx="0" cy="-5" r="3.2" fill="#0b0710" stroke="none" />
          <ellipse cx="0" cy="3" rx="5" ry="6" fill="#0b0710" stroke="none" />
          <circle cx="-1.2" cy="-5.6" r="0.8" fill="#ff4d5a" stroke="none" />
          <circle cx="1.2" cy="-5.6" r="0.8" fill="#ff4d5a" stroke="none" />
        </g>
      </g>
    </svg>
  );
}

/** Low drifting mist for the bottom of a dark section. */
export function Fog({ className }: { className?: string }) {
  return <div className={clsx("hw-fog pointer-events-none absolute inset-x-0 bottom-0", className)} aria-hidden="true" />;
}
