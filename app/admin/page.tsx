import type { Metadata } from "next";
import { connection } from "next/server";
import { LogOut, TriangleAlert } from "lucide-react";
import AdminLogin from "@/components/admin/AdminLogin";
import ThemePicker from "@/components/admin/ThemePicker";
import { adminPassword, MIN_PASSWORD_LENGTH } from "@/lib/admin";
import { getSiteTheme, ThemeStorage, themeStorage } from "@/lib/themeStore";
import { logOut } from "./actions";
import { hasAdminSession } from "./session";

export const metadata: Metadata = {
  title: "Administravimas",
  robots: { index: false, follow: false },
};

const storageNote: Record<ThemeStorage, string> = {
  redis: "Pasirinkimas saugomas Upstash Redis duomenų bazėje.",
  file: "Pasirinkimas saugomas šiame kompiuteryje, faile .data/site-theme.json.",
  none: "Vercel'yje pasirinkimui išsaugoti reikia Upstash Redis: Vercel → Storage → Upstash for Redis → prijunkite prie projekto ir perkurkite diegimą.",
};

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 flex gap-3 rounded-2xl bg-glow-soft p-5 text-pine-900">
      <TriangleAlert
        className="mt-0.5 size-5 shrink-0 text-glow-deep"
        aria-hidden="true"
      />
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}

export default async function AdminPage() {
  // Settings can change without a new build, so this page is never prerendered.
  await connection();
  const enabled = adminPassword() !== null;
  const signedIn = enabled && (await hasAdminSession());
  const storage = themeStorage();

  return (
    <section className="container-page max-w-3xl py-16 sm:py-24">
      <p className="eyebrow">Administravimas</p>
      <h1 className="mt-3 text-4xl font-semibold text-pine-900 sm:text-5xl">
        Svetainės dizainas
      </h1>

      {!enabled && (
        <Notice>
          Administravimas išjungtas. Nustatykite aplinkos kintamąjį{" "}
          <code className="font-bold">ADMIN_PASSWORD</code> (bent{" "}
          {MIN_PASSWORD_LENGTH} simbolių) faile .env.local ir Vercel → Settings →
          Environment Variables, tada paleiskite svetainę iš naujo.
        </Notice>
      )}

      {enabled && !signedIn && <AdminLogin />}

      {signedIn && (
        <>
          {storage === "none" && <Notice>{storageNote.none}</Notice>}
          <ThemePicker
            current={await getSiteTheme()}
            disabled={storage === "none"}
          />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            {storage !== "none" && (
              <p className="text-sm text-stone">{storageNote[storage]}</p>
            )}
            <form action={logOut}>
              <button type="submit" className="btn btn-outline">
                <LogOut className="size-4" aria-hidden="true" />
                Atsijungti
              </button>
            </form>
          </div>
        </>
      )}
    </section>
  );
}
