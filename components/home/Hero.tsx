"use client";
import Link from "next/link";
import { Sparkles, ArrowRight, Star } from "lucide-react";
import { useEffect, useState } from "react";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1920&q=85"
          alt="Kalėdomis papuoštas namas"
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.3) saturate(0.8)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08091a] via-[#08091a]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08091a] via-transparent to-transparent" />
        <div
          className="absolute bottom-0 right-0 w-1/2 h-2/3"
          style={{
            background:
              "radial-gradient(ellipse at 70% 80%, rgba(201,162,39,0.08) 0%, transparent 60%)",
          }}
        />
      </div>

      {loaded && <StarField />}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="max-w-2xl">
          {/* Headline */}
          <h1
            className={`font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-[#FFF5E6] transition-all duration-700 delay-100 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Pamatykite savo namus{" "}
            <span className="gold-text">Kalėdinių lempučių</span> šviesoje dar
            prieš montavimą
          </h1>

          {/* Subheadline */}
          <p
            className={`mt-6 text-lg md:text-xl text-[#C4A882] leading-relaxed transition-all duration-700 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Įkelkite savo namo nuotrauką. Leiskite AI sukurti Kalėdinį vaizdą.
            Patinka? Mūsų komanda profesionaliai viską sumontuos.
          </p>

          {/* CTAs */}
          <div
            className={`mt-10 flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Link
              href="/visualize"
              className="btn-gold text-base px-8 py-4 glow-pulse"
            >
              <Sparkles className="w-5 h-5" />✨ Vizualizuoti mano namus
            </Link>
            <Link href="/shop" className="btn-outline text-base px-8 py-4">
              Pirkti Kalėdines lemputes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#C4A882]/50">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#C9A227]/40" />
        <span className="text-xs tracking-widest uppercase">Slinkti</span>
      </div>
    </section>
  );
}

function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 60}%`,
    size: Math.random() * 2 + 1,
    delay: `${Math.random() * 3}s`,
    duration: `${1.5 + Math.random() * 2}s`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animation: `twinkle ${star.duration} ${star.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
