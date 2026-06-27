import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import { DetailRow } from "../components/DetailRow";
import { MotionSection, motionItem } from "../components/MotionSection";
import { ParallelLines } from "../components/ParallelLines";
import {
  MAP_QUERY,
  VENUE,
  VENUE_COPY_HINT,
  VENUE_COPY_TEXT,
  WEDDING_DATE_FULL,
} from "../content/wedding";

const COPY_TOAST_MS = 3000;

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function Details() {
  const [copyToast, setCopyToast] = useState(false);
  const copyTimeoutRef = useRef(null);

  const copyVenueAddress = useCallback(async () => {
    try {
      await copyToClipboard(VENUE_COPY_TEXT);
      setCopyToast(true);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopyToast(false);
        copyTimeoutRef.current = null;
      }, COPY_TOAST_MS);
    } catch (error) {
      console.error("[venue] copy failed", error);
    }
  }, []);

  return (
    <>
      <MotionSection variant="spin" className="px-5 pb-12 md:pb-14">
        <div className="mx-auto max-w-xl">
          <motion.div variants={motionItem} className="text-center">
            <p className="text-eyebrow mb-3 text-xs text-champagne-600">
              Ceremony Details
            </p>
            <h3 className="text-display text-3xl font-light text-ink md:text-4xl">
              婚礼信息
            </h3>
            <span className="mt-4 inline-block h-px w-16 gold-line" />
          </motion.div>

          <motion.div variants={motionItem} className="mt-8 md:mt-10">
            <ParallelLines />
          </motion.div>

          <motion.div variants={motionItem} className="mt-8 md:mt-10">
            <div className="h-px gold-line" />
          </motion.div>

          <motion.div
            variants={motionItem}
            className="mt-7 rounded-[32px] border border-champagne-200/70 bg-ivory-50/90 p-7 shadow-soft backdrop-blur md:p-9"
          >
            <div className="space-y-6">
              <motion.div variants={motionItem}>
                <DetailRow
                  icon={<CalendarDays className="h-5 w-5" />}
                  label="Date"
                  title={WEDDING_DATE_FULL}
                  subtitle="星期六 · 盛夏良辰"
                />
              </motion.div>

              <div className="h-px gold-line" />

              <motion.div variants={motionItem}>
                <DetailRow
                  icon={<MapPin className="h-5 w-5" />}
                  label="Venue"
                  title={VENUE.name}
                  subtitle={VENUE.address}
                  onContentClick={copyVenueAddress}
                />
              </motion.div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <a
                href={`https://uri.amap.com/search?keyword=${MAP_QUERY}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-champagne-400 to-champagne-600 px-8 py-4 text-base text-white shadow-warm transition active:scale-[0.98]"
              >
                <MapPin className="h-5 w-5" />
                打开地图导航
              </a>
              <button
                type="button"
                onClick={copyVenueAddress}
                className="text-xs text-ink-light transition active:opacity-70"
              >
                高德 / 苹果地图均可识别 「{VENUE.shortAddress}」
              </button>
            </div>
          </motion.div>
        </div>
      </MotionSection>

      {createPortal(
        <div
          className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+4.25rem)] z-[60] flex justify-center px-4 md:top-[calc(env(safe-area-inset-top,0px)+5rem)]"
        >
          <AnimatePresence>
            {copyToast ? (
              <motion.div
                key="venue-copy-toast"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-[22rem] rounded-2xl border border-champagne-300/60 bg-gradient-to-r from-champagne-400 to-champagne-600 px-5 py-3.5 text-center text-sm font-medium text-white shadow-warm backdrop-blur md:text-base"
              >
                {VENUE_COPY_HINT}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </>
  );
}
