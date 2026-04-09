"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mail, MailOpen, ChevronDown, ChevronUp } from "lucide-react";

const demoInquiries = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@meridiangroup.com",
    company: "Meridian Group",
    service: "Brand Identity",
    message: "We're launching a new fintech product and need a complete brand identity. Our timeline is Q2 2026 and budget is flexible for the right team.",
    is_read: false,
    created_at: "2026-04-08T10:00:00Z",
  },
  {
    id: "2",
    name: "Alex Rivera",
    email: "alex@voltaevents.com",
    company: "Volta Events",
    service: "Event Campaign",
    message: "Following up on our previous collaboration — we have another festival coming up in September and would love NOÉTIC to handle the campaign again.",
    is_read: false,
    created_at: "2026-04-07T16:30:00Z",
  },
  {
    id: "3",
    name: "Marcus Webb",
    email: "marcus@zenithlabs.io",
    company: "Zenith Labs",
    service: "UI/UX Design",
    message: "Our SaaS platform needs a major UX overhaul. We've grown from 50 to 5000 users and the current interface doesn't scale. Can we schedule a call?",
    is_read: false,
    created_at: "2026-04-06T09:15:00Z",
  },
  {
    id: "4",
    name: "Emma Thornton",
    email: "emma@apexathletics.com",
    company: "Apex Athletics",
    service: "Logo Design",
    message: "Love the work you did for our logo. Now we need sub-brand logos for our three product lines. Same aesthetic, differentiated marks.",
    is_read: true,
    created_at: "2026-04-04T14:00:00Z",
  },
];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState(demoInquiries);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    // Mark as read
    setInquiries(
      inquiries.map((inq) =>
        inq.id === id ? { ...inq, is_read: true } : inq
      )
    );
  };

  const unreadCount = inquiries.filter((i) => !i.is_read).length;

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <h1 className="heading-section text-2xl md:text-3xl">Inquiries</h1>
          {unreadCount > 0 && (
            <span className="text-[10px] font-[family-name:var(--font-body)] bg-[var(--accent-teal)]/20 text-[var(--accent-teal-light)] px-2.5 py-0.5 rounded-full border border-[var(--border-accent)]">
              {unreadCount} new
            </span>
          )}
        </div>
        <p className="text-body text-sm">Contact form submissions.</p>
      </motion.div>

      {/* Inquiries List */}
      <div className="space-y-3">
        {inquiries.map((inquiry, i) => (
          <motion.div
            key={inquiry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard padding="sm" hover={false}>
              <button
                onClick={() => toggleExpand(inquiry.id)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between px-2 py-2">
                  <div className="flex items-center gap-3">
                    {inquiry.is_read ? (
                      <MailOpen size={16} className="text-[var(--text-bone-dim)] flex-shrink-0" />
                    ) : (
                      <Mail size={16} className="text-[var(--accent-teal-light)] flex-shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-[family-name:var(--font-body)] ${
                            inquiry.is_read
                              ? "text-[var(--text-bone-muted)]"
                              : "text-[var(--text-bone)] font-medium"
                          }`}
                        >
                          {inquiry.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-bone-dim)] font-[family-name:var(--font-body)]">
                          {inquiry.company}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-bone-dim)] font-[family-name:var(--font-body)] truncate max-w-md">
                        {inquiry.message.slice(0, 80)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-[var(--text-bone-dim)] font-[family-name:var(--font-body)] hidden md:block">
                      {new Date(inquiry.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {expandedId === inquiry.id ? (
                      <ChevronUp size={14} className="text-[var(--text-bone-dim)]" />
                    ) : (
                      <ChevronDown size={14} className="text-[var(--text-bone-dim)]" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded content */}
              {expandedId === inquiry.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-2 pb-3 pt-2 border-t border-[var(--border-subtle)] mt-2"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                        {inquiry.service}
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
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-label text-[9px] block mb-1">Message</span>
                    <p className="text-sm text-[var(--text-bone)] leading-relaxed font-[family-name:var(--font-body)]">
                      {inquiry.message}
                    </p>
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
