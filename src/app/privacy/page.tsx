"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const privacySections = [
  {
    section: "01",
    title: "Introduction & Data Controller",
    content: `This Privacy Policy describes how NOÉTIC Studio ("the Agency," "we," "us," or "our"), a creative intelligence agency registered in Bangladesh, collects, uses, stores, and protects your personal information when you engage our services, visit our website (noeticstudio.net), or communicate with us.

NOÉTIC Studio is the data controller responsible for your personal data. We are committed to protecting the privacy and security of all individuals whose data we process — including clients, prospective clients, website visitors, and business contacts.

This policy is designed to comply with:
• The General Data Protection Regulation (GDPR) — for individuals in the European Economic Area (EEA) and the United Kingdom
• The California Consumer Privacy Act (CCPA) — for California residents
• The Information and Communication Technology Act, 2006 of Bangladesh
• Applicable international data protection standards for B2B digital services`,
  },
  {
    section: "02",
    title: "Information We Collect",
    content: `We collect and process the following categories of personal data:

a) Information You Provide Directly:
• Contact information: name, email address, phone number, company name
• Project briefs: brand details, creative direction, content, and assets shared for project purposes
• Communication records: emails, messages, call notes, and feedback exchanged during engagements
• Business information: company registration details, billing addresses, and tax identification numbers (where applicable)

b) Information Collected Automatically:
• Website analytics: pages visited, time on site, referral source, device type, browser type, and IP address (collected via privacy-respecting analytics tools)
• Cookies: essential functionality cookies and optional analytics cookies (see Section 08)

c) Information from Third Parties:
• Payment data: transaction records, payment status, and invoicing information provided by Paddle.com, our Merchant of Record
• Referral information: contact details provided by mutual contacts or partner agencies with your consent

We do NOT collect or process:
• Sensitive personal data (racial or ethnic origin, political opinions, religious beliefs, biometric data, health data)
• Payment card details — all payment information is processed exclusively and securely by Paddle.com. NOÉTIC Studio never has access to your full card number, CVV, or banking credentials.`,
  },
  {
    section: "03",
    title: "How We Use Your Data",
    content: `We process your personal data for the following purposes and under the corresponding legal bases:

a) Contract Performance (GDPR Art. 6(1)(b)):
• Delivering creative and digital services as outlined in your Project Agreement
• Managing project communications, feedback cycles, and deliverable transfers
• Processing milestone payments through our payment processor

b) Legitimate Interests (GDPR Art. 6(1)(f)):
• Responding to inquiries and providing quotations
• Improving our services, website, and client experience
• Internal analytics and business intelligence (aggregated, non-identifiable data)
• Portfolio showcase and case study creation (with your consent or as permitted under our Terms)

c) Legal Obligation (GDPR Art. 6(1)(c)):
• Maintaining financial records for tax and regulatory compliance
• Responding to lawful requests from authorities

d) Consent (GDPR Art. 6(1)(a)):
• Sending marketing communications or newsletters (opt-in only)
• Using optional analytics cookies on our website

We will never sell, rent, or trade your personal data to third parties for their marketing purposes.`,
  },
  {
    section: "04",
    title: "Payment Data & Paddle",
    content: `"Financial transactions are managed by Paddle.com. They act as the Merchant of Record, ensuring PCI-DSS compliant handling of payment data and managing billing-related customer inquiries." All payments for NOÉTIC Studio services are processed through Paddle.com ("Paddle"), which acts as our Merchant of Record.
    
When you make a payment:
• Your payment information (credit/debit card details, PayPal credentials, or other payment methods) is collected and processed exclusively by Paddle
• NOÉTIC Studio does NOT store, access, or process your payment card details
• Paddle is PCI DSS Level 1 compliant, the highest level of payment security certification
• Paddle handles sales tax, VAT, and GST calculation and remittance

Paddle processes your data in accordance with its own Privacy Policy, which can be reviewed at paddle.com/privacy. By making a payment, you also agree to Paddle's terms.

Transaction records (amount, date, invoice number, payment status) are shared with NOÉTIC Studio for accounting and project management purposes only.`,
  },
  {
    section: "05",
    title: "Data Sharing & Third Parties",
    content: `We may share your personal data with the following categories of recipients, only to the extent necessary:

a) Payment Processor:
• Paddle.com — for processing payments, issuing invoices, and handling tax compliance

b) Cloud Infrastructure:
• Vercel — website hosting and deployment
• Supabase — secure database hosting for project and contact management

c) Communication Tools:
• Email service providers — for transactional and project-related communications
• WhatsApp Business — for client communications (where initiated by the Client)

d) Professional Advisors:
• Legal counsel, accountants, and auditors — under confidentiality obligations

e) Legal Requirements:
• Government authorities or regulatory bodies — when required by law or to protect our legal rights

All third-party service providers are contractually obligated to process your data securely and in compliance with applicable data protection laws. We conduct due diligence on all sub-processors.

We do NOT share your data with advertising networks, data brokers, or social media platforms for tracking or targeting purposes.`,
  },
  {
    section: "06",
    title: "Data Retention",
    content: `We retain your personal data only for as long as necessary to fulfill the purposes described in this policy:

• Active client data: Retained for the duration of the project engagement plus three (3) years after completion, for warranty, support, and portfolio purposes.

• Inquiry and quotation data: Retained for twelve (12) months from the date of last contact. If no engagement results, data is securely deleted.

• Financial and tax records: Retained for seven (7) years in compliance with Bangladesh tax regulations and international accounting standards.

• Website analytics data: Retained in aggregated, anonymized form. Individual session data is purged within ninety (90) days.

• Marketing consent records: Retained until consent is withdrawn.

Upon expiration of the retention period, personal data is securely deleted or anonymized beyond recovery.`,
  },
  {
    section: "07",
    title: "Your Rights",
    content: `Depending on your jurisdiction, you have the following rights regarding your personal data:

GDPR Rights (EEA & UK Residents):
• Right of Access — request a copy of your personal data
• Right to Rectification — correct inaccurate or incomplete data
• Right to Erasure ("Right to be Forgotten") — request deletion of your data
• Right to Restrict Processing — limit how we use your data
• Right to Data Portability — receive your data in a structured, machine-readable format
• Right to Object — object to processing based on legitimate interests
• Right to Withdraw Consent — withdraw consent at any time for consent-based processing

CCPA Rights (California Residents):
• Right to Know — what personal information we collect, use, and disclose
• Right to Delete — request deletion of your personal information
• Right to Opt-Out — opt out of the "sale" of personal information (note: we do not sell personal data)
• Right to Non-Discrimination — equal service regardless of exercising privacy rights

To exercise any of these rights, contact us at:
• Email: contact@noeticstudio.net
• Subject Line: "Data Rights Request — [Your Name]"

We will respond to all verified requests within thirty (30) days (GDPR) or forty-five (45) days (CCPA).`,
  },
  {
    section: "08",
    title: "Cookies & Tracking",
    content: `Our website (noeticstudio.net) uses a minimal, privacy-respecting approach to cookies:

Essential Cookies:
• Required for basic site functionality (session management, security)
• Cannot be disabled as they are necessary for the website to operate

Analytics Cookies (Optional):
• Used to understand how visitors interact with our site
• Collected via privacy-respecting analytics (no cross-site tracking)
• No personally identifiable information is stored in analytics cookies
• You can opt out of analytics cookies at any time

We do NOT use:
• Third-party advertising cookies
• Social media tracking pixels
• Cross-site tracking technologies
• Fingerprinting or invasive identification methods

Your browser settings allow you to manage and delete cookies at any time. Disabling essential cookies may affect site functionality.`,
  },
  {
    section: "09",
    title: "International Data Transfers",
    content: `As a globally operating agency based in Bangladesh, your personal data may be transferred to and processed in countries outside your jurisdiction. We ensure that all international transfers are protected by:

• Standard Contractual Clauses (SCCs) approved by the European Commission for transfers from the EEA
• Adequacy decisions where applicable
• Contractual obligations with all sub-processors ensuring equivalent levels of data protection
• Encryption in transit (TLS 1.2+) and at rest for all stored data

Our primary infrastructure providers (Vercel, Supabase) maintain SOC 2 Type II certifications and process data in accordance with GDPR requirements.`,
  },
  {
    section: "10",
    title: "Data Security",
    content: `We implement robust technical and organizational measures to protect your personal data, including:

• Encryption: All data in transit is protected via TLS 1.2+ encryption. Data at rest is encrypted using AES-256 standards.
• Access Controls: Personal data access is restricted to authorized personnel on a need-to-know basis.
• Infrastructure Security: Our hosting and database providers maintain SOC 2 Type II compliance and undergo regular security audits.
• Incident Response: We maintain a data breach response plan. In the event of a data breach affecting your personal data, we will notify you and the relevant supervisory authority within seventy-two (72) hours as required by GDPR.

While we take all reasonable precautions, no method of data transmission or storage is 100% secure. We cannot guarantee absolute security but are committed to continuous improvement of our security practices.`,
  },
  {
    section: "11",
    title: "Children's Privacy",
    content: `NOÉTIC Studio's services are designed for business-to-business (B2B) engagements. We do not knowingly collect, process, or solicit personal data from individuals under the age of 16.

If we become aware that we have inadvertently collected personal data from a minor, we will take immediate steps to delete that information. If you believe a minor has provided us with personal data, please contact us immediately at contact@noeticstudio.net.`,
  },
  {
    section: "12",
    title: "Changes & Contact Information",
    content: `NOÉTIC Studio reserves the right to update this Privacy Policy at any time. Material changes will be communicated via:
• Prominent notice on our website
• Direct email notification to active clients

The "Last Updated" date at the top of this page reflects the most recent revision.

For all privacy-related inquiries, data access requests, or concerns, contact our data protection team:

• Email: contact@noeticstudio.net
• Subject Line: "Privacy Inquiry"
• WhatsApp: +8801755831289
• Response Time: Within 24–48 business hours

If you are not satisfied with our response, you have the right to lodge a complaint with your local data protection authority. For EEA residents, you may contact your national Data Protection Authority (DPA).`,
  },
];

export default function PrivacyPage() {
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
            <span className="text-label mb-4 block tracking-[0.3em]">Privacy Framework</span>
            <h1 className="heading-display text-4xl md:text-5xl lg:text-7xl mb-6 tracking-tighter">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-body text-lg max-w-2xl">
              How NOÉTIC Studio collects, processes, protects, and governs your personal data — designed for full GDPR and CCPA compliance across all international engagements.
            </p>
            <p className="mt-6 text-sm text-[var(--accent-teal-light)] font-[family-name:var(--font-body)]">
              Effective Date: April 22, 2026 &nbsp;·&nbsp; Last Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>
          
          {/* Content */}
          <div className="space-y-6">
            {privacySections.map((section, index) => (
              <motion.div
                key={section.section}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
              >
                <GlassCard padding="lg" hover={false} className="border-l-2 border-l-[var(--border-glass)] hover:border-l-[var(--accent-teal-light)] transition-colors duration-500">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                    <div className="md:w-1/3">
                      <div className="text-[10px] text-[var(--accent-teal-light)] uppercase tracking-[0.2em] mb-2 font-medium">
                        Section {section.section}
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
              Direct all privacy inquiries, data erasure requests, or GDPR/CCPA rights requests to contact@noeticstudio.net.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/terms">
                <Button variant="outline" size="md" className="gap-2 px-6 text-xs">
                  <ArrowRight size={14} />
                  Terms of Service
                </Button>
              </Link>
              <Link href="/refund">
                <Button variant="outline" size="md" className="gap-2 px-6 text-xs">
                  <ArrowRight size={14} />
                  Refund Policy
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
