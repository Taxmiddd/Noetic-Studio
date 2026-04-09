"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { ArrowRight } from "lucide-react";

// Demo placeholder projects
const featuredProjects = [
  {
    title: "Meridian Financial",
    category: "Brand Identity",
    slug: "meridian-financial",
    color: "#0D7377",
  },
  {
    title: "Apex Athletics",
    category: "Logo Design",
    slug: "apex-athletics",
    color: "#14B8A6",
  },
  {
    title: "Prism Gallery",
    category: "Web Development",
    slug: "prism-gallery",
    color: "#0D7377",
  },
  {
    title: "Volta Festival",
    category: "Event Campaign",
    slug: "volta-festival",
    color: "#14B8A6",
  },
];

export function WorkShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding" id="work-preview">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
        >
          <div>
            <span className="text-label mb-4 block">Selected Work</span>
            <h2 className="heading-section text-3xl md:text-4xl lg:text-5xl">
              Case Studies
            </h2>
          </div>
          <Link
            href="/work"
            className="group flex items-center gap-2 text-sm text-[var(--accent-teal-light)] font-[family-name:var(--font-body)] hover:gap-3 transition-all duration-300"
          >
            View All Projects
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Asymmetric Grid */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {featuredProjects.map((project, i) => (
            <motion.div
              key={project.slug}
              variants={fadeInUp}
              className={i === 0 ? "md:row-span-2" : ""}
            >
              <Link href={`/work/${project.slug}`} className="block group">
                <div
                  className={`relative overflow-hidden rounded-2xl ${
                    i === 0 ? "h-[400px] md:h-full" : "h-[250px] md:h-[280px]"
                  }`}
                >
                  {/* Gradient background as thumbnail placeholder */}
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${project.color}33, var(--bg-surface))`,
                    }}
                  />

                  {/* Logo watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none p-12">
                    <img 
                      src="/logo5.svg" 
                      alt="Watermark" 
                      className="w-full h-full object-contain grayscale invert" 
                    />
                  </div>

                  {/* Content overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)]/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-label text-xs">{project.category}</span>
                    <h3 className="heading-section text-xl md:text-2xl mt-2 group-hover:text-[var(--accent-teal-light)] transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  {/* Hover border */}
                  <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[var(--border-accent)] transition-colors duration-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
