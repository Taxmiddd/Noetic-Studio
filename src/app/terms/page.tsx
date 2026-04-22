"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const termsSections = [
  {
    article: "01",
    title: "Definitions & Interpretation",
    content: `In these Terms of Service ("Terms"), the following definitions apply:

"Agency" or "NOÉTIC Studio" refers to NOÉTIC Studio, a brand name owned and operated by Meraj Hossain, a registered sole proprietorship in Dhaka, Bangladesh.

"Client" or "You" refers to any individual, company, or organization engaging NOÉTIC Studio for services.

"Services" refers to all creative, strategic, and digital services provided by the Agency, including but not limited to: logo design, brand identity systems, UI/UX design, web development, creative direction, campaign design, and related consulting.

"Deliverables" refers to all tangible and intangible outputs produced by the Agency under a project engagement, including design files, source code, brand guidelines, digital assets, and documentation.

"Proposal" or "Project Agreement" refers to the custom scope of work, timeline, and investment breakdown provided to the Client prior to engagement.

"Merchant of Record" refers to Paddle.com, our designated payment processor responsible for handling all global financial transactions on behalf of the Agency. All global payments are securely processed via Paddle.com, our designated Merchant of Record.`,
  },
  {
    article: "02",
    title: "Acceptance of Terms",
    content: `By engaging NOÉTIC Studio — whether through signing a project proposal, submitting an Engagement Fee, or providing written authorization to commence work — you ("the Client") confirm that you have read, understood, and agree to be bound by these Terms of Service in full.

These Terms constitute a legally binding agreement between the Client and NOÉTIC Studio. If you are entering into this agreement on behalf of a company or legal entity, you represent and warrant that you have the authority to bind that entity to these Terms.

In the event of any conflict between these Terms and a signed Project Agreement, the Project Agreement shall take precedence to the extent of the inconsistency.`,
  },
  {
    article: "03",
    title: "Scope of Services & Digital Delivery",
    content: `NOÉTIC Studio provides bespoke creative and digital services as outlined in each Client's individual Project Agreement. All services are delivered digitally unless explicitly agreed otherwise.

Service delivery includes:
• Design assets delivered in industry-standard formats (AI, PSD, SVG, PNG, PDF, Figma, etc.)
• Web development deliverables provided via code repositories, staging environments, or direct server deployment
• Brand systems documented through comprehensive brand guideline documents
• All communication, feedback, and approvals conducted through digital channels

The Agency does not provide physical goods, printed materials, or tangible products unless explicitly included in the Project Agreement. The Client acknowledges that all Deliverables are digital in nature and delivered electronically.`,
  },
  {
    article: "04",
    title: "Project Timelines & Client Obligations",
    content: `All project timelines are estimates provided in good faith based on the scope defined in the Project Agreement. Timelines are contingent upon:

a) Timely provision of required materials, content, and brand assets by the Client.
b) Prompt feedback and approval within the review periods specified in the Project Agreement (typically five to seven business days per review cycle).
c) Adherence to the agreed milestone payment schedule.

Delays caused by the Client — including late feedback, scope changes, or delayed payments — may result in adjusted timelines. The Agency is not liable for project delays attributable to Client inaction.

If the Client fails to respond to communications or provide required materials for a period exceeding thirty (30) business days, the Agency reserves the right to archive the project. Reactivation may require a new Engagement Fee.`,
  },
  {
    article: "05",
    title: "Intellectual Property Rights",
    content: `Intellectual property rights for all Deliverables are governed as follows:

a) Pre-Payment: All concepts, designs, code, and creative work remain the exclusive intellectual property of NOÉTIC Studio until full and final payment for the relevant milestone (or the entire project) has been received.

b) Upon Final Payment: Upon receipt of the final milestone payment, full intellectual property rights for the agreed Deliverables transfer to the Client. This includes:
   • Unrestricted usage rights for commercial and non-commercial purposes
   • Modification and adaptation rights
   • Distribution and reproduction rights
   • The right to register trademarks for logo and brand identity work

c) Exceptions: The following are retained by the Agency regardless of payment:
   • The right to showcase the work in the Agency's portfolio, website, social media, and marketing materials (unless a Non-Disclosure Agreement is in effect)
   • Proprietary tools, frameworks, code libraries, and methodologies developed independently by the Agency prior to or during the engagement
   • Generic, non-client-specific design elements and patterns

d) Third-Party Assets: If the Deliverables incorporate licensed third-party assets (stock imagery, fonts, plugins), the Client is responsible for maintaining valid licenses for those assets. The Agency will disclose all third-party dependencies.`,
  },
  {
    article: "06",
    title: "Payment Terms & Merchant of Record",
    content: `"All global payments are securely processed via Paddle.com, our designated Merchant of Record." All payments for NOÉTIC Studio services are processed through Paddle.com ("Paddle"), which acts as our Merchant of Record.

By submitting payment, the Client is transacting with Paddle, which handles:
• Secure payment processing (credit/debit cards, PayPal, and regional methods)
• Invoice generation and delivery
• Sales tax, VAT, and GST calculation and remittance
• Payment receipts and financial documentation

Payment terms:
a) All engagements require a non-refundable Engagement Fee (typically 30–50% of total project investment) before work commences.
b) Subsequent milestone payments are due upon completion of each project phase, as outlined in the Project Agreement.
c) Final payment is due upon delivery of the last milestone and prior to the transfer of final Deliverables and intellectual property rights.
d) Invoices are payable within seven (7) business days of issuance unless otherwise agreed.
e) Late payments may incur a 2% monthly surcharge on the outstanding balance and may result in project suspension.

All prices quoted are exclusive of applicable taxes unless stated otherwise. Paddle will calculate and apply relevant taxes at the point of transaction.`,
  },
  {
    article: "07",
    title: "Confidentiality",
    content: `Both parties agree to maintain the confidentiality of all proprietary information exchanged during the engagement, including but not limited to:

• Business strategies, marketing plans, and competitive intelligence
• Unreleased brand concepts and creative work
• Technical specifications, source code, and system architectures
• Financial terms and pricing structures
• Customer data and audience insights

Confidentiality obligations survive the termination of the engagement for a period of two (2) years, unless the information becomes publicly available through no fault of the receiving party.

If a formal Non-Disclosure Agreement (NDA) is required, the Agency is prepared to execute a mutual NDA prior to the commencement of any engagement.`,
  },
  {
    article: "08",
    title: "Limitation of Liability",
    content: `To the maximum extent permitted by applicable law:

a) NOÉTIC Studio's total liability arising from or in connection with any engagement shall not exceed the total fees paid by the Client for the specific project in question.

b) The Agency shall not be liable for any indirect, incidental, consequential, special, or punitive damages, including but not limited to: loss of revenue, loss of business opportunities, loss of data, or reputational harm.

c) The Agency is not liable for delays, interruptions, or failures caused by circumstances beyond its reasonable control, including but not limited to: natural disasters, government actions, internet outages, third-party service failures, and pandemics (force majeure).

d) The Client acknowledges that creative and design work involves subjective judgment, and the Agency does not guarantee any specific business outcomes, revenue increases, or market performance resulting from the Deliverables.`,
  },
  {
    article: "09",
    title: "Termination",
    content: `Either party may terminate a project engagement under the following conditions:

a) By the Client: The Client may terminate at any time by providing written notice to contact@noeticstudio.net. Termination is governed by the Refund Policy, including payment for completed milestones and forfeiture of the Engagement Fee.

b) By the Agency: The Agency may terminate an engagement if:
   • The Client materially breaches these Terms or the Project Agreement
   • Payment obligations are not met within the specified terms
   • The Client's conduct makes continued collaboration untenable
   • The Client fails to respond to communications for thirty (30) business days

c) Effect of Termination: Upon termination, the Client receives ownership rights only to Deliverables from fully paid and completed milestones. All other work-in-progress remains the property of the Agency.`,
  },
  {
    article: "10",
    title: "Governing Law & Dispute Resolution",
    content: `These Terms of Service are governed by and construed in accordance with the laws of the People's Republic of Bangladesh.

Any dispute, controversy, or claim arising out of or relating to these Terms shall be resolved as follows:

a) Negotiation: The parties shall first attempt to resolve the dispute through good-faith negotiation within thirty (30) days of written notice of the dispute.

b) Mediation: If negotiation fails, the parties agree to submit the dispute to mediation administered by a mutually agreed-upon mediator in Dhaka, Bangladesh.

c) Litigation: If mediation is unsuccessful, the dispute shall be submitted to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.

Notwithstanding the above, the Agency acknowledges and respects applicable international B2B contract standards, including relevant EU directives for European clients and applicable provisions under the laws of the Client's jurisdiction where mandated by international treaty.`,
  },
  {
    article: "11",
    title: "Amendments & Severability",
    content: `NOÉTIC Studio reserves the right to update or modify these Terms of Service at any time. Updated Terms take effect immediately upon publication on this page.

Clients with active project engagements will be notified of material changes via email at least fourteen (14) days prior to the changes taking effect.

If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect.

For questions regarding these Terms, contact us at:
• Email: contact@noeticstudio.net
• WhatsApp: +8801755831289`,
  },
];

export default function TermsPage() {
  return (
    <div className="pt-[var(--nav-height)] pb-24 relative overflow-hidden min-h-screen">
      {/* Background elements */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[var(--accent-teal)]/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-teal-glow)] rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <section className="section-padding relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 md:mb-24"
          >
            <span className="text-label mb-4 block tracking-[0.3em]">Legal Framework</span>
            <h1 className="heading-display text-4xl md:text-5xl lg:text-7xl mb-6 tracking-tighter">
              Terms of <span className="gradient-text">Service</span>
            </h1>
            <p className="text-body text-lg max-w-2xl">
              The binding terms of engagement between your organization and NOÉTIC Studio — governing digital service delivery, intellectual property, payment, and project execution.
            </p>
            <p className="mt-6 text-sm text-[var(--accent-teal-light)] font-[family-name:var(--font-body)]">
              Effective Date: April 22, 2026 &nbsp;·&nbsp; Last Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>
          
          {/* Content */}
          <div className="space-y-6">
            {termsSections.map((section, index) => (
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

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-16 text-center space-y-6"
          >
            <p className="text-xs text-[var(--text-bone-dim)] font-[family-name:var(--font-body)] uppercase tracking-widest max-w-xl mx-auto">
              Transfer of the initial Engagement Fee designates formal acceptance of the terms detailed above.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/refund">
                <Button variant="outline" size="md" className="gap-2 px-6 text-xs">
                  <ArrowRight size={14} />
                  Refund Policy
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
