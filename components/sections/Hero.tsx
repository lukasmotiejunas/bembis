import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Phone } from "lucide-react";
import { phoneHref, site } from "@/lib/site";
import { Garland } from "../Lights";

const promises = ["Nemokama apžiūra", "Pirkimas arba nuoma", "Nuimame po švenčių"];

const season = [
  { month: "Lapkritis", text: "Sumontuojame", color: "bg-glow" },
  { month: "Gruodis", text: "Jūsų namai šviečia", color: "bg-berry" },
  { month: "Sausis", text: "Viską nuimame", color: "bg-pine-700" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[70%] bg-gradient-to-b from-cream to-snow" />
      <Garland id="hero-garland" />

      <div className="container-page grid items-center gap-14 pt-4 pb-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-8 lg:pb-28">
        <div>
          <p className="eyebrow">Kalėdinių lempučių montavimas ir nuoma</p>
          <h1 className="mt-5 text-[2.6rem] leading-[1.04] font-semibold text-pine-900 sm:text-6xl lg:text-[4rem]">
            Jūsų namai švies.
            <br />
            Mes pasirūpinsime{" "}
            <span className="text-glow-deep italic" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
              viskuo.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone sm:text-xl">
            Parduodame ir nuomojame kalėdines lemputes, atvažiuojame jų sumontuoti, o po švenčių viską nuimame.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact#forma" className="btn btn-primary">
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
                <span className="flex size-5 items-center justify-center rounded-full bg-pine-900 text-snow">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgb(12_27_20/0.6)]">
            <Image
              src="/work/porch-house.jpg"
              alt="Namas, papuoštas šiltomis kalėdinėmis lemputėmis"
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="relative -mt-12 ml-4 w-fit rounded-2xl bg-white p-5 shadow-[0_24px_48px_-20px_rgb(12_27_20/0.35)] sm:absolute sm:-bottom-8 sm:-left-8 sm:mt-0 sm:ml-0">
            <p className="text-xs font-extrabold tracking-widest text-stone uppercase">Jūsų sezonas su mumis</p>
            <ul className="mt-3 space-y-2.5">
              {season.map((s) => (
                <li key={s.month} className="flex items-center gap-3">
                  <span className={`size-2.5 rounded-full ${s.color}`} />
                  <span className="w-20 text-sm font-bold text-pine-900">{s.month}</span>
                  <span className="text-sm text-stone">{s.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
