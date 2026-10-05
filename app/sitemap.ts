import type { MetadataRoute } from "next";
import { productHref, products } from "@/lib/data/products";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "weekly") => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1),
    page("/montavimas", 0.9),
    page("/nuoma", 0.9),
    page("/kaledines-lemputes", 0.9),
    ...products.map((p) => page(productHref(p), 0.8)),
    page("/kontaktai", 0.6, "monthly"),
  ];
}
