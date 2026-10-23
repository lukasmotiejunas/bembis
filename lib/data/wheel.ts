// Laimės ratas. Visi prizai tikri: kiekvieno prizo dalys rate užima tiek vietos, kokia jo tikimybė,
// o serveris parenka atsitiktinį sustojimo tašką. Tikimybės rodomos lankytojui po ratu.
export const wheelPrizes = [
  { percent: 3, chance: 10 },
  { percent: 5, chance: 15 },
  { percent: 7, chance: 25 },
  { percent: 10, chance: 50 },
] as const;

/** Slices clockwise from the top. A prize's slices share its chance equally. */
const order = [3, 5, 7, 3, 10, 5, 3, 7, 5, 10];

export const CODE_VALID_DAYS = 7;
export const INVALID_DISCOUNT = "Šis nuolaidos kodas negalioja arba jo galiojimas baigėsi.";
export const maxWheelPercent = Math.max(...wheelPrizes.map((p) => p.percent));
export const isWheelPercent = (percent: number) => wheelPrizes.some((p) => p.percent === percent);

// Kodo forma: RATAS{procentas}-{paskutinė diena}{atsitiktiniai ženklai}-{parašas}. Parašą tikrina tik serveris (lib/discount.ts).
export const DAY_MS = 24 * 60 * 60 * 1000;
export const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export const CODE_PATTERN = /^RATAS(\d{1,2})-([2-9A-HJ-NP-Z]{4})([2-9A-HJ-NP-Z]{2})-([2-9A-HJ-NP-Z]{6})$/;
export const decodeCodeText = (text: string) => [...text].reduce((n, c) => n * 32 + CODE_ALPHABET.indexOf(c), 0);

/** Whether a wheel code's last day has passed, read from the code itself, so the browser can tell too. */
export function codeExpired(code: string, now = Date.now()) {
  const match = CODE_PATTERN.exec(code);
  return !match || Math.floor(now / DAY_MS) > decodeCodeText(match[2]);
}

export interface WheelSlice {
  percent: number;
  /** Degrees clockwise from the top */
  start: number;
  end: number;
}

export const wheelSlices: WheelSlice[] = (() => {
  let start = 0;
  return order.map((percent) => {
    const prize = wheelPrizes.find((p) => p.percent === percent)!;
    const slices = order.filter((p) => p === percent).length;
    const size = (prize.chance / 100) * (360 / slices);
    const slice = { percent, start, end: start + size };
    start += size;
    return slice;
  });
})();
