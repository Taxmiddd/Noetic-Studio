import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — The Studio",
  description:
    "Learn about NOÉTIC Studio — a multidisciplinary creative agency from Bangladesh that fuses design, technology and human intelligence to build world-class brands.",
  keywords: [
    "about NOÉTIC Studio", "noetic studio Bangladesh", "creative studio Dhaka",
    "about creative agency BD", "noetic studio team", "noetics",
    "Bangladesh design studio", "Dhaka creative agency",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | NOÉTIC Studio — Creative Agency Bangladesh",
    description: "NOÉTIC Studio is a multidisciplinary creative agency from Dhaka, Bangladesh — building brands, digital experiences and strategic campaigns.",
    url: "https://noeticstudio.net/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
