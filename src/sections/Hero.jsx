import { motion } from "framer-motion";
import { CalendarDays, ChevronDown } from "lucide-react";
import { SparkleStar } from "../components/decor";
import { heroPhoto } from "../lib/photos";
import { COUPLE, WEDDING_DATE_LABEL } from "../content/wedding";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] overflow-hidden">
      <motion.img
        src={heroPhoto}
        alt={`${COUPLE.groomZh}与${COUPLE.brideZh}婚纱照`}
        fetchPriority="high"
        decoding="async"
        initial={{ opacity: 0.92, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover object-[48%_center] md:object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#1f1812]/35 via-[#1f1812]/10 to-ivory" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ivory via-ivory/65 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-between px-5 pb-12 pt-[max(3rem,env(safe-area-inset-top))] text-center md:px-10 md:pb-16 md:pt-28"
      >
        <div className="mx-auto flex w-full max-w-[min(94vw,980px)] flex-col items-center text-white drop-shadow-[0_6px_24px_rgba(31,24,18,0.38)]">
          <motion.div
            initial={{ opacity: 0, scaleX: 0.82 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.24, duration: 1.2, ease: "easeOut" }}
            className="mb-3 flex w-full max-w-[360px] origin-center items-center justify-center gap-3 text-white/82 md:mb-5 md:max-w-[520px]"
          >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/60 to-white/20" />
            <span className="font-sans text-[10px] uppercase tracking-[0.42em] md:text-xs">
              Z · C
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/60 to-white/20" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 18, rotate: -0.8 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.12, duration: 1.4, ease: "easeOut" }}
            className="text-display whitespace-nowrap text-[clamp(1.75rem,7.4vw,5.8rem)] font-light italic leading-none tracking-[-0.045em] text-white/95 md:text-[clamp(4rem,7.6vw,6.8rem)]"
          >
            We Are Getting Married
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 1.1, ease: "easeOut" }}
            className="mt-3 font-sans text-[10px] uppercase tracking-[0.36em] text-white/76 md:mt-4 md:text-xs"
          >
            July Eighteenth · Shenzhen
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2 }}
          className="mx-auto flex w-full max-w-[min(92vw,720px)] flex-col items-center text-center"
        >
          <SparkleStar className="mb-4 h-5 w-5 text-champagne-500 animate-shimmer" />

          <div className="flex w-full items-center justify-center gap-3 text-ink md:gap-6">
            <p className="text-display shrink-0 whitespace-nowrap text-[clamp(1.65rem,7.6vw,3.5rem)] font-light leading-none tracking-[0.08em]">
              {COUPLE.groomZh}
            </p>
            <span className="flex shrink-0 items-center gap-2 text-champagne-600 md:gap-3">
              <span className="hidden h-px w-10 bg-gradient-to-r from-transparent via-champagne-400 to-transparent md:block md:w-16" />
              <span className="text-display text-xl italic md:text-2xl">
                &amp;
              </span>
              <span className="hidden h-px w-10 bg-gradient-to-r from-transparent via-champagne-400 to-transparent md:block md:w-16" />
            </span>
            <p className="text-display shrink-0 whitespace-nowrap text-[clamp(1.65rem,7.6vw,3.5rem)] font-light leading-none tracking-[0.08em]">
              {COUPLE.brideZh}
            </p>
          </div>

          <p className="mt-6 inline-flex items-center gap-3 rounded-full border border-champagne-300/70 bg-ivory-50/70 px-5 py-2 text-sm text-champagne-700 backdrop-blur md:text-base">
            <CalendarDays className="h-4 w-4" />
            {WEDDING_DATE_LABEL}
          </p>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.4 }}
            className="mt-6 flex justify-center text-champagne-600"
          >
            <ChevronDown className="h-6 w-6 opacity-80" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
