"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PolicyForm } from "@/components/admin/PolicyForm";
import { Suspense } from "react";

export default function NewPolicyPage() {
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
        <h1 className="heading-section text-3xl">New Clause</h1>
        <p className="text-body text-sm">Draft a new formal agreement for your legal framework.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Suspense fallback={<div className="h-40 border border-[var(--border-subtle)] rounded-xl animate-pulse" />}>
          <PolicyForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
