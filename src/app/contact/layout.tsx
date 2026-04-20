import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Start a Project",
  description:
    "Get in touch with NOÉTIC Studio — Bangladesh's leading creative and web agency. Start a brand identity, logo, or web development project today.",
  keywords: [
    "contact NOÉTIC Studio", "hire creative agency Bangladesh",
    "hire graphic designer Bangladesh", "hire web developer BD",
    "start branding project Bangladesh", "noetic studio contact",
    "creative agency Dhaka contact",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | NOÉTIC Studio",
    description: "Start your next brand identity, logo or web project with Bangladesh's premier creative studio.",
    url: "https://noeticstudio.net/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
