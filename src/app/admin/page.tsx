"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { BentoCardData } from "@/components/ui/MagicBento";
import { ArrowRight } from "lucide-react";

const MagicBento = dynamic(() => import("@/components/ui/MagicBento"), { ssr: false });

interface Stats {
  projects: number;
  unread: number;
  partners: number;
  services: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, unread: 0, partners: 0, services: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const [
          { count: p },
          { count: u },
          { count: pa },
          { count: s },
        ] = await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("contact_inquiries").select("*", { count: "exact", head: true }).eq("is_read", false),
          supabase.from("partners").select("*", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("services").select("*", { count: "exact", head: true }).eq("is_active", true),
        ]);
        setStats({ projects: p ?? 0, unread: u ?? 0, partners: pa ?? 0, services: s ?? 0 });
      } catch {
        // silently fail — zeros shown
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const bentoCards: BentoCardData[] = [
    {
      label: "Portfolio",
      title: loading ? "—" : String(stats.projects),
      description: "Total Projects",
      onClick: () => router.push("/admin/projects"),
    },
    {
      label: "Inbox",
      title: loading ? "—" : String(stats.unread),
      description: stats.unread > 0 ? "Unread inquiries" : "All caught up",
      onClick: () => router.push("/admin/inquiries"),
    },
    {
      label: "Actions",
      title: "Create",
      description: "New Project",
      content: (
        <div className="flex flex-col h-full justify-between">
          <div />
          <div>
            <h2 className="magic-bento-card__title" style={{ fontSize: "1.6em" }}>
              New Project
            </h2>
            <p className="magic-bento-card__description">Publish to portfolio</p>
            <div style={{ marginTop: "1em", display: "flex", alignItems: "center", gap: "0.4em", fontSize: "0.55em", textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.5, color: "#14B8A6" }}>
              Open editor <ArrowRight size={10} />
            </div>
          </div>
        </div>
      ),
      onClick: () => router.push("/admin/projects/new"),
    },
    {
      label: "Leads",
      title: loading ? "—" : String(stats.unread),
      description: "Open inquiries",
      content: (
        <div className="flex flex-col h-full justify-between">
          <div />
          <div>
            <h2 className="magic-bento-card__title" style={{ fontSize: "1.6em" }}>
              Inquiries
            </h2>
            <p className="magic-bento-card__description">
              {loading ? "Loading..." : `${stats.unread} unread messages`}
            </p>
            <div style={{ marginTop: "1em", display: "flex", alignItems: "center", gap: "0.4em", fontSize: "0.55em", textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.5, color: "#14B8A6" }}>
              View all <ArrowRight size={10} />
            </div>
          </div>
        </div>
      ),
      onClick: () => router.push("/admin/inquiries"),
    },
    {
      label: "Services",
      title: loading ? "—" : String(stats.services),
      description: "Active offerings",
      onClick: () => router.push("/admin/services"),
    },
    {
      label: "Partners",
      title: loading ? "—" : String(stats.partners),
      description: "In marquee",
      onClick: () => router.push("/admin/partners"),
    },
    {
      label: "Payments",
      title: "New",
      description: "Generate Invoice",
      onClick: () => router.push("/admin/payments"),
    },
  ];

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

      {/* Bento Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <MagicBento
          cards={bentoCards}
          textAutoHide={false}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={220}
          particleCount={8}
          glowColor="20, 184, 166"
        />
      </motion.div>
    </div>
  );
}
