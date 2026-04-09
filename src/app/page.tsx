import { HeroSection } from "@/components/hero/HeroSection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { WorkShowcase } from "@/components/sections/WorkShowcase";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesGrid />
      <PhilosophySection />
      <WorkShowcase />
      <PartnersSection />
      <ContactCTA />
    </>
  );
}
