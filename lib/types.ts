export type PurchaseMode = "buy" | "rent";

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Pirkimo kaina, € */
  price: number;
  /** Nuomos kaina visam sezonui, € */
  rentPrice: number;
  image: string;
  color: string;
  length: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  badge?: string;
}

export interface CartItem {
  productId: string;
  mode: PurchaseMode;
  quantity: number;
}
