"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Plus, Edit3, Trash2, ExternalLink, Star, StarOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types";
import toast from "react-hot-toast";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setProjects(data);
    setLoading(false);
  }

  async function handleFeatureToggle(project: Project) {
    const { error } = await supabase
      .from("projects")
      .update({ is_featured: !project.is_featured })
      .eq("id", project.id);

    if (error) { toast.error("Failed to update."); return; }
    setProjects(prev =>
      prev.map(p => p.id === project.id ? { ...p, is_featured: !p.is_featured } : p)
    );
    toast.success(`${project.title} ${project.is_featured ? "removed from" : "added to"} homepage.`);
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast.error("Error deleting project: " + error.message); return; }
    setProjects(projects.filter((p) => p.id !== id));
    toast.success("Project deleted.");
  }

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
          <p className="text-body text-sm">Manage your portfolio. Star = shown on homepage.</p>
        </div>
        <Link href="/admin/projects/new">
          <Button variant="primary" size="md" className="gap-2">
            <Plus size={16} /> New Project
          </Button>
        </Link>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <GlassCard blur={false} padding="sm" hover={false}>
          {loading ? (
            <div className="p-8 text-center text-label">Loading projects...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="text-left text-label text-[10px] py-3 px-4">Title</th>
                    <th className="text-left text-label text-[10px] py-3 px-4 hidden md:table-cell">Category</th>
                    <th className="text-left text-label text-[10px] py-3 px-4 hidden lg:table-cell">Year</th>
                    <th className="text-left text-label text-[10px] py-3 px-4 hidden lg:table-cell">Order</th>
                    <th className="text-center text-label text-[10px] py-3 px-4">Featured</th>
                    <th className="text-right text-label text-[10px] py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-label opacity-40">
                        No projects found. Create your first one.
                      </td>
                    </tr>
                  ) : (
                    projects.map((project, i) => (
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
                          {project.client_name && (
                            <span className="text-[10px] text-[var(--text-bone-dim)] font-[family-name:var(--font-body)] block">
                              {project.client_name}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <span className="text-xs text-[var(--text-bone-muted)] font-[family-name:var(--font-body)] uppercase tracking-wider">
                            {project.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className="text-xs text-[var(--text-bone-muted)] font-[family-name:var(--font-body)]">
                            {project.year}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className="text-xs text-[var(--text-bone-muted)] font-[family-name:var(--font-body)]">
                            {project.display_order}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleFeatureToggle(project)}
                            title={project.is_featured ? "Remove from homepage" : "Add to homepage"}
                            className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors"
                          >
                            {project.is_featured ? (
                              <Star size={15} className="text-[var(--accent-teal-light)] fill-[var(--accent-teal-light)]" />
                            ) : (
                              <StarOff size={15} className="text-[var(--text-bone-dim)]" />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/work/${project.slug}`} target="_blank" className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors">
                              <ExternalLink size={14} className="text-[var(--text-bone-dim)]" />
                            </Link>
                            <Link href={`/admin/projects/${project.id}`} className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors">
                              <Edit3 size={14} className="text-[var(--text-bone-muted)]" />
                            </Link>
                            <button onClick={() => handleDelete(project.id, project.title)} className="p-1.5 rounded-lg hover:bg-red-400/10 transition-colors">
                              <Trash2 size={14} className="text-[var(--text-bone-dim)] hover:text-red-400" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
