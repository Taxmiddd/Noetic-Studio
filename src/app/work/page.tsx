"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight } from "lucide-react";

const categories = [
  { label: "All", value: "all" },
  { label: "Logo", value: "logo" },
  { label: "Brand", value: "brand" },
  { label: "Web", value: "web" },
  { label: "Campaign", value: "campaign" },
  { label: "UI/UX", value: "uiux" },
];

const demoProjects = [
  {
    title: "Meridian Financial",
    category: "brand",
    slug: "meridian-financial",
    year: 2025,
    description: "Complete brand identity for a next-gen fintech platform.",
    color: "#0D7377",
  },
  {
    title: "Apex Athletics",
    category: "logo",
    slug: "apex-athletics",
    year: 2025,
    description: "Dynamic logo system for a premium fitness brand.",
    color: "#14B8A6",
  },
  {
    title: "Prism Gallery",
    category: "web",
    slug: "prism-gallery",
    year: 2024,
    description: "Immersive web platform for contemporary art curation.",
    color: "#0D7377",
  },
  {
    title: "Volta Festival",
    category: "campaign",
    slug: "volta-festival",
    year: 2024,
    description: "Multi-channel event campaign for an electronic music festival.",
    color: "#14B8A6",
  },
  {
    title: "Zenith Labs",
    category: "uiux",
    slug: "zenith-labs",
    year: 2024,
    description: "Enterprise SaaS dashboard redesign with data-rich interfaces.",
    color: "#0D7377",
  },
  {
    title: "Aether Wellness",
    category: "brand",
    slug: "aether-wellness",
    year: 2024,
    description: "Holistic brand system for a luxury wellness retreat.",
    color: "#14B8A6",
  },
];

export default function WorkPage() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div className="pt-[var(--nav-height)]">
      {/* Header */}
      <section className="section-padding pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-label mb-4 block">Portfolio</span>
            <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-4">
              Our <span className="gradient-text">Work</span>
            </h1>
            <p className="text-body max-w-xl">
              A selection of projects that showcase our creative intelligence across disciplines.
            </p>
          </motion.div>

          {/* Category filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            {categories.map((cat) => (
              <button
                key={cat.value}
                className="px-4 py-2 text-xs font-[family-name:var(--font-body)] tracking-wide rounded-full border border-[var(--border-glass)] text-[var(--text-bone-muted)] hover:border-[var(--border-accent)] hover:text-[var(--accent-teal-light)] transition-all duration-300 first:bg-[var(--bg-glass)] first:border-[var(--border-accent)] first:text-[var(--accent-teal-light)]"
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding pt-0">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {demoProjects.map((project) => (
            <motion.div key={project.slug} variants={fadeInUp}>
              <Link href={`/work/${project.slug}`} className="block group">
                <GlassCard padding="sm" className="overflow-hidden">
                  {/* Thumbnail area */}
                  <div className="relative h-[220px] rounded-xl overflow-hidden mb-4">
                    <div
                      className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${project.color}40, var(--bg-surface))`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                      <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                        <path d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z" fill="var(--text-bone)" />
                      </svg>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="px-2 pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-label text-[10px]">{project.category}</span>
                      <span className="text-xs text-[var(--text-bone-dim)] font-[family-name:var(--font-body)]">
                        {project.year}
                      </span>
                    </div>
                    <h3 className="heading-section text-lg group-hover:text-[var(--accent-teal-light)] transition-colors mb-1">
                      {project.title}
                    </h3>
                    <p className="text-body text-xs">{project.description}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-[var(--accent-teal-light)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View Case Study <ArrowRight size={12} />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
