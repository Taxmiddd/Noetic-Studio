"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/lib/supabase/client";
import { Policy } from "@/types";

export default function TermsPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPolicies() {
      const { data } = await supabase
        .from("policies")
        .select("*")
        .eq("type", "terms")
        .order("display_order", { ascending: true });
        
      if (data) setPolicies(data);
      setLoading(false);
    }
    fetchPolicies();
  }, [supabase]);

  return (
    <div className="pt-[var(--nav-height)] pb-24 relative overflow-hidden min-h-screen">
      {/* Background elements */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[var(--accent-teal)]/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-teal-glow)] rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <section className="section-padding relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 md:mb-24"
          >
            <span className="text-label mb-4 block tracking-[0.3em]">Legal Framework</span>
            <h1 className="heading-display text-4xl md:text-5xl lg:text-7xl mb-6 tracking-tighter">
              Project <span className="gradient-text">Agreements</span>
            </h1>
            <p className="text-body text-lg max-w-2xl">
              The operational physics and binding terms of engagement between your organization and NOÉTIC Studio concerning digital product development and deployment.
            </p>
            <p className="mt-6 text-sm text-[var(--accent-teal-light)] font-[family-name:var(--font-body)]">
               Document Version: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>
          
          {/* Content */}
          <div className="space-y-6">
            {loading ? (
              <div className="py-20 text-center text-[var(--text-bone-muted)] font-[family-name:var(--font-body)] animate-pulse">
                Decrypting framework...
              </div>
            ) : policies.length === 0 ? (
              <div className="py-20 text-center text-[var(--text-bone-dim)] font-[family-name:var(--font-body)]">
                No active policies recorded.
              </div>
            ) : (
              policies.map((policy, index) => (
                <motion.div
                  key={policy.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
                >
                  <GlassCard padding="lg" hover={false} className="border-l-2 border-l-[var(--border-glass)] hover:border-l-[var(--accent-teal-light)] transition-colors duration-500">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                      <div className="md:w-1/3">
                        <div className="text-[10px] text-[var(--accent-teal-light)] uppercase tracking-[0.2em] mb-2 font-medium">
                          Article 0{index + 1}
                        </div>
                        <h2 className="heading-section text-xl md:text-2xl text-[var(--text-bone)]">
                          {policy.title}
                        </h2>
                      </div>
                      <div className="md:w-2/3">
                        <p className="text-body text-[var(--text-bone-muted)] leading-relaxed text-[15px] whitespace-pre-wrap">
                          {policy.content}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>

          {/* Footer Clause */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-16 text-center"
          >
             <p className="text-xs text-[var(--text-bone-dim)] font-[family-name:var(--font-body)] uppercase tracking-widest max-w-xl mx-auto">
                Transfer of the primary deposit invoice designates formal digital acceptance of the framework detailed above.
             </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
