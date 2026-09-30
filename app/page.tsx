import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/data/products";
import Hero from "@/components/sections/Hero";
import Offers from "@/components/sections/Offers";
import SeasonSteps from "@/components/sections/SeasonSteps";
import Showcase from "@/components/sections/Showcase";
import FAQ from "@/components/sections/FAQ";
import ContactSection from "@/components/sections/ContactSection";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/shop/ProductCard";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Offers />
      <SeasonSteps />
      <Showcase />

      <section className="container-page py-20 sm:py-28">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Lemputės"
            title="Išsirinkite savo šviesą"
            text="Kiekvieną lemputę galite pirkti arba išsinuomoti sezonui."
          />
          <Link href="/shop" className="btn btn-outline shrink-0">
            Visos lemputės
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <FAQ />
      <ContactSection />
    </>
  );
}
