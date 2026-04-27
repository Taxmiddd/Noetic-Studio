"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { Policy, PolicyType } from "@/types";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

interface PolicyFormProps {
  initialData?: Policy;
  isEditing?: boolean;
}

export function PolicyForm({ initialData, isEditing = false }: PolicyFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  
  // Default type to url search param ?type=privacy if new.
  const defaultType = (searchParams.get('type') as PolicyType) || "terms";
  
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    type: initialData?.type || defaultType,
    content: initialData?.content || "",
    display_order: initialData?.display_order || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading(isEditing ? "Updating clause..." : "Saving clause...");

    try {
      const finalData = {
        title: formData.title,
        type: formData.type,
        content: formData.content,
        display_order: Number(formData.display_order) || 0,
      };

      if (isEditing && initialData) {
        const { error } = await supabase.from("policies").update(finalData).eq("id", initialData.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("policies").insert([finalData]);
        if (error) throw new Error(error.message);
      }

      toast.success(isEditing ? "Clause updated!" : "Clause saved!", { id: toastId });
      router.push("/admin/policies");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save clause.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard blur={false} padding="lg">
            <h2 className="text-xl font-[family-name:var(--font-heading)] mb-6">Clause Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-label text-[10px] mb-1.5 uppercase tracking-wider">Clause Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-bone)] focus:border-[var(--border-accent)] outline-none transition-colors"
                  placeholder="e.g. Intellectual Property & Licensing"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label text-[10px] mb-1.5 uppercase tracking-wider">Policy Assignment</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as PolicyType })}
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-bone)] outline-none"
                  >
                    <option value="terms">Terms of Service</option>
                    <option value="privacy">Privacy Policy</option>
                  </select>
                </div>
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
              </div>

              <div>
                <label className="block text-label text-[10px] mb-1.5 uppercase tracking-wider">Legal Content</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-bone)] h-64 outline-none resize-none focus:border-[var(--border-accent)] transition-colors"
                  placeholder="Enter the formal text for this clause..."
                />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard blur={false} padding="lg">
             <h3 className="heading-section text-lg mb-2">Instructions</h3>
             <p className="text-body text-xs text-[var(--text-bone-muted)] mb-4">
                This legal segment will be dynamically displayed on your public endpoints. Ensure that it aligns visually with your pre-defined aesthetic boundaries.
             </p>
          </GlassCard>
          <Button
            type="submit"
            variant="primary"
            className="w-full gap-2 py-6 text-base"
            disabled={loading}
          >
            <Save size={18} />
            {loading ? "Saving..." : isEditing ? "Update Clause" : "Publish Clause"}
          </Button>
        </div>
      </div>
    </form>
  );
}
