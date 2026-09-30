"use client";
import { Product } from "@/lib/types";
import { products } from "@/lib/data/products";
import {
  Star,
  Check,
  ShoppingCart,
  Package,
  Truck,
  Shield,
  Sparkles,
  Plus,
  Minus,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cartStore";

export default function ProductClient({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#08091a] pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#C4A882] mb-8">
          <Link
            href="/shop"
            className="flex items-center gap-1 hover:text-[#E8C84A] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Parduotuvė
          </Link>
          <span>/</span>
          <span className="text-[#FFF5E6]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="rounded-2xl overflow-hidden border border-[#1e2d52] aspect-square bg-[#0d1230] mb-4">
              <img
                src={product.images[activeImg] ?? product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="w-20 h-20 rounded-xl overflow-hidden border-2 transition-all"
                    style={{
                      borderColor: i === activeImg ? "#C9A227" : "#1e2d52",
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {product.badge && (
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-yellow-950 mb-4"
                style={{
                  background: "linear-gradient(135deg, #C9A227, #E8C84A)",
                }}
              >
                {product.badge}
              </span>
            )}
            <h1 className="font-display text-3xl font-bold text-[#FFF5E6] mb-3">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-4xl font-bold text-[#E8C84A]">
                €{product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-[#C4A882]/50 line-through">
                    €{product.originalPrice}
                  </span>
                  <span className="text-sm text-green-400 font-medium">
                    Sutaupote €{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            <p className="text-[#C4A882] leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3 mb-8 p-4 rounded-xl border border-[#1e2d52] bg-[#131c35]">
              {product.specs.length && (
                <SpecItem label="Ilgis" value={product.specs.length!} />
              )}
              {product.specs.lightColor && (
                <SpecItem
                  label="Šviesos spalva"
                  value={product.specs.lightColor}
                />
              )}
              {product.specs.numLEDs && (
                <SpecItem
                  label="LED lemputės"
                  value={`${product.specs.numLEDs} vnt.`}
                />
              )}
              {product.specs.powerType && (
                <SpecItem label="Maitinimas" value={product.specs.powerType} />
              )}
              {product.specs.ipRating && (
                <SpecItem
                  label="Apsaugos lygis"
                  value={product.specs.ipRating}
                />
              )}
              {product.specs.indoorOutdoor && (
                <SpecItem
                  label="Naudojimas"
                  value={product.specs.indoorOutdoor}
                />
              )}
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 border border-[#1e2d52] rounded-full px-4 py-2 bg-[#131c35]">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="text-[#C4A882] hover:text-[#FFF5E6] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-[#FFF5E6] font-semibold w-6 text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="text-[#C4A882] hover:text-[#FFF5E6] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="btn-gold flex-1 justify-center py-3"
                style={
                  added ? { background: "#166534", boxShadow: "none" } : {}
                }
              >
                <ShoppingCart className="w-5 h-5" />
                {added ? "Pridėta ✓" : "Į krepšelį"}
              </button>
            </div>

            {/* Delivery info */}
            <div className="space-y-3 mb-8">
              {[
                { icon: Truck, text: "Nemokamas pristatymas nuo €80" },
                { icon: Shield, text: "2 metų garantija visoms lemputėms" },
                { icon: Package, text: "Grąžinimas per 30 dienų" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-[#C4A882]"
                >
                  <item.icon className="w-4 h-4 text-[#C9A227] shrink-0" />
                  {item.text}
                </div>
              ))}
            </div>

            {/* Installation upsell */}
            <div className="p-5 rounded-xl border border-[rgba(201,162,39,0.25)] bg-[rgba(201,162,39,0.05)]">
              <p className="font-semibold text-[#FFF5E6] mb-1.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
                Norite, kad mes sumontuotume?
              </p>
              <p className="text-sm text-[#C4A882] mb-3">
                Įkelkite savo namo nuotrauką ir gaukite profesionalaus montavimo
                kainą su šiomis lemputėmis.
              </p>
              <Link
                href="/visualize"
                className="btn-gold text-sm px-5 py-2.5 inline-flex"
              >
                Gauti montavimo kainą
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold text-[#FFF5E6] mb-6">
            Savybės
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.features.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-[#C4A882]"
              >
                <div
                  className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: "rgba(201,162,39,0.15)" }}
                >
                  <Check className="w-3 h-3 text-[#C9A227]" />
                </div>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl font-bold text-[#FFF5E6] mb-8">
              Taip pat gali patikti
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/shop/${p.slug}`}
                  className="glass-card p-4 group hover:border-[rgba(201,162,39,0.3)] transition-all block"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full aspect-video object-cover rounded-xl mb-3"
                  />
                  <h3 className="text-sm font-medium text-[#FFF5E6] line-clamp-2 mb-1">
                    {p.name}
                  </h3>
                  <p className="text-[#E8C84A] font-semibold">€{p.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[#C4A882]/60 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="text-sm text-[#FFF5E6] font-medium">{value}</p>
    </div>
  );
}
