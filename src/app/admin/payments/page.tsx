"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, FileDown, Plus, ExternalLink, RefreshCw, Copy } from "lucide-react";

const CURRENCIES = [
  { code: "USD", label: "US Dollar ($)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "CAD", label: "Canadian Dollar ($)" },
  { code: "BDT", label: "Bangladeshi Taka (৳)" },
  { code: "INR", label: "Indian Rupee (₹)" },
  { code: "JPY", label: "Japanese Yen (¥)" },
];

const GATEWAYS = [
  { value: "lemon_squeezy", label: "Lemon Squeezy" },
  { value: "payoneer", label: "Payoneer" },
];

type Gateway = "lemon_squeezy" | "payoneer";

interface Invoice {
  id: string;
  client_name: string;
  client_email: string;
  project_name: string;
  notes: string | null;
  amount: number;
  currency: string;
  status: string;
  gateway: Gateway;
  checkout_url: string | null;
  receipt_url: string | null;
  paid_at: string | null;
  created_at: string;
}

const inputClass =
  "w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-bone)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors";
const labelClass = "text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] block mb-1.5";

export default function PaymentsAdminPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"dashboard" | "create">("dashboard");
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "failed">("all");
  const [creating, setCreating] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const supabase = createClient();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setInvoices(data || []);

      const res = await fetch(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
      );
      const rateData = await res.json();
      setRates(rateData.usd);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Analytics ───
  const calculateTotalBDT = (statusFilter: string) => {
    if (!rates.bdt) return 0;
    return invoices
      .filter((inv) => inv.status === statusFilter)
      .reduce((total, inv) => {
        const amount = Number(inv.amount);
        const currency = inv.currency.toLowerCase();
        if (currency === "bdt") return total + amount;
        if (currency === "usd") return total + amount * rates.bdt;
        const rateToUsd = rates[currency];
        if (rateToUsd) return total + (amount / rateToUsd) * rates.bdt;
        return total;
      }, 0);
  };

  const totalEarnedBDT = calculateTotalBDT("paid");
  const pendingBDT = calculateTotalBDT("pending");

  const formatBDT = (amount: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(amount);

  // ─── CSV Export ───
  const exportCSV = () => {
    const headers = ["ID", "Client", "Email", "Project", "Amount", "Currency", "Gateway", "Status", "Created At", "Paid At", "Receipt URL"];
    const rows = invoices.map((inv) => [
      inv.id,
      `"${inv.client_name}"`,
      inv.client_email,
      `"${inv.project_name}"`,
      inv.amount,
      inv.currency,
      inv.gateway,
      inv.status,
      new Date(inv.created_at).toISOString(),
      inv.paid_at ? new Date(inv.paid_at).toISOString() : "",
      inv.receipt_url || "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `noetic_transactions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── Gateway Toggle ───
  const handleGatewayToggle = async (invoiceId: string, newGateway: Gateway) => {
    setTogglingId(invoiceId);
    try {
      const { error } = await supabase
        .from("invoices")
        .update({ gateway: newGateway, updated_at: new Date().toISOString() })
        .eq("id", invoiceId);
      if (error) throw error;
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === invoiceId ? { ...inv, gateway: newGateway } : inv))
      );
      toast.success(`Gateway switched to ${newGateway === "payoneer" ? "Payoneer" : "Lemon Squeezy"}`);
    } catch {
      toast.error("Failed to update gateway");
    } finally {
      setTogglingId(null);
    }
  };

  // ─── Quick Link Creation ───
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    const invoicePayload = {
      client_name: data.get("client_name") as string,
      client_email: data.get("client_email") as string,
      project_name: data.get("project_name") as string,
      notes: "Quick Payment Link (No PDF)",
      amount: parseFloat(data.get("amount") as string),
      currency: data.get("currency") as string,
      status: "pending",
      gateway: (data.get("gateway") as Gateway) || "lemon_squeezy",
    };

    try {
      const { data: newInvoice, error: dbError } = await supabase
        .from("invoices")
        .insert(invoicePayload)
        .select()
        .single();

      if (dbError || !newInvoice) throw dbError || new Error("Insert failed");

      toast.success("Payment Link created!");

      if (newInvoice.gateway === "lemon_squeezy") {
        const lsRes = await fetch("/api/payments/lemon-squeezy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invoiceId: newInvoice.id }),
        });
        const lsData = await lsRes.json();
        if (lsData.checkoutUrl) {
          toast.success("Lemon Squeezy checkout URL generated");
          newInvoice.checkout_url = lsData.checkoutUrl;
        } else {
          toast("Checkout URL will be generated when client visits payment page", { icon: "ℹ️" });
        }
      }

      await loadData();
      form.reset();
      setView("dashboard");

      const payLink = `https://pay.noeticstudio.net/${newInvoice.id}`;
      await navigator.clipboard.writeText(payLink);
      toast.success("Payment link copied to clipboard!");
    } catch (err) {
      console.error("[Link Creation]", err);
      toast.error("Failed to create link. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  const filteredInvoices = invoices.filter(
    (inv) => filter === "all" || inv.status === filter
  );

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
          <h1 className="heading-section text-2xl md:text-3xl mb-1">Payments Hub</h1>
          <p className="text-body text-sm">Financial overview, quick links, and transaction ledger.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={view === "dashboard" ? "primary" : "outline"} size="sm" onClick={() => setView("dashboard")}>
            Dashboard
          </Button>
          <Button
            variant={view === "create" ? "primary" : "outline"}
            size="sm"
            onClick={() => setView("create")}
            className="gap-2"
          >
            <Plus size={14} /> Quick Link
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
            <GlassCard blur={false} padding="md" className="border-t-2 border-t-[var(--accent-teal)]">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-2">Total Earned (Approx)</p>
              <h3 className="text-3xl font-light tracking-tight text-[var(--text-bone)]">{formatBDT(totalEarnedBDT)}</h3>
              <p className="text-[10px] text-[var(--text-bone-muted)] mt-2">Live conversion via Free API</p>
            </GlassCard>
            <GlassCard blur={false} padding="md">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-2">Pending Revenue</p>
              <h3 className="text-3xl font-light tracking-tight text-[var(--text-bone-muted)]">{formatBDT(pendingBDT)}</h3>
            </GlassCard>
            <GlassCard blur={false} padding="md">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] mb-2">Total Transactions</p>
              <h3 className="text-3xl font-light tracking-tight text-[var(--text-bone)]">{invoices.length}</h3>
            </GlassCard>
          </div>

          {/* Transaction Table */}
          <GlassCard blur={false} padding="lg">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-lg font-[family-name:var(--font-heading)] uppercase tracking-widest">Unified Ledger</h2>
              <div className="flex gap-2 w-full md:w-auto">
                <select
                  className="bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-bone)] focus:outline-none"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                >
                  <option value="all">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2 text-xs">
                  <FileDown size={14} /> Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={loadData} className="gap-1 text-xs">
                  <RefreshCw size={13} />
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
                    <th className="pb-3 px-2 font-medium">Gateway</th>
                    <th className="pb-3 px-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[var(--text-bone-dim)]">
                        No transactions found.
                      </td>
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
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest rounded-full border ${
                              inv.status === "paid"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : inv.status === "failed"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        {/* Gateway Toggle */}
                        <td className="py-4 px-2">
                          <select
                            value={inv.gateway ?? "lemon_squeezy"}
                            disabled={inv.status === "paid" || togglingId === inv.id}
                            onChange={(e) => handleGatewayToggle(inv.id, e.target.value as Gateway)}
                            className={`bg-[var(--bg-deep)] border rounded px-2 py-1 text-[10px] uppercase tracking-wider focus:outline-none transition-colors cursor-pointer ${
                              (inv.gateway ?? "lemon_squeezy") === "payoneer"
                                ? "border-blue-500/30 text-blue-400"
                                : "border-[var(--accent-teal)]/30 text-[var(--accent-teal-light)]"
                            } disabled:opacity-40 disabled:cursor-not-allowed`}
                          >
                            {GATEWAYS.map((g) => (
                              <option key={g.value} value={g.value} className="bg-[var(--bg-deep)] text-[var(--text-bone)] normal-case">
                                {g.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        {/* Actions */}
                        <td className="py-4 px-2 text-right">
                          {inv.status === "paid" && inv.receipt_url ? (
                            <a href={inv.receipt_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[var(--accent-teal-light)] hover:underline">
                              Receipt <ExternalLink size={12} />
                            </a>
                          ) : inv.status !== "paid" ? (
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={async () => {
                                  await navigator.clipboard.writeText(`https://pay.noeticstudio.net/${inv.id}`);
                                  toast.success("Link copied");
                                }}
                                title="Copy Link"
                                className="text-[var(--text-bone-muted)] hover:text-[var(--text-bone)] transition-colors"
                              >
                                <Copy size={16} />
                              </button>
                            </div>
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
        /* ─── Create Quick Link Form ─── */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard blur={false} padding="lg">
            <h2 className="text-xl font-[family-name:var(--font-heading)] text-[var(--text-bone)] mb-6 uppercase tracking-wider">
              Create Quick Link
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelClass}>Client Name</label>
                  <input id="client_name" type="text" name="client_name" required className={inputClass} placeholder="Jane Smith" />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Client Email</label>
                  <input id="client_email" type="email" name="client_email" required className={inputClass} placeholder="jane@example.com" />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Project / Reason</label>
                <input id="project_name" type="text" name="project_name" required className={inputClass} placeholder="Consultation Deposit" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelClass}>Amount</label>
                  <input id="amount" type="number" step="0.01" min="0.01" name="amount" required placeholder="150.00" className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Currency</label>
                  <select id="currency" name="currency" required defaultValue="USD" className={inputClass}>
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Payment Gateway</label>
                <select id="gateway" name="gateway" defaultValue="lemon_squeezy" className={inputClass}>
                  {GATEWAYS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="submit" variant="primary" className="flex-1 justify-center gap-2" disabled={creating}>
                  {creating ? (
                    <><RefreshCw size={14} className="animate-spin" /> Generating…</>
                  ) : (
                    <>Generate Link <ArrowRight size={14} /></>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setView("dashboard")} disabled={creating}>
                  Cancel
                </Button>
              </div>
            </form>
          </GlassCard>

          {/* Help Panel */}
          <GlassCard blur={false} padding="lg" className="h-fit">
            <h2 className="text-xl font-[family-name:var(--font-heading)] text-[var(--text-bone)] mb-6 uppercase tracking-wider">
              Quick Link Guide
            </h2>
            <div className="space-y-5">
              <div className="border border-[var(--border-subtle)] rounded-xl p-4 space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)]">What is a Quick Link?</p>
                <p className="text-xs text-[var(--text-bone-muted)] leading-relaxed">
                  Quick Links allow you to accept payments instantly without generating a formal PDF Invoice document. This is ideal for retainers, late fees, or ad-hoc consultations.
                </p>
              </div>
              <div className="border border-[var(--accent-teal)]/20 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[var(--accent-teal)] rounded-full" />
                  <p className="text-sm font-medium text-[var(--text-bone)]">Lemon Squeezy</p>
                </div>
                <p className="text-xs text-[var(--text-bone-muted)] leading-relaxed">
                  Overlay checkout. URL is automatically generated and stored immediately. Accepts all major cards + PayPal.
                </p>
              </div>
              <div className="border border-blue-500/20 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full" />
                  <p className="text-sm font-medium text-[var(--text-bone)]">Payoneer</p>
                </div>
                <p className="text-xs text-[var(--text-bone-muted)] leading-relaxed">
                  Square-style embedded checkout. No redirects. Requires API credentials in your environment setup.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
