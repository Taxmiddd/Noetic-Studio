"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useGravityField } from "./GravityField";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { normalizedX, normalizedY } = useGravityField();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      id="hero"
    >
      {/* Background grain / subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--text-bone) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ambient teal glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent-teal)] opacity-[0.04] blur-[120px]" />

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Brand Logomark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, type: "spring", stiffness: 50 }}
          className="mb-8 md:mb-12 relative h-[320px] w-full max-w-[500px] flex items-center justify-center"
          style={{ 
            x: normalizedX * 15, 
            y: normalizedY * 15,
            rotateX: -normalizedY * 10,
            rotateY: normalizedX * 10,
            perspective: 1000
          }}
        >
          {/* Subtle background glow */}
          <div className="absolute inset-x-0 inset-y-0 bg-[var(--accent-teal)] opacity-[0.08] blur-[80px] rounded-full" />
          
          <img 
            src="/logo3.svg" 
            alt="NOÉTIC" 
            className="w-full h-full object-contain relative z-10"
          />
        </motion.div>

        {/* Motto */}
        <div className="space-y-2 mb-6">
          <AnimatedText
            text="CLARITY."
            as="h1"
            className="heading-display text-5xl md:text-7xl lg:text-8xl"
            delay={1.8}
          />
          <AnimatedText
            text="MANDATED."
            as="h1"
            className="heading-display text-5xl md:text-7xl lg:text-8xl gradient-text"
            delay={2.2}
          />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8 }}
          className="text-body text-sm md:text-base lg:text-lg max-w-md"
        >
          Creative Intelligence for the modern market
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          className="absolute -bottom-32 md:-bottom-20 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown
              size={24}
              className="text-[var(--text-bone-dim)]"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
