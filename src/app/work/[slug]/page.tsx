"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const demoData: Record<string, {
  title: string;
  category: string;
  client: string;
  year: number;
  services: string[];
  description: string;
  challenge: string;
  solution: string;
  color: string;
}> = {
  "meridian-financial": {
    title: "Meridian Financial",
    category: "Brand Identity",
    client: "Meridian Group",
    year: 2025,
    services: ["Brand Strategy", "Visual Identity", "Brand Guidelines"],
    description: "A comprehensive brand identity for a next-generation fintech platform transforming personal banking.",
    challenge: "Meridian needed to stand apart in a saturated fintech landscape dominated by sterile, corporate aesthetics. They required a brand that felt both trustworthy and innovative.",
    solution: "We crafted a visual system rooted in dynamic geometry and a refined teal-to-midnight palette — signaling precision without coldness. The identity extends across digital products, print collateral, and environmental design.",
    color: "#0D7377",
  },
  "apex-athletics": {
    title: "Apex Athletics",
    category: "Logo Design",
    client: "Apex Athletics Inc.",
    year: 2025,
    services: ["Logo Design", "Icon System", "Brand Guidelines"],
    description: "A dynamic logo system for a premium fitness brand that embodies peak performance.",
    challenge: "Create a mark that transcends typical fitness branding — something that speaks to discipline, precision, and aspiration.",
    solution: "The Apex mark uses intersecting angular forms to create a sense of ascent and momentum. The system includes responsive logos for app icons, merchandise, and environmental signage.",
    color: "#14B8A6",
  },
  "prism-gallery": {
    title: "Prism Gallery",
    category: "Web Development",
    client: "Prism Contemporary",
    year: 2024,
    services: ["UI/UX Design", "Full-stack Development", "CMS Integration"],
    description: "An immersive web platform for contemporary art curation and gallery management.",
    challenge: "Build a digital space that honors the art without competing with it — minimal yet feature-rich for collectors and curators.",
    solution: "We developed a Next.js platform with dynamic gallery views, GSAP scroll animations, and a headless CMS for seamless content management. The design uses negative space as a feature.",
    color: "#0D7377",
  },
  "volta-festival": {
    title: "Volta Festival",
    category: "Event Campaign",
    client: "Volta Events Ltd.",
    year: 2024,
    services: ["Creative Direction", "Campaign Design", "Digital Strategy"],
    description: "A multi-channel campaign for an electronic music festival that reached 2M+ impressions.",
    challenge: "Capture the energy of a live music experience in static and digital media across 8 platforms simultaneously.",
    solution: "We designed a living campaign system with generative visuals, AR filters, and responsive social templates — all governed by a strict but flexible design language.",
    color: "#14B8A6",
  },
};

export default function CaseStudyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = demoData[slug];

  if (!project) {
    return (
      <div className="pt-[var(--nav-height)] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-display text-4xl mb-4">Project Not Found</h1>
          <Link href="/work">
            <Button variant="outline">Back to Work</Button>
          </Link>
        </div>
      </div>
    );
  }

  const slugs = Object.keys(demoData);
  const currentIndex = slugs.indexOf(slug);
  const prevSlug = currentIndex > 0 ? slugs[currentIndex - 1] : null;
  const nextSlug = currentIndex < slugs.length - 1 ? slugs[currentIndex + 1] : null;

  return (
    <div className="pt-[var(--nav-height)]">
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${project.color}30, var(--bg-deep))`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] via-transparent to-transparent" />

        {/* Star watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <svg width="300" height="300" viewBox="0 0 100 100" fill="none">
            <path d="M50 10 L57 42 L90 50 L57 58 L50 90 L43 58 L10 50 L43 42 Z" fill="var(--text-bone)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-xs text-[var(--text-bone-muted)] hover:text-[var(--text-bone)] mb-6 transition-colors font-[family-name:var(--font-body)]"
            >
              <ArrowLeft size={14} /> Back to Work
            </Link>
            <span className="text-label block mb-3">{project.category}</span>
            <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl">
              {project.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Metadata */}
      <section className="section-padding pt-12 pb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-[var(--border-subtle)] pb-8"
          >
            <div>
              <span className="text-label text-[10px] block mb-1">Client</span>
              <span className="text-sm text-[var(--text-bone)] font-[family-name:var(--font-body)]">
                {project.client}
              </span>
            </div>
            <div>
              <span className="text-label text-[10px] block mb-1">Year</span>
              <span className="text-sm text-[var(--text-bone)] font-[family-name:var(--font-body)]">
                {project.year}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-label text-[10px] block mb-1">Services</span>
              <div className="flex flex-wrap gap-2">
                {project.services.map((s) => (
                  <span
                    key={s}
                    className="text-xs text-[var(--text-bone-muted)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full px-3 py-1 font-[family-name:var(--font-body)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding pt-8">
        <div className="max-w-3xl mx-auto space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="heading-section text-2xl mb-4">Overview</h2>
            <p className="text-body">{project.description}</p>
          </motion.div>

          {/* Image placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden"
          >
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${project.color}20, var(--bg-surface))`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                <path d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z" fill="var(--text-bone)" />
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-section text-2xl mb-4">The Challenge</h2>
            <p className="text-body">{project.challenge}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-section text-2xl mb-4">The Solution</h2>
            <p className="text-body">{project.solution}</p>
          </motion.div>
        </div>
      </section>

      {/* Navigation */}
      <section className="section-padding pt-8">
        <div className="max-w-7xl mx-auto flex justify-between border-t border-[var(--border-subtle)] pt-8">
          {prevSlug ? (
            <Link
              href={`/work/${prevSlug}`}
              className="flex items-center gap-2 text-sm text-[var(--text-bone-muted)] hover:text-[var(--text-bone)] transition-colors font-[family-name:var(--font-body)]"
            >
              <ArrowLeft size={16} /> Previous Project
            </Link>
          ) : (
            <div />
          )}
          {nextSlug ? (
            <Link
              href={`/work/${nextSlug}`}
              className="flex items-center gap-2 text-sm text-[var(--text-bone-muted)] hover:text-[var(--text-bone)] transition-colors font-[family-name:var(--font-body)]"
            >
              Next Project <ArrowRight size={16} />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </div>
  );
}
