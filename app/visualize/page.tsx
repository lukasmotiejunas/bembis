"use client";
import { useState } from "react";
import {
  VisualizationPreferences,
  VisualizationResult,
  VisualizationStep,
} from "@/lib/types";
import { generateChristmasVisualization } from "@/lib/services/visualizationService";
import UploadStep from "@/components/visualizer/UploadStep";
import CustomizeStep from "@/components/visualizer/CustomizeStep";
import GeneratingStep from "@/components/visualizer/GeneratingStep";
import ResultStep from "@/components/visualizer/ResultStep";
import { Sparkles, ChevronRight } from "lucide-react";

const stepLabels = ["Įkelti", "Stilius", "Peržiūra"];

const defaultPrefs: VisualizationPreferences = {
  style: "classic-warm",
  lightColor: "warm-white",
  decorationLevel: "classic",
  areas: ["roofline", "windows", "entrance"],
  specialRequest: "",
  selectedProductId: "1",
};

export default function VisualizePage() {
  const [step, setStep] = useState<VisualizationStep>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [preferences, setPreferences] =
    useState<VisualizationPreferences>(defaultPrefs);
  const [result, setResult] = useState<VisualizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentStepIndex = (() => {
    if (step === "upload") return 0;
    if (step === "customize") return 1;
    return 2;
  })();

  const handleImageUploaded = (img: string) => {
    setUploadedImage(img);
    setStep("customize");
  };

  const handleGenerate = async () => {
    if (!uploadedImage) return;
    setStep("generating");
    setError(null);
    try {
      const res = await generateChristmasVisualization(
        uploadedImage,
        preferences,
      );
      setResult(res);
      setStep("result");
    } catch (err: any) {
      setError(
        err?.message ??
          "Kažkas nutiko generuojant peržiūrą. Bandykite dar kartą.",
      );
      setStep("customize");
    }
  };

  return (
    <div className="min-h-screen bg-[#08091a]">
      <div
        className="pt-28 pb-12 text-center relative"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.08) 0%, transparent 60%)",
        }}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
          style={{
            background: "rgba(201,162,39,0.1)",
            border: "1px solid rgba(201,162,39,0.3)",
            color: "#E8C84A",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Kalėdinė vizualizacija
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#FFF5E6] mb-3">
          Pamatykite savo namus{" "}
          <span className="gold-text">Kalėdinių lempučių</span> šviesoje
        </h1>
        <p className="text-[#C4A882] max-w-xl mx-auto text-lg">
          Įkelti nuotrauką · Pasirinkti stilių · Gauti AI peržiūrą · Užsakyti
          montavimą
        </p>

        {step !== "generating" && step !== "result" && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={{
                      background:
                        i <= currentStepIndex
                          ? "linear-gradient(135deg, #C9A227, #E8C84A)"
                          : "#1e2d52",
                      color: i <= currentStepIndex ? "#1a1000" : "#C4A882",
                    }}
                  >
                    {i < currentStepIndex ? "✓" : i + 1}
                  </div>
                  <span
                    className="text-xs font-medium hidden sm:block"
                    style={{
                      color: i === currentStepIndex ? "#E8C84A" : "#C4A882",
                    }}
                  >
                    {label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-[#1e2d52]" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 pb-24">
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {step === "upload" && (
          <UploadStep onImageUploaded={handleImageUploaded} />
        )}
        {step === "customize" && uploadedImage && (
          <CustomizeStep
            preferences={preferences}
            onChange={setPreferences}
            onGenerate={handleGenerate}
            uploadedImage={uploadedImage}
          />
        )}
        {step === "generating" && uploadedImage && (
          <GeneratingStep uploadedImage={uploadedImage} />
        )}
        {step === "result" && result && (
          <ResultStep
            result={result}
            onRestyle={() => {
              setStep("customize");
              setResult(null);
            }}
            onCustomize={() => {
              setStep("customize");
              setResult(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
