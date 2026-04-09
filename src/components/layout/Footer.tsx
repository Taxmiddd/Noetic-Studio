"use client";

import Link from "next/link";
import { StatusIndicator } from "@/components/ui/StatusIndicator";

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-deep)] pb-24 md:pb-0">
      {/* Gradient border top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-teal)] to-transparent opacity-30" />

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left — Copyright */}
        <p className="text-xs text-[var(--text-bone-dim)] font-[family-name:var(--font-body)]">
          © {new Date().getFullYear()} NOÉTIC Studio. All rights reserved.
        </p>

        {/* Center — Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="text-xs text-[var(--text-bone-dim)] hover:text-[var(--text-bone-muted)] transition-colors font-[family-name:var(--font-body)]"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-xs text-[var(--text-bone-dim)] hover:text-[var(--text-bone-muted)] transition-colors font-[family-name:var(--font-body)]"
          >
            Terms
          </Link>
        </div>

        {/* Right — Social + Status */}
        <div className="flex items-center gap-6">
          <a
            href="https://instagram.com/thenoeticstudio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--text-bone-dim)] hover:text-[var(--accent-teal-light)] transition-colors font-[family-name:var(--font-body)]"
          >
            @thenoeticstudio
          </a>
          <StatusIndicator />
        </div>
      </div>
    </footer>
  );
}
