import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { FloralSprig } from "../components/decor";
import { MotionSection, motionItem } from "../components/MotionSection";
import { COUPLE, WEDDING_DATE_FOOTER } from "../content/wedding";

export function Footer() {
  return (
    <MotionSection
      as="footer"
      variant="bloom"
      viewportAmount={0.4}
      className="relative px-6 pb-14 text-center text-champagne-700"
    >
      <div className="mx-auto max-w-md">
        <motion.div variants={motionItem}>
          <FloralSprig className="mx-auto mb-4 w-44 text-champagne-400/85" />
        </motion.div>
        <motion.div variants={motionItem}>
          <motion.div
            animate={{ rotate: [0, 10, -8, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="mx-auto mb-3 h-5 w-5 text-champagne-500" />
          </motion.div>
        </motion.div>
        <motion.p variants={motionItem} className="text-eyebrow mb-3 text-xs">
          Thank You For Coming
        </motion.p>
        <motion.p
          variants={motionItem}
          className="text-display mb-2 text-xl font-light italic leading-relaxed text-ink md:text-2xl"
        >
          愿岁月以温柔 · 待你我同行
        </motion.p>
        <motion.p variants={motionItem} className="text-sm leading-8 text-ink-soft">
          {WEDDING_DATE_FOOTER}
        </motion.p>
        <motion.p
          variants={motionItem}
          className="mt-6 text-[11px] tracking-[0.3em] text-ink-light"
        >
          {COUPLE.groomEn} &amp; {COUPLE.brideEn} · 2026.07.18
        </motion.p>
        <p className="mt-4 text-[11px] tracking-wide text-ink-light">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-champagne-600"
          >
            粤ICP备2026067284号
          </a>
        </p>
      </div>
    </MotionSection>
  );
}
