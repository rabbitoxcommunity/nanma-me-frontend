import PageTransition from "../components/layout/PageTransition";
import SEO from "../components/ui/SEO";
import HeroSlider from "../components/sections/HeroSlider";
import FeaturedProjects from "../components/sections/FeaturedProjects";
import CompanyOverview from "../components/sections/CompanyOverview";
import ServicesSection from "../components/sections/ServicesSection";
import AmenitiesSection from "../components/sections/AmenitiesSection";
import Counters from "../components/sections/Counters";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import GalleryPreview from "../components/sections/GalleryPreview";
import CTABanner from "../components/sections/CTABanner";
import ContactPreview from "../components/sections/ContactPreview";

export default function Home() {
  return (
    <PageTransition>
      <SEO
        title="Nanma By Meeran — Crafted Living. Built to Endure."
        description="Limited-edition luxury residential projects across India. Bespoke villas, sky homes, and architectural landmarks by Nanma By Meeran."
        url="https://nanmaconstruct.com/"
      />
      <HeroSlider />
      <FeaturedProjects />
      <CompanyOverview />
      <ServicesSection />
      <AmenitiesSection />
      <Counters />
      <TestimonialsSection />
      <GalleryPreview />
      <CTABanner />
      <ContactPreview />
    </PageTransition>
  );
}
