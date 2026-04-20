"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { createClient } from "@/lib/supabase/client";
import { Service } from "@/types";

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchService() {
      const { data } = await supabase.from("services").select("*").eq("id", id).single();
      if (data) setService(data);
      setLoading(false);
    }
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-[var(--accent-teal)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl mb-4">Service not found</h2>
        <Link href="/admin/services" className="text-[var(--accent-teal-light)] underline">Back to Services</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link href="/admin/services" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--text-bone-muted)] hover:text-[var(--text-bone)] transition-colors mb-4">
          <ChevronLeft size={14} /> Back to Services
        </Link>
        <h1 className="heading-section text-3xl">Edit Service</h1>
        <p className="text-body text-sm">Update "{service.title}" details.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <ServiceForm initialData={service} isEditing={true} />
      </motion.div>
    </div>
  );
}
