"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const refundSections = [
  {
    article: "01",
    title: "Overview & Scope",
    content: `This Refund Policy governs all creative and digital services provided by NOÉTIC Studio ("the Agency"), a creative intelligence agency registered in Bangladesh, operating globally. All payments are processed through Paddle.com ("Paddle"), our designated Merchant of Record.

This policy applies to all service engagements including, but not limited to: logo design, brand identity systems, UI/UX design, web development, creative direction, and campaign design.

By engaging NOÉTIC Studio and submitting payment, you ("the Client") acknowledge and agree to the terms outlined in this policy.`,
  },
  {
    article: "02",
    title: "Milestone-Based Engagement Model",
    content: `All NOÉTIC Studio projects operate on a milestone-based engagement model. Each project is divided into clearly defined phases ("Milestones"), as detailed in your custom proposal and project agreement. Typical milestone structures include:

• Milestone 1 — Discovery & Strategy (non-refundable deposit)
• Milestone 2 — Concept Development & Initial Deliverables
• Milestone 3 — Refinement & Iteration Rounds
• Milestone 4 — Final Delivery & Asset Transfer

Payment for each milestone is due upon completion of the preceding phase and prior to commencement of the next. The exact milestone structure, deliverables, and payment schedule are defined in your individual project proposal.`,
  },
  {
    article: "03",
    title: "Initial Deposit & Non-Refundable Commitment",
    content: `All projects require an initial deposit ("Engagement Fee") before work commences. This deposit is set at a minimum of 50% of the total project investment, as specified in your proposal.

The Engagement Fee is strictly non-refundable once the project has been formally initiated, as it covers strategic discovery, resource allocation, and initial concept development.`,
  },
  {
    article: "04",
    title: "Project Cancellation by the Client",
    content: `In the event that the Client elects to cancel a project after work has commenced, the following terms apply:

a) The Client will be invoiced for all completed milestones up to the date of cancellation.

b) Pro-rata billing: For work completed during the execution of an active milestone, the Client will be billed for hours/effort consumed up to the moment of cancellation.

c) Zero refunds on delivery: Once final source assets, code, or deliverables have been transferred, no refunds of any kind will be issued.`,
  },
  {
    article: "05",
    title: "Final Delivery & No-Refund Clause",
    content: `Once final digital assets and deliverables have been delivered to the Client and the final milestone payment has been received, no refunds of any kind will be issued.

Due to the bespoke, intellectual, and non-tangible nature of creative and digital work:
• Delivered design files, brand assets, code, and digital materials cannot be "returned" in any meaningful sense
• The creative process involves significant intellectual labour, strategic thinking, and specialized expertise that is consumed upon delivery
• All work is custom-produced for the Client and cannot be resold, repurposed, or reassigned to another party

Final delivery is defined as the transfer of completed assets via the agreed-upon delivery method (file transfer, repository access, deployment, etc.), accompanied by a formal delivery confirmation from the Agency.`,
  },
  {
    article: "06",
    title: "Dissatisfaction & Revision Process",
    content: `NOÉTIC Studio is committed to exceeding client expectations. If you are not satisfied with deliverables at any milestone stage:

a) You are entitled to the number of revision rounds specified in your project proposal (typically two to three rounds per milestone).

b) Revision requests must be submitted within seven (7) business days of receiving milestone deliverables.

c) Revisions must be clearly articulated in writing with specific, actionable feedback. Vague directives such as "make it better" do not constitute valid revision requests.

d) Additional revision rounds beyond the agreed scope will be quoted separately and must be approved by the Client before work begins.

e) Dissatisfaction with subjective design direction — after approved revisions have been completed within scope — does not constitute grounds for a refund.`,
  },
  {
    article: "07",
    title: "Cancellation or Suspension by the Agency",
    content: `NOÉTIC Studio reserves the right to suspend or terminate a project under the following circumstances:

a) Failure by the Client to provide required materials, feedback, or approvals within fourteen (14) business days of the agreed schedule.

b) Non-payment of milestone invoices within the payment terms specified in the project agreement.

c) Breach of the Terms of Service or any conduct that materially impedes the Agency's ability to deliver work.

In such cases, the Client will be invoiced for all work completed to date. No refund will be issued for milestones already paid and delivered.`,
  },
  {
    article: "08",
    title: "Payment Processor & Dispute Resolution",
    content: `All payments are processed through Paddle.com, which acts as the Merchant of Record for NOÉTIC Studio. By making a payment, you are transacting with Paddle, who will handle:

• Payment processing and invoicing
• Sales tax and VAT calculation and remittance
• Payment dispute mediation (initial stage)

If you believe a charge is in error or wish to dispute a payment, please first contact NOÉTIC Studio directly at contact@noeticstudio.net. We are committed to resolving payment issues amicably within five (5) business days.

If a resolution cannot be reached through direct communication, the dispute shall be escalated through Paddle's merchant dispute resolution process before any external legal proceedings are initiated.`,
  },
  {
    article: "09",
    title: "Governing Law & Jurisdiction",
    content: `This Refund Policy is governed by and construed in accordance with the laws of Bangladesh. Any disputes arising from or relating to this policy shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.

Notwithstanding the above, the Agency acknowledges and adheres to international consumer protection standards applicable to B2B digital service transactions, including relevant provisions under EU consumer directives for European clients.`,
  },
  {
    article: "10",
    title: "Amendments & Contact",
    content: `NOÉTIC Studio reserves the right to update or modify this Refund Policy at any time. Changes take effect immediately upon publication on this page. Clients with active projects will be notified of material changes via email.

For all refund inquiries, payment questions, or dispute resolution, contact us directly:

• Email: contact@noeticstudio.net
• WhatsApp: +8801755831289
• Response Time: Within 24–48 business hours`,
  },
];

export default function RefundPage() {
  return (
    <div className="pt-[var(--nav-height)] pb-24 relative overflow-hidden min-h-screen">
      {/* Background elements */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[var(--accent-teal)]/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--accent-teal-glow)] rounded-full blur-[120px] opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <section className="section-padding relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 md:mb-24"
          >
            <span className="text-label mb-4 block tracking-[0.3em]">Financial Framework</span>
            <h1 className="heading-display text-4xl md:text-5xl lg:text-7xl mb-6 tracking-tighter">
              Refund <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-body text-lg max-w-2xl">
              A transparent, milestone-based framework governing cancellations,
              refund eligibility, and the financial terms of creative engagements
              with NOÉTIC Studio.
            </p>
            <p className="mt-6 text-sm text-[var(--accent-teal-light)] font-[family-name:var(--font-body)]">
              Effective Date: April 22, 2026 &nbsp;·&nbsp; Last Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>

          {/* Content */}
          <div className="space-y-6">
            {refundSections.map((section, index) => (
              <motion.div
                key={section.article}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
              >
                <GlassCard padding="lg" hover={false} className="border-l-2 border-l-[var(--border-glass)] hover:border-l-[var(--accent-teal-light)] transition-colors duration-500">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                    <div className="md:w-1/3">
                      <div className="text-[10px] text-[var(--accent-teal-light)] uppercase tracking-[0.2em] mb-2 font-medium">
                        Article {section.article}
                      </div>
                      <h2 className="heading-section text-xl md:text-2xl text-[var(--text-bone)]">
                        {section.title}
                      </h2>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-body text-[var(--text-bone-muted)] leading-relaxed text-[15px] whitespace-pre-wrap">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-16 text-center space-y-6"
          >
            <p className="text-xs text-[var(--text-bone-dim)] font-[family-name:var(--font-body)] uppercase tracking-widest max-w-xl mx-auto">
              By initiating a project engagement and submitting your Engagement Fee, you confirm acceptance of this Refund Policy in full.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/terms">
                <Button variant="outline" size="md" className="gap-2 px-6 text-xs">
                  <ArrowRight size={14} />
                  Terms of Service
                </Button>
              </Link>
              <Link href="/privacy">
                <Button variant="outline" size="md" className="gap-2 px-6 text-xs">
                  <ArrowRight size={14} />
                  Privacy Policy
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
