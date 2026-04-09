"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Partner {
  id: string;
  name: string;
  display_order: number;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    setLoading(true);
    const { data } = await supabase
      .from("partners")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (data) setPartners(data);
    setLoading(false);
  }

  async function handleAdd() {
    const name = prompt("Enter Partner Name:");
    if (!name) return;

    const { data, error } = await supabase
      .from("partners")
      .insert([{ name, display_order: partners.length + 1 }])
      .select();

    if (error) {
      alert("Error adding partner: " + error.message);
    } else {
      fetchPartners();
    }
  }

  async function handleUpdate(id: string) {
    if (!editName) return;
    const { error } = await supabase
      .from("partners")
      .update({ name: editName })
      .eq("id", id);

    if (error) {
      alert("Error updating partner: " + error.message);
    } else {
      setIsEditing(null);
      fetchPartners();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this partner?")) return;
    const { error } = await supabase.from("partners").delete().eq("id", id);

    if (error) {
      alert("Error deleting partner: " + error.message);
    } else {
      fetchPartners();
    }
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
          <p className="text-body text-sm">Manage the 'Trusted By' marquee names.</p>
        </div>
        <Button onClick={handleAdd} variant="primary" size="md" className="gap-2">
          <Plus size={16} />
          Add Partner
        </Button>
      </motion.div>

      {/* List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard padding="sm" hover={false}>
          {loading ? (
            <div className="p-8 text-center text-label">Loading partners...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="text-left text-label text-[10px] py-3 px-4">Name</th>
                    <th className="text-left text-label text-[10px] py-3 px-4">Order</th>
                    <th className="text-right text-label text-[10px] py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner, i) => (
                    <motion.tr
                      key={partner.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-surface)]/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        {isEditing === partner.id ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={() => handleUpdate(partner.id)}
                            onKeyDown={(e) => e.key === "Enter" && handleUpdate(partner.id)}
                            className="bg-[var(--bg-elevated)] text-sm text-[var(--text-bone)] px-2 py-1 rounded border border-[var(--border-accent)] outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm text-[var(--text-bone)] font-[family-name:var(--font-body)] font-medium">
                            {partner.name}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-[var(--text-bone-muted)]">
                          {partner.display_order}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {
                              setIsEditing(partner.id);
                              setEditName(partner.name);
                            }}
                            className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors"
                          >
                            <Edit3 size={14} className="text-[var(--text-bone-muted)]" />
                          </button>
                          <button
                            onClick={() => handleDelete(partner.id)}
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
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
