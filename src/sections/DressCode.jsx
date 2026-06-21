import { motion } from "framer-motion";
import { MotionSection, motionItem } from "../components/MotionSection";
import dressCodePoster from "../assets/photos/dress-code.webp";

export function DressCode() {
  return (
    <MotionSection
      variant="bloom"
      stagger={0.08}
      className="px-5 pb-14 md:pb-16"
    >
      <div className="mx-auto max-w-xl">
        <motion.div variants={motionItem} className="text-center">
          <p className="text-eyebrow mb-3 text-xs text-champagne-600">
            Dress Code
          </p>
          <h3 className="text-display text-3xl font-light text-ink md:text-4xl">
            着装建议
          </h3>
          <span className="mt-4 inline-block h-px w-16 gold-line" />
          <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-ink-soft">
            轻盈、清爽、温柔的浅色系，会很适合这场户外婚礼。
          </p>
        </motion.div>

        <motion.figure
          variants={motionItem}
          className="mt-8 overflow-hidden rounded-[32px] border border-champagne-200/70 bg-ivory-50/95 p-3 shadow-soft backdrop-blur md:p-4"
        >
          <img
            src={dressCodePoster}
            alt="户外婚礼着装建议：女士建议轻盈清爽的裙装，男士建议清爽得体的浅色服装，整体以奶油白、香槟米、浅杏、雾粉、丁香紫、雾绿为主。"
            loading="lazy"
            decoding="async"
            className="w-full rounded-[24px] object-cover"
          />
        </motion.figure>
      </div>
    </MotionSection>
  );
}
