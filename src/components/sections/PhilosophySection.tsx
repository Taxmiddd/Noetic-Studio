"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const processSteps = [
  { title: "Think", description: "Conceptualize and ideate" },
  { title: "Design", description: "Shape the vision" },
  { title: "Build", description: "Engineer the solution" },
  { title: "Deploy", description: "Launch into the world" }
];

export function PhilosophySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const logoY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.03, 0.08, 0.03]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--bg-deep)] py-32"
    >
      <div className="absolute inset-x-0 bottom-0 h-full dot-grid opacity-[0.05] pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-[0.03] pointer-events-none" />
      {/* Giant Background Wordmark Watermark */}
      <motion.div
        style={{ y: logoY, opacity: logoOpacity }}
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none px-4"
      >
        <img
          src="/logo5.svg"
          alt=""
          className="w-full max-w-[1600px] h-auto grayscale invert"
        />
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
        {/* Intro */}
        <div className="text-center mb-32">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[9px] uppercase tracking-[0.5em] text-white/40 mb-12 block"
          >
            Our Philosophy
          </motion.span>

          <div className="space-y-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[0.95]"
            >
              WE DON&apos;T DECORATE. <br />
              <span className="opacity-30">WE DECODE.</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-2xl text-white/50 max-w-2xl mx-auto font-medium"
            >
              Every brand has a dormant frequency. We find it, amplify it, and make it unmistakable.
            </motion.p>
          </div>
        </div>

        {/* The Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-32 border-t border-white/5">
          {processSteps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 group cursor-default"
            >
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-white/20 font-mono">0{i + 1}</span>
                <div className="h-[1px] flex-1 bg-white/5 group-hover:bg-[var(--accent-teal-light)]/30 transition-colors" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white">{step.title}</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
