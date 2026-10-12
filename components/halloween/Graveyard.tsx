import clsx from "clsx";
import { PumpkinShape } from "./Decor";

const WIDTH = 2400;
const HEIGHT = 120;
const GROUND = 120;

// Tombstones: x, width, height above the ground line, shape, tilt (deg), carved "RIP".
const STONES: [number, number, number, "round" | "cross", number, boolean?][] = [
  [220, 34, 62, "round", 0],
  [290, 22, 50, "cross", -4],
  [640, 42, 70, "round", 0, true],
  [722, 26, 52, "round", -8],
  [1012, 30, 60, "cross", 3],
  [1060, 44, 74, "round", 0],
  [1382, 32, 56, "round", 6],
  [1462, 22, 44, "cross", 0],
  [1982, 40, 68, "round", 0, true],
  [2062, 24, 48, "cross", -6],
  [2250, 30, 54, "round", 4],
];

function Stone({ stone: [x, w, h, shape, tilt, rip] }: { stone: (typeof STONES)[number] }) {
  const top = GROUND - h;
  const body =
    shape === "round" ? (
      <path d={`M${x} ${GROUND} V${top + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${top + w / 2} V${GROUND} Z`} />
    ) : (
      <>
        <rect x={x + w / 2 - 4} y={top} width="8" height={h} />
        <rect x={x} y={top + 12} width={w} height="7" />
      </>
    );
  return (
    <g transform={tilt ? `rotate(${tilt} ${x + w / 2} ${GROUND})` : undefined}>
      {body}
      {rip && (
        <text
          x={x + w / 2}
          y={top + w / 2 + 10}
          textAnchor="middle"
          fontSize="11"
          fontWeight="800"
          fill="#2c1f3d"
          style={{ fontFamily: "var(--font-manrope), sans-serif", letterSpacing: "0.1em" }}
        >
          RIP
        </text>
      )}
    </g>
  );
}

/**
 * Night-black graveyard skyline: hill, tombstones, an iron fence, a crooked tree, a black cat and glowing pumpkins.
 * Same colour as the footer, so the footer seems to rise out of the ground. Fixed size, cropped at the sides.
 */
export default function Graveyard({ className }: { className?: string }) {
  const fence = Array.from({ length: 13 }, (_, i) => 420 + i * 13);
  return (
    <div
      className={clsx(
        // Moonlit horizon behind the silhouettes, so they stand out against the night.
        "pointer-events-none relative overflow-hidden bg-[radial-gradient(70%_130%_at_50%_100%,rgb(124_58_237/0.42),rgb(255_122_26/0.08)_55%,transparent_75%)]",
        className,
      )}
      style={{ height: HEIGHT }}
      aria-hidden="true"
    >
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="absolute bottom-0 left-1/2 max-w-none -translate-x-1/2">
        <g className="fill-pine-950">
          <path d="M0 120 L0 98 C180 82 360 94 560 92 C760 90 900 74 1100 80 C1300 86 1450 98 1650 90 C1850 82 2050 76 2400 92 L2400 120 Z" />
          {STONES.map((s) => (
            <Stone key={s[0]} stone={s} />
          ))}
          {fence.map((x) => (
            <g key={x}>
              <rect x={x} y="64" width="3" height="52" />
              <path d={`M${x - 2} 66 L${x + 1.5} 57 L${x + 5} 66 Z`} />
            </g>
          ))}
          <rect x="418" y="72" width="164" height="3" />
          <rect x="418" y="100" width="164" height="3" />
          {/* Crooked tree */}
          <path d="M1690 120 C1694 96 1688 70 1700 40 L1708 42 C1700 70 1708 96 1713 120 Z" />
          <g fill="none" className="stroke-pine-950" strokeLinecap="round">
            <path d="M1701 58 C1682 50 1668 52 1652 38 M1704 50 C1720 38 1734 40 1750 26 M1697 76 C1672 72 1658 78 1642 70 M1707 80 C1726 75 1742 80 1762 68" strokeWidth="4" />
            <path d="M1664 46 L1656 30 M1736 38 L1744 50 M1650 72 L1640 60 M1748 76 L1758 86 M1700 42 L1696 26" strokeWidth="2.2" />
          </g>
          {/* Black cat on the tall stone */}
          <ellipse cx="1082" cy="34" rx="9" ry="11" />
          <circle cx="1082" cy="19" r="7" />
          <path d="M1076 15 L1076.5 6 L1081 12 Z M1083 12 L1087.5 6 L1088 15 Z" />
          <path d="M1090 42 C1102 40 1104 28 1096 23" fill="none" className="stroke-pine-950" strokeWidth="3" strokeLinecap="round" />
        </g>
        <ellipse cx="1079" cy="18" rx="1.6" ry="1.2" fill="#c6f36b" />
        <ellipse cx="1085" cy="18" rx="1.6" ry="1.2" fill="#c6f36b" />
        {[
          [520, 104],
          [1240, 98],
          [1880, 92],
        ].map(([x, y]) => (
          <g key={x} transform={`translate(${x} ${y}) scale(0.42)`}>
            <PumpkinShape id={`grave-pumpkin-${x}`} />
          </g>
        ))}
      </svg>
    </div>
  );
}
