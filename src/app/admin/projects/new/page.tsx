"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
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
        <h1 className="heading-section text-3xl">New Project</h1>
        <p className="text-body text-sm">Add a new creation to your portfolio.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ProjectForm />
      </motion.div>
    </div>
  );
}
