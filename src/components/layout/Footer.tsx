"use client";

import Link from "next/link";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-deep)] pb-24 md:pb-0">
      {/* Gradient border top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-teal)] to-transparent opacity-30" />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
        {/* Left — Copyright */}
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-bone-dim)] font-[family-name:var(--font-body)]">
          © {new Date().getFullYear()} NOÉTIC Studio. All rights reserved.
        </p>

        {/* Center — Links */}
        <div className="flex items-center gap-8">
          <Link
            href="/privacy"
            className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-bone-dim)] hover:text-[var(--text-bone)] transition-colors font-[family-name:var(--font-body)]"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-bone-dim)] hover:text-[var(--text-bone)] transition-colors font-[family-name:var(--font-body)]"
          >
            Terms
          </Link>
        </div>

        {/* Right — Social + Status */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/TheNoeticStudio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-bone-dim)] hover:text-[var(--accent-teal-light)] transition-colors p-1"
              aria-label="X (Twitter)"
            >
              <Twitter size={14} />
            </a>
            <a
              href="https://www.instagram.com/thenoeticstudio/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-bone-dim)] hover:text-[var(--accent-teal-light)] transition-colors p-1"
              aria-label="Instagram"
            >
              <Instagram size={14} />
            </a>
          </div>
          <div className="w-[1px] h-4 bg-[var(--border-subtle)] hidden md:block" />
          <StatusIndicator />
        </div>
      </div>
    </footer>
  );
}
