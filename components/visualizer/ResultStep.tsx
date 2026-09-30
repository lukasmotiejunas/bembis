"use client";
import { VisualizationResult } from "@/lib/types";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { Check, Sparkles, RefreshCw, Sliders } from "lucide-react";
import { useState } from "react";
import QuoteModal from "./QuoteModal";

interface Props {
  result: VisualizationResult;
  onRestyle: () => void;
  onCustomize: () => void;
}

const included = [
  "Profesionalios klasės Kalėdinės lemputės",
  "Profesionali montavimo komanda",
  "Lauko tvirtinimo elementai",
  "Laikmačio ir pultelio nustatymas",
  "Visiškas sutvarkymas po montavimo",
];

export default function ResultStep({ result, onRestyle, onCustomize }: Props) {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{
              background: "rgba(201,162,39,0.1)",
              border: "1px solid rgba(201,162,39,0.35)",
              color: "#E8C84A",
            }}
          >
            <Sparkles className="w-4 h-4" />
            Jūsų Kalėdinė peržiūra paruošta
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#FFF5E6]">
            Tokie galėtų atrodyti jūsų namai
          </h2>
          <p className="mt-2 text-[#C4A882]">
            Vilkite slankiklį norėdami palyginti prieš ir po
          </p>
        </div>

        <BeforeAfterSlider
          beforeImage={result.originalImage}
          afterImage={result.generatedImage}
          beforeLabel="Jūsų namai"
          afterLabel="Kalėdinė peržiūra"
        />

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={onRestyle}
            className="btn-outline text-sm px-5 py-2.5 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Pabandyti kitą stilių
          </button>
          <button
            onClick={onCustomize}
            className="btn-outline text-sm px-5 py-2.5 flex items-center gap-2"
          >
            <Sliders className="w-4 h-4" />
            Stilius
          </button>
        </div>

        {/* Quote CTA */}
        <div
          className="mt-10 rounded-2xl p-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #131c35, #0d1230)",
            border: "1px solid rgba(201,162,39,0.25)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.08) 0%, transparent 60%)",
            }}
          />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              <h3 className="font-display text-2xl font-bold text-[#FFF5E6] mb-2">
                Patinka šis vaizdas?
              </h3>
              <p className="text-[#C4A882] text-sm mb-6">
                Galime paversti šią AI peržiūrą realybe. Mūsų komanda atvyks ir
                sumontuos šį dizainą jūsų namuose.
              </p>

              <div className="space-y-2.5 mb-6">
                {included.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-sm text-[#C4A882]"
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(201,162,39,0.15)" }}
                    >
                      <Check className="w-3 h-3 text-[#C9A227]" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-sm text-[#C4A882]">
                  Preliminari kaina:
                </span>
                <span className="font-display text-2xl font-bold text-[#E8C84A]">
                  €{result.estimatedPriceMin}–€{result.estimatedPriceMax}
                </span>
              </div>

              <button
                onClick={() => setQuoteOpen(true)}
                className="btn-gold text-base px-10 py-4"
              >
                <Sparkles className="w-5 h-5" />
                Gauti tikslią kainą
              </button>
              <p className="text-xs text-[#C4A882]/60 mt-3">
                Galutinė kaina patvirtinama po namo detalių peržiūros — jokių
                įsipareigojimų.
              </p>
            </div>

            <div className="w-full md:w-52 shrink-0">
              <div className="rounded-xl overflow-hidden border border-[rgba(201,162,39,0.25)]">
                <img
                  src={result.generatedImage}
                  alt="Jūsų Kalėdinis dizainas"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div
                  className="p-2 text-center"
                  style={{ background: "rgba(201,162,39,0.1)" }}
                >
                  <p className="text-xs text-[#C9A227] font-medium">
                    Jūsų Kalėdinis dizainas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuoteModal
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        result={result}
      />
    </>
  );
}
