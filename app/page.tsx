import Hero from "@/components/sections/Hero";
import Offers from "@/components/sections/Offers";
import SeasonSteps from "@/components/sections/SeasonSteps";
import Showcase from "@/components/sections/Showcase";
import LightsSection from "@/components/sections/LightsSection";
import FAQ from "@/components/sections/FAQ";
import ContactSection from "@/components/sections/ContactSection";
import JsonLd from "@/components/JsonLd";
import { businessSchema, pageMetadata, websiteSchema } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: `Lauko kalėdinės lemputės, nuoma ir montavimas | ${site.name}`,
  absoluteTitle: true,
  description:
    "Lauko kalėdinės lemputės C9: šiltos baltos ir spalvotos girliandos. Peržiūrėkite katalogą. Montavimas ir nuoma Vilniuje bei Vilniaus apskrityje.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={[businessSchema(), websiteSchema()]} />
      <Hero />
      <Offers />
      <SeasonSteps />
      <Showcase />
      <LightsSection />
      <FAQ />
      <ContactSection />
    </>
  );
}
