import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "NOÉTIC Studio's milestone-based refund policy. Understand our fair approach to deposits, project cancellations, and digital deliverable ownership.",
  alternates: { canonical: "/refund" },
  robots: { index: true, follow: true },
};

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
