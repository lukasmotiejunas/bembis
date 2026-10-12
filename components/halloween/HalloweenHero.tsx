import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Phone } from "lucide-react";
import { phoneHref, site } from "@/lib/site";
import { Bats, Fog, Ghost, Moon, Pumpkin } from "./Decor";
import SpookyGarland from "./SpookyGarland";

const promises = ["2 metų garantija", "Nemokama apžiūra", "Nuimame po sezono"];

const season = [
  { month: "Spalis", text: "Sumontuojame", color: "bg-glow" },
  { month: "Spalio 31", text: "Šviečiate visai gatvei", color: "bg-[#a66cff]" },
  { month: "Po sezono", text: "Viską nuimame", color: "bg-pine-700" },
];

// On phones the headline fills the width, so only two small bats fly up by the moon.
const phoneBats = [
  { left: "58%", top: "2%", size: 30, duration: 8, delay: 0 },
  { left: "40%", top: "6%", size: 20, duration: 10, delay: -3 },
];

const heroBats = [
  { left: "55%", top: "12%", size: 72, duration: 8, delay: 0 },
  { left: "66%", top: "8%", size: 30, duration: 10, delay: -3 },
  { left: "86%", top: "14%", size: 36, duration: 9, delay: -6 },
  { left: "3%", top: "16%", size: 26, duration: 11, delay: -2 },
  { left: "44%", top: "12%", size: 22, duration: 7, delay: -4 },
];

/** The home page hero on a Halloween night. */
export default function HalloweenHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_34rem_at_78%_8%,rgb(124_58_237/0.32),transparent_65%),linear-gradient(to_bottom,#170d24,var(--hw-night))]" />
      <Moon className="absolute top-3 right-4 -z-10 w-20 sm:top-20 sm:right-[8%] sm:w-56 lg:top-16 lg:right-[34%] lg:w-48" />
      <Bats spots={phoneBats} className="sm:hidden" />
      <Bats spots={heroBats} className="hidden sm:block" />
      <SpookyGarland id="hero-garland" />

      <div className="relative container-page grid items-center gap-14 pt-2 pb-24 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-32">
        <div>
          {/* The keyword line is the page's main heading for search engines; the slogan stays the visual headline. */}
          <h1 className="eyebrow font-sans">Helovyno apšvietimo montavimas ir nuoma Vilniuje</h1>
          <p className="mt-5 font-display text-[2.4rem] leading-[1.08] text-balance text-pine-900 sm:text-[3.4rem] lg:text-[3.6rem]">
            Jūsų namai švies.
            <br />
            Net pačią{" "}
            <span className="text-glow drop-shadow-[0_0_22px_rgb(255_122_26/0.65)]">baisiausią naktį.</span>
          </p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone sm:text-xl">
            Parduodame ir nuomojame lauko LED girliandas, jas sumontuojame, o po sezono viską nuimame. Saldainių
            medžiotojai jūsų namus pamatys iš tolo.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/kontaktai#forma" className="btn btn-primary">
              Užsakyti montavimą
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a href={phoneHref} className="btn btn-outline">
              <Phone className="size-4" aria-hidden="true" />
              {site.phone}
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[0.95rem] font-semibold text-pine-900">
            {promises.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-glow text-[#1a0d05]">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="hw-night hw-web relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-[0_40px_90px_-30px_rgb(255_122_26/0.45)] ring-1 ring-[#a66cff]/25">
            <Image
              src="/work/lithuanian-house-xp-v2.png"
              alt="Namas, kurio stogo kraštus puošia LED girliandos, Helovyno nakties spalvomis"
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <Fog className="h-24" />
          </div>
          {/* On phones the season card covers the bottom of the photo, so the pumpkin sits on top instead. */}
          <Pumpkin id="hero-pumpkin-big" className="absolute -top-9 left-3 w-20 sm:top-auto sm:left-auto sm:-bottom-6 sm:right-6 sm:w-28" />
          <Pumpkin id="hero-pumpkin-small" className="absolute right-36 -bottom-3 hidden w-16 sm:block" />
          <Ghost className="absolute -top-8 -right-3 w-14 sm:-right-6 sm:w-16" />

          <div className="relative -mt-12 ml-4 w-fit rounded-2xl bg-white p-5 shadow-[0_24px_48px_-20px_rgb(0_0_0/0.7)] ring-1 ring-[#a66cff]/25 sm:absolute sm:-bottom-8 sm:-left-8 sm:mt-0 sm:ml-0">
            <p className="text-xs font-extrabold tracking-widest text-stone uppercase">Jūsų Helovyno sezonas</p>
            <ul className="mt-3 space-y-2.5">
              {season.map((s) => (
                <li key={s.month} className="flex items-center gap-3">
                  <span className={`size-2.5 rounded-full shadow-[0_0_8px_currentColor] ${s.color}`} />
                  <span className="w-20 text-sm font-bold text-pine-900">{s.month}</span>
                  <span className="text-sm text-stone">{s.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Fog />
    </section>
  );
}
