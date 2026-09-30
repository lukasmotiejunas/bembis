import { getProductBySlug, products } from "@/lib/data/products";
import { notFound } from "next/navigation";
import { Product } from "@/lib/types";
import ProductClient from "./ProductClient";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return notFound();
  return <ProductClient product={product} />;
}
