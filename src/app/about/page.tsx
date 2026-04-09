"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lightbulb, Target, Zap, Eye } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Insight First",
    description: "Every project begins with rigorous research and strategic thinking before a pixel is placed.",
  },
  {
    icon: Target,
    title: "Precision Always",
    description: "We obsess over details. Typography, spacing, color — nothing is accidental or approximate.",
  },
  {
    icon: Zap,
    title: "Impact Driven",
    description: "Beautiful work that doesn't perform is decoration. We build for results and resonance.",
  },
  {
    icon: Eye,
    title: "Clarity Mandated",
    description: "Complexity is the enemy of communication. We distill, simplify, and clarify relentlessly.",
  },
];

const timeline = [
  { year: "2021", event: "NOÉTIC founded as a solo creative practice" },
  { year: "2022", event: "Expanded into brand identity and web development" },
  { year: "2023", event: "First major enterprise campaign — 2M+ reach" },
  { year: "2024", event: "Studio expansion — full-stack creative team" },
  { year: "2025", event: "Launched NOÉTIC Intelligence Framework" },
];

export default function AboutPage() {
  const valuesRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: "-50px" });
  const timelineInView = useInView(timelineRef, { once: true, margin: "-50px" });

  return (
    <div className="pt-[var(--nav-height)]">
      {/* Header */}
      <section className="section-padding pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-label mb-4 block">About</span>
            <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-6">
              Creative{" "}
              <span className="gradient-text">Intelligence.</span>
            </h1>
            <p className="text-body text-base md:text-lg leading-relaxed mb-4">
              NOÉTIC Studio is a creative intelligence agency that fuses insight with execution. We exist to solve complex market challenges through design, strategy, and technology.
            </p>
            <p className="text-body text-base md:text-lg leading-relaxed">
              Our name derives from "noetic" — relating to the mind and intellect. Every project we undertake begins with understanding, not aesthetics. The visual language always follows the strategic logic.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding pt-0">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="heading-section text-2xl md:text-3xl">Our Principles</h2>
          </motion.div>

          <motion.div
            ref={valuesRef}
            variants={staggerContainer}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div key={value.title} variants={fadeInUp}>
                  <GlassCard className="h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-[var(--accent-teal-light)]" />
                      </div>
                      <div>
                        <h3 className="heading-section text-lg mb-2">{value.title}</h3>
                        <p className="text-body text-sm">{value.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="heading-section text-2xl md:text-3xl mb-12"
          >
            Studio Timeline
          </motion.h2>

          <motion.div
            ref={timelineRef}
            variants={staggerContainer}
            initial="hidden"
            animate={timelineInView ? "visible" : "hidden"}
            className="relative"
          >
            {/* Vertical line */}
            <div className="absolute left-[37px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[var(--accent-teal)] via-[var(--border-glass)] to-transparent" />

            <div className="space-y-8">
              {timeline.map((item) => (
                <motion.div
                  key={item.year}
                  variants={fadeInUp}
                  className="flex items-start gap-6"
                >
                  <div className="flex-shrink-0 w-[75px] text-right">
                    <span className="text-sm font-[family-name:var(--font-heading)] font-bold text-[var(--accent-teal-light)]">
                      {item.year}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-[var(--bg-deep)] border-2 border-[var(--accent-teal)]" />
                  </div>
                  <p className="text-body text-sm pt-0.5">{item.event}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
