"use client";
import { ReactNode, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

export default function ProductGallery({
  photos,
  alt,
  children,
}: {
  photos: string[];
  alt: string;
  /** Ženkliukai virš pagrindinės nuotraukos */
  children?: ReactNode;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-sand bg-white">
        <Image
          src={photos[active]}
          alt={alt}
          fill
          preload
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-4"
        />
        {children}
      </div>
      {photos.length > 1 && (
        <div className="mt-4 flex gap-3">
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${i + 1} nuotrauka iš ${photos.length}`}
              aria-pressed={i === active}
              className={clsx(
                "relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white transition sm:size-24",
                i === active
                  ? "border-pine-900"
                  : "border-sand hover:border-pine-900/40",
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="96px"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
