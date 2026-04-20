"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mail, MailOpen, ChevronDown, ChevronUp, Trash2, Reply, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  service_interest: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

type FilterTab = "all" | "unread" | "read";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setInquiries(data);
    if (error) console.warn("Inquiries fetch failed:", error.message);
    setLoading(false);
  }

  async function handleExpand(id: string) {
    const isOpening = expandedId !== id;
    setExpandedId(isOpening ? id : null);

    // Mark as read on open
    if (isOpening) {
      const inq = inquiries.find(i => i.id === id);
      if (inq && !inq.is_read) {
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, is_read: true } : i));
        await supabase.from("contact_inquiries").update({ is_read: true }).eq("id", id);
      }
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("contact_inquiries").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete inquiry.");
    } else {
      setInquiries(prev => prev.filter(i => i.id !== id));
      setDeleteConfirm(null);
      toast.success("Inquiry deleted.");
    }
  }

  const filtered = inquiries.filter(i => {
    if (filter === "unread") return !i.is_read;
    if (filter === "read") return i.is_read;
    return true;
  });

  const unreadCount = inquiries.filter(i => !i.is_read).length;

  const tabs: { label: string; value: FilterTab }[] = [
    { label: "All", value: "all" },
    { label: `Unread (${unreadCount})`, value: "unread" },
    { label: "Read", value: "read" },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <h1 className="heading-section text-2xl md:text-3xl">Inquiries</h1>
          {unreadCount > 0 && (
            <span className="text-[10px] font-[family-name:var(--font-body)] bg-[var(--accent-teal)]/20 text-[var(--accent-teal-light)] px-2.5 py-0.5 rounded-full border border-[var(--border-accent)]">
              {unreadCount} new
            </span>
          )}
        </div>
        <p className="text-body text-sm">Contact form submissions from potential clients.</p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6"
      >
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-[family-name:var(--font-body)] transition-all border ${
              filter === tab.value
                ? "bg-[var(--accent-teal)]/10 text-[var(--accent-teal-light)] border-[var(--border-accent)]"
                : "text-[var(--text-bone-dim)] border-[var(--border-subtle)] hover:text-[var(--text-bone)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl"
            >
              <h3 className="heading-section text-lg mb-2">Delete Inquiry?</h3>
              <p className="text-body text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-[family-name:var(--font-body)] hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 bg-[var(--bg-elevated)] text-[var(--text-bone-muted)] rounded-xl text-sm font-[family-name:var(--font-body)] hover:text-[var(--text-bone)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inquiries List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-label opacity-40">No inquiries found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inquiry, i) => (
            <motion.div
              key={inquiry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <GlassCard padding="sm" hover={false}>
                <button
                  onClick={() => handleExpand(inquiry.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between px-2 py-2">
                    <div className="flex items-center gap-3 min-w-0">
                      {inquiry.is_read ? (
                        <MailOpen size={16} className="text-[var(--text-bone-dim)] flex-shrink-0" />
                      ) : (
                        <Mail size={16} className="text-[var(--accent-teal-light)] flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-[family-name:var(--font-body)] ${!inquiry.is_read ? "text-[var(--text-bone)] font-medium" : "text-[var(--text-bone-muted)]"}`}>
                            {inquiry.name}
                          </span>
                          <span className="text-[10px] text-[var(--text-bone-dim)] font-[family-name:var(--font-body)] hidden sm:block">
                            {inquiry.company}
                          </span>
                          <span className="text-[10px] text-[var(--accent-teal-light)] uppercase tracking-wider hidden md:block">
                            {inquiry.service_interest}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-bone-dim)] font-[family-name:var(--font-body)] truncate max-w-md">
                          {inquiry.message.slice(0, 90)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <span className="text-[10px] text-[var(--text-bone-dim)] font-[family-name:var(--font-body)]">
                        {new Date(inquiry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      {expandedId === inquiry.id ? (
                        <ChevronUp size={14} className="text-[var(--text-bone-dim)]" />
                      ) : (
                        <ChevronDown size={14} className="text-[var(--text-bone-dim)]" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded */}
                <AnimatePresence>
                  {expandedId === inquiry.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-2 pb-3 pt-2 border-t border-[var(--border-subtle)] mt-2">
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div>
                            <span className="text-label text-[9px] block mb-0.5">Email</span>
                            <a
                              href={`mailto:${inquiry.email}`}
                              className="text-xs text-[var(--accent-teal-light)] hover:underline font-[family-name:var(--font-body)]"
                            >
                              {inquiry.email}
                            </a>
                          </div>
                          <div>
                            <span className="text-label text-[9px] block mb-0.5">Service</span>
                            <span className="text-xs text-[var(--text-bone)] font-[family-name:var(--font-body)]">
                              {inquiry.service_interest}
                            </span>
                          </div>
                          <div>
                            <span className="text-label text-[9px] block mb-0.5">Company</span>
                            <span className="text-xs text-[var(--text-bone)] font-[family-name:var(--font-body)]">
                              {inquiry.company}
                            </span>
                          </div>
                          <div>
                            <span className="text-label text-[9px] block mb-0.5">Date</span>
                            <span className="text-xs text-[var(--text-bone)] font-[family-name:var(--font-body)]">
                              {new Date(inquiry.created_at).toLocaleDateString("en-US", {
                                year: "numeric", month: "long", day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-label text-[9px] block mb-1">Message</span>
                          <p className="text-sm text-[var(--text-bone)] leading-relaxed font-[family-name:var(--font-body)] bg-[var(--bg-deep)] rounded-lg p-3">
                            {inquiry.message}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <a
                            href={`mailto:${inquiry.email}?subject=Re: Your enquiry to NOÉTIC Studio&body=Hi ${inquiry.name},%0D%0A%0D%0AThank you for reaching out.`}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-[var(--accent-teal)]/10 text-[var(--accent-teal-light)] border border-[var(--border-accent)] rounded-lg text-xs font-[family-name:var(--font-body)] hover:bg-[var(--accent-teal)]/20 transition-colors"
                          >
                            <Reply size={12} /> Reply
                          </a>
                          <button
                            onClick={() => setDeleteConfirm(inquiry.id)}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-red-500/5 text-red-400 border border-red-500/10 rounded-lg text-xs font-[family-name:var(--font-body)] hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
