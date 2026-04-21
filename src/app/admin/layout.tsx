"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Users,
  LogOut,
  ChevronLeft,
  Layers,
  FileText,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: FolderKanban, label: "Projects", href: "/admin/projects" },
  { icon: Layers, label: "Services", href: "/admin/services" },
  { icon: MessageSquare, label: "Inquiries", href: "/admin/inquiries" },
  { icon: Users, label: "Partners", href: "/admin/partners" },
  { icon: FileText, label: "Policies", href: "/admin/policies" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Skip auth check for login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthenticated(true);
      return;
    }
    const isAuth = sessionStorage.getItem("noetic-admin");
    if (!isAuth) {
      router.push("/admin/login");
    } else {
      setAuthenticated(true);
    }
  }, [router, isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-deep)] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-teal)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    sessionStorage.removeItem("noetic-admin");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className={cn(
          "fixed top-0 left-0 bottom-0 z-40 glass-panel border-r border-[var(--border-subtle)] flex flex-col transition-all duration-300",
          sidebarCollapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* Header */}
        <div className="px-4 h-16 flex items-center justify-between border-b border-[var(--border-subtle)]">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
                <path d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z" fill="var(--accent-teal-light)" />
              </svg>
              <span className="text-sm font-[family-name:var(--font-heading)] font-bold text-[var(--text-bone)] tracking-wide">
                NOÉTIC
              </span>
              <span className="text-[10px] text-[var(--text-bone-dim)] font-[family-name:var(--font-body)]">
                Admin
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors"
          >
            <ChevronLeft
              size={16}
              className={cn(
                "text-[var(--text-bone-dim)] transition-transform",
                sidebarCollapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-[family-name:var(--font-body)] transition-all duration-200",
                  isActive
                    ? "bg-[var(--accent-teal)]/10 text-[var(--accent-teal-light)] border border-[var(--border-accent)]"
                    : "text-[var(--text-bone-muted)] hover:text-[var(--text-bone)] hover:bg-[var(--bg-surface)]"
                )}
              >
                <Icon size={18} />
                {!sidebarCollapsed && link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-[family-name:var(--font-body)] text-[var(--text-bone-dim)] hover:text-red-400 hover:bg-red-400/5 transition-all duration-200 w-full"
          >
            <LogOut size={18} />
            {!sidebarCollapsed && "Log Out"}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
        )}
      >
        <div className="p-6 md:p-8">{children}</div>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--bg-surface)",
            color: "var(--text-bone)",
            border: "1px solid var(--border-glass)",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
          },
          success: { iconTheme: { primary: "#14B8A6", secondary: "#040D0C" } },
          error: { iconTheme: { primary: "#f87171", secondary: "#040D0C" } },
        }}
      />
      <Analytics />
    </div>
  );
}
