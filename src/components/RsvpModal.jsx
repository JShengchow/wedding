import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { RsvpCard, RsvpSectionIntro } from "./RsvpCard";
import { RsvpFormBody, RsvpSuccessBody } from "./RsvpFormBody";

export function RsvpModal({
  isOpen,
  onClose,
  form,
  loading,
  submitted,
  submitError,
  isAbsent,
  updateField,
  setAttendance,
  reset,
  handleSubmit,
}) {
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
      {isOpen ? (
        <motion.div
          aria-labelledby="rsvp-modal-title"
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/55 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <button
            type="button"
            aria-label="关闭回执弹窗"
            className="absolute inset-0"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 max-h-[min(88vh,760px)] w-full max-w-xl overflow-y-auto rounded-[32px] bg-ivory px-5 pb-8 pt-8 text-ink shadow-soft md:px-8 md:pb-10 md:pt-10"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 28,
              mass: 0.85,
            }}
          >
            <button
              type="button"
              aria-label="关闭"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-champagne-200 bg-ivory-50 text-ink-soft transition hover:text-ink md:right-6 md:top-6"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>

            <RsvpSectionIntro titleId="rsvp-modal-title" />

            <RsvpCard className="relative mt-8">
              {submitted ? (
                <RsvpSuccessBody onReset={reset} />
              ) : (
                <RsvpFormBody
                  idPrefix="rsvp-modal"
                  form={form}
                  loading={loading}
                  submitError={submitError}
                  isAbsent={isAbsent}
                  updateField={updateField}
                  setAttendance={setAttendance}
                  handleSubmit={handleSubmit}
                />
              )}
            </RsvpCard>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
