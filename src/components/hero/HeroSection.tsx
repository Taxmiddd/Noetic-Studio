"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useEffect } from "react";

const Aurora = dynamic(() => import("@/components/ui/Aurora"), { ssr: false });

export function HeroSection() {
  const [showAurora, setShowAurora] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowAurora(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-deep)]"
      id="hero"
    >
      <div className="absolute inset-0 dot-grid opacity-[0.03] z-0 pointer-events-none" />

      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        {showAurora && (
          <Aurora
            colorStops={["#0D7377", "#14B8A6", "#040D0C"]}
            blend={0.6}
            amplitude={1.2}
            speed={0.5}
          />
        )}
      </div>

      <div className="absolute inset-0 opacity-[0.02] z-[1] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, var(--text-bone-dim) 1px, transparent 0)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Brand Wordmark (Static and Powerful) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 md:mb-12 flex items-center justify-center h-[200px] md:h-[320px]"
        >
          <Image 
            src="/logo7.svg" 
            alt="NOÉTIC" 
            width={800} 
            height={320}
            className="h-full w-auto object-contain brightness-125"
            priority
            fetchPriority="high"
          />
        </motion.div>

        {/* Tagline */}
        <div className="space-y-4 mb-8">
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1.5, delay: 0.8 }}
          >
            <h2 className="text-[10px] md:text-xs uppercase tracking-[0.8em] text-white/50 font-[family-name:var(--font-body)]">
              CLARITY. MANDATED.
            </h2>
          </motion.div>
          
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[var(--accent-teal-light)] font-[family-name:var(--font-body)] opacity-80"
            >
              Creative Intelligence for the modern market
            </motion.p>
          </div>
        </div>

      </motion.div>
    </section>
  );
}
