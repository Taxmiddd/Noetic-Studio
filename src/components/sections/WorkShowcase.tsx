"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types";

const demoBackups: Partial<Project>[] = [
  {
    id: "1",
    title: "Meridian Financial",
    category: "brand" as any,
    slug: "meridian-financial",
    thumbnail_url: "",
  },
  {
    id: "2",
    title: "Apex Athletics",
    category: "logo" as any,
    slug: "apex-athletics",
    thumbnail_url: "",
  },
  {
    id: "3",
    title: "Prism Gallery",
    category: "web" as any,
    slug: "prism-gallery",
    thumbnail_url: "",
  },
  {
    id: "4",
    title: "Volta Festival",
    category: "campaign" as any,
    slug: "volta-festival",
    thumbnail_url: "",
  },
];

export function WorkShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .eq("is_featured", true)
          .order("display_order", { ascending: true })
          .limit(4);
        
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(demoBackups as Project[]);
        }
      } catch (err) {
        setProjects(demoBackups as Project[]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [supabase]);

  if (loading) return null;

  return (
    <section className="section-padding relative z-10" id="work-preview">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-10%" }}
           transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
           className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
        >
          <div className="max-w-2xl">
            <span className="text-label mb-6 block">Selected Projects</span>
            <h2 className="heading-section text-4xl md:text-5xl lg:text-7xl leading-[0.95] tracking-tighter">
              Case Studies
            </h2>
          </div>
          <Link
            href="/work"
            className="group flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--accent-teal-light)] hover:text-white transition-all duration-500"
          >
            All Work
            <div className="w-12 h-[1px] bg-[var(--accent-teal-light)] group-hover:w-16 group-hover:bg-white transition-all duration-500" />
          </Link>
        </motion.div>

        {/* Asymmetric Premium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {projects.map((project, i) => {
            const isLarge = i === 0;
            const gridClass = isLarge 
              ? "md:col-span-12 lg:col-span-8 md:h-[600px]" 
              : i === 1 
                ? "md:col-span-6 lg:col-span-4 md:h-[450px] lg:h-[600px]"
                : "md:col-span-6 lg:col-span-6 md:h-[450px]";

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={gridClass}
              >
                <Link href={`/work/${project.slug}`} className="group relative block h-full w-full overflow-hidden rounded-2xl bg-[var(--bg-surface)]">
                  {/* Background Layer (Matte Teal Fallback) */}
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-surface)]">
                      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,var(--accent-teal-light)_1px,transparent_1px)] [background-size:24px_24px]" />
                    </div>
                  )}

                  {/* Brand Watermark (Sophisticated opacity) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-1000 pointer-events-none p-24">
                    <img src="/logo5.svg" alt="" className="w-full h-full object-contain grayscale invert" />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pt-32" />

                  {/* Content Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 transition-transform duration-700 group-hover:-translate-y-2">
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[var(--accent-teal-light)] font-medium mb-3 block">
                      {project.category}
                    </span>
                    <h3 className="heading-section text-2xl md:text-3xl lg:text-4xl !text-white leading-snug max-w-2xl group-hover:text-[var(--accent-teal-light)] transition-colors duration-500">
                      {project.title}
                    </h3>
                  </div>

                  {/* Reveal Indicator */}
                  <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-4 group-hover:translate-x-0">
                    <ArrowRight className="text-white" size={28} />
                  </div>

                  {/* Glass Border */}
                  <div className="absolute inset-0 border border-white/5 group-hover:border-teal-500/20 transition-colors duration-700 rounded-2xl" />
                  
                  {/* Subtle Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(circle_at_bottom_right,var(--accent-teal-glow),transparent_60%)]" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
