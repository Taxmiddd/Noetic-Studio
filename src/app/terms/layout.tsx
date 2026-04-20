import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read NOÉTIC Studio's Terms of Service — the legal framework governing our creative services, project deliverables, intellectual property, and client agreements.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
