"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import dynamic from "next/dynamic";

// Dynamically import WebGL-heavy components to avoid SSR issues
const Dither = dynamic(() => import("@/components/ui/Dither"), { ssr: false });
const ASCIIText = dynamic(() => import("@/components/ui/ASCIIText"), { ssr: false });

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[var(--bg-deep)]">

      {/* Dither: full-screen interactive background */}
      <div className="absolute inset-0 z-0">
        <Dither
          waveColor={[0.05, 0.45, 0.47]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={3}
          waveAmplitude={0.35}
          waveFrequency={2.5}
          waveSpeed={0.06}
          pixelSize={3}
        />
      </div>

      {/* Subtle dark overlay to keep text readable */}
      <div className="absolute inset-0 z-[1] bg-[var(--bg-deep)]/50 pointer-events-none" />

      {/* ASCIIText: "404" hero */}
      <div className="absolute inset-0 z-[2] pointer-events-none" style={{ opacity: 0.85 }}>
        <ASCIIText
          text="404"
          enableWaves={true}
          asciiFontSize={9}
          textFontSize={240}
          textColor="#0D7377"
          planeBaseHeight={12}
        />
      </div>

      {/* Foreground content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center max-w-lg px-6 pointer-events-auto"
      >
        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="h-px bg-gradient-to-r from-transparent via-[var(--border-glass)] to-transparent mb-8"
        />

        <span className="text-label block mb-4">Error — Page not found</span>

        <h1 className="heading-display text-3xl md:text-4xl mb-4">
          CLARITY.{" "}
          <span className="gradient-text">LOST.</span>
        </h1>

        <p className="text-body text-sm md:text-base mb-10 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
        </p>

        <Link href="/">
          <Button variant="primary" size="lg" className="gap-2">
            <ArrowLeft size={16} />
            Back to Homepage
          </Button>
        </Link>
      </motion.div>

      {/* Corner marks */}
      <div className="fixed top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-[var(--border-subtle)] pointer-events-none z-10" />
      <div className="fixed top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-[var(--border-subtle)] pointer-events-none z-10" />
      <div className="fixed bottom-8 left-8 w-8 h-8 border-l-2 border-b-2 border-[var(--border-subtle)] pointer-events-none z-10" />
      <div className="fixed bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-[var(--border-subtle)] pointer-events-none z-10" />
    </div>
  );
}
