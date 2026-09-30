import Image from "next/image";
import clsx from "clsx";
import { showcase } from "@/lib/data/services";
import { Garland } from "../Lights";
import SectionHeading from "../ui/SectionHeading";

export default function Showcase() {
  return (
    <section className="relative overflow-hidden bg-pine-950">
      <Garland id="showcase-garland" palette="multi" />
      <div className="container-page pt-8 pb-20 sm:pb-28">
        <SectionHeading
          light
          eyebrow="Įkvėpimui"
          title="Taip gali atrodyti jūsų namai"
          text="Šilta balta, spalvota ar mėlyna — padėsime išsirinkti stilių, kuris tiks būtent jūsų namui."
        />

        <div className="mt-12 grid auto-rows-[14rem] gap-4 sm:grid-cols-2 lg:auto-rows-[16rem] lg:grid-cols-4">
          {showcase.map((item, i) => (
            <figure
              key={item.src}
              className={clsx(
                "group relative overflow-hidden rounded-3xl",
                i === 0 && "sm:col-span-2 sm:row-span-2"
              )}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes={i === 0 ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-pine-950/70 px-3 py-1.5 text-xs font-semibold text-snow backdrop-blur-sm">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
