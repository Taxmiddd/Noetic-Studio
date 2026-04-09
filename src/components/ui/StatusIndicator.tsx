"use client";

export function StatusIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        <span className="absolute w-2.5 h-2.5 rounded-full bg-[var(--accent-teal-light)] animate-pulse-teal" />
        <span className="w-2 h-2 rounded-full bg-[var(--accent-teal-light)]" />
      </div>
      <span className="text-xs text-[var(--text-bone-dim)] font-[family-name:var(--font-body)]">
        All Systems Operational
      </span>
    </div>
  );
}
