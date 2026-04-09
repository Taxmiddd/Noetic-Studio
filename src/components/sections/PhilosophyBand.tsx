"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function PhilosophyBand() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const lines = [
    "We don't decorate — we decode.",
    "Every brand has a dormant frequency.",
    "We find it, amplify it, and make it unmistakable.",
  ];

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-48 overflow-hidden"
      id="philosophy"
    >
      {/* Decorative NOÉTIC watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.02 } : {}}
        transition={{ duration: 2 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span
          className="text-[20vw] font-[family-name:var(--font-decorative)] font-bold text-[var(--text-bone)] whitespace-nowrap"
        >
          NOÉTIC
        </span>
      </motion.div>

      {/* Gradient accent lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-teal)] to-transparent opacity-20" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-teal)] to-transparent opacity-20" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-label mb-12 block"
        >
          Our Philosophy
        </motion.span>

        <div className="space-y-6 md:space-y-8">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.3 + i * 0.25,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className={`font-[family-name:var(--font-heading)] font-bold text-xl md:text-2xl lg:text-3xl leading-relaxed ${
                i === lines.length - 1
                  ? "text-[var(--text-bone)]"
                  : "text-[var(--text-bone-muted)]"
              }`}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
