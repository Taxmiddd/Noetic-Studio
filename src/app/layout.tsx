export const runtime = "edge";

import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Montserrat, Space_Grotesk, Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const SmoothScroll = dynamic(() => import("@/components/ui/SmoothScroll").then(mod => mod.SmoothScroll));
const GlobalBackground = dynamic(() => import("@/components/ui/GlobalBackground").then(mod => mod.GlobalBackground));
const MobileNav = dynamic(() => import("@/components/layout/MobileNav").then(mod => mod.MobileNav));

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-decorative",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NOÉTIC Studio — Creative Agency Bangladesh | Brand, Graphics & Web",
    template: "%s | NOÉTIC Studio",
  },
  description:
    "NOÉTIC Studio is Bangladesh's premier creative agency offering logo design, brand identity, UI/UX, graphics, and full-stack web development. Serving clients globally from Dhaka, BD.",
  keywords: [
    // Brand & name variants
    "NOÉTIC Studio", "Noetic Studio", "noetic", "noetics", "noetic studio bd",
    // Service keywords
    "creative agency", "creative agency Bangladesh", "graphics agency",
    "graphics agency Bangladesh", "graphics agency BD", "graphics Bangladesh",
    "logo design Bangladesh", "logo design BD", "brand identity Bangladesh",
    "web developer Bangladesh", "web developer BD", "web development Bangladesh",
    "UI UX design Bangladesh", "graphic design Bangladesh", "graphic designer BD",
    "branding agency Dhaka", "creative studio Dhaka", "design agency Bangladesh",
    // Specific searches
    "noetic studio Bangladesh", "bd noetic studio", "noetic bd",
    "best creative agency Bangladesh", "top design agency BD",
    "brand design Bangladesh", "campaign design Bangladesh",
    "web design Bangladesh", "full stack developer Bangladesh",
  ],
  authors: [{ name: "NOÉTIC Studio", url: "https://noeticstudio.net" }],
  creator: "NOÉTIC Studio",
  publisher: "NOÉTIC Studio",
  metadataBase: new URL("https://noeticstudio.net"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NOÉTIC Studio — Creative Agency Bangladesh | Brand, Graphics & Web",
    description:
      "NOÉTIC Studio is Bangladesh's leading creative agency. Logo design, brand identity, UI/UX, graphics, and web development — built for brands that demand precision.",
    url: "https://noeticstudio.net",
    type: "website",
    locale: "en_US",
    siteName: "NOÉTIC Studio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NOÉTIC Studio — Creative Agency Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NOÉTIC Studio — Creative Agency Bangladesh",
    description:
      "Bangladesh's premier creative studio. Logo, Brand Identity, UI/UX & Web Development.",
    site: "@TheNoeticStudio",
    creator: "@TheNoeticStudio",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo5.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/logo5.svg", type: "image/svg+xml" },
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
  manifest: "/site.webmanifest",
  category: "Creative Agency",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NOÉTIC Studio",
  alternateName: ["Noetic Studio", "Noetic Studio BD", "NOETIC Studio Bangladesh"],
  url: "https://noeticstudio.net",
  logo: "https://noeticstudio.net/logo5.svg",
  description:
    "NOÉTIC Studio is Bangladesh's premier multidisciplinary creative agency offering logo design, brand identity, UI/UX, graphic design, and full-stack web development.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "BD",
    addressLocality: "Dhaka",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "hello@noeticstudio.net",
    areaServed: ["BD", "Worldwide"],
    availableLanguage: ["English", "Bengali"],
  },
  sameAs: [
    "https://www.instagram.com/thenoeticstudio",
    "https://www.facebook.com/thenoeticstudio",
  ],
  knowsAbout: [
    "Logo Design", "Brand Identity", "Graphic Design", "UI/UX Design",
    "Web Development", "Creative Agency", "Campaign Design",
    "Bangladesh Creative Agency", "Graphics Agency",
  ],
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
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0E3MJPSV74"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0E3MJPSV74');
            `,
          }}
        />
        <link rel="preconnect" href="https://eoxfhufkayryfzqtnjsp.supabase.co" />
        <link rel="dns-prefetch" href="https://eoxfhufkayryfzqtnjsp.supabase.co" />
      </head>
      <body className="bg-[var(--bg-deep)] text-[var(--text-bone)] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>
          <div className="vignette" />
          <GlobalBackground />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileNav />
        </SmoothScroll>
        <SpeedInsights />
      </body>
    </html>
  );
}
