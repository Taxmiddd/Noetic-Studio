'use client';

/**
 * UniversalPaymentWidget
 *
 * A dual-gateway payment component that seamlessly switches between:
 *  - Lemon Squeezy overlay (existing flow)
 *  - Payoneer Embedded Checkout (Square-style, no redirects)
 *
 * Props:
 *   invoice          — the full invoice object from the DB
 *   preferred_gateway — 'lemon_squeezy' | 'payoneer'
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

/* ─── Types ─── */
export interface Invoice {
  id: string;
  client_name: string;
  client_email: string;
  project_name: string;
  notes: string | null;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  checkout_url: string | null;
  receipt_url: string | null;
  paid_at: string | null;
  created_at: string;
}

interface UniversalPaymentWidgetProps {
  invoice: Invoice;
  preferred_gateway?: 'lemon_squeezy' | 'payoneer';
}

/* ─── Framer Motion Variants ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

/* ─── Security Badge Row ─── */
function SecurityBadges() {
  return (
    <motion.div
      variants={itemVariants}
      className="flex items-center justify-center gap-4 text-[10px] text-[var(--text-bone-dim)] mt-4"
    >
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full block" />
        <span>SSL Encrypted</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full block" />
        <span>PCI Compliant</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full block" />
        <span>Protected</span>
      </div>
    </motion.div>
  );
}

/* ─── Skeleton Loader ─── */
function PayoneerSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-24 bg-[var(--bg-elevated)] rounded" />
          <div className="h-11 w-full bg-[var(--bg-elevated)] rounded-lg" />
        </div>
      ))}
      <div className="h-14 w-full bg-[var(--bg-elevated)] rounded-lg mt-4" />
    </div>
  );
}

/* ─── Lemon Squeezy Branch ─── */
function LemonSqueezyGateway({ invoice }: { invoice: Invoice }) {
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(invoice.checkout_url);
  const [loading, setLoading] = useState(false);

  // If no checkout URL yet, generate one on mount
  useEffect(() => {
    if (checkoutUrl) return;
    setLoading(true);
    fetch('/api/payments/lemon-squeezy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId: invoice.id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.checkoutUrl) setCheckoutUrl(data.checkoutUrl);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [invoice.id, checkoutUrl]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      {/* Lemon Squeezy Script — overlay mode */}
      <Script src="https://app.lemonsqueezy.com/js/lemon.js" strategy="afterInteractive" />

      <motion.div variants={itemVariants}>
        <a
          href={checkoutUrl || '#'}
          className={`lemonsqueezy-button block w-full group ${!checkoutUrl ? 'pointer-events-none opacity-60' : ''}`}
        >
          <Button
            variant="primary"
            className="w-full justify-center text-sm py-4 shadow-[0_0_20px_rgba(13,115,119,0.4)] group-hover:shadow-[0_0_30px_rgba(13,115,119,0.6)] transition-all duration-300 transform group-hover:scale-[1.02]"
            disabled={loading || !checkoutUrl}
          >
            <span className="flex items-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Preparing Checkout…
                </>
              ) : (
                <>
                  💳 Proceed to Secure Payment
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
          </Button>
        </a>
      </motion.div>

      <motion.p variants={itemVariants} className="text-center text-[10px] text-[var(--text-bone-dim)]">
        A secure payment overlay will open in this window.
      </motion.p>

      <SecurityBadges />
    </motion.div>
  );
}

/* ─── Payoneer Embedded Branch ─── */
function PayoneerGateway({ invoice }: { invoice: Invoice }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkState, setSdkState] = useState<'idle' | 'loading' | 'ready' | 'processing' | 'success' | 'error'>('idle');
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [longId, setLongId] = useState<string | null>(null);
  const [programId, setProgramId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mountedRef = useRef(false);

  // 1. Fetch longId from our backend
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    setSdkState('loading');

    fetch('/api/payments/payoneer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId: invoice.id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.longId) {
          setLongId(data.longId);
          setProgramId(data.programId);
        } else {
          throw new Error(data.error || 'Failed to initialize Payoneer');
        }
      })
      .catch((err) => {
        console.error('[Payoneer Widget]', err);
        setErrorMsg(err.message || 'Could not connect to Payoneer. Please try again.');
        setSdkState('error');
      });
  }, [invoice.id]);

  // 2. Mount the SDK once both longId and the Payoneer script are ready
  const mountPayoneerSDK = useCallback(() => {
    if (!longId || !programId || !containerRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Payoneer = (window as any).Payoneer;
    if (!Payoneer) return;

    try {
      const checkout = Payoneer.checkout({
        programId,
        longId,
        container: '#payoneer-card-fields',
        cssUrl: '/payoneer-matte.css',
        locale: 'en',
        onReady: () => setSdkState('ready'),
        onSuccess: () => {
          setSdkState('success');
          // Refresh page after short delay to show updated status
          setTimeout(() => window.location.reload(), 2000);
        },
        onError: (err: { message?: string }) => {
          console.error('[Payoneer SDK] Error:', err);
          setErrorMsg(err?.message || 'Payment failed. Please check your card details.');
          setSdkState('error');
        },
      });

      // Expose submit function for our custom button
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__payoneerCheckout = checkout;
    } catch (err) {
      console.error('[Payoneer SDK] Mount failed:', err);
      setErrorMsg('Could not load payment form. Please refresh and try again.');
      setSdkState('error');
    }
  }, [longId, programId]);

  // 3. Trigger mount when SDK script loads
  useEffect(() => {
    if (sdkLoaded && longId) {
      mountPayoneerSDK();
    }
  }, [sdkLoaded, longId, mountPayoneerSDK]);

  const handleSubmit = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkout = (window as any).__payoneerCheckout;
    if (checkout?.submit) {
      setSdkState('processing');
      checkout.submit();
    }
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: invoice.currency,
  });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      {/* Load Payoneer SDK only on this route */}
      <Script
        src="https://checkout.payoneer.com/js/payoneer-checkout.js"
        strategy="afterInteractive"
        onLoad={() => setSdkLoaded(true)}
        onError={() => {
          setErrorMsg('Failed to load Payoneer SDK. Check your connection.');
          setSdkState('error');
        }}
      />

      <AnimatePresence mode="wait">
        {sdkState === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center space-y-3"
          >
            <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[var(--accent-teal-light)] font-medium text-sm">Payment Successful</p>
            <p className="text-[10px] text-[var(--text-bone-dim)]">Updating invoice status…</p>
          </motion.div>
        ) : sdkState === 'error' ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
              <p className="text-red-400 text-sm font-medium mb-1">Payment Unavailable</p>
              <p className="text-[11px] text-[var(--text-bone-dim)]">{errorMsg}</p>
            </div>
            <Button
              variant="outline"
              className="w-full justify-center text-sm"
              onClick={() => {
                setSdkState('idle');
                setErrorMsg(null);
                mountedRef.current = false;
                window.location.reload();
              }}
            >
              Try Again
            </Button>
          </motion.div>
        ) : (
          <motion.div key="form" variants={containerVariants} className="space-y-5">
            {/* SDK Loading Skeleton */}
            {(sdkState === 'loading' || sdkState === 'idle') && <PayoneerSkeleton />}

            {/* Payoneer Card Fields Mount Target */}
            <div
              id="payoneer-card-fields"
              ref={containerRef}
              className={`transition-opacity duration-500 ${sdkState === 'ready' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
              style={{ minHeight: sdkState === 'ready' ? 'auto' : '0' }}
            />

            {/* Amount summary before submit */}
            {sdkState === 'ready' && (
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between text-sm bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-5 py-3"
              >
                <span className="text-[var(--text-bone-dim)] text-[11px] uppercase tracking-widest">Total Due</span>
                <span className="text-[var(--accent-teal-light)] font-light text-lg tracking-tight">
                  {formatter.format(invoice.amount)}
                </span>
              </motion.div>
            )}

            {/* Pay Now Button */}
            {sdkState === 'ready' && (
              <motion.div variants={itemVariants}>
                <button
                  id="payoneer-pay-now"
                  onClick={handleSubmit}
                  disabled={sdkState !== 'ready'}
                  className="w-full h-[52px] bg-[var(--text-bone)] text-[#040D0C] rounded-lg font-bold text-[13px] uppercase tracking-[0.15em] cursor-pointer transition-all duration-200 hover:bg-white hover:shadow-[0_4px_20px_rgba(245,245,240,0.15)] hover:-translate-y-px active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Pay {formatter.format(invoice.amount)}
                </button>
              </motion.div>
            )}

            {/* Processing state overlay */}
            {sdkState === 'processing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-4 gap-3"
              >
                <svg className="animate-spin w-6 h-6 text-[var(--accent-teal)]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-[11px] text-[var(--text-bone-dim)] uppercase tracking-widest">Processing Payment…</p>
              </motion.div>
            )}

            <SecurityBadges />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Export ─── */
export default function UniversalPaymentWidget({
  invoice,
  preferred_gateway,
}: UniversalPaymentWidgetProps) {
  // Resolve gateway: prop overrides, fallback to invoice.gateway, default to lemon_squeezy
  const gateway = preferred_gateway ?? invoice.gateway ?? 'lemon_squeezy';

  return (
    <AnimatePresence mode="wait">
      {gateway === 'payoneer' ? (
        <motion.div
          key="payoneer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <PayoneerGateway invoice={invoice} />
        </motion.div>
      ) : (
        <motion.div
          key="lemon-squeezy"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <LemonSqueezyGateway invoice={invoice} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
