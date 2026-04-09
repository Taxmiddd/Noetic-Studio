"use client";

import { motion } from "framer-motion";
import { drawSVG } from "@/lib/animations";

interface NoeticOrbitProps {
  className?: string;
  size?: number;
  mouseX?: number;
  mouseY?: number;
}

export function NoeticOrbit({
  className,
  size = 400,
  mouseX = 0,
  mouseY = 0,
}: NoeticOrbitProps) {
  const gravitySensitivity = 8;
  const offsetX = mouseX * gravitySensitivity;
  const offsetY = mouseY * gravitySensitivity;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      className={className}
      initial="hidden"
      animate="visible"
    >
      {/* Background glow */}
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-teal)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <filter id="starGlow">
          <feGaussianBlur stdDeviation="2" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Subtle glow circle */}
      <circle cx="200" cy="200" r="180" fill="url(#centerGlow)" />

      {/* Outer orbit ring with arrow */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ originX: "200px", originY: "200px" }}
      >
        <motion.circle
          cx="200"
          cy="200"
          r="175"
          stroke="var(--accent-teal-light)"
          strokeWidth="2.5"
          fill="none"
          opacity="0.5"
          variants={drawSVG}
        />
        {/* Arrow tip on the orbit */}
        <motion.path
          d="M370 180 L380 200 L360 200 Z"
          fill="var(--accent-teal-light)"
          opacity="0.6"
          variants={drawSVG}
        />
      </motion.g>

      {/* Orbital elliptical paths — 6 intersecting orbits */}
      {[0, 30, 60, 90, 120, 150].map((angle, i) => (
        <motion.ellipse
          key={`orbit-${angle}`}
          cx={200 + offsetX * (0.3 + i * 0.1)}
          cy={200 + offsetY * (0.3 + i * 0.1)}
          rx="155"
          ry={55 + i * 8}
          stroke="var(--text-bone)"
          strokeWidth="0.8"
          fill="none"
          opacity={0.15 + i * 0.03}
          transform={`rotate(${angle} 200 200)`}
          variants={drawSVG}
          custom={i}
          transition={{
            pathLength: { duration: 2 + i * 0.3, ease: "easeInOut" },
            opacity: { duration: 0.5, delay: i * 0.15 },
          }}
        />
      ))}

      {/* Additional crossing orbital paths for density */}
      {[15, 45, 75, 105, 135, 165].map((angle, i) => (
        <motion.ellipse
          key={`orbit-inner-${angle}`}
          cx={200 + offsetX * (0.2 + i * 0.05)}
          cy={200 + offsetY * (0.2 + i * 0.05)}
          rx="130"
          ry={40 + i * 6}
          stroke="var(--accent-teal)"
          strokeWidth="0.5"
          fill="none"
          opacity={0.1 + i * 0.02}
          transform={`rotate(${angle} 200 200)`}
          variants={drawSVG}
          custom={i + 6}
          transition={{
            pathLength: { duration: 2.5 + i * 0.2, ease: "easeInOut" },
            opacity: { duration: 0.5, delay: 0.8 + i * 0.1 },
          }}
        />
      ))}

      {/* Inner dark ring */}
      <motion.circle
        cx="200"
        cy="200"
        r="60"
        fill="var(--bg-deep)"
        stroke="var(--text-bone)"
        strokeWidth="2"
        opacity="0.8"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.8 }}
        transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
      />

      {/* Center star — 4-pointed */}
      <motion.path
        d="M200 165 L207 192 L235 200 L207 208 L200 235 L193 208 L165 200 L193 192 Z"
        fill="var(--text-bone)"
        filter="url(#starGlow)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 2, type: "spring", stiffness: 200 }}
        style={{ transformOrigin: "200px 200px" }}
      />

      {/* Small decorative dots on orbit paths */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const dotX = 200 + 155 * Math.cos(rad);
        const dotY = 200 + 55 * Math.sin(rad);
        return (
          <motion.circle
            key={`dot-${angle}`}
            cx={dotX}
            cy={dotY}
            r="2"
            fill="var(--accent-teal-light)"
            opacity="0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{
              duration: 3,
              delay: 2.5 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </motion.svg>
  );
}
