"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { tapScale } from "@/lib/animations";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  isLoading,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center font-medium font-[family-name:var(--font-body)] tracking-wide transition-all duration-300 rounded-lg overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-deep)]";

  const variants = {
    primary:
      "bg-gradient-to-r from-[var(--accent-teal)] to-[var(--accent-teal-light)] text-[var(--bg-deep)] hover:opacity-90 shadow-lg shadow-[var(--accent-teal-glow)]",
    secondary:
      "bg-[var(--bg-surface)] text-[var(--text-bone)] border border-[var(--border-glass)] hover:border-[var(--border-accent)] hover:bg-[var(--bg-elevated)]",
    ghost:
      "bg-transparent text-[var(--text-bone-muted)] hover:text-[var(--text-bone)] hover:bg-[rgba(245,245,240,0.05)]",
    outline:
      "bg-transparent text-[var(--accent-teal-light)] border border-[var(--border-accent)] hover:bg-[rgba(13,115,119,0.1)]",
  };

  const sizes = {
    sm: "text-xs px-4 py-2",
    md: "text-sm px-6 py-3",
    lg: "text-base px-8 py-4",
  };

  return (
    <motion.button
      whileTap={tapScale}
      whileHover={{ scale: 1.02 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
