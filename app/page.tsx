import Hero from "@/components/sections/Hero";
import Offers from "@/components/sections/Offers";
import SeasonSteps from "@/components/sections/SeasonSteps";
import Showcase from "@/components/sections/Showcase";
import LightsSection from "@/components/sections/LightsSection";
import FAQ from "@/components/sections/FAQ";
import ContactSection from "@/components/sections/ContactSection";
import JsonLd from "@/components/JsonLd";
import { faqs } from "@/lib/data/services";
import { businessSchema, faqSchema, pageMetadata, websiteSchema } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: `Kalėdinių lempučių montavimas ir nuoma Vilniuje | ${site.name}`,
  absoluteTitle: true,
  description:
    "Kalėdinių lempučių montavimas, nuoma ir pardavimas Vilniuje ir apskrityje. Atvažiuojame, papuošiame namus, po švenčių nuimame. 2 metų garantija.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={[businessSchema(), websiteSchema(), faqSchema(faqs)]} />
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
