"use client";
import { useId } from "react";
import clsx from "clsx";
import { Minus, Plus } from "lucide-react";
import { MAX_SET_METERS, SECTION_METERS } from "@/lib/data/lightSet";
import { money } from "@/lib/format";

const presets = [15, 30, 45, 60];

/** The length of lights wanted: typed in, stepped by one section or picked from the usual lengths. */
export default function MetersInput({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const id = useId();
  const meters = value === "" ? NaN : Number(value);
  const step = (delta: number) => {
    const current = Number.isFinite(meters) ? meters : 0;
    onChange(String(Math.max(SECTION_METERS, money(current + delta))));
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-bold text-pine-900">
        Reikalingas ilgis
      </label>
      <div className="mt-2 flex h-16 overflow-hidden rounded-2xl border-[1.5px] border-sand bg-white transition-shadow focus-within:border-pine-700 focus-within:shadow-[0_0_0_4px_rgb(36_80_57/0.12)]">
        <button
          type="button"
          onClick={() => step(-SECTION_METERS)}
          disabled={!Number.isFinite(meters) || meters <= SECTION_METERS}
          aria-label="Viena sekcija mažiau"
          className="flex w-14 shrink-0 items-center justify-center border-r border-sand text-pine-900 transition-colors hover:bg-cream disabled:opacity-35 disabled:hover:bg-transparent"
        >
          <Minus className="size-5" aria-hidden="true" />
        </button>
        <div className="relative flex min-w-0 flex-1 items-center justify-center">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min="0.1"
            max={MAX_SET_METERS}
            step="0.1"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-w-0 [appearance:textfield] bg-transparent pr-8 pl-4 text-center font-display text-3xl font-semibold text-pine-900 outline-none focus-visible:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="pointer-events-none absolute right-4 text-lg font-semibold text-stone">
            m
          </span>
        </div>
        <button
          type="button"
          onClick={() => step(SECTION_METERS)}
          disabled={Number.isFinite(meters) && meters + SECTION_METERS > MAX_SET_METERS}
          aria-label="Viena sekcija daugiau"
          className="flex w-14 shrink-0 items-center justify-center border-l border-sand text-pine-900 transition-colors hover:bg-cream disabled:opacity-35 disabled:hover:bg-transparent"
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={meters === m}
            onClick={() => onChange(String(m))}
            className={clsx(
              "rounded-full border-[1.5px] px-3.5 py-1.5 text-sm font-bold transition-colors",
              meters === m
                ? "border-pine-900 bg-pine-900 text-snow"
                : "border-sand bg-white text-pine-900 hover:border-pine-900",
            )}
          >
            {m} m
          </button>
        ))}
      </div>
    </div>
  );
}
