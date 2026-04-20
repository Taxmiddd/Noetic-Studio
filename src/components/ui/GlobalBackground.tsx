"use client";

import { usePathname } from "next/navigation";
import DotField from "./DotField";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function GlobalBackground() {
  const pathname = usePathname();
  const [showDots, setShowDots] = useState(true);

  useEffect(() => {
    if (pathname === "/") {
      const handleScroll = () => {
        // Show dots after 80vh of scrolling (end of hero)
        setShowDots(window.scrollY > window.innerHeight * 0.8);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setShowDots(true);
    }
  }, [pathname]);

  // Page variants
  let config = {
    opacity: 0.4,
    dotSpacing: 22,
    gradientFrom: "#0D7377",
    gradientTo: "#14B8A6",
    glowColor: "rgba(13, 115, 119, 0.15)",
  };

  if (pathname === "/about") {
    config = {
      ...config,
      opacity: 0.2, // More subtle on About
      dotSpacing: 25,
    };
  } else if (pathname === "/services") {
    config = {
      ...config,
      opacity: 0.5, // Slightly stronger on Services
    };
  } else if (pathname === "/privacy" || pathname === "/terms") {
    config = {
      ...config,
      opacity: 0.15,
      gradientFrom: "#ffffff",
      gradientTo: "#ffffff",
      glowColor: "rgba(255, 255, 255, 0.05)",
    };
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {showDots && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: config.opacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <DotField
              dotRadius={1}
              dotSpacing={config.dotSpacing}
              bulgeStrength={86}
              glowRadius={160}
              sparkle
              waveAmplitude={2}
              gradientFrom={config.gradientFrom}
              gradientTo={config.gradientTo}
              glowColor={config.glowColor}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
