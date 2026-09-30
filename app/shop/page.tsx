"use client";
import { useState } from "react";
import { products, categories } from "@/lib/data/products";
import { Plus, ShoppingCart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cartStore";
import { Product } from "@/lib/types";

const ltCategories = [{ id: "all", label: "Visi produktai" }];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#08091a] pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-[#C9A227] text-sm font-semibold uppercase tracking-widest mb-3">
          Kalėdinė parduotuvė
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#FFF5E6] mb-4">
          Aukščiausios kokybės Kalėdinės lemputės
        </h1>
        <p className="text-[#C4A882] max-w-2xl text-lg">
          Profesionalios klasės, lauko reitingą turinčios Kalėdinės lemputės,
          sukurtos atlaikyti Baltijos žiemas — ir atrodyti nuostabiai tai
          darant.
        </p>

        {/* Installation upsell */}
        <div
          className="mt-8 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(201,162,39,0.1), rgba(201,162,39,0.05))",
            border: "1px solid rgba(201,162,39,0.25)",
          }}
        >
          <div>
            <p className="font-semibold text-[#FFF5E6] mb-1">
              ✨ Norite, kad mes sumontuotume?
            </p>
            <p className="text-sm text-[#C4A882]">
              Įkelkite savo namo nuotrauką — suprojektuosime ir profesionaliai
              sumontuosime tobulą jūsų namams sistemą.
            </p>
          </div>
          <Link
            href="/visualize"
            className="btn-gold text-sm px-6 py-2.5 whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Gauti montavimo kainą
          </Link>
        </div>
      </div>

      {/* Category filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
        <div className="flex flex-wrap gap-2">
          {ltCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background:
                  activeCategory === cat.id
                    ? "linear-gradient(135deg, #C9A227, #E8C84A)"
                    : "#131c35",
                color: activeCategory === cat.id ? "#1a1000" : "#C4A882",
                border:
                  activeCategory === cat.id
                    ? "1px solid transparent"
                    : "1px solid #1e2d52",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#C4A882]">
            Šioje kategorijoje produktų nerasta.
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    openCart();
  };

  return (
    <Link href={`/shop/${product.slug}`} className="group product-card block">
      <div
        className="rounded-2xl overflow-hidden border border-[#1e2d52] transition-all duration-300 group-hover:border-[rgba(201,162,39,0.35)]"
        style={{ background: "#131c35" }}
      >
        <div className="relative overflow-hidden aspect-square bg-[#0d1230]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.badge && (
            <span
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-yellow-950"
              style={{
                background: "linear-gradient(135deg, #C9A227, #E8C84A)",
              }}
            >
              {product.badge}
            </span>
          )}
          <button
            onClick={handleAdd}
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
            style={{
              background: added
                ? "rgba(40,160,80,0.9)"
                : "rgba(201,162,39,0.9)",
              backdropFilter: "blur(4px)",
            }}
          >
            {added ? (
              <ShoppingCart className="w-4 h-4 text-white" />
            ) : (
              <Plus className="w-4 h-4 text-yellow-950" />
            )}
          </button>
        </div>
        <div className="p-4">
          <p className="text-xs text-[#C4A882]/60 mb-1">
            {product.category.replace(/-/g, " ")}
          </p>
          <h3 className="text-sm font-medium text-[#FFF5E6] leading-snug line-clamp-2 mb-3">
            {product.name}
          </h3>
          <div className="flex items-center justify-end gap-2">
            {product.originalPrice && (
              <span className="text-xs text-[#C4A882]/50 line-through">
                €{product.originalPrice}
              </span>
            )}
            <span className="font-semibold text-[#E8C84A]">
              €{product.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
