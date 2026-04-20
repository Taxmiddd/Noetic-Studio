"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { Project, ProjectCategory } from "@/types";
import { Upload, X, Save, Image as ImageIcon, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProjectFormProps {
  initialData?: Project;
  isEditing?: boolean;
}

export function ProjectForm({ initialData, isEditing = false }: ProjectFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [serviceTag, setServiceTag] = useState("");
  
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "brand" as ProjectCategory,
    year: initialData?.year || new Date().getFullYear(),
    client_name: initialData?.client_name || "",
    description: initialData?.description || "",
    long_description: initialData?.long_description || "",
    is_featured: initialData?.is_featured || false,
    display_order: initialData?.display_order || 0,
    thumbnail_url: initialData?.thumbnail_url || "",
    images: initialData?.images || [] as string[],
    services: initialData?.services || [] as string[],
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const handleUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const addServiceTag = () => {
    const tag = serviceTag.trim();
    if (tag && !formData.services.includes(tag)) {
      setFormData({ ...formData, services: [...formData.services, tag] });
    }
    setServiceTag("");
  };

  const removeServiceTag = (tag: string) => {
    setFormData({ ...formData, services: formData.services.filter(s => s !== tag) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading(isEditing ? "Updating project..." : "Publishing project...");

    try {
      let currentThumbnailUrl = formData.thumbnail_url;
      let currentImages = [...formData.images];

      if (thumbnailFile) {
        currentThumbnailUrl = await handleUpload(thumbnailFile);
      }

      if (galleryFiles.length > 0) {
        const uploadedUrls = await Promise.all(galleryFiles.map(file => handleUpload(file)));
        currentImages = [...currentImages, ...uploadedUrls];
      }

      const finalData = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        year: Number(formData.year),
        client_name: formData.client_name,
        description: formData.description,
        long_description: formData.long_description,
        is_featured: formData.is_featured,
        thumbnail_url: currentThumbnailUrl,
        images: currentImages,
        display_order: Number(formData.display_order) || 0,
        services: formData.services,
      };

      if (isEditing && initialData) {
        const { error } = await supabase.from("projects").update(finalData).eq("id", initialData.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("projects").insert([finalData]);
        if (error) throw new Error(error.message);
      }

      toast.success(isEditing ? "Project updated!" : "Project published!", { id: toastId });
      router.push("/admin/projects");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save project.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard padding="lg">
            <h2 className="text-xl font-[family-name:var(--font-heading)] mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              {/* Title + Auto-slug */}
              <div>
                <label className="block text-label text-[10px] mb-1.5 uppercase tracking-wider">Project Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    title: e.target.value, 
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                  })}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-bone)] focus:border-[var(--border-accent)] outline-none transition-colors"
                  placeholder="e.g. Meridian Financial"
                />
              </div>

              {/* Slug (read-only preview) */}
              <div>
                <label className="block text-label text-[10px] mb-1.5 uppercase tracking-wider">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-bone-muted)] outline-none font-mono"
                  placeholder="auto-generated"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label text-[10px] mb-1.5 uppercase tracking-wider">Client Name</label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-bone)] focus:border-[var(--border-accent)] outline-none transition-colors"
                    placeholder="e.g. Meridian Group"
                  />
                </div>
                <div>
                  <label className="block text-label text-[10px] mb-1.5 uppercase tracking-wider">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-bone)] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label text-[10px] mb-1.5 uppercase tracking-wider">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-bone)] outline-none"
                  >
                    <option value="brand">Brand Identity</option>
                    <option value="logo">Logo Design</option>
                    <option value="web">Web Development</option>
                    <option value="campaign">Event Campaign</option>
                    <option value="uiux">UI/UX Design</option>
                    <option value="direction">Creative Direction</option>
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
                <label className="block text-label text-[10px] mb-1.5 uppercase tracking-wider">Short Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-bone)] h-20 outline-none resize-none"
                  placeholder="One sentence summary..."
                />
              </div>

              <div>
                <label className="block text-label text-[10px] mb-1.5 uppercase tracking-wider">Full Case Study</label>
                <textarea
                  value={formData.long_description}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-bone)] h-40 outline-none resize-none"
                  placeholder="Detailed project narrative..."
                />
              </div>
            </div>
          </GlassCard>

          {/* Services Tags */}
          <GlassCard padding="lg">
            <h2 className="text-xl font-[family-name:var(--font-heading)] mb-2">Services</h2>
            <p className="text-xs text-[var(--text-bone-dim)] mb-4 font-[family-name:var(--font-body)]">
              Tags shown on the case study page.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.services.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-teal)]/10 border border-[var(--border-accent)] text-xs text-[var(--accent-teal-light)] font-[family-name:var(--font-body)]"
                >
                  {tag}
                  <button type="button" onClick={() => removeServiceTag(tag)}>
                    <X size={10} />
                  </button>
                </span>
              ))}
              {formData.services.length === 0 && (
                <span className="text-xs text-[var(--text-bone-dim)] font-[family-name:var(--font-body)] italic">No services added yet.</span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={serviceTag}
                onChange={(e) => setServiceTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addServiceTag(); } }}
                className="flex-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-sm text-[var(--text-bone)] focus:border-[var(--border-accent)] outline-none transition-colors"
                placeholder="e.g. Brand Strategy"
              />
              <Button type="button" variant="outline" size="sm" onClick={addServiceTag} className="gap-1.5">
                <Tag size={13} /> Add
              </Button>
            </div>
          </GlassCard>

          {/* Gallery */}
          <GlassCard padding="lg">
            <h2 className="text-xl font-[family-name:var(--font-heading)] mb-6">Gallery Images</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {formData.images.map((url, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-[var(--border-subtle)]">
                  <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, images: formData.images.filter((_, idx) => idx !== i) })}
                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-red-500/80 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
                className="hidden"
                id="gallery-upload"
              />
              <label
                htmlFor="gallery-upload"
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[var(--border-subtle)] rounded-xl hover:border-[var(--accent-teal)] cursor-pointer transition-colors"
              >
                <Upload size={24} className="text-[var(--text-bone-dim)] mb-2" />
                <span className="text-xs text-[var(--text-bone-muted)]">
                  {galleryFiles.length > 0 ? `${galleryFiles.length} files selected` : "Upload additional images"}
                </span>
              </label>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <GlassCard padding="lg">
            <h2 className="text-xl font-[family-name:var(--font-heading)] mb-6">Thumbnail</h2>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[var(--border-subtle)] mb-4 bg-[var(--bg-elevated)] flex items-center justify-center">
              {thumbnailFile ? (
                <img src={URL.createObjectURL(thumbnailFile)} className="w-full h-full object-cover" />
              ) : formData.thumbnail_url ? (
                <img src={formData.thumbnail_url} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={48} className="opacity-10" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              className="hidden"
              id="thumbnail-upload"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 text-xs"
              onClick={() => document.getElementById('thumbnail-upload')?.click()}
            >
              <Upload size={14} />
              {thumbnailFile || formData.thumbnail_url ? "Change Thumbnail" : "Upload Thumbnail"}
            </Button>
          </GlassCard>

          <GlassCard padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[var(--text-bone-muted)] block">Featured Project</span>
                <span className="text-[10px] text-[var(--text-bone-dim)] font-[family-name:var(--font-body)]">Shows on homepage</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                className={cn(
                  "w-10 h-5 rounded-full transition-colors relative flex-shrink-0",
                  formData.is_featured ? "bg-[var(--accent-teal)]" : "bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
                )}
              >
                <motion.div
                  animate={{ x: formData.is_featured ? 22 : 2 }}
                  className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          </GlassCard>

          <Button
            type="submit"
            variant="primary"
            className="w-full gap-2 py-6 text-base"
            disabled={loading}
          >
            <Save size={18} />
            {loading ? "Saving..." : isEditing ? "Update Project" : "Publish Project"}
          </Button>
        </div>
      </div>
    </form>
  );
}
