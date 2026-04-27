"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Plus, Edit3, Trash2, X, ToggleLeft, ToggleRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface Partner {
  id: string;
  name: string;
  display_order: number;
  is_active: boolean;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formName, setFormName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => { fetchPartners(); }, []);

  async function fetchPartners() {
    setLoading(true);
    const { data } = await supabase
      .from("partners")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setPartners(data);
    setLoading(false);
  }

  function openAdd() {
    setEditingPartner(null);
    setFormName("");
    setShowModal(true);
  }

  function openEdit(p: Partner) {
    setEditingPartner(p);
    setFormName(p.name);
    setShowModal(true);
  }

  async function handleSave() {
    if (!formName.trim()) return;
    const toastId = toast.loading(editingPartner ? "Updating..." : "Adding...");

    if (editingPartner) {
      const { error } = await supabase
        .from("partners")
        .update({ name: formName.trim() })
        .eq("id", editingPartner.id);
      if (error) { toast.error("Failed to update partner.", { id: toastId }); return; }
      toast.success("Partner updated.", { id: toastId });
    } else {
      const { error } = await supabase
        .from("partners")
        .insert([{ name: formName.trim(), display_order: partners.length + 1, is_active: true }]);
      if (error) { toast.error("Failed to add partner.", { id: toastId }); return; }
      toast.success("Partner added.", { id: toastId });
    }

    setShowModal(false);
    fetchPartners();
  }

  async function handleToggleActive(p: Partner) {
    const { error } = await supabase
      .from("partners")
      .update({ is_active: !p.is_active })
      .eq("id", p.id);

    if (error) { toast.error("Failed to update."); return; }
    setPartners(prev => prev.map(partner =>
      partner.id === p.id ? { ...partner, is_active: !partner.is_active } : partner
    ));
    toast.success(`${p.name} ${p.is_active ? "hidden" : "shown"} in marquee.`);
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("partners").delete().eq("id", id);
    if (error) { toast.error("Failed to delete partner."); return; }
    setPartners(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
    toast.success("Partner removed.");
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="heading-section text-2xl md:text-3xl mb-1">Partners</h1>
          <p className="text-body text-sm">Manage the "Trusted By" marquee on the homepage.</p>
        </div>
        <Button onClick={openAdd} variant="primary" size="md" className="gap-2">
          <Plus size={16} /> Add Partner
        </Button>
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="heading-section text-lg">
                  {editingPartner ? "Edit Partner" : "Add Partner"}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-1 hover:text-[var(--text-bone)] text-[var(--text-bone-dim)] transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-label text-[10px] mb-2">Partner / Client Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  autoFocus
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-bone)] focus:border-[var(--border-accent)] outline-none transition-colors"
                  placeholder="e.g. Taj Water"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSave} variant="primary" className="flex-1">
                  {editingPartner ? "Save Changes" : "Add Partner"}
                </Button>
                <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <h3 className="heading-section text-lg mb-2">Remove Partner?</h3>
              <p className="text-body text-sm mb-6">This will remove them from the homepage marquee.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm hover:bg-red-500/20 transition-colors">Delete</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-[var(--bg-elevated)] text-[var(--text-bone-muted)] rounded-xl text-sm hover:text-[var(--text-bone)] transition-colors">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Partners Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard blur={false} padding="sm" hover={false}>
          {loading ? (
            <div className="p-8 text-center text-label">Loading partners...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="text-left text-label text-[10px] py-3 px-4">Name</th>
                    <th className="text-left text-label text-[10px] py-3 px-4">Order</th>
                    <th className="text-left text-label text-[10px] py-3 px-4">Status</th>
                    <th className="text-right text-label text-[10px] py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-label opacity-40">No partners yet.</td>
                    </tr>
                  ) : (
                    partners.map((partner, i) => (
                      <motion.tr
                        key={partner.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-surface)]/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className={`text-sm font-[family-name:var(--font-body)] font-medium ${partner.is_active ? "text-[var(--text-bone)]" : "text-[var(--text-bone-dim)] line-through"}`}>
                            {partner.name}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-[var(--text-bone-muted)]">{partner.display_order}</span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleActive(partner)}
                            className="flex items-center gap-1.5"
                          >
                            {partner.is_active ? (
                              <><ToggleRight size={16} className="text-[var(--accent-teal-light)]" /><span className="text-xs text-[var(--accent-teal-light)]">Visible</span></>
                            ) : (
                              <><ToggleLeft size={16} className="text-[var(--text-bone-dim)]" /><span className="text-xs text-[var(--text-bone-dim)]">Hidden</span></>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(partner)} className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors">
                              <Edit3 size={14} className="text-[var(--text-bone-muted)]" />
                            </button>
                            <button onClick={() => setDeleteConfirm(partner.id)} className="p-1.5 rounded-lg hover:bg-red-400/10 transition-colors">
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
