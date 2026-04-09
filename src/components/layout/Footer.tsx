"use client";

import Link from "next/link";
import { StatusIndicator } from "@/components/ui/StatusIndicator";

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4l11.733 16h4.267l-11.733-16z" />
                <path d="M4 20l6.768-6.768m2.464-2.464l6.768-6.768" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/thenoeticstudio/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-bone-dim)] hover:text-[var(--accent-teal-light)] transition-colors p-1"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
          </div>
          <div className="w-[1px] h-4 bg-[var(--border-subtle)] hidden md:block" />
          <StatusIndicator />
        </div>
      </div>
    </footer>
  );
}
