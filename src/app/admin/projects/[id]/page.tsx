"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProject() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      
      if (data) setProject(data);
      setLoading(false);
    }
    fetchProject();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-[var(--accent-teal)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl mb-4">Project not found</h2>
        <Link href="/admin/projects" className="text-[var(--accent-teal-light)] underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link 
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--text-bone-muted)] hover:text-[var(--text-bone)] transition-colors mb-4"
        >
          <ChevronLeft size={14} />
          Back to Projects
        </Link>
        <h1 className="heading-section text-3xl">Edit Project</h1>
        <p className="text-body text-sm">Update "{project.title}" details.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ProjectForm initialData={project} isEditing={true} />
      </motion.div>
    </div>
  );
}
