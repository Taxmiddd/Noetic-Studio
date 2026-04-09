import { type Variants } from "framer-motion";

// Spring physics config for premium "weight" feel
export const springConfig = {
  gentle: { type: "spring" as const, stiffness: 100, damping: 20, mass: 1 },
  snappy: { type: "spring" as const, stiffness: 300, damping: 30, mass: 0.8 },
  heavy: { type: "spring" as const, stiffness: 80, damping: 25, mass: 1.5 },
  bounce: { type: "spring" as const, stiffness: 400, damping: 15, mass: 0.5 },
};

// ─── Entrance Animations ───

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...springConfig.gentle, duration: 0.8 },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...springConfig.gentle, duration: 0.6 },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springConfig.snappy,
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springConfig.gentle,
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springConfig.gentle,
  },
};

// ─── Container Stagger ───

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

// ─── SVG Path Drawing ───

export const drawSVG: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 2, ease: "easeInOut" },
      opacity: { duration: 0.3 },
    },
  },
};

// ─── Text Reveal ───

export const textReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    clipPath: "inset(100% 0 0 0)",
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0 0 0)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ─── Hover Animations ───

export const hoverScale = {
  scale: 1.02,
  transition: springConfig.snappy,
};

export const tapScale = {
  scale: 0.97,
  transition: springConfig.bounce,
};

// ─── Page Transitions ───

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};
