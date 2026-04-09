"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { Plus, Edit3, Trash2, ExternalLink } from "lucide-react";

const demoProjects = [
  { id: "1", title: "Meridian Financial", category: "Brand Identity", year: 2025, status: "Published", slug: "meridian-financial" },
  { id: "2", title: "Apex Athletics", category: "Logo Design", year: 2025, status: "Published", slug: "apex-athletics" },
  { id: "3", title: "Prism Gallery", category: "Web Development", year: 2024, status: "Published", slug: "prism-gallery" },
  { id: "4", title: "Volta Festival", category: "Event Campaign", year: 2024, status: "Published", slug: "volta-festival" },
  { id: "5", title: "Zenith Labs", category: "UI/UX Design", year: 2024, status: "Draft", slug: "zenith-labs" },
  { id: "6", title: "Aether Wellness", category: "Brand Identity", year: 2024, status: "Published", slug: "aether-wellness" },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState(demoProjects);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="heading-section text-2xl md:text-3xl mb-1">Projects</h1>
          <p className="text-body text-sm">Manage your portfolio.</p>
        </div>
        <Button variant="primary" size="md" className="gap-2">
          <Plus size={16} />
          New Project
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <GlassCard padding="sm" hover={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  <th className="text-left text-label text-[10px] py-3 px-4">Title</th>
                  <th className="text-left text-label text-[10px] py-3 px-4 hidden md:table-cell">Category</th>
                  <th className="text-left text-label text-[10px] py-3 px-4 hidden md:table-cell">Year</th>
                  <th className="text-left text-label text-[10px] py-3 px-4">Status</th>
                  <th className="text-right text-label text-[10px] py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, i) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-surface)]/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm text-[var(--text-bone)] font-[family-name:var(--font-body)] font-medium">
                        {project.title}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-xs text-[var(--text-bone-muted)] font-[family-name:var(--font-body)]">
                        {project.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-xs text-[var(--text-bone-muted)] font-[family-name:var(--font-body)]">
                        {project.year}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-[family-name:var(--font-body)] px-2.5 py-1 rounded-full ${
                          project.status === "Published"
                            ? "bg-[var(--accent-teal)]/10 text-[var(--accent-teal-light)] border border-[var(--border-accent)]"
                            : "bg-[var(--bg-surface)] text-[var(--text-bone-dim)] border border-[var(--border-subtle)]"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/work/${project.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors"
                        >
                          <ExternalLink size={14} className="text-[var(--text-bone-dim)]" />
                        </Link>
                        <button className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors">
                          <Edit3 size={14} className="text-[var(--text-bone-muted)]" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-1.5 rounded-lg hover:bg-red-400/10 transition-colors"
                        >
                          <Trash2 size={14} className="text-[var(--text-bone-dim)] hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
