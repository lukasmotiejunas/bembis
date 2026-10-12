"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import {
  ADMIN_COOKIE,
  adminPassword,
  createSessionToken,
  passwordMatches,
  SESSION_DAYS,
} from "@/lib/admin";
import { isSiteTheme, themeOptions } from "@/lib/theme";
import { saveSiteTheme, THEME_TAG, themeStorage } from "@/lib/themeStore";
import { hasAdminSession } from "./session";

export type AdminFormState = { ok: boolean; message: string } | null;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/admin",
} as const;

export async function logIn(
  _: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const password = adminPassword();
  if (!password)
    return { ok: false, message: "Administravimas neįjungtas: nustatykite ADMIN_PASSWORD." };
  if (!passwordMatches(String(formData.get("password") ?? ""), password)) {
    // Slows down guessing; a person typing barely notices.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { ok: false, message: "Neteisingas slaptažodis." };
  }
  (await cookies()).set(ADMIN_COOKIE, createSessionToken(password), {
    ...cookieOptions,
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  redirect("/admin");
}

export async function logOut() {
  (await cookies()).set(ADMIN_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  redirect("/admin");
}

export async function changeTheme(
  _: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  if (!(await hasAdminSession()))
    return { ok: false, message: "Sesija baigėsi — prisijunkite iš naujo." };
  const theme = formData.get("theme");
  if (!isSiteTheme(theme)) return { ok: false, message: "Pasirinkite dizainą." };
  if (themeStorage() === "none")
    return {
      ok: false,
      message: "Nėra kur išsaugoti pasirinkimo: prijunkite Upstash Redis (žr. README).",
    };
  try {
    await saveSiteTheme(theme);
  } catch (err) {
    console.error("[admin] Could not save the site design:", err);
    return { ok: false, message: "Nepavyko išsaugoti. Bandykite dar kartą." };
  }
  // Every page shows the design, so all of them are rendered again on their next visit.
  updateTag(THEME_TAG);
  revalidatePath("/", "layout");
  return {
    ok: true,
    message: `Įjungtas dizainas „${themeOptions[theme].label}“. Lankytojai jį mato jau dabar.`,
  };
}
