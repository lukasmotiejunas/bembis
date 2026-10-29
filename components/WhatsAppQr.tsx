import QRCode from "qrcode";
import { site } from "@/lib/site";
import SocialIcon from "./SocialIcon";

const INK = "#122a1f";
/** Blank square in the middle for the logo, in modules; error correction level H restores what it hides. */
const LOGO = 9;

const { modules } = QRCode.create(site.whatsapp, { errorCorrectionLevel: "H" });
const size = modules.size;
const logoFrom = (size - LOGO) / 2;
const finders = [[0, 0], [size - 7, 0], [0, size - 7]];
const inFinder = (x: number, y: number) =>
  finders.some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
const inLogo = (x: number, y: number) =>
  x >= logoFrom && x < logoFrom + LOGO && y >= logoFrom && y < logoFrom + LOGO;
const dark = (x: number, y: number) => !!modules.get(y, x) && !inFinder(x, y) && !inLogo(x, y);

// One path for all data modules: a rectangle per run of dark modules in a row.
let modulePath = "";
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    if (!dark(x, y)) continue;
    const start = x;
    while (x + 1 < size && dark(x + 1, y)) x++;
    modulePath += `M${start} ${y}h${x - start + 1}v1h${start - x - 1}z`;
  }
}

/**
 * QR code that opens a WhatsApp chat with us, drawn from `site.whatsapp`.
 * Colours are fixed, not theme tokens: phones can't read the inverted code the Halloween design would make.
 * Needs a white backdrop around it; nothing for screen readers, who get the link next to it.
 */
export default function WhatsAppQr({ className }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className} aria-hidden="true">
      <path d={modulePath} fill={INK} />
      {finders.map(([x, y]) => (
        <g key={`${x}-${y}`} fill={INK}>
          <rect x={x + 0.5} y={y + 0.5} width={6} height={6} rx={1.75} fill="none" stroke={INK} />
          <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.9} />
        </g>
      ))}
      <rect x={logoFrom + 0.5} y={logoFrom + 0.5} width={LOGO - 1} height={LOGO - 1} rx={2.2} fill="#25d366" />
      <SocialIcon name="WhatsApp" x={logoFrom + 2} y={logoFrom + 2} width={LOGO - 4} height={LOGO - 4} color="#fff" />
    </svg>
  );
}
