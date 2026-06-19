import { useState } from "react";
import { motion } from "framer-motion";
import { featurePhotos } from "../lib/photos";

const CORNER_ENTRIES = [
  { x: "-62vw", y: "-34vh", rotate: -8 },
  { x: "62vw", y: "-34vh", rotate: 8 },
  { x: "-62vw", y: "34vh", rotate: 8 },
  { x: "62vw", y: "34vh", rotate: -8 },
];

const cornerPhoto = {
  hidden: ({ rotate, x, y }) => ({
    opacity: 0,
    scale: 0.92,
    x,
    y,
    rotate,
  }),
  show: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.72,
      ease: "linear",
    },
  },
};

export function FeaturePhotos() {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!featurePhotos.length) return null;

  return (
    <section className="px-5 pb-14 md:px-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.01 }}
        transition={{ staggerChildren: 0.04 }}
        className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
      >
        {featurePhotos.map((photo, index) => {
          const isActive = index === activeIndex;

          return (
            <motion.button
              type="button"
              key={photo.src}
              custom={CORNER_ENTRIES[index] || CORNER_ENTRIES[0]}
              variants={cornerPhoto}
              onClick={() => setActiveIndex(index)}
              aria-pressed={isActive}
              className={`group transform-gpu overflow-hidden rounded-[24px] border bg-champagne-100 p-0 shadow-soft will-change-transform transition duration-300 active:scale-[0.985] md:rounded-[28px] ${
                isActive
                  ? "border-champagne-300 ring-2 ring-champagne-200/70"
                  : "border-champagne-100"
              }`}
              aria-label={`选中${photo.alt}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className={`aspect-[3/4] h-full w-full transform-gpu object-cover transition-transform duration-300 group-active:scale-[1.015] ${
                  isActive ? "scale-[1.012]" : "scale-100"
                }`}
              />
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}
