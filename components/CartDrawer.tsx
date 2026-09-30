"use client";
import { useCartStore } from "@/lib/store/cartStore";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore();
  const total = totalPrice();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full z-[70] w-full max-w-md flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "#0d1230", borderLeft: "1px solid #1e2d52" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1e2d52]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#C9A227]" />
            <h2 className="font-display font-semibold text-lg text-[#FFF5E6]">
              Jūsų krepšelis
            </h2>
            {items.length > 0 && (
              <span className="text-xs text-[#C9A227] bg-[rgba(201,162,39,0.15)] px-2 py-0.5 rounded-full">
                {items.length} prек{items.length === 1 ? "ė" : "ės"}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-[#C4A882] hover:text-[#FFF5E6] transition-colors rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-[#1e2d52] mx-auto mb-4" />
              <p className="text-[#C4A882] font-medium">Krepšelis tuščias</p>
              <p className="text-sm text-[#C4A882]/60 mt-1">
                Pridėkite lempučių ir pradėkite
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="btn-gold mt-6 text-sm px-5 py-2.5 inline-flex"
              >
                Pirkti Kalėdines lemputes
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-4 rounded-xl border border-[#1e2d52] bg-[#131c35]"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#0d1230]">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#FFF5E6] leading-tight line-clamp-2">
                    {item.product.name}
                  </p>
                  <p className="text-[#C9A227] font-semibold mt-1">
                    €{item.product.price}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full border border-[#1e2d52] flex items-center justify-center text-[#C4A882] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm text-[#FFF5E6] w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full border border-[#1e2d52] flex items-center justify-center text-[#C4A882] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-auto text-[#C4A882]/50 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#1e2d52] space-y-4">
            <div className="flex items-center justify-between text-sm text-[#C4A882]">
              <span>Tarpinė suma</span>
              <span className="text-[#FFF5E6] font-semibold text-base">€{total.toFixed(0)}</span>
            </div>
            <p className="text-xs text-[#C4A882]/60">
              Pristatymo kaina skaičiuojama atsiskaitant
            </p>
            <button className="btn-gold w-full justify-center py-3">
              Pereiti į atsiskaitymą
            </button>
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-[#C4A882] hover:text-[#FFF5E6] transition-colors py-2"
            >
              Tęsti apsipirkimą
            </button>
          </div>
        )}
      </div>
    </>
  );
}
