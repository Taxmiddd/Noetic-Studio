"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function PhilosophySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const logoY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.02, 0.05, 0.02]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[var(--bg-deep)] py-24"
    >
      {/* Giant Background Wordmark Watermark */}
      <motion.div
        style={{ y: logoY, opacity: logoOpacity }}
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none px-4"
      >
        <img
          src="/logo5.svg"
          alt=""
          className="w-full max-w-[1400px] h-auto grayscale invert opacity-100"
        />
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-label mb-8 block"
        >
          Our Philosophy
        </motion.span>

        <div className="space-y-6 md:space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-4xl lg:text-5xl font-[family-name:var(--font-heading)] font-bold text-[var(--text-bone)] leading-tight"
          >
            We don't decorate — <span className="text-[var(--text-bone-dim)]">we decode.</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-3xl lg:text-4xl font-[family-name:var(--font-heading)] font-semibold text-[var(--text-bone-muted)]"
          >
            Every brand has a dormant frequency.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-2xl md:text-4xl lg:text-5xl font-[family-name:var(--font-heading)] font-bold text-[var(--text-bone)] leading-tight"
          >
            We find it, amplify it, and make it <span className="gradient-text">unmistakable.</span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
