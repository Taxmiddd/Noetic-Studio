"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export default function PayLandingPage() {
  const router = useRouter();
  const [invoiceId, setInvoiceId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = invoiceId.trim();

    if (!trimmed) {
      setError("Please enter your Invoice ID.");
      return;
    }

    if (!uuidRegex.test(trimmed)) {
      setError("That doesn't look like a valid Invoice ID. Please check and try again.");
      return;
    }

    setLoading(true);

    // Verify the invoice exists before navigating
    try {
      const res = await fetch(`/api/invoices/${trimmed}`);
      if (!res.ok) {
        setError("Invoice not found. Please double-check your ID.");
        setLoading(false);
        return;
      }
      router.push(`/pay/${trimmed}`);
    } catch {
      setError("Could not verify invoice. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden min-h-screen bg-[var(--bg-base)] text-[var(--text-bone)] flex flex-col">
      {/* Background Effects */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[var(--accent-teal)]/8 to-transparent pointer-events-none" />
      <div className="absolute top-[30%] left-1/2 w-[700px] h-[700px] bg-[var(--accent-teal-glow)] rounded-full blur-[180px] opacity-15 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[var(--accent-teal-glow)] rounded-full blur-[120px] opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[var(--accent-teal-glow)] rounded-full blur-[100px] opacity-5 pointer-events-none" />

      {/* Subtle grid */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">
        {/* Logo + Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
              <path
                d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z"
                fill="var(--accent-teal-light)"
              />
            </svg>
            <span className="text-2xl font-[family-name:var(--font-heading)] font-bold tracking-wider">
              NOÉTIC
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-bone-dim)] font-[family-name:var(--font-body)]">
            Secure Payment Portal
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <GlassCard
            padding="lg"
            className="border-[var(--accent-teal)]/20 shadow-[0_0_60px_rgba(13,115,119,0.08)]"
          >
            <div className="text-center mb-8">
              <h1 className="heading-section text-2xl md:text-3xl mb-3">
                Access Your Invoice
              </h1>
              <p className="text-body text-sm leading-relaxed max-w-xs mx-auto">
                Enter the Invoice ID provided by NOÉTIC Studio to view details
                and complete your payment securely.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-bone-dim)] block font-[family-name:var(--font-body)]">
                  Invoice ID
                </label>
                <input
                  type="text"
                  value={invoiceId}
                  onChange={(e) => {
                    setInvoiceId(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="e.g. a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                  className="w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-xl px-4 py-3.5 text-sm text-[var(--text-bone)] font-mono placeholder:text-[var(--text-bone-dim)]/40 focus:outline-none focus:border-[var(--accent-teal)] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.15)] transition-all duration-300"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-center"
                >
                  <p className="text-red-400 text-xs">{error}</p>
                </motion.div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center py-3.5 text-sm shadow-[0_0_25px_rgba(13,115,119,0.3)] hover:shadow-[0_0_35px_rgba(13,115,119,0.5)] transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Verifying…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    View Invoice
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                )}
              </Button>
            </form>

            {/* Security Footer */}
            <div className="mt-8 pt-5 border-t border-[var(--border-glass)]">
              <div className="flex items-center justify-center gap-5 text-[10px] text-[var(--text-bone-dim)]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full block" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full block" />
                  <span>PCI Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full block" />
                  <span>Protected</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Bottom Help */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-[11px] text-[var(--text-bone-dim)] mt-8 text-center"
        >
          Don&apos;t have an Invoice ID?{" "}
          <a
            href="https://noeticstudio.net/contact"
            className="text-[var(--accent-teal-light)] hover:underline"
          >
            Contact NOÉTIC Studio
          </a>
        </motion.p>
      </div>

      {/* Bottom Brand Bar */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-center py-6 border-t border-[var(--border-subtle)] relative z-10"
      >
        <p className="text-[10px] text-[var(--text-bone-dim)] tracking-widest uppercase font-[family-name:var(--font-body)]">
          © {new Date().getFullYear()} NOÉTIC Studio · Creative Intelligence
        </p>
      </motion.footer>
    </div>
  );
}
