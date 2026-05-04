"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Partner {
  id: string;
  name: string;
}

interface PartnersSectionProps {
  initialPartners?: Partner[];
}

export function PartnersSection({ initialPartners }: PartnersSectionProps) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners ?? []);
  const [mounted, setMounted] = useState(!!initialPartners);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialPartners !== undefined) return;
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;

    async function fetchPartners() {
      try {
        const { data } = await supabase
          .from("partners")
          .select("id, name")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (data) setPartners(data);
      } catch (e) {
        console.error("Failed to fetch partners:", e);
      }
    }
    fetchPartners();
  }, []);

  // Handle empty or small lists by duplicating for marquee effect
  const marqueePartners = partners.length > 0 
    ? [...partners, ...partners, ...partners, ...partners] 
    : [];

  if (!mounted || partners.length === 0) return null;

  return (
    <section className="bg-[var(--bg-deep)] py-12 border-y border-[var(--border-subtle)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-teal-light)] opacity-60">
          Trusted By
        </span>
      </div>

      <div className="relative flex">
        <motion.div
          animate={{
            x: [0, -1035], // Approximate width adjustment
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ willChange: "transform" }}
          className="flex whitespace-nowrap gap-16 md:gap-32 items-center"
        >
          {marqueePartners.map((partner, i) => (
            <span
              key={`${partner.id}-${i}`}
              className="text-2xl md:text-3xl lg:text-4xl font-[family-name:var(--font-heading)] font-black tracking-tighter text-[var(--text-bone-dim)] hover:text-[var(--text-bone)] transition-colors cursor-default"
            >
              {partner.name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
