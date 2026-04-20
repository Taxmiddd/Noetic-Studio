"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { Service } from "@/types";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const ICON_OPTIONS = [
  "Palette", "Globe", "Layers", "MousePointer", "Film", "Megaphone",
  "PenTool", "Zap", "Target", "Lightbulb", "Code", "Star",
];

interface ServiceFormProps {
  initialData?: Service;
  isEditing?: boolean;
}

export function ServiceForm({ initialData, isEditing = false }: ServiceFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    short_description: initialData?.short_description || "",
    long_description: initialData?.long_description || "",
    icon_name: initialData?.icon_name || "Palette",
    display_order: initialData?.display_order || 0,
    is_active: initialData?.is_active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditing ? "Updating service..." : "Creating service...");

    try {
      const payload = {
        ...formData,
        slug: formData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        display_order: Number(formData.display_order),
      };

      if (isEditing && initialData) {
        const { error } = await supabase.from("services").update(payload).eq("id", initialData.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("services").insert([payload]);
        if (error) throw new Error(error.message);
      }

      toast.success(isEditing ? "Service updated!" : "Service created!", { id: toastId });
      router.push("/admin/services");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save service.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard padding="lg">
            <h2 className="text-xl font-[family-name:var(--font-heading)] mb-6">Service Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-label text-[10px] mb-1.5 uppercase tracking-wider">Service Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-bone)] focus:border-[var(--border-accent)] outline-none"
                  placeholder="e.g. Brand Identity"
                />
              </div>

              <div>
                <label className="block text-label text-[10px] mb-1.5 uppercase tracking-wider">Short Description</label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-bone)] h-20 outline-none resize-none"
                  placeholder="A concise one-line summary..."
                />
              </div>

              <div>
                <label className="block text-label text-[10px] mb-1.5 uppercase tracking-wider">Full Description</label>
                <textarea
                  value={formData.long_description}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-bone)] h-36 outline-none resize-none"
                  placeholder="Detailed description of what this service entails..."
                />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard padding="lg">
            <h2 className="text-xl font-[family-name:var(--font-heading)] mb-4">Icon</h2>
            <div className="grid grid-cols-4 gap-2">
              {ICON_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon_name: icon })}
                  className={cn(
                    "py-2 px-1 rounded-lg text-[10px] font-[family-name:var(--font-body)] border transition-all",
                    formData.icon_name === icon
                      ? "bg-[var(--accent-teal)]/10 border-[var(--border-accent)] text-[var(--accent-teal-light)]"
                      : "border-[var(--border-subtle)] text-[var(--text-bone-dim)] hover:text-[var(--text-bone)]"
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard padding="lg">
            <div className="space-y-4">
              <div>
                <label className="block text-label text-[10px] mb-1.5 uppercase tracking-wider">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-bone)] outline-none"
                  min={0}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[var(--text-bone-muted)] block">Active</span>
                  <span className="text-[10px] text-[var(--text-bone-dim)] font-[family-name:var(--font-body)]">Shows on /services page</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={cn(
                    "w-10 h-5 rounded-full transition-colors relative flex-shrink-0",
                    formData.is_active ? "bg-[var(--accent-teal)]" : "bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
                  )}
                >
                  <motion.div
                    animate={{ x: formData.is_active ? 22 : 2 }}
                    className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            </div>
          </GlassCard>

          <Button type="submit" variant="primary" className="w-full gap-2 py-6 text-base" disabled={loading}>
            <Save size={18} />
            {loading ? "Saving..." : isEditing ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </div>
    </form>
  );
}
