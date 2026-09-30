"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProductById, priceFor } from "../data/products";
import { CartItem, Product, PurchaseMode } from "../types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (productId: string, mode: PurchaseMode, quantity?: number) => void;
  removeItem: (productId: string, mode: PurchaseMode) => void;
  updateQuantity: (productId: string, mode: PurchaseMode, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const same = (item: CartItem, productId: string, mode: PurchaseMode) =>
  item.productId === productId && item.mode === mode;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (productId, mode, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => same(i, productId, mode));
          if (existing) {
            return {
              items: state.items.map((i) =>
                same(i, productId, mode) ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return { items: [...state.items, { productId, mode, quantity }] };
        });
      },

      removeItem: (productId, mode) => {
        set((state) => ({
          items: state.items.filter((i) => !same(i, productId, mode)),
        }));
      },

      updateQuantity: (productId, mode, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, mode);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (same(i, productId, mode) ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "bembis-cart-v2",
      partialize: (state) => ({ items: state.items }),
      // Rehydrated on mount by <CartHydration /> so server and client render the same markup.
      skipHydration: true,
    }
  )
);

export interface CartLine extends CartItem {
  product: Product;
  unitPrice: number;
}

export function resolveLines(items: CartItem[]): CartLine[] {
  return items.flatMap((item) => {
    const product = getProductById(item.productId);
    if (!product) return [];
    return [{ ...item, product, unitPrice: priceFor(product, item.mode) }];
  });
}

export function cartTotals(lines: CartLine[]) {
  return {
    count: lines.reduce((sum, l) => sum + l.quantity, 0),
    total: lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
  };
}
