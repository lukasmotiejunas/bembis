"use client";
import { LightColor, DecorationLevel, DecorationArea, VisualizationPreferences } from "@/lib/types";
import { products } from "@/lib/data/products";
import { Sparkles } from "lucide-react";

const productToLightColor: Record<string, LightColor> = {
  "1": "warm-white",
  "2": "multicolor",
  "3": "pure-white",
  "4": "multicolor",
  "5": "red-white",
  "6": "golden",
};

const levels: { id: DecorationLevel; label: string; desc: string }[] = [
  { id: "minimal", label: "Minimalus", desc: "Subtilus" },
  { id: "classic", label: "Klasikinis", desc: "Tradicinis" },
  { id: "full", label: "Pilnas", desc: "Įspūdingas" },
  { id: "spectacular", label: "Spektakuliarus", desc: "Žavesys" },
];

const areas: { id: DecorationArea; label: string; emoji: string }[] = [
  { id: "roofline", label: "Stogo kraštas", emoji: "🏠" },
  { id: "windows", label: "Langai", emoji: "🪟" },
  { id: "entrance", label: "Įėjimas", emoji: "🚪" },
  { id: "trees", label: "Medžiai", emoji: "🌲" },
  { id: "bushes", label: "Krūmai", emoji: "🌿" },
  { id: "fence", label: "Tvora", emoji: "🔲" },
  { id: "balcony", label: "Balkonas", emoji: "🏛️" },
  { id: "columns", label: "Kolonos", emoji: "🏛️" },
  { id: "garden", label: "Sodas", emoji: "🌹" },
];

interface Props {
  preferences: VisualizationPreferences;
  onChange: (prefs: VisualizationPreferences) => void;
  onGenerate: () => void;
  uploadedImage: string;
}

export default function CustomizeStep({ preferences, onChange, onGenerate, uploadedImage }: Props) {
  const update = (partial: Partial<VisualizationPreferences>) => {
    onChange({ ...preferences, ...partial });
  };

  const handleProductSelect = (productId: string) => {
    update({
      selectedProductId: productId,
      lightColor: productToLightColor[productId] ?? "warm-white",
    });
  };

  const toggleArea = (area: DecorationArea) => {
    const current = preferences.areas;
    if (current.includes(area)) {
      update({ areas: current.filter((a) => a !== area) });
    } else {
      update({ areas: [...current, area] });
    }
  };

  const selectedProductId = preferences.selectedProductId ?? "1";
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-64 shrink-0">
          <div className="rounded-xl overflow-hidden border border-[#1e2d52] sticky top-24">
            <img src={uploadedImage} alt="Jūsų namas" className="w-full aspect-[4/3] object-cover" />
            <div className="p-3 bg-[#131c35]">
              <p className="text-xs text-[#C4A882]">Jūsų namas</p>
              {selectedProduct && (
                <p className="text-xs text-[#C9A227] mt-0.5 truncate">{selectedProduct.name}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#FFF5E6] mb-1">
              Patikslinkite savo Kalėdinį vaizdą
            </h2>
            <p className="text-sm text-[#C4A882]">
              Pasirinkite lemputes, puošybos lygį ir zonas — tada generuokite AI peržiūrą.
            </p>
          </div>

          {/* Product picker */}
          <div>
            <label className="block text-sm font-semibold text-[#FFF5E6] mb-3">
              Pasirinkite lemputes
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {products.map((product) => {
                const isSelected = selectedProductId === product.id;
                return (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product.id)}
                    className="group flex flex-col items-center gap-2 rounded-xl border p-2 transition-all duration-200"
                    style={{
                      background: isSelected ? "rgba(201,162,39,0.1)" : "#131c35",
                      borderColor: isSelected ? "rgba(201,162,39,0.6)" : "#1e2d52",
                      boxShadow: isSelected ? "0 0 16px rgba(201,162,39,0.2)" : "none",
                    }}
                  >
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#0d1230]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-yellow-950 font-bold"
                          style={{ background: "linear-gradient(135deg, #C9A227, #E8C84A)" }}>
                          ✓
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] leading-tight text-center line-clamp-2"
                      style={{ color: isSelected ? "#E8C84A" : "#C4A882" }}>
                      {product.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Decoration Level */}
          <div>
            <label className="block text-sm font-semibold text-[#FFF5E6] mb-3">
              Puošybos lygis
            </label>
            <div className="grid grid-cols-4 gap-2">
              {levels.map((level) => {
                const selected = preferences.decorationLevel === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => update({ decorationLevel: level.id })}
                    className="py-3 rounded-xl border text-center transition-all duration-200"
                    style={{
                      background: selected ? "rgba(201,162,39,0.1)" : "#131c35",
                      borderColor: selected ? "rgba(201,162,39,0.6)" : "#1e2d52",
                    }}
                  >
                    <div className={`font-semibold text-sm ${selected ? "text-[#E8C84A]" : "text-[#FFF5E6]"}`}>
                      {level.label}
                    </div>
                    <div className="text-xs text-[#C4A882] mt-0.5">{level.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Areas */}
          <div>
            <label className="block text-sm font-semibold text-[#FFF5E6] mb-3">
              Puošybos zonos
            </label>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => {
                const selected = preferences.areas.includes(area.id);
                return (
                  <button
                    key={area.id}
                    onClick={() => toggleArea(area.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm transition-all duration-200"
                    style={{
                      background: selected ? "rgba(201,162,39,0.1)" : "#131c35",
                      borderColor: selected ? "rgba(201,162,39,0.6)" : "#1e2d52",
                      color: selected ? "#E8C84A" : "#C4A882",
                    }}
                  >
                    <span>{area.emoji}</span>
                    {area.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special request */}
          <div>
            <label className="block text-sm font-semibold text-[#FFF5E6] mb-3">
              Ypatingi pageidavimai <span className="text-[#C4A882] font-normal">(nebūtina)</span>
            </label>
            <textarea
              rows={3}
              placeholder='pvz. „Lemputės ant stogo ir įėjimo, bet sodą palikti minimalų."'
              value={preferences.specialRequest ?? ""}
              onChange={(e) => update({ specialRequest: e.target.value })}
              className="w-full rounded-xl border px-4 py-3 text-sm text-[#FFF5E6] resize-none transition-colors outline-none placeholder:text-[#C4A882]/40 focus:border-[rgba(201,162,39,0.5)]"
              style={{ background: "#131c35", borderColor: "#1e2d52" }}
            />
          </div>

          {/* Generate CTA */}
          <div>
            <button
              onClick={onGenerate}
              className="btn-gold text-lg px-12 py-5 w-full sm:w-auto glow-pulse"
            >
              <Sparkles className="w-6 h-6" />
              ✨ Generuoti mano Kalėdinius namus
            </button>
            <p className="text-xs text-[#C4A882]/60 mt-3">
              Tai paprastai trunka 20–40 sekundžių
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
