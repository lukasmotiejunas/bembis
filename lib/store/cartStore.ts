"use client";
import { useEffect, useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DeliveryMethod, ParcelMachine } from "../data/delivery";
import { getProduct } from "../data/products";
import { CustomerDetails, emptyCustomer } from "../orders/checkout";
import { OrderServices } from "../orders/order";
import { CartItem, Product, PurchaseMode } from "../types";
import { buildOrder } from "../orders/order";

const noServices: OrderServices = { installation: false, removal: false };

export interface DeliveryChoice {
  method: DeliveryMethod | null;
  parcelMachine: ParcelMachine | null;
}
const noDelivery: DeliveryChoice = { method: null, parcelMachine: null };

interface CartStore {
  items: CartItem[];
  services: OrderServices;
  customer: CustomerDetails;
  delivery: DeliveryChoice;
  isOpen: boolean;
  addItem: (productId: string, mode: PurchaseMode, quantity?: number) => void;
  removeItem: (productId: string, mode: PurchaseMode) => void;
  updateQuantity: (
    productId: string,
    mode: PurchaseMode,
    quantity: number,
  ) => void;
  setService: (service: keyof OrderServices, enabled: boolean) => void;
  setCustomerField: (field: keyof CustomerDetails, value: string) => void;
  setDelivery: (delivery: Partial<DeliveryChoice>) => void;
  /** After a paid order: empty the cart and forget the checkout details. */
  resetAfterOrder: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const same = (item: CartItem, productId: string, mode: PurchaseMode) =>
  item.productId === productId && item.mode === mode;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      services: noServices,
      customer: emptyCustomer,
      delivery: noDelivery,
      isOpen: false,

      addItem: (productId, mode, quantity = 1) => {
        if (
          !getProduct(productId, mode) ||
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          quantity > 99
        )
          return;
        set((state) => {
          const existing = state.items.find((i) => same(i, productId, mode));
          if (existing) {
            return {
              items: state.items.map((i) =>
                same(i, productId, mode)
                  ? { ...i, quantity: Math.min(99, i.quantity + quantity) }
                  : i,
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
        if (!Number.isInteger(quantity) || quantity > 99) return;
        if (quantity <= 0) {
          get().removeItem(productId, mode);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            same(i, productId, mode) ? { ...i, quantity } : i,
          ),
        }));
      },

      setService: (service, enabled) =>
        set((state) => ({
          services: { ...state.services, [service]: enabled },
        })),
      setCustomerField: (field, value) =>
        set((state) => ({ customer: { ...state.customer, [field]: value } })),
      setDelivery: (delivery) =>
        set((state) => ({ delivery: { ...state.delivery, ...delivery } })),
      resetAfterOrder: () =>
        set({
          items: [],
          services: noServices,
          customer: emptyCustomer,
          delivery: noDelivery,
        }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "kaledu-dekoras-cart",
      partialize: (state) => ({
        items: state.items,
        services: state.services,
        customer: state.customer,
        delivery: state.delivery,
      }),
      // Rehydrated on mount by <CartHydration /> so server and client render the same markup.
      skipHydration: true,
    },
  ),
);

/** False on the server and until the saved cart has been loaded from this browser. */
export function useCartHydrated() {
  // <CartHydration /> normally loads the cart; this covers a store that was never loaded
  // (e.g. recreated by a dev hot reload), which would otherwise leave the page waiting forever.
  useEffect(() => {
    if (!useCartStore.persist.hasHydrated()) useCartStore.persist.rehydrate();
  }, []);
  return useSyncExternalStore(
    (onChange) => useCartStore.persist.onFinishHydration(onChange),
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}

export interface CartLine extends CartItem {
  product: Product;
  unitPrice: number;
}

export function resolveLines(items: CartItem[]): CartLine[] {
  return items.flatMap((item) => {
    const product = getProduct(item.productId, item.mode);
    if (
      !product ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99
    )
      return [];
    return [{ ...item, product, unitPrice: product.price }];
  });
}

export function cartTotals(lines: CartLine[]) {
  const order = buildOrder(lines, noServices);
  return { count: order.itemCount, total: order.productsTotal };
}
