import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

// We use the admin client here to fetch the invoice safely via server component
// without needing the user to be logged in, since this is a public link.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface PageProps {
  params: {
    id: string;
  };
}

export default async function InvoicePage({ params }: PageProps) {
  const invoiceId = params.id;

  if (!invoiceId) {
    return <div>Debug Error: No ID provided.</div>;
  }

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .single();

  if (error) {
    return <div>Debug DB Error: {JSON.stringify(error)}</div>;
  }

  if (!invoice) {
    return <div>Debug Error: Invoice not found in database for ID: {invoiceId}</div>;
  }

  // Currency formatting
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: invoice.currency,
  });

  const isPaid = invoice.status === "paid";

  return (
    <div className="pt-[var(--nav-height)] pb-24 relative overflow-hidden min-h-screen bg-[var(--bg-base)] text-[var(--text-bone)]">
      {/* Background elements */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[var(--accent-teal)]/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[var(--accent-teal-glow)] rounded-full blur-[150px] opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <section className="section-padding relative z-10 flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-lg">
          <GlassCard padding="lg" className="border-[var(--accent-teal)]/30 shadow-[0_0_50px_rgba(13,115,119,0.1)]">
            <div className="text-center mb-8">
              <span className="text-[10px] text-[var(--accent-teal-light)] uppercase tracking-[0.3em] font-medium block mb-2">
                NOÉTIC Studio
              </span>
              <h1 className="heading-section text-3xl md:text-4xl">
                Invoice Details
              </h1>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-[var(--border-glass)] pb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-1">Billed To</p>
                  <p className="font-medium text-lg">{invoice.client_name}</p>
                  <p className="text-sm text-[var(--text-bone-muted)]">{invoice.client_email}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-1">Status</p>
                  {isPaid ? (
                    <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium uppercase tracking-widest rounded-full border border-green-500/30">
                      Paid
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium uppercase tracking-widest rounded-full border border-yellow-500/30">
                      Pending
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4 py-2">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-1">Project</p>
                  <p className="text-[15px]">{invoice.project_name}</p>
                </div>
                {invoice.notes && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-1">Notes</p>
                    <p className="text-sm text-[var(--text-bone-muted)]">{invoice.notes}</p>
                  </div>
                )}
              </div>

              <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-2">Total Amount due</p>
                <p className="text-4xl md:text-5xl font-light tracking-tight text-[var(--accent-teal-light)] mb-1">
                  {formatter.format(invoice.amount)}
                </p>
                <p className="text-xs text-[var(--text-bone-dim)] uppercase tracking-widest">
                  {invoice.currency}
                </p>
              </div>

              <div className="pt-4">
                {isPaid ? (
                  <Button variant="outline" className="w-full justify-center pointer-events-none opacity-80" disabled>
                    Payment Completed
                  </Button>
                ) : (
                  <Link href={invoice.checkout_url || "#"} className="block w-full">
                    <Button variant="primary" className="w-full justify-center text-sm py-4 shadow-[0_0_20px_rgba(13,115,119,0.4)]">
                      Proceed to Payment
                    </Button>
                  </Link>
                )}
              </div>
              
              {!isPaid && invoice.currency !== 'USD' && (
                <p className="text-center text-[10px] text-[var(--text-bone-dim)] mt-4 max-w-xs mx-auto leading-relaxed">
                  Note: Payments are processed globally in USD at the mid-market exchange rate. Your bank may show a slight variation depending on real-time conversion rates.
                </p>
              )}
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
