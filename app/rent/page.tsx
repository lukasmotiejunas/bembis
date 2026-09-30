import type { Metadata } from "next";
import Catalog from "@/components/shop/Catalog";

export const metadata: Metadata = {
  title: "Kalėdinių lempučių nuoma",
  description: "Išsinuomokite kalėdines lemputes visam sezonui — be pirkimo ir sandėliavimo. Po švenčių jas pasiimame.",
};

export default function RentPage() {
  return <Catalog mode="rent" />;
}
