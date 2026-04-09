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
    description: "Distilled brand marks that command recognition and resonate across every medium.",
    details: "We approach every logo as a compression algorithm for your brand's DNA. Through rigorous exploration — from initial concept sketches to refined vector systems — we create marks that are distinctive, scalable, and timelessly relevant. Each logo delivery includes primary/secondary lockups, icon variants, and a complete usage guide.",
  },
  {
    icon: Fingerprint,
    title: "Brand Identity",
    description: "Complete identity systems — from visual language to tone — that position you at the frontier.",
    details: "Brand is more than a logo. We build comprehensive identity systems that include typography, color architecture, imagery direction, voice & tone guidelines, and stationery. Every element is stress-tested across digital and physical touchpoints to ensure cohesion at any scale.",
  },
  {
    icon: Megaphone,
    title: "Event Campaigns",
    description: "Campaign architectures that synthesize narrative, design, and strategy into cultural impact.",
    details: "From music festivals to product launches, we design multi-platform campaigns that create anticipation, drive engagement, and leave lasting impressions. Our process includes creative concepting, visual system design, social media toolkits, and performance analytics.",
  },
  {
    icon: Compass,
    title: "Creative Direction",
    description: "Strategic vision that unifies creative output and ensures every touchpoint speaks with authority.",
    details: "We serve as an extended creative arm for brands that need consistent, high-quality output across teams and agencies. Our directors provide ongoing art direction, brand governance, and strategic creative planning to ensure every piece of content reinforces your positioning.",
  },
  {
    icon: Layout,
    title: "UI/UX Design",
    description: "Interfaces designed with intent — where clarity meets engagement and friction disappears.",
    details: "We design digital experiences that feel intuitive from the first interaction. Our process includes user research, information architecture, wireframing, high-fidelity prototyping, and usability testing. We specialize in SaaS dashboards, mobile apps, and complex data interfaces.",
  },
  {
    icon: Code2,
    title: "Full-stack Web Development",
    description: "Performant, scalable digital products built with modern frameworks and engineering precision.",
    details: "We build with Next.js, React, TypeScript, and modern backend stacks. Every project prioritizes performance, accessibility, and maintainability. From headless CMS integrations to custom APIs, we handle the full technical stack so your digital presence matches your design ambitions.",
  },
];

export default function ServicesPage() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div className="pt-[var(--nav-height)]">
      {/* Header */}
      <section className="section-padding pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-label mb-4 block">Services</span>
            <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-4">
              What We <span className="gradient-text">Build</span>
            </h1>
            <p className="text-body max-w-2xl">
              Six disciplines, unified by one principle: every creative decision must be intelligent, intentional, and impactful.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding pt-0 pb-20">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-5xl mx-auto space-y-8"
        >
          {services.map((service, i) => {
            const Icon = service.icon;
            const isEven = i % 2 === 0;
            return (
              <motion.div key={service.title} variants={fadeInUp}>
                <GlassCard padding="lg" className="group">
                  <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-start`}>
                    {/* Icon + Title */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center group-hover:border-[var(--border-accent)] transition-colors duration-300 mb-4">
                        <Icon
                          size={28}
                          className="text-[var(--accent-teal-light)]"
                        />
                      </div>
                      <h2 className="heading-section text-xl md:text-2xl mb-2">
                        {service.title}
                      </h2>
                      <p className="text-body text-sm font-medium text-[var(--accent-teal-light)]">
                        {service.description}
                      </p>
                    </div>
                    {/* Details */}
                    <div className="flex-1">
                      <p className="text-body text-sm leading-relaxed">
                        {service.details}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
