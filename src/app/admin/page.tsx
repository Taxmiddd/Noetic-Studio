"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import {
  FolderKanban,
  MessageSquare,
  Eye,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    icon: FolderKanban,
    label: "Total Projects",
    value: "6",
    change: "+2 this month",
  },
  {
    icon: MessageSquare,
    label: "Unread Inquiries",
    value: "3",
    change: "2 new today",
  },
  {
    icon: Eye,
    label: "Portfolio Views",
    value: "1,247",
    change: "+18% vs last month",
  },
  {
    icon: TrendingUp,
    label: "Engagement Rate",
    value: "4.2%",
    change: "+0.8% this week",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="heading-section text-2xl md:text-3xl mb-1">Dashboard</h1>
        <p className="text-body text-sm">Welcome back to NOÉTIC Admin.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={fadeInUp}>
              <GlassCard padding="md">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center">
                    <Icon size={18} className="text-[var(--accent-teal-light)]" />
                  </div>
                </div>
                <p className="heading-section text-2xl mb-0.5">{stat.value}</p>
                <p className="text-xs text-[var(--text-bone-muted)] font-[family-name:var(--font-body)] mb-1">
                  {stat.label}
                </p>
                <p className="text-[10px] text-[var(--accent-teal-light)] font-[family-name:var(--font-body)]">
                  {stat.change}
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <GlassCard padding="lg" hover={false}>
          <h2 className="heading-section text-lg mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: "New inquiry from Sarah Chen", time: "2 hours ago", type: "inquiry" },
              { action: "Portfolio 'Meridian Financial' updated", time: "5 hours ago", type: "project" },
              { action: "New inquiry from Alex Rivera", time: "1 day ago", type: "inquiry" },
              { action: "Project 'Volta Festival' published", time: "2 days ago", type: "project" },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "inquiry"
                        ? "bg-[var(--accent-teal-light)]"
                        : "bg-[var(--text-bone-dim)]"
                    }`}
                  />
                  <span className="text-sm text-[var(--text-bone)] font-[family-name:var(--font-body)]">
                    {activity.action}
                  </span>
                </div>
                <span className="text-xs text-[var(--text-bone-dim)] font-[family-name:var(--font-body)]">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
