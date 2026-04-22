"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, FileDown, Plus, ExternalLink, RefreshCw } from "lucide-react";

const CURRENCIES = [
  { code: "USD", label: "US Dollar ($)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "CAD", label: "Canadian Dollar ($)" },
  { code: "BDT", label: "Bangladeshi Taka (৳)" },
  { code: "INR", label: "Indian Rupee (₹)" },
  { code: "JPY", label: "Japanese Yen (¥)" },
];

export default function PaymentsAdminPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"dashboard" | "create">("dashboard");
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "failed">("all");
  
  const [generating, setGenerating] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      // 1. Fetch Invoices
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvoices(data || []);

      // 2. Fetch Exchange Rates (Base USD)
      const res = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json");
      const rateData = await res.json();
      setRates(rateData.usd);
    } catch (err) {
      console.error("Failed to load data:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  // Analytics Calculations
  const calculateTotalBDT = (statusFilter: string) => {
    if (!rates.bdt) return 0;
    
    return invoices
      .filter(inv => inv.status === statusFilter)
      .reduce((total, inv) => {
        const amount = Number(inv.amount);
        const currency = inv.currency.toLowerCase();
        
        if (currency === "bdt") return total + amount;
        if (currency === "usd") return total + (amount * rates.bdt);
        
        // Convert other currency to USD, then to BDT
        const rateToUsd = rates[currency];
        if (rateToUsd) {
          const inUsd = amount / rateToUsd;
          return total + (inUsd * rates.bdt);
        }
        return total;
      }, 0);
  };

  const totalEarnedBDT = calculateTotalBDT("paid");
  const pendingBDT = calculateTotalBDT("pending");

  // Format BDT
  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(amount);
  };

  // CSV Export
  const exportCSV = () => {
    const headers = ["ID", "Client", "Email", "Project", "Amount", "Currency", "Status", "Created At", "Paid At", "Receipt URL"];
    const rows = invoices.map(inv => [
      inv.id,
      `"${inv.client_name}"`,
      inv.client_email,
      `"${inv.project_name}"`,
      inv.amount,
      inv.currency,
      inv.status,
      new Date(inv.created_at).toISOString(),
      inv.paid_at ? new Date(inv.paid_at).toISOString() : "",
      inv.receipt_url || ""
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `noetic_invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Form Submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGenerating(true);
    setInvoiceUrl(null);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      client_name: formData.get("client_name"),
      client_email: formData.get("client_email"),
      project_name: formData.get("project_name"),
      notes: formData.get("notes"),
      amount: formData.get("amount"),
      currency: formData.get("currency"),
    };

    try {
      const res = await fetch("/api/admin/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed to create invoice");

      toast.success("Invoice created successfully!");
      setInvoiceUrl(json.url);
      (e.target as HTMLFormElement).reset();
      loadData(); // Refresh table
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setGenerating(false);
    }
  }

  const filteredInvoices = invoices.filter(inv => filter === "all" || inv.status === filter);

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="heading-section text-2xl md:text-3xl mb-1">Payments</h1>
          <p className="text-body text-sm">Financial overview, invoices, and custom billing.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={view === "dashboard" ? "primary" : "outline"} size="sm" onClick={() => setView("dashboard")}>
            Dashboard
          </Button>
          <Button variant={view === "create" ? "primary" : "outline"} size="sm" onClick={() => setView("create")} className="gap-2">
            <Plus size={14} /> New Invoice
          </Button>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin text-[var(--accent-teal)]" />
        </div>
      ) : view === "dashboard" ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard padding="md" className="border-t-2 border-t-[var(--accent-teal)]">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-2">Total Earned (Approx)</p>
              <h3 className="text-3xl font-light tracking-tight text-[var(--text-bone)]">
                {formatBDT(totalEarnedBDT)}
              </h3>
              <p className="text-[10px] text-[var(--text-bone-muted)] mt-2">Live conversion via Free API</p>
            </GlassCard>
            <GlassCard padding="md">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-2">Pending Revenue</p>
              <h3 className="text-3xl font-light tracking-tight text-[var(--text-bone-muted)]">
                {formatBDT(pendingBDT)}
              </h3>
            </GlassCard>
            <GlassCard padding="md">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-2">Total Invoices</p>
              <h3 className="text-3xl font-light tracking-tight text-[var(--text-bone)]">
                {invoices.length}
              </h3>
            </GlassCard>
          </div>

          {/* Transaction Table */}
          <GlassCard padding="lg">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-lg font-[family-name:var(--font-heading)] uppercase tracking-widest">Transactions</h2>
              <div className="flex gap-2 w-full md:w-auto">
                <select 
                  className="bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-bone)] focus:outline-none"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                >
                  <option value="all">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2 text-xs">
                  <FileDown size={14} /> Export CSV
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)]">
                    <th className="pb-3 px-2 font-medium">Date</th>
                    <th className="pb-3 px-2 font-medium">Client / Project</th>
                    <th className="pb-3 px-2 font-medium">Amount</th>
                    <th className="pb-3 px-2 font-medium">Status</th>
                    <th className="pb-3 px-2 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[var(--text-bone-dim)]">No transactions found.</td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[var(--bg-elevated)] transition-colors">
                        <td className="py-4 px-2 text-[var(--text-bone-muted)] whitespace-nowrap">
                          {new Date(inv.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-2">
                          <p className="font-medium text-[var(--text-bone)]">{inv.client_name}</p>
                          <p className="text-xs text-[var(--text-bone-dim)]">{inv.project_name}</p>
                        </td>
                        <td className="py-4 px-2 font-mono text-[var(--text-bone)]">
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: inv.currency }).format(inv.amount)}
                        </td>
                        <td className="py-4 px-2">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest rounded-full border ${
                            inv.status === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            inv.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          {inv.status === 'paid' && inv.receipt_url ? (
                            <a href={inv.receipt_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[var(--accent-teal-light)] hover:underline">
                              Receipt <ExternalLink size={12} />
                            </a>
                          ) : inv.checkout_url ? (
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`https://pay.noeticstudio.net/${inv.id}`);
                                toast.success("Link copied");
                              }}
                              className="text-xs text-[var(--text-bone-muted)] hover:text-[var(--text-bone)] transition-colors"
                            >
                              Copy Link
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>

        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard padding="lg">
            <h2 className="text-xl font-[family-name:var(--font-heading)] text-[var(--text-bone)] mb-6 uppercase tracking-wider">
              Create Invoice
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)]">Client Name</label>
                  <input type="text" name="client_name" required className="w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-sm text-[var(--text-bone)] focus:outline-none focus:border-[var(--accent-teal)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)]">Client Email</label>
                  <input type="email" name="client_email" required className="w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-sm text-[var(--text-bone)] focus:outline-none focus:border-[var(--accent-teal)]" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)]">Project Name</label>
                <input type="text" name="project_name" required className="w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-sm text-[var(--text-bone)] focus:outline-none focus:border-[var(--accent-teal)]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)]">Amount</label>
                  <input type="number" step="0.01" min="0.01" name="amount" required placeholder="150.00" className="w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-sm text-[var(--text-bone)] focus:outline-none focus:border-[var(--accent-teal)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)]">Currency</label>
                  <select name="currency" required defaultValue="USD" className="w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-sm text-[var(--text-bone)] focus:outline-none focus:border-[var(--accent-teal)]">
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)]">Internal Notes</label>
                <textarea name="notes" rows={3} className="w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-sm text-[var(--text-bone)] focus:outline-none focus:border-[var(--accent-teal)]" />
              </div>
              <div className="pt-4">
                <Button type="submit" variant="primary" disabled={generating} className="w-full justify-center">
                  {generating ? "Generating..." : "Generate Invoice Link"}
                </Button>
              </div>
            </form>
          </GlassCard>

          {invoiceUrl && (
            <GlassCard padding="lg" className="border-[var(--accent-teal-light)]/50 bg-[var(--accent-teal)]/5 h-fit">
              <h3 className="text-lg font-[family-name:var(--font-heading)] text-[var(--accent-teal-light)] mb-2 uppercase tracking-wider">
                Invoice Generated
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-4">
                Send this link to the client:
              </p>
              <div className="p-4 bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg break-all font-mono text-sm text-[var(--text-bone)] mb-4">
                {invoiceUrl}
              </div>
              <Button variant="outline" className="w-full justify-center" onClick={() => {
                navigator.clipboard.writeText(invoiceUrl);
                toast.success("Copied to clipboard");
              }}>
                Copy Link
              </Button>
            </GlassCard>
          )}
        </motion.div>
      )}
    </div>
  );
}
