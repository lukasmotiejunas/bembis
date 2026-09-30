import Hero from "@/components/home/Hero";
import VisualizerTeaser from "@/components/home/VisualizerTeaser";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import GalleryPreview from "@/components/home/GalleryPreview";
import TrustSection from "@/components/home/TrustSection";
import FAQ from "@/components/home/FAQ";

export default function HomePage() {
  return (
    <>
      <Hero />
      <VisualizerTeaser />
      <FeaturedProducts />
      <GalleryPreview />
      <TrustSection />
      <FAQ />
    </>
  );
}
