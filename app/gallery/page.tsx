"use client";
import { useState } from "react";
import { galleryItems, galleryCategories } from "@/lib/data/gallery";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category.includes(activeFilter));

  return (
    <div className="min-h-screen bg-[#08091a] pt-28">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-[#C9A227] text-sm font-semibold uppercase tracking-widest mb-3">
            Portfolio
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#FFF5E6] mb-4">
            Kalėdinės{" "}
            <span className="gold-text">transformacijos</span>
          </h1>
          <p className="text-[#C4A882] max-w-2xl mx-auto text-lg">
            Tikri namai, profesionaliai papuošti mūsų komandos. Kiekvienas projektas suprojektuotas nuo nulio naudojant AI vizualizaciją.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {galleryCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background:
                  activeFilter === cat.id
                    ? "linear-gradient(135deg, #C9A227, #E8C84A)"
                    : "#131c35",
                color: activeFilter === cat.id ? "#1a1000" : "#C4A882",
                border:
                  activeFilter === cat.id
                    ? "1px solid transparent"
                    : "1px solid #1e2d52",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              isHovered={hoveredId === item.id}
              onHover={() => setHoveredId(item.id)}
              onLeave={() => setHoveredId(null)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#C4A882]">
            Šioje kategorijoje projektų dar nėra.
          </div>
        )}

        {/* CTA section */}
        <div
          className="mt-20 rounded-3xl p-12 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #131c35, #0d1230)",
            border: "1px solid rgba(201,162,39,0.2)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(201,162,39,0.06) 0%, transparent 70%)" }}
          />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#FFF5E6] mb-4 relative">
            Pasiruošę transformuoti savo namus?
          </h2>
          <p className="text-[#C4A882] mb-8 max-w-lg mx-auto relative">
            Įkelkite nuotrauką ir gaukite personalizuotą Kalėdinę jūsų namo vizualizaciją — dar prieš sumontuodami pirmą lemputę.
          </p>
          <Link href="/visualize" className="btn-gold text-base px-10 py-4 inline-flex">
            <Sparkles className="w-5 h-5" />
            ✨ Vizualizuoti mano namus
          </Link>
        </div>
      </div>
    </div>
  );
}

function GalleryCard({
  item,
  isHovered,
  onHover,
  onLeave,
}: {
  item: typeof galleryItems[0];
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const [showAfter, setShowAfter] = useState(true);

  return (
    <div
      className="rounded-2xl overflow-hidden border border-[#1e2d52] hover:border-[rgba(201,162,39,0.35)] transition-all duration-300 group"
      style={{ background: "#131c35" }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={showAfter ? item.afterImage : item.beforeImage}
          alt={item.style}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08091a]/70 to-transparent" />

        {/* Before/After toggle */}
        <div className="absolute top-3 right-3 flex gap-1 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm rounded-full p-1">
          <button
            onClick={() => setShowAfter(false)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${!showAfter ? "bg-white/20 text-white" : "text-white/50 hover:text-white/80"}`}
          >
            Prieš
          </button>
          <button
            onClick={() => setShowAfter(true)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${showAfter ? "text-yellow-950" : "text-white/50 hover:text-white/80"}`}
            style={showAfter ? { background: "linear-gradient(135deg, #C9A227, #E8C84A)" } : {}}
          >
            Po ✨
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-[#FFF5E6] mb-0.5">{item.style}</h3>
            <p className="text-xs text-[#C4A882]">{item.location}</p>
          </div>
          <span className="text-sm font-semibold text-[#C9A227] whitespace-nowrap">
            {item.estimatedPrice}
          </span>
        </div>

        <Link
          href="/visualize"
          className="flex items-center gap-1.5 text-xs text-[#C9A227] hover:text-[#E8C84A] transition-colors font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Noriu tokio stiliaus savo namams
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
