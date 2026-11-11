import Image from "next/image";
import { pricing } from "@/lib/data/pricing";
import { formatPrice } from "@/lib/format";
import { getSiteTheme } from "@/lib/themeStore";
import InquiryForm from "../InquiryForm";
import { Garland } from "../Lights";
import HalloweenHero from "../halloween/HalloweenHero";

export default async function Hero() {
  if ((await getSiteTheme()) === "halloween") return <HalloweenHero />;
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[70%] bg-gradient-to-b from-cream to-snow" />
      <Garland id="hero-garland" />

      <div className="container-page grid gap-10 pt-4 pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-8 lg:pb-28">
        <div className="flex flex-col">
          <h1
            className="font-display text-[2.4rem] leading-[1.05] font-semibold tracking-[-0.02em] text-balance text-pine-900 sm:text-5xl lg:text-[3.4rem]"
            style={{ fontVariationSettings: '"SOFT" 60, "opsz" 72' }}
          >
            Kalėdinių lempučių montavimas ir nuoma{" "}
            <span className="text-glow-deep italic" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
              Vilniuje
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone sm:text-xl">
            Parduodame ir nuomojame kalėdines lemputes, jas sumontuojame, o po švenčių viską nuimame.
          </p>
          <p className="mt-6 inline-flex w-fit items-center gap-3 rounded-full bg-white px-5 py-2.5 text-lg text-stone shadow-[0_12px_24px_-16px_rgb(12_27_20/0.35)] ring-1 ring-sand sm:text-xl">
            <span className="size-2.5 shrink-0 rounded-full bg-glow shadow-[0_0_10px_rgb(244_176_62/0.9)]" aria-hidden="true" />
            <span>
              Montavimo kaina nuo{" "}
              <strong className="whitespace-nowrap text-pine-900">{formatPrice(pricing.installPerMeter)}/m</strong>
            </span>
          </p>

          {/* On wide screens the photo grows to end level with the form beside it. */}
          <div className="relative mt-8 aspect-[5/4] overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgb(12_27_20/0.6)] sm:aspect-[3/2] lg:aspect-auto lg:min-h-80 lg:flex-1">
            <Image
              src="/work/lithuanian-house-xp-v2.png"
              alt="Namas, kurio stogo kraštus puošia šiltai baltos LED girliandos"
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div id="forma" className="scroll-mt-28 rounded-[2rem] shadow-[0_40px_80px_-40px_rgb(12_27_20/0.45)] ring-1 ring-sand">
          <InquiryForm />
        </div>
      </div>
    </section>
  );
}
