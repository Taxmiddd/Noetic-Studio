import dynamic from "next/dynamic";
import { HeroSection } from "@/components/hero/HeroSection";

const ServicesGrid = dynamic(() => import("@/components/sections/ServicesGrid").then(mod => mod.ServicesGrid));
const PhilosophySection = dynamic(() => import("@/components/sections/PhilosophySection").then(mod => mod.PhilosophySection));
const WorkShowcase = dynamic(() => import("@/components/sections/WorkShowcase").then(mod => mod.WorkShowcase));
const PartnersSection = dynamic(() => import("@/components/sections/PartnersSection").then(mod => mod.PartnersSection));
const ContactCTA = dynamic(() => import("@/components/sections/ContactCTA").then(mod => mod.ContactCTA));

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
