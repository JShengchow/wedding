import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const SECTION_VARIANTS = {
  none: {
    hidden: { opacity: 1 },
    show: { opacity: 1 },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  rise: {
    hidden: { opacity: 0, y: 36 },
    show: { opacity: 1, y: 0 },
  },
  driftLeft: {
    hidden: { opacity: 0, x: -42, rotate: -1.5 },
    show: { opacity: 1, x: 0, rotate: 0 },
  },
  driftRight: {
    hidden: { opacity: 0, x: 42, rotate: 1.5 },
    show: { opacity: 1, x: 0, rotate: 0 },
  },
  bloom: {
    hidden: { opacity: 0, scale: 0.92, filter: "blur(8px)" },
    show: { opacity: 1, scale: 1, filter: "blur(0px)" },
  },
  scatter: {
    hidden: { opacity: 0, scale: 0.96, rotate: -2, y: 24 },
    show: { opacity: 1, scale: 1, rotate: 0, y: 0 },
  },
  pop: {
    hidden: { opacity: 0, scale: 0.86, y: 18 },
    show: { opacity: 1, scale: 1, y: 0 },
  },
  spin: {
    hidden: { opacity: 0, scale: 0.9, rotate: 4 },
    show: { opacity: 1, scale: 1, rotate: 0 },
  },
};

const REDUCED_VARIANTS = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const motionItem = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export const scatterItem = {
  hidden: { opacity: 0, x: 0, y: 18, rotate: -2, scale: 0.94 },
  show: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 },
};

export function MotionSection({
  as = "section",
  children,
  className = "",
  delay = 0,
  once = true,
  stagger = 0.08,
  variant = "rise",
  viewportAmount = 0.24,
}) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion
    ? REDUCED_VARIANTS
    : SECTION_VARIANTS[variant] || SECTION_VARIANTS.rise;
  const sectionVariants = {
    hidden: variants.hidden,
    show: {
      ...variants.show,
      transition: {
        delay,
        duration: prefersReducedMotion ? 0.2 : 0.78,
        ease: EASE,
        staggerChildren: prefersReducedMotion ? 0 : stagger,
      },
    },
  };
  const Component = motion[as] || motion.section;

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: viewportAmount }}
      variants={sectionVariants}
    >
      {children}
    </Component>
  );
}
