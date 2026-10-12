"use client";
import { useActionState } from "react";
import clsx from "clsx";
import { Check, Loader2, Save } from "lucide-react";
import { changeTheme } from "@/app/admin/actions";
import { SiteTheme, siteThemes, themeOptions } from "@/lib/theme";
import { Pumpkin } from "../halloween/Decor";

const WARM = ["#ffc65a", "#ffd98a", "#ffb640", "#ffe3a3", "#ffc65a", "#ffd98a"];

/** Fixed colours, so each preview looks the same whichever design is switched on. */
function Preview({ theme }: { theme: SiteTheme }) {
  if (theme === "halloween")
    return (
      <div className="relative h-28 overflow-hidden rounded-2xl bg-[#0e0915]">
        <span className="absolute top-3 right-5 size-10 rounded-full bg-[#f3e6c8] shadow-[0_0_32px_10px_rgb(255_190_110/0.3)]" />
        <Pumpkin id="preview-pumpkin" className="absolute right-4 bottom-2 w-12" />
        <p
          className="absolute bottom-3 left-4 text-2xl text-[#ff9b45]"
          style={{ fontFamily: "var(--font-wet-paint), sans-serif" }}
        >
          Baisiai gražu
        </p>
      </div>
    );
  return (
    <div className="relative h-28 overflow-hidden rounded-2xl bg-[#f4eee4]">
      <div className="h-3 bg-[#122a1f]" />
      <div className="mt-3 flex justify-around px-4">
        {WARM.map((color, i) => (
          <span
            key={i}
            className="size-2.5 rounded-full"
            style={{ background: color, boxShadow: `0 0 10px 3px ${color}` }}
          />
        ))}
      </div>
      <p
        className="absolute bottom-3 left-4 text-2xl font-semibold text-[#122a1f]"
        style={{ fontFamily: "var(--font-fraunces), serif" }}
      >
        Jūsų namai švies.
      </p>
    </div>
  );
}

export default function ThemePicker({
  current,
  disabled = false,
}: {
  current: SiteTheme;
  disabled?: boolean;
}) {
  const [state, action, pending] = useActionState(changeTheme, null);

  return (
    <form
      action={action}
      className="mt-10 rounded-[2rem] border border-sand bg-white p-6 sm:p-9"
    >
      <fieldset disabled={disabled || pending}>
        <legend className="text-2xl font-semibold text-pine-900">
          Kaip atrodo svetainė?
        </legend>
        <p className="mt-1 text-stone">
          Įjungti galima tik vieną dizainą. Išsaugojus jį iškart mato visi
          lankytojai.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {siteThemes.map((theme) => (
            <label
              key={theme}
              className="group flex cursor-pointer flex-col rounded-3xl border-2 border-sand p-4 transition-colors hover:border-pine-900/40 has-checked:border-glow-deep has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-glow-deep has-disabled:cursor-not-allowed has-disabled:opacity-60"
            >
              <input
                type="radio"
                name="theme"
                value={theme}
                defaultChecked={theme === current}
                required
                className="sr-only"
              />
              <Preview theme={theme} />
              <span className="mt-4 flex items-center gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-sand text-transparent transition-colors group-has-checked:border-glow-deep group-has-checked:bg-glow group-has-checked:text-pine-950">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="text-lg font-bold text-pine-900">
                  {themeOptions[theme].label}
                </span>
                {theme === current && (
                  <span className="ml-auto rounded-full bg-glow-soft px-2.5 py-1 text-xs font-bold text-glow-deep">
                    Dabar įjungtas
                  </span>
                )}
              </span>
              <span className="mt-2 text-sm leading-relaxed text-stone">
                {themeOptions[theme].text}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {state && (
        <p
          role={state.ok ? "status" : "alert"}
          className={clsx(
            "mt-6 rounded-2xl p-4 text-sm font-semibold",
            state.ok ? "bg-glow-soft text-pine-900" : "bg-berry/10 text-berry",
          )}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={disabled || pending}
        className="btn btn-primary mt-7 w-full disabled:opacity-60 sm:w-auto"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="size-4" aria-hidden="true" />
        )}
        {pending ? "Saugoma…" : "Išsaugoti dizainą"}
      </button>
    </form>
  );
}
