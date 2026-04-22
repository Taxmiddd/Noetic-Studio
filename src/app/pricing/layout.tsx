import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "NOÉTIC Studio offers bespoke, quotation-based pricing for all creative and digital services. No off-the-shelf packages — every engagement is tailored to your brand's strategic needs.",
  alternates: { canonical: "/pricing" },
  robots: { index: true, follow: true },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
