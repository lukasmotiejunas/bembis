import Hero from "@/components/sections/Hero";
import Offers from "@/components/sections/Offers";
import SeasonSteps from "@/components/sections/SeasonSteps";
import Showcase from "@/components/sections/Showcase";
import LightsSection from "@/components/sections/LightsSection";
import FAQ from "@/components/sections/FAQ";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
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
