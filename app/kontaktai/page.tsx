import { Garland } from "@/components/Lights";
import JsonLd from "@/components/JsonLd";
import ContactSection from "@/components/sections/ContactSection";
import FAQ from "@/components/sections/FAQ";
import { businessSchema, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Kontaktai — kalėdinių lempučių montavimas ir nuoma",
  description: `Skambinkite ${site.phone} arba rašykite ${site.email} — dirbame visada. Padėsime išsirinkti kalėdines lemputes ir pasakysime montavimo kainą.`,
  path: "/kontaktai",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={businessSchema()} />
      <div className="bg-cream">
        <Garland id="contact-garland" />
      </div>
      <ContactSection titleAs="h1" />
      <FAQ />
    </>
  );
}
