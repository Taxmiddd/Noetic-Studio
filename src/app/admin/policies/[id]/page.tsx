"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PolicyForm } from "@/components/admin/PolicyForm";
import { createClient } from "@/lib/supabase/client";
import { Policy } from "@/types";
import { use } from "react";

export default function EditPolicyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPolicy() {
      const { data } = await supabase
        .from("policies")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();
      
      if (data) setPolicy(data);
      setLoading(false);
    }
    fetchPolicy();
  }, [resolvedParams.id, supabase]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-[var(--accent-teal)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <h2 className="heading-section text-2xl mb-4">Clause Not Found</h2>
        <Link href="/admin/policies" className="text-[var(--accent-teal-light)] hover:underline">
          Return to Policies
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/admin/policies"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--text-bone-muted)] hover:text-[var(--text-bone)] transition-colors mb-4"
        >
          <ChevronLeft size={14} /> Back to Policies
        </Link>
        <h1 className="heading-section text-3xl">Edit Clause</h1>
        <p className="text-body text-sm">Modify this legal segment.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Suspense fallback={<div className="h-40 border border-[var(--border-subtle)] rounded-xl animate-pulse" />}>
          <PolicyForm initialData={policy} isEditing />
        </Suspense>
      </motion.div>
    </div>
  );
}
