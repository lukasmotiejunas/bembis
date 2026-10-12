// Kur saugomas pasirinktas dizainas: Upstash Redis (Vercel → Storage), o kompiuteryje — failas .data/site-theme.json.
import { cache } from "react";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_THEME, isSiteTheme, SiteTheme } from "./theme";

export const THEME_TAG = "site-theme";
const KEY = "site-theme";
const localFile = () => path.join(process.cwd(), ".data", "site-theme.json");

// Vercel's Upstash integration names the variables KV_*; Upstash's own console uses UPSTASH_REDIS_*.
function redisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

export type ThemeStorage = "redis" | "file" | "none";

/** On Vercel the file system is read-only and not shared between servers, so a file can't be used there. */
export function themeStorage(): ThemeStorage {
  if (redisConfig()) return "redis";
  return process.env.VERCEL ? "none" : "file";
}

async function readStored(): Promise<unknown> {
  const redis = redisConfig();
  if (redis) {
    const res = await fetch(`${redis.url}/get/${KEY}`, {
      headers: { Authorization: `Bearer ${redis.token}` },
      // Pages stay static: saving a design revalidates them at once. The hour only heals a failed read.
      next: { tags: [THEME_TAG], revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Redis GET responded ${res.status}`);
    return ((await res.json()) as { result?: unknown }).result;
  }
  if (themeStorage() === "none") return null;
  try {
    return JSON.parse(await readFile(localFile(), "utf8")).theme;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

/** The design every visitor sees. Never throws: if the setting can't be read, the site stays Christmas. */
export const getSiteTheme = cache(async (): Promise<SiteTheme> => {
  try {
    const stored = await readStored();
    return isSiteTheme(stored) ? stored : DEFAULT_THEME;
  } catch (err) {
    console.error("[theme] Could not read the site design:", err);
    return DEFAULT_THEME;
  }
});

export async function saveSiteTheme(theme: SiteTheme) {
  const redis = redisConfig();
  if (redis) {
    const res = await fetch(`${redis.url}/set/${KEY}/${theme}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${redis.token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Redis SET responded ${res.status}`);
    return;
  }
  if (themeStorage() === "none")
    throw new Error("No storage for the site design is configured.");
  await mkdir(path.dirname(localFile()), { recursive: true });
  await writeFile(localFile(), `${JSON.stringify({ theme }, null, 2)}\n`);
}
