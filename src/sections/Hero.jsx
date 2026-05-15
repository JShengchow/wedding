import { motion } from "framer-motion";
import { CalendarDays, ChevronDown } from "lucide-react";
import { FloralSprig, SparkleStar } from "../components/decor";
import { heroPhoto } from "../lib/photos";
import { COUPLE, WEDDING_DATE_LABEL } from "../content/wedding";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] overflow-hidden">
      <img
        src={heroPhoto}
        alt={`${COUPLE.groomZh}与${COUPLE.brideZh}婚纱照`}
        fetchpriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[48%_center] md:object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#1f1812]/35 via-[#1f1812]/10 to-ivory" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ivory via-ivory/65 to-transparent" />

      <FloralSprig className="absolute left-1/2 top-12 -translate-x-1/2 text-champagne-100/85 w-[260px] md:w-[340px]" />
      <FloralSprig
        flip
        className="absolute left-1/2 top-[110px] -translate-x-1/2 text-champagne-100/60 w-[200px] md:w-[260px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-between px-5 pb-12 pt-24 text-center md:px-10 md:pb-16 md:pt-28"
      >
        <div className="mx-auto w-full max-w-3xl text-white drop-shadow">
          <p className="text-eyebrow mb-3 text-[11px] text-white/90 md:text-xs">
            The Wedding of
          </p>
          <p className="text-display text-[clamp(2.6rem,13vw,5.5rem)] font-light italic leading-none">
            We Are
          </p>
          <p className="text-display mx-auto mt-2 flex max-w-[92vw] flex-col items-center text-[clamp(2.6rem,12vw,5.5rem)] font-light italic leading-[0.95] md:block">
            <span>Getting</span>
            <span className="md:ml-3">Married</span>
          </p>
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
