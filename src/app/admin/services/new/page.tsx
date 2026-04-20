"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ServiceForm } from "@/components/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--text-bone-muted)] hover:text-[var(--text-bone)] transition-colors mb-4"
        >
          <ChevronLeft size={14} /> Back to Services
        </Link>
        <h1 className="heading-section text-3xl">New Service</h1>
        <p className="text-body text-sm">Add a new service offering to your site.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <ServiceForm />
      </motion.div>
    </div>
  );
}
