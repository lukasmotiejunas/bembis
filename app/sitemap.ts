import type { MetadataRoute } from "next";
import { productHref, products } from "@/lib/data/products";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string) => ({
    url: absoluteUrl(path),
  });

  return [
    page("/"),
    page("/montavimas"),
    page("/nuoma"),
    page("/kaledines-lemputes"),
    ...products.map((p) => ({ ...page(productHref(p)), images: [absoluteUrl(p.image)] })),
    page("/kontaktai"),
  ];
}
