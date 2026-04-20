"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { ChevronDown } from "lucide-react";
import Aurora from "@/components/ui/Aurora";

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // Loading animation logic
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 1.5;
      });
    }, 20);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-deep)]"
      id="hero"
    >
      <div className="absolute inset-0 dot-grid opacity-[0.03] z-0 pointer-events-none" />
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loader"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <img src="/logo7.svg" alt="NOÉTIC" className="h-12 w-auto brightness-200" />
            </motion.div>
            
            <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <motion.span 
              className="mt-4 text-[10px] tracking-[0.3em] text-white/40 uppercase font-[family-name:var(--font-body)]"
            >
              Initializing Studio
            </motion.span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <Aurora 
          colorStops={["#0D7377", "#14B8A6", "#040D0C"]}
          blend={0.6}
          amplitude={1.2}
          speed={0.5}
        />
      </div>

      <div className="absolute inset-0 opacity-[0.02] z-[1] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, var(--text-bone-dim) 1px, transparent 0)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Brand Wordmark (Static and Powerful) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 md:mb-12 flex items-center justify-center h-[200px] md:h-[320px]"
        >
          <img 
            src="/logo7.svg" 
            alt="NOÉTIC" 
            className="h-full w-auto object-contain brightness-125"
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
