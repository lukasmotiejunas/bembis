import Hero from "@/components/sections/Hero";
import Showcase from "@/components/sections/Showcase";
import FAQ from "@/components/sections/FAQ";
import ContactSection from "@/components/sections/ContactSection";
import JsonLd from "@/components/JsonLd";
import { businessSchema, installationServiceSchema, pageMetadata, websiteSchema } from "@/lib/seo";
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

export default async function HomePage() {
  const theme = await getSiteTheme();
  return (
    <>
      <JsonLd data={[businessSchema(), websiteSchema(), installationServiceSchema()]} />
      <Hero />
      <Showcase />
      <FAQ />
      {/* The Christmas hero already holds the inquiry form. */}
      {theme === "halloween" && <ContactSection />}
    </>
  );
}
