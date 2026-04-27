"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Plus, Edit3, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Service } from "@/types";
import toast from "react-hot-toast";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => { fetchServices(); }, []);

  async function fetchServices() {
    setLoading(true);
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setServices(data);
    setLoading(false);
  }

  async function handleToggleActive(service: Service) {
    const { error } = await supabase
      .from("services")
      .update({ is_active: !service.is_active })
      .eq("id", service.id);

    if (error) { toast.error("Failed to update."); return; }
    setServices(prev =>
      prev.map(s => s.id === service.id ? { ...s, is_active: !s.is_active } : s)
    );
    toast.success(`${service.title} ${service.is_active ? "hidden" : "shown"}.`);
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) { toast.error("Failed to delete."); return; }
    setServices(prev => prev.filter(s => s.id !== id));
    toast.success("Service deleted.");
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="heading-section text-2xl md:text-3xl mb-1">Services</h1>
          <p className="text-body text-sm">Manage what appears on the /services page.</p>
        </div>
        <Link href="/admin/services/new">
          <Button variant="primary" size="md" className="gap-2">
            <Plus size={16} /> New Service
          </Button>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard blur={false} padding="sm" hover={false}>
          {loading ? (
            <div className="p-8 text-center text-label">Loading services...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="text-left text-label text-[10px] py-3 px-4">Title</th>
                    <th className="text-left text-label text-[10px] py-3 px-4">Icon</th>
                    <th className="text-left text-label text-[10px] py-3 px-4">Order</th>
                    <th className="text-left text-label text-[10px] py-3 px-4">Status</th>
                    <th className="text-right text-label text-[10px] py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-label opacity-40">
                        No services yet. Create your first one.
                      </td>
                    </tr>
                  ) : (
                    services.map((svc, i) => (
                      <motion.tr
                        key={svc.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-surface)]/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className={`text-sm font-[family-name:var(--font-body)] font-medium ${svc.is_active ? "text-[var(--text-bone)]" : "text-[var(--text-bone-dim)]"}`}>
                            {svc.title}
                          </span>
                          <p className="text-[11px] text-[var(--text-bone-dim)] font-[family-name:var(--font-body)] truncate max-w-xs">
                            {svc.short_description}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-[var(--text-bone-muted)] font-mono">{svc.icon_name}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-[var(--text-bone-muted)]">{svc.display_order}</span>
                        </td>
                        <td className="py-3 px-4">
                          <button onClick={() => handleToggleActive(svc)} className="flex items-center gap-1.5">
                            {svc.is_active ? (
                              <><ToggleRight size={16} className="text-[var(--accent-teal-light)]" /><span className="text-xs text-[var(--accent-teal-light)]">Active</span></>
                            ) : (
                              <><ToggleLeft size={16} className="text-[var(--text-bone-dim)]" /><span className="text-xs text-[var(--text-bone-dim)]">Hidden</span></>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/services/${svc.id}`} className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors">
                              <Edit3 size={14} className="text-[var(--text-bone-muted)]" />
                            </Link>
                            <button onClick={() => handleDelete(svc.id, svc.title)} className="p-1.5 rounded-lg hover:bg-red-400/10 transition-colors">
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
