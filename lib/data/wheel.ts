// Laimės ratas. Visi prizai tikri: kiekvieno prizo dalys rate užima tiek vietos, kokia jo tikimybė,
// o serveris parenka atsitiktinį sustojimo tašką. Tikimybės rodomos lankytojui po ratu.
export const wheelPrizes = [
  { percent: 3, chance: 45 },
  { percent: 5, chance: 30 },
  { percent: 7, chance: 17 },
  { percent: 10, chance: 8 },
] as const;

/** Slices clockwise from the top. A prize's slices share its chance equally. */
const order = [3, 5, 7, 3, 10, 5, 3, 7, 5, 10];

export const CODE_VALID_DAYS = 7;
export const INVALID_DISCOUNT = "Šis nuolaidos kodas negalioja arba jo galiojimas baigėsi.";
export const maxWheelPercent = Math.max(...wheelPrizes.map((p) => p.percent));
export const isWheelPercent = (percent: number) => wheelPrizes.some((p) => p.percent === percent);

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
