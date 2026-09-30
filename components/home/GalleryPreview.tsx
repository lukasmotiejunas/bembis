"use client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { galleryItems } from "@/lib/data/gallery";
import { useState } from "react";

export default function GalleryPreview() {
  const featured = galleryItems.slice(0, 3);
  return (
    <section className="py-24 bg-[#0d1230]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-[#C9A227] text-sm font-semibold uppercase tracking-widest mb-3">
            Transformacijos
          </p>
          <h2 className="section-title text-4xl md:text-5xl font-display font-bold text-[#FFF5E6]">
            Kalėdinės <span className="gold-text">transformacijos</span>
          </h2>
          <p className="mt-4 text-[#C4A882] max-w-xl mx-auto">
            Realūs namai, realūs rezultatai. Pamatykite, kaip mes
            transformuojame namus visoje Lietuvoje.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((item) => (
            <GalleryCard key={item.id} item={item} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/gallery" className="btn-outline px-8 py-3">
            Peržiūrėti visas transformacijas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function GalleryCard({ item }: { item: (typeof galleryItems)[0] }) {
  const [showAfter, setShowAfter] = useState(true);

  return (
    <div
      className="group rounded-2xl overflow-hidden border border-[#1e2d52] hover:border-[rgba(201,162,39,0.35)] transition-all duration-300"
      style={{ background: "#131c35" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={showAfter ? item.afterImage : item.beforeImage}
          alt={`${item.style} puošimas`}
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08091a]/60 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-1 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm rounded-full p-1">
          <button
            onClick={() => setShowAfter(false)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${!showAfter ? "bg-white/20 text-white" : "text-white/50"}`}
          >
            Prieš
          </button>
          <button
            onClick={() => setShowAfter(true)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${showAfter ? "text-yellow-950" : "text-white/50"}`}
            style={
              showAfter
                ? { background: "linear-gradient(135deg, #C9A227, #E8C84A)" }
                : {}
            }
          >
            Po ✨
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#FFF5E6] text-sm">{item.style}</p>
            <p className="text-xs text-[#C4A882] mt-0.5">{item.location}</p>
          </div>
          <span className="text-sm font-semibold text-[#C9A227]">
            {item.estimatedPrice}
          </span>
        </div>
      </div>
    </div>
  );
}
