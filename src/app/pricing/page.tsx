"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight, MessageCircle, Layers, Target, Sparkles } from "lucide-react";

const processSteps = [
  {
    icon: MessageCircle,
    number: "01",
    title: "Discovery Session",
    description:
      "We begin with a complimentary, no-obligation consultation to understand your brand's vision, competitive landscape, and strategic objectives.",
  },
  {
    icon: Target,
    number: "02",
    title: "Custom Proposal",
    description:
      "Based on our discovery findings, we architect a detailed scope of work — complete with deliverables, timelines, milestones, and a transparent investment breakdown.",
  },
  {
    icon: Layers,
    number: "03",
    title: "Milestone Execution",
    description:
      "Work begins upon agreement. You'll receive structured updates at each milestone, ensuring full visibility and control throughout the engagement.",
  },
  {
    icon: Sparkles,
    number: "04",
    title: "Delivery & Launch",
    description:
      "Final assets are delivered upon completion of the last milestone payment. Full intellectual property rights transfer to you at this stage.",
  },
];

const principles = [
  {
    title: "No Hidden Fees",
    body: "Your proposal is your contract. Every cost is itemized and agreed upon before a single pixel is placed.",
  },
  {
    title: "Scope-Aligned Investment",
    body: "Whether it's a focused logo refinement or a full-scale brand system, your investment reflects the exact scope and complexity of the work.",
  },
  {
    title: "Flexible Payment Structures",
    body: "All engagements follow a milestone-based payment model — you pay progressively as value is delivered, never all upfront.",
  },
  {
    title: "Transparent Revisions",
    body: "Revision rounds are defined in your proposal. Additional iterations beyond scope are quoted clearly before any work begins.",
  },
];

export default function PricingPage() {
  return (
    <div className="pt-[var(--nav-height)] pb-24 relative overflow-hidden min-h-screen">
      {/* Background elements */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[var(--accent-teal)]/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-[var(--accent-teal-glow)] rounded-full blur-[150px] opacity-15 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <section className="section-padding relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* ─── HERO ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20 md:mb-28 text-center"
          >
            <span className="text-label mb-4 block tracking-[0.3em]">Investment</span>
            <h1 className="heading-display text-4xl md:text-5xl lg:text-7xl mb-6 tracking-tighter">
              Bespoke <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-body text-lg md:text-xl max-w-2xl mx-auto mb-4">
              We don't offer off-the-shelf packages. Every engagement at NOÉTIC Studio
              is architected around your brand's unique strategic requirements — because
              generic solutions produce generic results.
            </p>
            <p className="text-body text-base max-w-xl mx-auto mb-6">
              Our work is deeply consultative. Rather than fitting your vision into a
              predefined tier, we design a scope, timeline, and investment structure
              that is precisely calibrated to what your brand needs to achieve.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--accent-teal)]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal-light)] animate-pulse" />
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-[var(--text-bone-muted)] font-[family-name:var(--font-body)]">
                Bespoke project engagements start at a minimum fee of <span className="text-[var(--accent-teal-light)] font-bold">$100 USD</span>
              </span>
            </div>
          </motion.div>

          {/* ─── QUOTATION SYSTEM ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8 }}
            className="mb-20 md:mb-28"
          >
            <GlassCard padding="lg" hover={false} className="text-center border border-[var(--border-accent)]">
              <div className="py-6 md:py-10">
                <div className="text-[10px] text-[var(--accent-teal-light)] uppercase tracking-[0.3em] mb-3 font-medium">
                  How It Works
                </div>
                <h2 className="heading-section text-2xl md:text-3xl mb-4">
                  Quotation-Based System
                </h2>
                <p className="text-body text-base max-w-2xl mx-auto mb-8">
                  Every project begins with a conversation, not a checkout page. After
                  understanding your objectives in a discovery session, we deliver a
                  detailed custom proposal outlining scope, deliverables, timelines, and
                  a precise investment figure — tailored entirely to you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button variant="primary" size="lg" className="gap-2 px-8">
                      <ArrowRight size={16} />
                      Start a Conversation
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" size="lg" className="gap-2 px-8">
                      Request a Quote
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* ─── PROCESS STEPS ─── */}
          <div className="mb-20 md:mb-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <span className="text-label mb-3 block tracking-[0.3em]">Process</span>
              <h2 className="heading-section text-2xl md:text-3xl">
                From Conversation to Creation
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {processSteps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                >
                  <GlassCard padding="lg" hover={false} className="h-full border-l-2 border-l-[var(--border-glass)] hover:border-l-[var(--accent-teal-light)] transition-colors duration-500">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center">
                        <step.icon size={20} className="text-[var(--accent-teal-light)]" />
                      </div>
                      <div>
                        <div className="text-[10px] text-[var(--accent-teal-light)] uppercase tracking-[0.2em] mb-1 font-medium">
                          Step {step.number}
                        </div>
                        <h3 className="heading-section text-lg mb-2 text-[var(--text-bone)]">
                          {step.title}
                        </h3>
                        <p className="text-body text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ─── PRICING PRINCIPLES ─── */}
          <div className="mb-20 md:mb-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <span className="text-label mb-3 block tracking-[0.3em]">Principles</span>
              <h2 className="heading-section text-2xl md:text-3xl">
                Our Pricing Philosophy
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {principles.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                >
                  <GlassCard padding="lg" hover={false} className="h-full">
                    <h3 className="heading-section text-base mb-2 text-[var(--text-bone)]">
                      {item.title}
                    </h3>
                    <p className="text-body text-sm leading-relaxed">
                      {item.body}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ─── PAYMENT NOTE ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <GlassCard padding="lg" hover={false}>
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                <div className="md:w-1/3">
                  <div className="text-[10px] text-[var(--accent-teal-light)] uppercase tracking-[0.2em] mb-2 font-medium">
                    Payment Processing
                  </div>
                  <h3 className="heading-section text-xl text-[var(--text-bone)]">
                    Secure Transactions
                  </h3>
                </div>
                <div className="md:w-2/3">
                  <p className="text-body text-[15px] leading-relaxed mb-3">
                    All payments for NOÉTIC Studio services are securely processed through
                    <strong className="text-[var(--text-bone)]"> Paddle.com</strong>, our
                    Merchant of Record. Paddle handles invoicing, payment processing,
                    sales tax, and VAT compliance on our behalf — ensuring a seamless
                    and internationally compliant transaction experience.
                  </p>
                  <p className="text-body text-[15px] leading-relaxed">
                    We accept all major credit and debit cards, PayPal, and select
                    regional payment methods through Paddle's infrastructure.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* ─── BOTTOM CTA ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-body text-lg mb-6 max-w-lg mx-auto">
              Ready to explore what a strategic creative partnership looks like?
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg" className="gap-2 px-10">
                <MessageCircle size={16} />
                Start a Conversation
              </Button>
            </Link>
            <p className="mt-8 text-xs text-[var(--text-bone-dim)] font-[family-name:var(--font-body)] uppercase tracking-widest max-w-xl mx-auto">
              All engagements are governed by our{" "}
              <Link href="/terms" className="underline hover:text-[var(--accent-teal-light)] transition-colors">Terms of Service</Link>,{" "}
              <Link href="/refund" className="underline hover:text-[var(--accent-teal-light)] transition-colors">Refund Policy</Link>, and{" "}
              <Link href="/privacy" className="underline hover:text-[var(--accent-teal-light)] transition-colors">Privacy Policy</Link>.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
