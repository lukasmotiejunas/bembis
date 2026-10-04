export type PurchaseMode = "buy" | "rent";

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Ar ši lemputė parduodama, ar nuomojama */
  mode: PurchaseMode;
  /** Pirkimo kaina arba nuomos kaina visam sezonui, € */
  price: number;
  image: string;
  color: string;
  /** Girliandos ilgis metrais — pagal jį skaičiuojamas montavimas ir nuėmimas */
  meters: number;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
}

export interface CartItem {
  productId: string;
  mode: PurchaseMode;
  quantity: number;
}
