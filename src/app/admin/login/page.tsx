"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate auth (replace with Supabase auth when connected)
      if (email && password) {
        await new Promise((r) => setTimeout(r, 1000));
        // Store a simple auth flag for demo
        sessionStorage.setItem("noetic-admin", "true");
        router.push("/admin");
      }
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-deep)] px-6">
      {/* Ambient glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[var(--accent-teal)] opacity-[0.03] blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
        className="w-full max-w-md relative z-[60] pointer-events-auto"
      >
        <GlassCard blur={false} padding="lg" hover={false}>
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src="/logo5.svg" alt="NOÉTIC" className="h-8 md:h-10 w-auto" />
            </div>
            <h1 className="heading-section text-xl mb-1">Admin</h1>
            <p className="text-body text-xs">Sign in to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="text-xs text-red-400 bg-red-400/10 rounded-lg px-4 py-3 border border-red-400/20">
                {error}
              </div>
            )}

            <div>
              <label className="text-label text-[10px] block mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-bone)] font-[family-name:var(--font-body)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors placeholder:text-[var(--text-bone-dim)]"
                placeholder="admin@noeticstudio.com"
              />
            </div>

            <div>
              <label className="text-label text-[10px] block mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-bone)] font-[family-name:var(--font-body)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors placeholder:text-[var(--text-bone-dim)]"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
