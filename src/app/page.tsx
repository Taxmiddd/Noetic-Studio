import { HeroSection } from "@/components/hero/HeroSection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { PhilosophyBand } from "@/components/sections/PhilosophyBand";
import { WorkShowcase } from "@/components/sections/WorkShowcase";
import { PartnersMarquee } from "@/components/sections/PartnersMarquee";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesGrid />
      <PhilosophyBand />
      <WorkShowcase />
      <PartnersMarquee />
      <ContactCTA />
    </>
  );
}
