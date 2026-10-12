// Administravimo prisijungimas: slaptažodis iš ADMIN_PASSWORD, sesija — pasirašytas slapukas.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "admin_session";
export const SESSION_DAYS = 14;
export const MIN_PASSWORD_LENGTH = 8;

/** The configured password, or null while the admin panel is switched off (unset or too short). */
export function adminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD ?? "";
  return password.length >= MIN_PASSWORD_LENGTH ? password : null;
}

const sha256 = (value: string) => createHash("sha256").update(value).digest();
const sign = (password: string, expires: number) =>
  createHmac("sha256", password).update(`admin:${expires}`).digest("base64url");

/** Compares hashes, so the check takes the same time whatever is typed. */
export const passwordMatches = (input: string, password: string) =>
  timingSafeEqual(sha256(input), sha256(password));

export function createSessionToken(password: string, now = Date.now()) {
  const expires = now + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return `${expires}.${sign(password, expires)}`;
}

/** Valid until it expires; changing ADMIN_PASSWORD signs everyone out. */
export function verifySessionToken(
  token: string | undefined,
  password: string,
  now = Date.now(),
) {
  const [expiresText, signature, extra] = (token ?? "").split(".");
  const expires = Number(expiresText);
  if (!signature || extra !== undefined) return false;
  if (!Number.isSafeInteger(expires) || expires <= now) return false;
  const expected = Buffer.from(sign(password, expires));
  const given = Buffer.from(signature);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
