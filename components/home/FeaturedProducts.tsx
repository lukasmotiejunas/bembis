"use client";
import Link from "next/link";
import { products } from "@/lib/data/products";
import { ArrowRight, Star, Plus, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useState } from "react";

export default function FeaturedProducts() {
  const featured = products.slice(0, 4);
  return (
    <section className="py-24 bg-[#08091a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#C9A227] text-sm font-semibold uppercase tracking-widest mb-3">
              Kalėdinė parduotuvė
            </p>
            <h2 className="section-title text-4xl font-display font-bold text-[#FFF5E6]">
              Aukščiausios kokybės Kalėdinės lemputės
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 text-sm text-[#C9A227] hover:text-[#E8C84A] transition-colors"
          >
            Visi produktai
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Link href="/shop" className="btn-outline px-8 py-3">
            Visi produktai
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: (typeof products)[0] }) {
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
          <p className="text-xs text-[#C4A882]/60 mb-1 capitalize">
            {product.category.replace(/-/g, " ")}
          </p>
          <h3 className="text-sm font-medium text-[#FFF5E6] leading-snug line-clamp-2 mb-3">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[#C9A227] fill-current" />
              <span className="text-xs text-[#C4A882]">
                {product.rating} ({product.reviewCount})
              </span>
            </div>
            <div className="flex items-center gap-2">
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
      </div>
    </Link>
  );
}
