import { notFound } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { Suspense } from "react";
import UniversalPaymentWidget from "@/components/payment/UniversalPaymentWidget";
export const dynamic = "force-dynamic";

// Invoice interface for type safety
interface InvoiceItem {
  description: string;
  subDescription?: string;
  quantity: number;
  unitPrice: number;
}

interface Invoice {
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

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Loading component
function InvoiceLoading() {
  return (
    <div className="relative overflow-hidden h-screen bg-[var(--bg-base)] text-[var(--text-bone)] flex flex-col justify-center">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[var(--accent-teal)]/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[var(--accent-teal-glow)] rounded-full blur-[150px] opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <section className="px-6 relative z-10 flex items-center justify-center w-full">
        <div className="w-full max-w-lg">
          <GlassCard padding="lg" className="border-[var(--accent-teal)]/30 shadow-[0_0_50px_rgba(13,115,119,0.1)]">
            <div className="text-center mb-8">
              <span className="text-[10px] text-[var(--accent-teal-light)] uppercase tracking-[0.3em] font-medium block mb-2">
                NOÉTIC Studio
              </span>
              <h1 className="heading-section text-3xl md:text-4xl">
                Loading Invoice...
              </h1>
            </div>

            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-teal)]"></div>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

export default async function InvoicePage({ params }: PageProps) {
  return (
    <Suspense fallback={<InvoiceLoading />}>
      <InvoiceContent params={params} />
    </Suspense>
  );
}

// Parse augmented data from the notes JSON field
function parseInvoiceData(notes: string | null): {
  items: InvoiceItem[];
  displayId: number;
  invoiceNoAlpha: string;
} {
  const fallback = { items: [], displayId: 0, invoiceNoAlpha: "" };
  if (!notes) return fallback;
  try {
    if (notes.startsWith("{")) {
      const parsed = JSON.parse(notes);
      return {
        items: parsed.items || [],
        displayId: parsed.display_id || 0,
        invoiceNoAlpha: parsed.invoice_no_alpha || "",
      };
    }
  } catch {
    // Not JSON — plain text notes
  }
  return fallback;
}

async function InvoiceContent({ params }: PageProps) {
  const { id: invoiceId } = await params;

  if (!invoiceId) {
    notFound();
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(invoiceId)) {
    notFound();
  }

  // Fetch invoice data from our secure API route (server-side only)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/invoices/${invoiceId}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    console.error("[Invoice Page] API error:", response.status, response.statusText);
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-deep)]">
        <GlassCard padding="lg">
          <div className="text-center">
            <h1 className="heading-section text-xl mb-4">Invoice Not Found</h1>
            <p className="text-body text-sm mb-6">
              The invoice you&apos;re looking for could not be found or has expired.
            </p>
            <Link href="/pay">
              <Button variant="primary">Try Another ID</Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    );
  }

  const invoice: Invoice = await response.json();
  const { items, displayId, invoiceNoAlpha } = parseInvoiceData(invoice.notes);

  // Currency formatting
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: invoice.currency,
  });

  const isPaid = invoice.status === "paid";

  // Build invoice number display
  const year = new Date(invoice.created_at).getFullYear();
  const invoiceNo =
    displayId > 0
      ? `NS-${year}-${invoiceNoAlpha || "---"}-${String(displayId).padStart(5, "0")}`
      : null;

  return (
    <div className="relative overflow-hidden min-h-screen bg-[var(--bg-base)] text-[var(--text-bone)] flex flex-col">
      {/* Background effects */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[var(--accent-teal)]/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[var(--accent-teal-glow)] rounded-full blur-[150px] opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[var(--accent-teal-glow)] rounded-full blur-[100px] opacity-10 pointer-events-none" />

      <section className="flex-1 px-6 py-12 relative z-10 flex items-center justify-center w-full">
        <div className="w-full max-w-lg space-y-6">
          {/* Main Invoice Card */}
          <GlassCard
            padding="lg"
            className="border-[var(--accent-teal)]/30 shadow-[0_0_50px_rgba(13,115,119,0.1)]"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
                  <path d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z" fill="var(--accent-teal-light)" />
                </svg>
                <span className="text-[10px] text-[var(--accent-teal-light)] uppercase tracking-[0.3em] font-medium font-[family-name:var(--font-body)]">
                  NOÉTIC Studio
                </span>
              </div>
              <h1 className="heading-section text-2xl md:text-3xl">
                Invoice Details
              </h1>
              {invoiceNo && (
                <p className="text-xs font-mono text-[var(--text-bone-dim)] mt-2">
                  {invoiceNo}
                </p>
              )}
            </div>

            <div className="space-y-6">
              {/* Client + Status Row */}
              <div className="flex justify-between items-end border-b border-[var(--border-glass)] pb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-1">
                    Billed To
                  </p>
                  <p className="font-medium text-lg">{invoice.client_name}</p>
                  <p className="text-sm text-[var(--text-bone-muted)]">
                    {invoice.client_email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-1">
                    Status
                  </p>
                  <StatusIndicator status={invoice.status} />
                </div>
              </div>

              {/* Project Info */}
              <div className="space-y-4 py-2">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-1">
                    Project
                  </p>
                  <p className="text-[15px]">{invoice.project_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-1">
                      Date Issued
                    </p>
                    <p className="text-sm text-[var(--text-bone-muted)]">
                      {new Date(invoice.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  {isPaid && invoice.paid_at && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-1">
                        Paid On
                      </p>
                      <p className="text-sm text-green-400">
                        {new Date(invoice.paid_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Line Items Table */}
              {items.length > 0 && (
                <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
                  <div className="bg-[var(--bg-elevated)] px-4 py-2.5">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] font-medium">
                      Line Items
                    </p>
                  </div>
                  <div className="divide-y divide-[var(--border-subtle)]">
                    {items.map((item: InvoiceItem, index: number) => (
                      <div key={index} className="px-4 py-3 flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--text-bone)] truncate">
                            {item.description}
                          </p>
                          {item.subDescription && (
                            <p className="text-[11px] text-[var(--text-bone-dim)] italic mt-0.5">
                              {item.subDescription}
                            </p>
                          )}
                          <p className="text-[10px] text-[var(--text-bone-dim)] mt-1">
                            {item.quantity} × {formatter.format(item.unitPrice)}
                          </p>
                        </div>
                        <p className="text-sm font-mono text-[var(--text-bone)] whitespace-nowrap">
                          {formatter.format(item.quantity * item.unitPrice)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amount Block */}
              <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--accent-teal)]/5 rounded-full blur-xl"></div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-2">
                  {isPaid ? "Total Paid" : "Total Amount Due"}
                </p>
                <p className="text-4xl md:text-5xl font-light tracking-tight text-[var(--accent-teal-light)] mb-1">
                  {formatter.format(invoice.amount)}
                </p>
                <p className="text-xs text-[var(--text-bone-dim)] uppercase tracking-widest">
                  {invoice.currency}
                </p>
                {!isPaid && (
                  <div className="flex items-center gap-1 mt-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-green-400 uppercase tracking-widest">
                      Secure Payment
                    </span>
                  </div>
                )}
              </div>

              {/* Payment Section */}
              <div className="pt-2">
                {isPaid ? (
                  <div className="space-y-3">
                    {/* Payment Completed Badge */}
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 text-center">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-green-400 font-medium text-sm">
                        Payment Completed Successfully
                      </p>
                      {invoice.paid_at && (
                        <p className="text-[11px] text-[var(--text-bone-dim)] mt-1">
                          Paid on{" "}
                          {new Date(invoice.paid_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      {invoice.receipt_url && (
                        <a href={invoice.receipt_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="w-full justify-center text-xs gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View Receipt
                          </Button>
                        </a>
                      )}
                      <a
                        href={`/api/invoices/${invoice.id}/pdf`}
                        download
                      >
                        <Button variant="outline" className="w-full justify-center text-xs gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download Invoice
                        </Button>
                      </a>
                    </div>
                  </div>
                ) : (
                  /* Universal gateway widget */
                  <UniversalPaymentWidget invoice={invoice} />
                )}

                {!isPaid && invoice.currency !== "USD" && (
                  <div className="text-center text-[10px] text-[var(--text-bone-dim)] mt-4 max-w-xs mx-auto leading-relaxed bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg p-3">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-yellow-400">ℹ️</span>
                      <span className="font-medium">Currency Note</span>
                    </div>
                    Payments are processed globally in USD at the mid-market exchange rate. Your bank may show a slight variation depending on real-time conversion rates.
                  </div>
                )}

                {/* Download Invoice (for unpaid invoices too) */}
                {!isPaid && (
                  <div className="mt-4">
                    <a
                      href={`/api/invoices/${invoice.id}/pdf`}
                      download
                      className="flex items-center justify-center gap-2 text-[11px] text-[var(--text-bone-dim)] hover:text-[var(--accent-teal-light)] transition-colors py-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Invoice PDF
                    </a>
                  </div>
                )}

                {/* Footer */}
                <div className="text-center pt-4 border-t border-[var(--border-glass)] mt-4">
                  <p className="text-[10px] text-[var(--text-bone-dim)]">
                    Need help?{" "}
                    <Link href="/contact" className="text-[var(--accent-teal-light)] hover:underline">
                      Contact Support
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Payment Log Card (shown for paid invoices) */}
          {isPaid && (
            <GlassCard
              padding="lg"
              className="border-[var(--border-subtle)] shadow-[0_0_30px_rgba(13,115,119,0.05)]"
            >
              <h2 className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] font-medium mb-4">
                Payment Log
              </h2>
              <div className="space-y-0">
                {/* Timeline */}
                <div className="relative pl-6 border-l border-[var(--border-subtle)]">
                  {/* Created */}
                  <div className="relative pb-5">
                    <div className="absolute -left-[25px] top-0.5 w-2.5 h-2.5 rounded-full bg-[var(--accent-teal)] border-2 border-[var(--bg-base)]" />
                    <p className="text-xs text-[var(--text-bone)]">Invoice Created</p>
                    <p className="text-[10px] text-[var(--text-bone-dim)] mt-0.5">
                      {new Date(invoice.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Payment Initiated */}
                  <div className="relative pb-5">
                    <div className="absolute -left-[25px] top-0.5 w-2.5 h-2.5 rounded-full bg-yellow-400 border-2 border-[var(--bg-base)]" />
                    <p className="text-xs text-[var(--text-bone)]">
                      Payment via {invoice.gateway === "payoneer" ? "Payoneer" : "Lemon Squeezy"}
                    </p>
                    <p className="text-[10px] text-[var(--text-bone-dim)] mt-0.5">
                      {formatter.format(invoice.amount)} {invoice.currency}
                    </p>
                  </div>

                  {/* Paid */}
                  {invoice.paid_at && (
                    <div className="relative">
                      <div className="absolute -left-[25px] top-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[var(--bg-base)]" />
                      <p className="text-xs text-green-400 font-medium">Payment Confirmed</p>
                      <p className="text-[10px] text-[var(--text-bone-dim)] mt-0.5">
                        {new Date(invoice.paid_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-[var(--border-subtle)] relative z-10">
        <p className="text-[10px] text-[var(--text-bone-dim)] tracking-widest uppercase font-[family-name:var(--font-body)]">
          © {new Date().getFullYear()} NOÉTIC Studio · Creative Intelligence
        </p>
      </footer>
    </div>
  );
}
