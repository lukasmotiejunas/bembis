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
import { getSiteTheme } from "@/lib/themeStore";

const meta = {
  christmas: {
    title: `Kalėdinių lempučių montavimas ir nuoma Vilniuje | ${site.name}`,
    description:
      "Atvykstame, papuošiame ir sumontuojame kalėdines lemputes, po sezono nuimame. XP ir LLinks lauko LED pardavimas bei nuoma. Vilnius ir Vilniaus apskritis.",
  },
  halloween: {
    title: `Helovyno apšvietimo montavimas ir nuoma Vilniuje | ${site.name}`,
    description:
      "Šiurpiai gražus Helovyno apšvietimas: atvykstame, papuošiame ir sumontuojame lauko LED lemputes, po sezono nuimame. XP ir LLinks pardavimas bei nuoma. Vilnius ir Vilniaus apskritis.",
  },
};

export async function generateMetadata() {
  return pageMetadata({ ...meta[await getSiteTheme()], absoluteTitle: true, path: "/" });
}

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
