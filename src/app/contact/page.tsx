"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Send, CheckCircle } from "lucide-react";

const serviceOptions = [
  "Logo Design",
  "Brand Identity",
  "Event Campaign",
  "Creative Direction",
  "UI/UX Design",
  "Web Development",
  "Not sure yet",
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate submission (replace with Supabase insert when connected)
    await new Promise((r) => setTimeout(r, 1500));

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="pt-[var(--nav-height)]">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left — Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-label mb-4 block">Contact</span>
              <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-6">
                Let&apos;s{" "}
                <span className="gradient-text">Talk.</span>
              </h1>
              <p className="text-body text-base md:text-lg mb-12 max-w-md">
                Have a project in mind? We'd love to hear about it. Tell us what you're working on and we'll get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                <div>
                  <span className="text-label text-[10px] block mb-1">Email</span>
                  <a
                    href="mailto:thenoeticstudio@gmail.com"
                    className="text-sm text-[var(--text-bone)] hover:text-[var(--accent-teal-light)] transition-colors font-[family-name:var(--font-body)]"
                  >
                    thenoeticstudio@gmail.com
                  </a>
                </div>
                <div>
                  <span className="text-label text-[10px] block mb-1">Instagram</span>
                  <a
                    href="https://instagram.com/thenoeticstudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--text-bone)] hover:text-[var(--accent-teal-light)] transition-colors font-[family-name:var(--font-body)]"
                  >
                    @thenoeticstudio
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {submitted ? (
                <GlassCard padding="lg" className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="space-y-4"
                  >
                    <CheckCircle
                      size={48}
                      className="text-[var(--accent-teal-light)] mx-auto"
                    />
                    <h2 className="heading-section text-2xl">Message Sent</h2>
                    <p className="text-body">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </motion.div>
                </GlassCard>
              ) : (
                <GlassCard padding="lg" hover={false}>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="text-label text-[10px] block mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) =>
                          setFormState((s) => ({ ...s, name: e.target.value }))
                        }
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-bone)] font-[family-name:var(--font-body)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors placeholder:text-[var(--text-bone-dim)]"
                        placeholder="Your name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-label text-[10px] block mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) =>
                          setFormState((s) => ({ ...s, email: e.target.value }))
                        }
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-bone)] font-[family-name:var(--font-body)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors placeholder:text-[var(--text-bone-dim)]"
                        placeholder="you@company.com"
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label className="text-label text-[10px] block mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={formState.company}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            company: e.target.value,
                          }))
                        }
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-bone)] font-[family-name:var(--font-body)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors placeholder:text-[var(--text-bone-dim)]"
                        placeholder="Your company"
                      />
                    </div>

                    {/* Service Interest */}
                    <div>
                      <label className="text-label text-[10px] block mb-2">
                        Service Interest
                      </label>
                      <select
                        value={formState.service}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            service: e.target.value,
                          }))
                        }
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-bone)] font-[family-name:var(--font-body)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors appearance-none"
                      >
                        <option value="">Select a service</option>
                        {serviceOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-label text-[10px] block mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formState.message}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            message: e.target.value,
                          }))
                        }
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-bone)] font-[family-name:var(--font-body)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors resize-none placeholder:text-[var(--text-bone-dim)]"
                        placeholder="Tell us about your project..."
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full gap-2"
                      isLoading={loading}
                    >
                      <Send size={16} />
                      Send Message
                    </Button>
                  </form>
                </GlassCard>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
