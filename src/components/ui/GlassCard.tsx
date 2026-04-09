"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

export function GlassCard({
  children,
  className,
  hover = true,
  padding = "md",
}: GlassCardProps) {
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <motion.div
      whileHover={hover ? { scale: 1.01, y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn("glass-card rounded-2xl", paddings[padding], className)}
    >
      {children}
    </motion.div>
  );
}
