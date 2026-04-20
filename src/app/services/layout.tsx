import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Logo, Branding, Web & UI/UX",
  description:
    "NOÉTIC Studio offers logo design, brand identity, UI/UX design, event campaigns, creative direction, and full-stack web development in Bangladesh.",
  keywords: [
    "logo design service Bangladesh", "brand identity service BD",
    "UI UX design service BD", "web development service Bangladesh",
    "graphic design service Dhaka", "creative agency services BD",
    "campaign design Bangladesh", "creative direction Bangladesh",
  ],
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | NOÉTIC Studio — Creative Agency Bangladesh",
    description: "Logo design, brand identity, UI/UX, web development & campaign architecture in Bangladesh.",
    url: "https://noeticstudio.net/services",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
