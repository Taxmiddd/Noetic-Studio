import { HeroSection } from "@/components/hero/HeroSection";
import dynamic from "next/dynamic";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Project } from "@/types";

const ServicesGrid = dynamic(() => import("@/components/sections/ServicesGrid").then(mod => mod.ServicesGrid));
const PhilosophySection = dynamic(() => import("@/components/sections/PhilosophySection").then(mod => mod.PhilosophySection));
const WorkShowcase = dynamic(() => import("@/components/sections/WorkShowcase").then(mod => mod.WorkShowcase));
const PartnersSection = dynamic(() => import("@/components/sections/PartnersSection").then(mod => mod.PartnersSection));
const ContactCTA = dynamic(() => import("@/components/sections/ContactCTA").then(mod => mod.ContactCTA));

interface Partner {
  id: string;
  name: string;
}

export default async function HomePage() {
  let projects: Project[] = [];
  let partners: Partner[] = [];

  try {
    const supabase = createAdminClient();
    const [projectsResult, partnersResult] = await Promise.all([
      supabase
        .from("projects")
        .select("*")
        .eq("is_featured", true)
        .order("display_order", { ascending: true })
        .limit(4),
      supabase
        .from("partners")
        .select("id, name")
        .eq("is_active", true)
        .order("display_order", { ascending: true }),
    ]);
    projects = projectsResult.data ?? [];
    partners = partnersResult.data ?? [];
  } catch {
    // Components handle their own fallbacks
  }

  return (
    <>
      <HeroSection />
      <ServicesGrid />
      <PhilosophySection />
      <WorkShowcase initialProjects={projects} />
      <PartnersSection initialPartners={partners} />
      <ContactCTA />
    </>
  );
}
