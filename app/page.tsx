import Hero from "@/components/sections/Hero";
import Showcase from "@/components/sections/Showcase";
import FAQ from "@/components/sections/FAQ";
import ContactSection from "@/components/sections/ContactSection";
import ServicesOverview from "@/components/sections/ServicesOverview";
import JsonLd from "@/components/JsonLd";
import { businessSchema, installationServiceSchema, pageMetadata, websiteSchema } from "@/lib/seo";
import { site } from "@/lib/site";
import { getSiteTheme } from "@/lib/themeStore";

const meta = {
  christmas: {
    // This exact title already ranks for "kalėdinių lempučių montavimas" — keep it; the "girliandų" wording
    // lives in the description and the service cards below.
    title: `Kalėdinių lempučių montavimas ir nuoma Vilniuje | ${site.name}`,
    description:
      "Kalėdinių girliandų ir lempučių montavimas: atvykstame, pakabiname ant namo, po sezono nuimame. XP ir LLinks lauko LED pardavimas bei nuoma Vilniuje ir Vilniaus apskrityje.",
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
      <ServicesOverview />
      <Showcase />
      <FAQ />
      {/* The Christmas hero already holds the inquiry form. */}
      {theme === "halloween" && <ContactSection />}
    </>
  );
}
