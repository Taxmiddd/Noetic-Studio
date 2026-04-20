"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Policy, PolicyType } from "@/types";
import toast from "react-hot-toast";

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PolicyType>("terms");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => { fetchPolicies(); }, []);

  async function fetchPolicies() {
    setLoading(true);
    const { data } = await supabase
      .from("policies")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (data) setPolicies(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("policies").delete().eq("id", id);
    if (error) { toast.error("Failed to delete policy."); return; }
    
    setPolicies(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
    toast.success("Policy clause removed.");
  }

  const filteredPolicies = policies.filter(p => p.type === activeTab);

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="heading-section text-2xl md:text-3xl mb-1">Legal Policies</h1>
          <p className="text-body text-sm">Manage the clauses required for Terms of Service and Privacy.</p>
        </div>
        <Link href={`/admin/policies/new?type=${activeTab}`}>
          <Button variant="primary" size="md" className="gap-2">
            <Plus size={16} /> Add Clause
          </Button>
        </Link>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6"
      >
        <button
          onClick={() => setActiveTab("terms")}
          className={`px-4 py-2 rounded-xl text-sm font-[family-name:var(--font-body)] transition-colors ${
            activeTab === "terms" 
              ? "bg-[var(--accent-teal)]/10 text-[var(--accent-teal-light)] border border-[var(--border-accent)]" 
              : "text-[var(--text-bone-muted)] hover:text-[var(--text-bone)] hover:bg-[var(--bg-surface)]"
          }`}
        >
          Terms of Service
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          className={`px-4 py-2 rounded-xl text-sm font-[family-name:var(--font-body)] transition-colors ${
            activeTab === "privacy" 
              ? "bg-[var(--accent-teal)]/10 text-[var(--accent-teal-light)] border border-[var(--border-accent)]" 
              : "text-[var(--text-bone-muted)] hover:text-[var(--text-bone)] hover:bg-[var(--bg-surface)]"
          }`}
        >
          Privacy Policy
        </button>
      </motion.div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl"
            >
              <h3 className="heading-section text-lg mb-2">Remove Clause?</h3>
              <p className="text-body text-sm mb-6">This will immediately remove it from the public page.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm hover:bg-red-500/20 transition-colors">Delete</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-[var(--bg-elevated)] text-[var(--text-bone-muted)] rounded-xl text-sm hover:text-[var(--text-bone)] transition-colors">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard padding="sm" hover={false}>
          {loading ? (
            <div className="p-8 text-center text-label">Loading policies...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="text-left text-label text-[10px] py-3 px-4">Title</th>
                    <th className="text-left text-label text-[10px] py-3 px-4 max-w-[300px]">Content Snapshot</th>
                    <th className="text-left text-label text-[10px] py-3 px-4">Order</th>
                    <th className="text-right text-label text-[10px] py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPolicies.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-label opacity-40">No clauses for this policy.</td>
                    </tr>
                  ) : (
                    filteredPolicies.map((policy, i) => (
                      <motion.tr
                        key={policy.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-surface)]/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="text-sm text-[var(--text-bone)] font-[family-name:var(--font-body)] font-medium">
                            {policy.title}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-[300px]">
                          <span className="text-xs text-[var(--text-bone-dim)] truncate block">
                            {policy.content.substring(0, 60)}...
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-[var(--text-bone-muted)]">{policy.display_order}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/policies/${policy.id}`} className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors">
                              <Edit3 size={14} className="text-[var(--text-bone-muted)]" />
                            </Link>
                            <button onClick={() => setDeleteConfirm(policy.id)} className="p-1.5 rounded-lg hover:bg-red-400/10 transition-colors">
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
