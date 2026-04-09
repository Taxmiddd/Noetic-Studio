"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  splitBy?: "word" | "character";
}

export function AnimatedText({
  text,
  className,
  delay = 0,
  as: Tag = "p",
  splitBy = "word",
}: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const units = splitBy === "word" ? text.split(" ") : text.split("");

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className}>
      {units.map((unit, i) => (
        <motion.span
          key={`${unit}-${i}`}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.04,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ display: "inline-block" }}
        >
          {unit}
          {splitBy === "word" && i < units.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </Tag>
  );
}
