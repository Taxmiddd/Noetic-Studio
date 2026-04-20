export const runtime = "edge";

import type { Metadata } from "next";
import { Montserrat, Space_Grotesk, Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { GlobalBackground } from "@/components/ui/GlobalBackground";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-decorative",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NOÉTIC Studio — Creative Intelligence",
    template: "%s | NOÉTIC Studio",
  },
  description:
    "NOÉTIC Studio fuses insight with execution to solve complex market challenges. Logo Design, Brand Identity, UI/UX, and Full-stack Web Development.",
  keywords: [
    "creative agency",
    "brand identity",
    "logo design",
    "UI/UX design",
    "web development",
    "creative direction",
    "NOÉTIC Studio",
  ],
  authors: [{ name: "NOÉTIC Studio" }],
  openGraph: {
    title: "NOÉTIC Studio — Creative Intelligence",
    description:
      "Clarity. Mandated. NOÉTIC fuses insight with execution to solve complex market challenges.",
    type: "website",
    locale: "en_US",
    siteName: "NOÉTIC Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "NOÉTIC Studio — Creative Intelligence",
    description:
      "Clarity. Mandated. Creative Intelligence for the modern market.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${spaceGrotesk.variable} ${playfair.variable}`}
    >
      <body className="bg-[var(--bg-deep)] text-[var(--text-bone)] antialiased">
        <SmoothScroll>
          <div className="vignette" />
          <GlobalBackground />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileNav />
        </SmoothScroll>
      </body>
    </html>
  );
}
