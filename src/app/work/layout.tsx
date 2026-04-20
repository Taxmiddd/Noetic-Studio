import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio & Case Studies",
  description:
    "Explore NOÉTIC Studio's portfolio — branding, logo design, UI/UX, web development and campaign work for clients across Bangladesh and globally.",
  keywords: [
    "NOÉTIC Studio portfolio", "creative agency portfolio Bangladesh",
    "branding case studies", "logo design portfolio BD",
    "graphic design portfolio Bangladesh", "web design portfolio Dhaka",
  ],
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Portfolio & Case Studies | NOÉTIC Studio",
    description: "Selected work across brand identity, logo design, UI/UX and web development.",
    url: "https://noeticstudio.net/work",
  },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
