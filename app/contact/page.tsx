import type { Metadata } from "next";
import { Garland } from "@/components/Lights";
import ContactSection from "@/components/sections/ContactSection";
import FAQ from "@/components/sections/FAQ";

export const metadata: Metadata = {
  title: "Kontaktai",
  description: "Paskambinkite, parašykite arba palikite užklausą — padėsime išsirinkti kalėdines lemputes ir pasakysime montavimo kainą.",
};

export default function ContactPage() {
  return (
    <>
      <div className="bg-cream">
        <Garland id="contact-garland" />
      </div>
      <ContactSection titleAs="h1" />
      <FAQ />
    </>
  );
}
