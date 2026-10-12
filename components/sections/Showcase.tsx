import Image from "next/image";
import clsx from "clsx";
import { halloweenShowcaseLabels, showcase } from "@/lib/data/services";
import { getSiteTheme } from "@/lib/themeStore";
import { Garland } from "../Lights";
import { Fog } from "../halloween/Decor";
import SpookyGarland from "../halloween/SpookyGarland";
import SectionHeading from "../ui/SectionHeading";

const copy = {
  christmas: {
    title: "Taip gali atrodyti jūsų namai",
    text: "Stogo kraštai, karnizai, prieangiai ir balkonai — apšvietimą pritaikome jūsų objektui. Nuotraukose pateikiamos dekoravimo idėjos.",
  },
  halloween: {
    title: "Taip jūsų namai atrodys Helovyno naktį",
    text: "Stogo kraštai, karnizai, prieangiai ir balkonai — apšvietimą pritaikome jūsų namui. Nuotraukose — dekoravimo idėjos, nudažytos Helovyno nakties spalvomis.",
  },
};

export default async function Showcase() {
  const theme = await getSiteTheme();
  const halloween = theme === "halloween";
  const t = copy[theme];
  return (
    <section className="relative overflow-hidden bg-pine-950">
      {halloween ? (
        <SpookyGarland id="showcase-garland" />
      ) : (
        <Garland id="showcase-garland" palette="multi" />
      )}
      <div className="container-page pt-8 pb-20 sm:pb-28">
        <SectionHeading
          light
          eyebrow="Įkvėpimui"
          title={t.title}
          text={t.text}
        />

        <div className="mt-12 grid auto-rows-[14rem] gap-4 sm:grid-cols-2 lg:auto-rows-[16rem] lg:grid-cols-4">
          {showcase.map((item, i) => (
            <figure
              key={item.src}
              className={clsx(
                "group relative overflow-hidden rounded-3xl",
                i === 0 && "sm:col-span-2 sm:row-span-2",
                halloween && "hw-night",
                halloween && i === 0 && "hw-web",
              )}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes={
                  i === 0
                    ? "(max-width: 640px) 100vw, 50vw"
                    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                }
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-pine-950/70 px-3 py-1.5 text-xs font-semibold text-snow backdrop-blur-sm">
                {halloween ? halloweenShowcaseLabels[i] : item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      {halloween && <Fog />}
    </section>
  );
}
