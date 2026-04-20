"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Send, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

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
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("contact_inquiries").insert([
        {
          name: formState.name,
          email: formState.email,
          company: formState.company,
          service_interest: formState.service,
          message: formState.message,
          is_read: false,
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
      toast.success("Message sent successfully!");
    } catch (error: any) {
      console.error("Error submitting inquiry:", error);
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[var(--nav-height)] relative overflow-hidden min-h-screen">
      <section className="section-padding relative z-10">
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
                    href="mailto:contact@noeticstudio.net"
                    className="text-sm text-[var(--text-bone)] hover:text-[var(--accent-teal-light)] transition-colors font-[family-name:var(--font-body)]"
                  >
                    contact@noeticstudio.net
                  </a>
                </div>
                <div>
                  <span className="text-label text-[10px] block mb-1">WhatsApp / Phone</span>
                  <a
                    href="https://wa.me/8801755831289"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--text-bone)] hover:text-[var(--accent-teal-light)] transition-colors font-[family-name:var(--font-body)]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.274-.101-.473-.15-.673.15-.197.295-.771.966-.944 1.162-.175.195-.349.21-.646.065-.3-.15-1.265-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.525.146-.18.194-.3.297-.495.098-.21.046-.39-.029-.54-.075-.15-.671-1.62-.92-2.205-.243-.585-.487-.51-.671-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.285-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.21 2.095 3.205 5.076 4.485.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.195-.572-.345z"/>
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.756.449 3.411 1.238 4.861L2 22l5.35-1.18A9.957 9.957 0 0 0 12 22z"/>
                    </svg>
                    +8801755831289
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
