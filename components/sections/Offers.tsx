import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const installation = [
  "Individualus dekoro planas",
  "Montavimas prieš šventes",
  "Demontavimas po švenčių",
];

const small = [
  {
    href: "/nuoma",
    image: "/work/lithuanian-house-xp-single-storey.png",
    title: "Dekoracijų nuoma",
    text: "Šiltai baltos XP ir LLinks lauko LED nuomai sezonui, su montavimo ir nuėmimo pasiūlymu.",
    cta: "Žiūrėti nuomą",
  },
  {
    href: "/kaledines-lemputes",
    image: "/products/llinks.svg",
    title: "Prekyba dekoracijom",
    text: "Aukščiausios kokybės lemputės ir dekoracijos pagamintos Europos sąjungoje.",
    cta: "Žiūrėti lemputes",
  },
];

export default function Offers() {
  return (
    <section className="container-page py-20 sm:py-28">
      <SectionHeading
        eyebrow="Ką siūlome"
        title="Pasirinkite, kas jums patogiausia"
        text="Papuošime jūsų namus, išnuomosime arba parduosime dekoracijas."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <Link
          href="/montavimas"
          className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-pine-900 text-snow lg:row-span-2"
        >
          <div className="relative z-10 p-8 sm:p-10">
            <span className="rounded-full bg-glow px-3 py-1 text-xs font-extrabold text-pine-950">
              Pagrindinė paslauga
            </span>
            <h3 className="mt-6 text-3xl font-semibold sm:text-4xl">
              Montavimas ir demontavimas
            </h3>
            <p className="mt-3 max-w-md text-lg leading-relaxed text-snow/75">
              Išbaigtas namo dekoras, individualiai pritaikytas jūsų
              pageidavimams.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {installation.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-1.5 rounded-full border border-snow/15 bg-snow/5 px-3 py-1.5 text-sm font-semibold"
                >
                  <Check className="size-4 text-glow" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative min-h-60 flex-1 overflow-hidden">
            <Image
              src="/work/lithuanian-house-xp-modern-gable.png"
              alt="Modernus namas, kurio frontoną ir karnizą puošia šiltai baltos LED girliandos"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[center_35%] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-pine-900 via-pine-900/20 to-transparent" />
            <span className="btn btn-primary absolute bottom-8 left-8 sm:bottom-10 sm:left-10">
              Apie montavimą
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </div>
        </Link>

        {small.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-4 rounded-[2rem] border border-sand bg-white p-6 transition hover:border-pine-900/25 hover:shadow-[0_24px_48px_-28px_rgb(18_42_31/0.35)] sm:gap-6 sm:p-10"
          >
            <div className="min-w-0 flex-1">
              <h3 className="text-2xl font-semibold text-pine-900 sm:text-3xl">
                {item.title}
              </h3>
              <p className="mt-2 leading-relaxed text-stone">{item.text}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-bold text-pine-900">
                {item.cta}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </div>
            <div className="relative size-20 shrink-0 sm:size-36">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="144px"
                className="object-contain transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
