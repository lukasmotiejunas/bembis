import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { halloweenProducts } from "@/lib/data/halloweenProducts";
import { getSiteTheme } from "@/lib/themeStore";
import ProductFeatureCard from "../shop/ProductFeatureCard";
import SectionHeading from "../ui/SectionHeading";

export default async function HalloweenProductsSection() {
  if (await getSiteTheme() !== "halloween") return null;
  const featured = ["vorai", "moliugai", "vaiduokliai"].flatMap((category) => halloweenProducts.find((p) => p.decorationCategory === category) ?? []);
  if (!featured.length) return null;
  return (
    <section className="container-page py-16 sm:py-24">
      <SectionHeading eyebrow="Helovyno dekoracijų pardavimas" title="Papuoškite savo Helovyno namus" text="Vorai, vaiduokliai, moliūgai ir dekoracijų rinkiniai. Pristatome per 4 dienas visoje Lietuvoje." />
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{featured.map((p) => <ProductFeatureCard key={p.id} product={p} />)}</div>
      <Link href="/kaledines-lemputes#katalogas" className="btn btn-primary mt-8">Visos prekės<ArrowRight className="size-4" aria-hidden="true" /></Link>
    </section>
  );
}
