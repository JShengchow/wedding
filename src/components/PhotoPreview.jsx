import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function PhotoPreview({ alt, isOpen, onClose, src, title }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && src ? (
        <motion.div
          aria-label={title ? `照片预览：${title}` : "照片预览"}
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/82 p-4 backdrop-blur-sm"
          role="dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <button
            type="button"
            aria-label="关闭照片预览"
            className="absolute inset-0 cursor-zoom-out"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 max-h-[88vh] max-w-[92vw]"
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
              mass: 0.8,
            }}
          >
            <img
              src={src}
              alt={alt}
              decoding="async"
              className="max-h-[88vh] max-w-[92vw] rounded-[24px] border border-white/25 bg-ivory-50 object-contain shadow-[0_30px_90px_-28px_rgba(0,0,0,0.65)]"
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
