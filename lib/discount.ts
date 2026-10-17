// Laimės rato nuolaidų kodai: serveris juos pasirašo, todėl kodo negalima atspėti ar pakeisti procento.
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { CODE_VALID_DAYS, isWheelPercent, wheelSlices } from "./data/wheel";

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const DAY = 24 * 60 * 60 * 1000;
const CODE = /^RATAS(\d{1,2})-([2-9A-HJ-NP-Z]{4})([2-9A-HJ-NP-Z]{2})-([2-9A-HJ-NP-Z]{6})$/;

/** DISCOUNT_CODE_SECRET, or a key derived from the Stripe key so codes work without extra setup. */
function secret() {
  if (process.env.DISCOUNT_CODE_SECRET) return process.env.DISCOUNT_CODE_SECRET;
  const stripe = process.env.STRIPE_SECRET_KEY;
  return stripe ? createHmac("sha256", stripe).update("discount-codes").digest("hex") : null;
}

export const discountsEnabled = () => secret() !== null;

export { INVALID_DISCOUNT } from "./data/wheel";

const encode = (value: number, length: number) =>
  Array.from({ length }, (_, i) => ALPHABET[Math.floor(value / 32 ** (length - 1 - i)) % 32]).join("");
const decode = (text: string) => [...text].reduce((n, c) => n * 32 + ALPHABET.indexOf(c), 0);
const sign = (key: string, payload: string) =>
  encode(createHmac("sha256", key).update(payload).digest().readUIntBE(0, 4), 6);

export interface DiscountCode {
  code: string;
  percent: number;
  /** End of the last day the code works (UTC) */
  validUntil: Date;
}

export function createDiscountCode(percent: number, now = Date.now()): DiscountCode {
  const key = secret();
  if (!key) throw new Error("Discount codes are not configured");
  if (!isWheelPercent(percent)) throw new Error(`Not a wheel prize: ${percent}%`);
  const lastDay = Math.floor(now / DAY) + CODE_VALID_DAYS;
  const payload = `${encode(lastDay, 4)}${encode(randomInt(32 * 32), 2)}`;
  return {
    code: `RATAS${percent}-${payload}-${sign(key, `${percent}-${payload}`)}`,
    percent,
    validUntil: new Date((lastDay + 1) * DAY - 1),
  };
}

/** The checked code, or null when it is mistyped, forged or expired. Spaces and case don't matter. */
export function verifyDiscountCode(input: string, now = Date.now()): DiscountCode | null {
  const key = secret();
  const code = input.toUpperCase().replace(/\s+/g, "");
  const match = CODE.exec(code);
  if (!key || !match) return null;
  const [, percentText, dayText, nonce, signature] = match;
  const percent = Number(percentText);
  const lastDay = decode(dayText);
  if (!isWheelPercent(percent) || Math.floor(now / DAY) > lastDay) return null;
  const expected = Buffer.from(sign(key, `${percent}-${dayText}${nonce}`));
  if (!timingSafeEqual(expected, Buffer.from(signature))) return null;
  return { code, percent, validUntil: new Date((lastDay + 1) * DAY - 1) };
}

/**
 * Where the wheel stops (degrees clockwise from the top) and what that slice wins.
 * Uniform over the whole wheel, kept a little away from slice edges so the pointer is never on a line.
 */
export function spinWheelPrize(random = randomInt(0, 36000) / 100) {
  const slice = wheelSlices.find((s) => random < s.end) ?? wheelSlices[wheelSlices.length - 1];
  const margin = Math.min(1.5, (slice.end - slice.start) / 4);
  const angle = Math.min(Math.max(random, slice.start + margin), slice.end - margin);
  return { angle, percent: slice.percent };
}
