"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Home, Briefcase, Layers, Mail } from "lucide-react";

const tabs = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Briefcase, label: "Work", href: "/work" },
  { icon: Layers, label: "Services", href: "/services" },
  { icon: Mail, label: "Contact", href: "/contact" },
];

export function MobileNav() {
  const pathname = usePathname();

  // Don't show on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-panel border-t border-[var(--border-subtle)] safe-bottom"
    >
      <div className="flex items-center justify-around h-[var(--mobile-nav-height)] px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 py-2"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="flex flex-col items-center"
              >
                <div className="relative">
                  <Icon
                    size={20}
                    className={cn(
                      "transition-colors duration-300",
                      isActive
                        ? "text-[var(--accent-teal-light)]"
                        : "text-[var(--text-bone-dim)]"
                    )}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="mobile-indicator"
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent-teal-light)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-[family-name:var(--font-body)] transition-colors duration-300",
                    isActive
                      ? "text-[var(--accent-teal-light)]"
                      : "text-[var(--text-bone-dim)]"
                  )}
                >
                  {tab.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
