"use client";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const messages = [
  "Analizuojama jūsų namo architektūra...",
  "Studiuojamas mūsų C9 lempučių stilius ir šviesa...",
  "Ieškoma tobulos vietos ant stogo krašto...",
  "Braižomi langai ir įėjimas...",
  "Dedama Kalėdinė magija...",
  "Reguliuojamas šiltas auksinės šviesos atspalvis...",
  "Beveik paruošta — paskutiniai prisilietimai...",
];

export default function GeneratingStep({ uploadedImage }: { uploadedImage: string }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) return p;
        const increment = p < 60 ? Math.random() * 5 : Math.random() * 1.5;
        return Math.min(95, p + increment);
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="relative rounded-2xl overflow-hidden border border-[rgba(201,162,39,0.3)] mb-10">
        <img src={uploadedImage} alt="Jūsų namas"
          className="w-full aspect-video object-cover"
          style={{ filter: "brightness(0.45) saturate(0.6)" }} />
        <div className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 35%, rgba(201,162,39,0.28) 0%, rgba(255,150,50,0.1) 50%, transparent 80%)",
            animation: "glowPulse 1.8s ease-in-out infinite",
          }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: "rgba(201,162,39,0.2)", border: "1px solid rgba(201,162,39,0.4)" }}>
            <Sparkles className="w-8 h-8 text-[#E8C84A]" style={{ animation: "spin 3s linear infinite" }} />
          </div>
          <p className="text-lg font-semibold text-[#FFF5E6] mb-2">
            AI puošia jūsų namus...
          </p>
          <p className="text-sm text-[#E8C84A] transition-all duration-700 min-h-[20px]" key={msgIndex}>
            {messages[msgIndex]}
          </p>
        </div>

        <div
          className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(201,162,39,0.3)", backdropFilter: "blur(8px)" }}
        >
          <img src="/product-lights-reference.jpg" alt="C9 lemputės"
            className="w-6 h-6 rounded-full object-cover" />
          <span className="text-[#E8C84A] font-medium">Naudojamos mūsų C9 lemputės</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-[#C4A882] mb-2">
          <span>Generuojama su AI</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-[#1e2d52] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #C9A227, #E8C84A)", boxShadow: "0 0 10px rgba(201,162,39,0.5)" }} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 mb-6">
        <span className="loading-dot" />
        <span className="loading-dot" />
        <span className="loading-dot" />
      </div>

      <p className="text-sm text-[#C4A882]/60 max-w-sm mx-auto">
        Mūsų AI analizuoja jūsų namo stogo kraštą, langus ir įėjimą — tada pritaiko mūsų tikrąsias C9 šiltas baltas lemputes tiksliai taip, kaip jos atrodytų realiame gyvenime.
        <br />
        <span className="text-[#C4A882]/40 text-xs mt-1 block">Tai paprastai trunka 20–40 sekundžių.</span>
      </p>
    </div>
  );
}
