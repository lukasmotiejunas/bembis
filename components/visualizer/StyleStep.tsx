"use client";
import { DecorStyle } from "@/lib/types";

interface StyleCard {
  id: DecorStyle;
  title: string;
  desc: string;
  emoji: string;
  preview: string;
}

const styles: StyleCard[] = [
  {
    id: "classic-warm",
    title: "Klasikinis šiltas",
    desc: "Šiltos baltos lemputės išilgai stogo ir langų",
    emoji: "🏡",
    preview:
      "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&q=75",
  },
  {
    id: "winter-white",
    title: "Žiemos baltas",
    desc: "Elegantiškas, ryškus vėsiai baltas apšvietimas",
    emoji: "❄️",
    preview:
      "https://images.unsplash.com/photo-1545048702-79362596cdc9?w=400&q=75",
  },
  {
    id: "golden-luxury",
    title: "Auksinė prabanga",
    desc: "Tankios šiltos auksinės lemputės su prabangiais elementais",
    emoji: "✨",
    preview:
      "https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=400&q=75",
  },
  {
    id: "colorful",
    title: "Spalvingos Kalėdos",
    desc: "Tradicinės spalvingos Kalėdinės lemputės",
    emoji: "🎄",
    preview:
      "https://images.unsplash.com/photo-1491300258918-c6f03438dab0?w=400&q=75",
  },
  {
    id: "minimal-scandinavian",
    title: "Minimalus skandinaviškas",
    desc: "Švaras architektūrinis apšvietimas, subtilus ir elegantiškas",
    emoji: "🕯️",
    preview:
      "https://images.unsplash.com/photo-1606946887360-0c7ea0c08376?w=400&q=75",
  },
  {
    id: "surprise-me",
    title: "Nustebinkite mane",
    desc: "AI nusprendžia, kas geriausiai tiks jūsų namams",
    emoji: "🎁",
    preview:
      "https://images.unsplash.com/photo-1548105907-e4dae1e9a6d5?w=400&q=75",
  },
];

interface Props {
  selected: DecorStyle | null;
  onSelect: (style: DecorStyle) => void;
  onContinue: () => void;
  uploadedImage: string;
}

export default function StyleStep({
  selected,
  onSelect,
  onContinue,
  uploadedImage,
}: Props) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-64 shrink-0">
          <div className="rounded-xl overflow-hidden border border-[#1e2d52] sticky top-24">
            <img
              src={uploadedImage}
              alt="Jūsų namas"
              className="w-full aspect-[4/3] object-cover"
            />
            <div className="p-3 bg-[#131c35]">
              <p className="text-xs text-[#C4A882]">Jūsų namas</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="font-display text-2xl font-bold text-[#FFF5E6] mb-2">
            Kaip norėtumėte, kad atrodytų jūsų namai?
          </h2>
          <p className="text-sm text-[#C4A882] mb-8">
            Pasirinkite puošybos stilių — kitame žingsnyje galėsite viską
            patikslinti.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {styles.map((style) => {
              const isSelected = selected === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => onSelect(style.id)}
                  className="group text-left rounded-xl overflow-hidden border transition-all duration-200"
                  style={{
                    background: isSelected ? "rgba(201,162,39,0.1)" : "#131c35",
                    borderColor: isSelected
                      ? "rgba(201,162,39,0.6)"
                      : "#1e2d52",
                    boxShadow: isSelected
                      ? "0 0 20px rgba(201,162,39,0.15)"
                      : "none",
                  }}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={style.preview}
                      alt={style.title}
                      className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${isSelected ? "" : "brightness-75 saturate-75"}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08091a]/50 to-transparent" />
                    {isSelected && (
                      <div
                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs text-yellow-950 font-bold"
                        style={{
                          background:
                            "linear-gradient(135deg, #C9A227, #E8C84A)",
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-base">{style.emoji}</span>
                      <span
                        className={`font-semibold text-sm ${isSelected ? "text-[#E8C84A]" : "text-[#FFF5E6]"}`}
                      >
                        {style.title}
                      </span>
                    </div>
                    <p className="text-xs text-[#C4A882] pl-6">{style.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <button
              onClick={onContinue}
              disabled={!selected}
              className={`btn-gold text-base px-10 py-4 w-full sm:w-auto ${!selected ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Tikrinti lemputes →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
