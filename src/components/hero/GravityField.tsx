"use client";

import { useSpring, useTransform, MotionValue } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";

export function useGravityField() {
  const { normalizedX, normalizedY } = useMousePosition();

  const springX = useSpring(normalizedX, {
    stiffness: 50,
    damping: 30,
    mass: 1.5,
  });
  const springY = useSpring(normalizedY, {
    stiffness: 50,
    damping: 30,
    mass: 1.5,
  });

  return { springX, springY, normalizedX, normalizedY };
}
