"use client";
import Link from "next/link";
import { Sparkles, Upload, Camera } from "lucide-react";

export default function VisualizerTeaser() {
  return (
    <section className="py-24 bg-[#08091a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <p className="text-[#C9A227] text-sm font-semibold uppercase tracking-widest mb-4">
              AI vizualizacija
            </p>
            <h2 className="section-title text-4xl md:text-5xl font-display font-bold text-[#FFF5E6] leading-tight">
              Pamatykite savo namus{" "}
              <span className="gold-text">Kalėdinių lempučių</span>{" "}
              šviesoje dar prieš pirmą lemputę
            </h2>
            <p className="mt-6 text-lg text-[#C4A882] leading-relaxed">
              Įkelkite savo namo nuotrauką ir mūsų AI sugeneruos fotorealistišką peržiūrą, kaip tiksliai atrodys jūsų namas papuoštas — išsaugodamas jūsų namo unikalią architektūrą ir charakterį.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Įkelkite priekio nuotrauką savo namo",
                "Pasirinkite puošybos stilių ir lempučių spalvas",
                "AI sugeneruoja realistišką prieš/po peržiūrą",
                "Patinka? Užsakykite montavimą vienu paspaudimu",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#C4A882]">
                  <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-yellow-950 mt-0.5"
                    style={{ background: "linear-gradient(135deg, #C9A227, #E8C84A)" }}>
                    {i + 1}
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/visualize" className="btn-gold text-base px-8 py-4">
                <Sparkles className="w-5 h-5" />
                ✨ Vizualizuoti mano namus
              </Link>
            </div>
            <p className="mt-4 text-xs text-[#C4A882]/60 flex items-center gap-1.5">
              <span>🔒</span>
              Jūsų nuotrauka naudojama tik Kalėdinei vizualizacijai sukurti.
            </p>
          </div>

          {/* Right — mockup */}
          <div className="relative">
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden border border-[rgba(201,162,39,0.3)] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                <img
                  src="/visualizer-preview.png"
                  alt="Kalėdomis papuoštas namas"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08091a]/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1.5 rounded-full text-sm font-semibold text-white bg-[rgba(0,0,0,0.5)] backdrop-blur-sm border border-white/10">
                    Po ✨
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-sm font-semibold text-yellow-950 backdrop-blur-sm"
                    style={{ background: "linear-gradient(135deg, #C9A227, #E8C84A)" }}>
                    AI peržiūra
                  </span>
                </div>
              </div>

              <div className="absolute -top-6 -left-6 w-40 h-32 rounded-xl overflow-hidden border-2 border-[#1e2d52] z-20 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80"
                  alt="Namas prieš puošimą"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.85) saturate(0.5)" }}
                />
                <div className="absolute inset-0 flex items-end p-2">
                  <span className="px-2 py-1 rounded text-xs font-medium text-white bg-[rgba(0,0,0,0.7)]">
                    Prieš
                  </span>
                </div>
              </div>

              <div
                className="absolute -bottom-6 -right-6 z-20 p-4 rounded-xl border border-[rgba(201,162,39,0.3)] max-w-[180px]"
                style={{ background: "rgba(13,18,48,0.95)", backdropFilter: "blur(12px)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="w-4 h-4 text-[#C9A227]" />
                  <span className="text-xs font-semibold text-[#FFF5E6]">Jūsų namas</span>
                </div>
                <p className="text-xs text-[#C4A882]">
                  Įkelkite bet kurią priekio nuotrauką
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span className="text-xs text-[#C9A227]">Arba nufotografuokite</span>
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ boxShadow: "0 0 80px rgba(201,162,39,0.12)" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
