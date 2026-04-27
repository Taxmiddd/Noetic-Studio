"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, FileDown, Plus, ExternalLink, RefreshCw, Copy, Mail, MessageCircle, X, Trash2 } from "lucide-react";
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor').then(mod => mod.RichTextEditor), { ssr: false });
const InvoicePreview = dynamic(() => import('@/components/admin/InvoicePreview'), { ssr: false });

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
  gateway: Gateway;
  checkout_url: string | null;
  receipt_url: string | null;
  paid_at: string | null;
  created_at: string;
  display_id?: number;
  invoice_no_alpha?: string;
}

const inputClass =
  "w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-bone)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors";
const labelClass = "text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)] block mb-1.5";

export default function InvoicesAdminPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"dashboard" | "create">("dashboard");
  const [creating, setCreating] = useState(false);

  // Form State for Realtime Preview
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectName, setProjectName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [gateway, setGateway] = useState<Gateway>("lemon_squeezy");
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", subDescription: "", quantity: 1, unitPrice: 0 }
  ]);

  // Email Modal State
  const [emailModalInvoice, setEmailModalInvoice] = useState<Invoice | null>(null);
  const [emailSubject, setEmailSubject] = useState("NOÉTIC Studio — Your Invoice is Ready");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

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
    } catch {
      toast.error("Failed to load invoices data");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const addItem = () => {
    setItems([...items, { description: "", subDescription: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // ─── Invoice Creation ───
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);

    // Generate random 3 letters for the invoice number
    const randomAlpha = Array.from({length: 3}, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
    
    // Get total count for the display_id
    const { count } = await supabase
      .from("invoices")
      .select("*", { count: "exact", head: true });
    
    const displayId = (count || 0) + 1;

    // Store items as JSON in notes for now
    const invoicePayload = {
      client_name: clientName,
      client_email: clientEmail,
      project_name: projectName,
      notes: JSON.stringify({
        items: items,
        total: totalAmount,
        invoice_no_alpha: randomAlpha,
        display_id: displayId,
      }),
      amount: totalAmount,
      currency: currency,
      status: "pending",
      gateway: gateway,
    };

    try {
      const { data: newInvoice, error: dbError } = await supabase
        .from("invoices")
        .insert(invoicePayload)
        .select()
        .single();

      if (dbError || !newInvoice) throw dbError || new Error("Insert failed");

      toast.success("Invoice created!");

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
        }
      }

      await loadData();
      
      // Reset Form
      setClientName("");
      setClientEmail("");
      setProjectName("");
      setCurrency("USD");
      setItems([{ description: "", subDescription: "", quantity: 1, unitPrice: 0 }]);
      
      setView("dashboard");

      const payLink = `https://pay.noeticstudio.net/${newInvoice.id}`;
      await navigator.clipboard.writeText(payLink);
      toast.success("Payment link copied to clipboard!");
    } catch (err) {
      console.error("[Invoice Creation]", err);
      toast.error("Failed to create invoice. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  // ─── Email Dispatcher ───
  async function handleSendEmail() {
    if (!emailModalInvoice) return;
    setSendingEmail(true);

    try {
      const res = await fetch("/api/invoices/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: emailModalInvoice.id,
          subject: emailSubject,
          body: emailBody,
        }),
      });

      if (!res.ok) throw new Error("Failed to send email");
      
      toast.success(`Invoice emailed to ${emailModalInvoice.client_email}!`);
      setEmailModalInvoice(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send email. Ensure SMTP is configured in .env.");
    } finally {
      setSendingEmail(false);
    }
  }

  // ─── WhatsApp Fallback (Click-to-Chat) ───
  function handleSendWhatsApp(inv: Invoice) {
    const payLink = `https://pay.noeticstudio.net/${inv.id}`;
    const text = encodeURIComponent(`Hi ${inv.client_name},\n\nYour invoice for ${inv.project_name} is ready.\n\nYou can view and securely pay your invoice here:\n${payLink}\n\nThank you for choosing NOÉTIC Studio.`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  function openEmailModal(inv: Invoice) {
    setEmailModalInvoice(inv);
    setEmailSubject(`NOÉTIC Studio — Invoice for ${inv.project_name}`);
    const payLink = `https://pay.noeticstudio.net/${inv.id}`;
    setEmailBody(`
      <p>Hi ${inv.client_name},</p>
      <p>I hope this email finds you well.</p>
      <p>Please find attached the PDF invoice for <strong>${inv.project_name}</strong>.</p>
      <p>You can also securely pay online using the link below:</p>
      <p><a href="${payLink}" style="color: #0D7377;"><strong>Pay Invoice Online</strong></a></p>
      <br />
      <p>Best regards,</p>
      <p><strong>NOÉTIC Studio</strong></p>
    `);
  }

  // Helper to parse augmented data from notes JSON
  const getAugmentedData = (inv: Invoice) => {
    try {
      if (inv.notes && inv.notes.startsWith('{')) {
        return JSON.parse(inv.notes);
      }
    } catch (e) {
      console.error("Failed to parse augmented data", e);
    }
    return {};
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="heading-section text-2xl md:text-3xl mb-1">Invoices</h1>
          <p className="text-body text-sm">Generate professional PDF invoices and send them to clients.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={view === "dashboard" ? "primary" : "outline"} size="sm" onClick={() => setView("dashboard")}>
            Invoice List
          </Button>
          <Button
            variant={view === "create" ? "primary" : "outline"}
            size="sm"
            onClick={() => setView("create")}
            className="gap-2"
          >
            <Plus size={14} /> Create New Invoice
          </Button>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin text-[var(--accent-teal)]" />
        </div>
      ) : view === "dashboard" ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <GlassCard blur={false} padding="lg">
            <h2 className="text-lg font-[family-name:var(--font-heading)] uppercase tracking-widest mb-6">Generated Invoices</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[10px] uppercase tracking-widest text-[var(--text-bone-dim)]">
                    <th className="pb-3 px-2 font-medium">Date</th>
                    <th className="pb-3 px-2 font-medium">Client / Project</th>
                    <th className="pb-3 px-2 font-medium">Amount</th>
                    <th className="pb-3 px-2 font-medium">Status</th>
                    <th className="pb-3 px-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[var(--text-bone-dim)]">
                        No invoices generated yet.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => {
                      const augmented = getAugmentedData(inv);
                      return (
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
                          <td className="py-4 px-2 text-right">
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
                              <button
                                onClick={() => openEmailModal(inv)}
                                title="Email Invoice"
                                className="text-[var(--text-bone-muted)] hover:text-[var(--accent-teal-light)] transition-colors"
                              >
                                <Mail size={16} />
                              </button>
                              <button
                                onClick={() => handleSendWhatsApp(inv)}
                                title="Send via WhatsApp"
                                className="text-[var(--text-bone-muted)] hover:text-green-400 transition-colors"
                              >
                                <MessageCircle size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Form Side */}
          <div className="space-y-6">
            <GlassCard blur={false} padding="lg">
              <h2 className="text-xl font-[family-name:var(--font-heading)] text-[var(--text-bone)] mb-6 uppercase tracking-wider">
                Invoice Basic Info
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={labelClass}>Client Name</label>
                    <input value={clientName} onChange={(e) => setClientName(e.target.value)} type="text" required className={inputClass} placeholder="Jane Smith" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Client Email</label>
                    <input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} type="email" required className={inputClass} placeholder="jane@example.com" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Main Project / Header</label>
                  <input value={projectName} onChange={(e) => setProjectName(e.target.value)} type="text" required className={inputClass} placeholder="Brand Identity Redesign" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={labelClass}>Currency</label>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} required className={inputClass}>
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Payment Gateway</label>
                    <select value={gateway} onChange={(e) => setGateway(e.target.value as Gateway)} className={inputClass}>
                      {GATEWAYS.map((g) => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard blur={false} padding="lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-[family-name:var(--font-heading)] text-[var(--text-bone)] uppercase tracking-wider">
                  Line Items
                </h2>
                <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-2">
                  <Plus size={14} /> Add Item
                </Button>
              </div>
              
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={index} className="relative p-4 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-deep)] space-y-4">
                    <button 
                      onClick={() => removeItem(index)}
                      className="absolute top-2 right-2 text-red-500/50 hover:text-red-500 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="space-y-1">
                      <label className={labelClass}>Item Description</label>
                      <input 
                        value={item.description} 
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        className={inputClass} 
                        placeholder="e.g. Website Development" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Sub-details (gray text)</label>
                      <input 
                        value={item.subDescription} 
                        onChange={(e) => updateItem(index, "subDescription", e.target.value)}
                        className={inputClass} 
                        placeholder="e.g. (100% Upon Completion)" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className={labelClass}>Quantity</label>
                        <input 
                          type="number"
                          value={item.quantity} 
                          onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
                          className={inputClass} 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Unit Price</label>
                        <input 
                          type="number"
                          value={item.unitPrice || ""} 
                          onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                          className={inputClass} 
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-bone-dim)]">Total Invoice Amount</p>
                  <p className="text-3xl text-[var(--accent-teal-light)] font-mono">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency }).format(totalAmount)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setView("dashboard")} disabled={creating}>
                    Cancel
                  </Button>
                  <Button onClick={(e: any) => handleSubmit(e)} variant="primary" className="gap-2" disabled={creating || totalAmount <= 0}>
                    {creating ? <><RefreshCw size={14} className="animate-spin" /> Generating…</> : <>Finalize & Generate <ArrowRight size={14} /></>}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Realtime Preview Side */}
          <div className="sticky top-8 h-fit">
            <h2 className="text-xl font-[family-name:var(--font-heading)] text-[var(--text-bone)] mb-6 uppercase tracking-wider px-4">
              Live Document Preview
            </h2>
            <InvoicePreview 
              invoiceData={{
                id: "DRAFT-ID",
                client_name: clientName || "CLIENT NAME",
                client_email: clientEmail || "client@email.com",
                project_name: projectName || "PROJECT TITLE",
                amount: totalAmount,
                currency: currency,
                created_at: new Date().toISOString(),
                items: items,
                display_id: invoices.length + 1,
              }}
              payLink="https://pay.noeticstudio.net/draft"
            />
          </div>
        </motion.div>
      )}

      {/* Email Modal */}
      <AnimatePresence>
        {emailModalInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--bg-base)] border border-[var(--border-glass)] shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="text-lg font-medium text-[var(--text-bone)]">Email Invoice</h3>
                  <p className="text-xs text-[var(--text-bone-dim)] mt-1">To: {emailModalInvoice.client_email}</p>
                </div>
                <button
                  onClick={() => setEmailModalInvoice(null)}
                  className="text-[var(--text-bone-dim)] hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                <div className="space-y-1">
                  <label className={labelClass}>Subject Line</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>Message Body (HTML)</label>
                  <div className="rounded-lg overflow-hidden border border-[var(--border-subtle)]">
                    <RichTextEditor 
                      value={emailBody} 
                      onChange={setEmailBody}
                      className="h-48 mb-12"
                    />
                  </div>
                </div>

                <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg p-4 flex items-center gap-3">
                  <FileDown className="text-[var(--accent-teal)]" size={24} />
                  <div>
                    <p className="text-sm text-[var(--text-bone)]">Invoice PDF Attachment</p>
                    <p className="text-xs text-[var(--text-bone-dim)]">Automatically generated matching Matte brand theme.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[var(--border-subtle)] flex justify-end gap-3 bg-[var(--bg-elevated)]">
                <Button variant="outline" onClick={() => setEmailModalInvoice(null)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSendEmail} disabled={sendingEmail}>
                  {sendingEmail ? (
                    <><RefreshCw size={14} className="animate-spin mr-2" /> Sending...</>
                  ) : (
                    <>Send Email</>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
