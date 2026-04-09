"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import {
  Palette,
  Fingerprint,
  Megaphone,
  Compass,
  Layout,
  Code2,
} from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Logo Design",
    description:
      "Distilled brand marks that command recognition and resonate across every medium.",
  },
  {
    icon: Fingerprint,
    title: "Brand Identity",
    description:
      "Complete identity systems — from visual language to tone — that position you at the frontier.",
  },
  {
    icon: Megaphone,
    title: "Event Campaigns",
    description:
      "Campaign architectures that synthesize narrative, design, and strategy into cultural impact.",
  },
  {
    icon: Compass,
    title: "Creative Direction",
    description:
      "Strategic vision that unifies creative output and ensures every touchpoint speaks with authority.",
  },
  {
    icon: Layout,
    title: "UI/UX Design",
    description:
      "Interfaces designed with intent — where clarity meets engagement and friction disappears.",
  },
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Full-stack engineering with modern frameworks, delivering performant, scalable digital products.",
  },
];

export function ServicesGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding" id="services-preview">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-label mb-4 block">What We Do</span>
          <h2 className="heading-section text-3xl md:text-4xl lg:text-5xl">
            Six Disciplines.{" "}
            <span className="gradient-text">One Intelligence.</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.title} variants={fadeInUp}>
                <div className="h-full group cursor-pointer p-8 rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all duration-500 bg-[var(--bg-deep)]">
                  <div className="flex flex-col gap-6">
                    <Icon
                      size={24}
                      className="text-[var(--accent-teal-light)] group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100"
                    />
                    <div className="space-y-4">
                      <h3 className="heading-section text-sm md:text-base tracking-[0.1em]">
                        {service.title}
                      </h3>
                      <p className="text-body text-xs md:text-sm leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
