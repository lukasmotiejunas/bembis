import type { Metadata } from "next";
import Catalog from "@/components/shop/Catalog";

export const metadata: Metadata = {
  title: "Pirkti kalėdines lemputes",
  description: "Kokybiškos lauko LED kalėdinės lemputės. Pirkite arba išsinuomokite sezonui — sumontuosime ir po švenčių nuimsime.",
};

export default function ShopPage() {
  return <Catalog mode="buy" />;
}
