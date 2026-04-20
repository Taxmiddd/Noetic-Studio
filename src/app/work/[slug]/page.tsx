"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types";

export default function CaseStudyPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [prevProject, setPrevProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchProjectData() {
      setLoading(true);
      
      // 1. Fetch current project
      const { data: currentProject } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .single();
        
      if (!currentProject) {
        setProject(null);
        setLoading(false);
        return;
      }
      
      setProject(currentProject);
      
      // 2. Fetch all projects to find prev/next
      const { data: allProjects } = await supabase
        .from("projects")
        .select("id, slug, title, display_order")
        .order("display_order", { ascending: true });
        
      if (allProjects) {
        const currentIndex = allProjects.findIndex(p => p.slug === slug);
        if (currentIndex > 0) setPrevProject(allProjects[currentIndex - 1] as any);
        if (currentIndex < allProjects.length - 1) setNextProject(allProjects[currentIndex + 1] as any);
      }
      
      setLoading(false);
    }
    
    fetchProjectData();
  }, [slug, supabase]);

  if (loading) {
    return (
      <div className="pt-[var(--nav-height)] min-h-screen flex items-center justify-center">
        <div className="text-label animate-pulse">Loading project details...</div>
      </div>
    );
  }

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

  return (
    <div className="pt-[var(--nav-height)]">
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${project.thumbnail_url ? '#14B8A6' : '#0D7377'}30, var(--bg-deep))`,
          }}
        />
        {project.thumbnail_url && (
            <img 
                src={project.thumbnail_url} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
        )}
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
            <span className="text-label block mb-3 uppercase tracking-widest">{project.category}</span>
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
                {project.client_name || "Confidential"}
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
                {project.services?.map((s) => (
                  <span
                    key={s}
                    className="text-xs text-[var(--text-bone-muted)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full px-3 py-1 font-[family-name:var(--font-body)]"
                  >
                    {s}
                  </span>
                )) || <span className="text-xs text-[var(--text-bone-dim)]">Strategic Execution</span>}
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
            <p className="text-body whitespace-pre-line">{project.description}</p>
          </motion.div>

          {/* Project Images */}
          {project.images && project.images.length > 0 ? (
            <div className="space-y-8">
                {project.images.map((img, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-2xl overflow-hidden border border-[var(--border-glass)]"
                    >
                        <img src={img} alt={`${project.title} screenshot ${i+1}`} className="w-full h-auto object-cover" />
                    </motion.div>
                ))}
            </div>
          ) : project.thumbnail_url ? (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative rounded-2xl overflow-hidden"
            >
                <img src={project.thumbnail_url} className="w-full h-auto object-cover" alt={project.title} />
            </motion.div>          
          ) : (
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
                    background: `linear-gradient(180deg, rgba(20, 184, 166, 0.1), var(--bg-surface))`,
                }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                    <path d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z" fill="var(--text-bone)" />
                </svg>
                </div>
            </motion.div>
          )}

          {project.long_description && (
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="prose prose-invert max-w-none"
            >
                <h2 className="heading-section text-2xl mb-4">Detailed Breakdown</h2>
                <div className="text-body whitespace-pre-line text-lg">
                    {project.long_description}
                </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Navigation */}
      <section className="section-padding pt-8">
        <div className="max-w-7xl mx-auto flex justify-between border-t border-[var(--border-subtle)] pt-8">
          {prevProject ? (
            <Link
              href={`/work/${prevProject.slug}`}
              className="flex items-center gap-2 text-sm text-[var(--text-bone-muted)] hover:text-[var(--text-bone)] transition-colors font-[family-name:var(--font-body)] group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Previous: {prevProject.title}
            </Link>
          ) : (
            <div />
          )}
          {nextProject ? (
            <Link
              href={`/work/${nextProject.slug}`}
              className="flex items-center gap-2 text-sm text-[var(--text-bone-muted)] hover:text-[var(--text-bone)] transition-colors font-[family-name:var(--font-body)] group"
            >
              Next: {nextProject.title} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </div>
  );
}
