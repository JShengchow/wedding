import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRsvpUI } from "../context/RsvpUIContext";
import { RsvpCard, RsvpSectionIntro } from "../components/RsvpCard";
import { RsvpFormBody, RsvpSuccessBody } from "../components/RsvpFormBody";
import { RsvpModal } from "../components/RsvpModal";
import { MotionSection, motionItem } from "../components/MotionSection";
import { useRsvpForm } from "../hooks/useRsvpForm";

export function RsvpForm() {
  const sectionRef = useRef(null);
  const {
    modalOpen,
    closeModal,
    setShowFloatingPrompt,
    setSubmitted: setGlobalSubmitted,
  } = useRsvpUI();

  const rsvp = useRsvpForm({
    onSubmitted: () => {
      setGlobalSubmitted(true);
      const fromModal = modalOpen;
      closeModal();
      if (fromModal) {
        window.setTimeout(() => {
          sectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 80);
      }
    },
  });

  const {
    form,
    loading,
    submitted,
    submitError,
    isAbsent,
    updateField,
    setAttendance,
    reset,
    handleSubmit,
  } = rsvp;

  useEffect(() => {
    setGlobalSubmitted(submitted);
  }, [submitted, setGlobalSubmitted]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || submitted) {
      setShowFloatingPrompt(false);
      return undefined;
    }

    const updatePrompt = () => {
      const rect = section.getBoundingClientRect();
      const scrolledPast = rect.bottom < window.innerHeight * 0.35;
      setShowFloatingPrompt(scrolledPast);
    };

    updatePrompt();

    const observer = new IntersectionObserver(
      () => {
        updatePrompt();
      },
      { threshold: [0, 0.1, 0.25] },
    );

    observer.observe(section);
    window.addEventListener("scroll", updatePrompt, { passive: true });
    window.addEventListener("resize", updatePrompt);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updatePrompt);
      window.removeEventListener("resize", updatePrompt);
    };
  }, [submitted, setShowFloatingPrompt]);

  const handleReset = () => {
    reset();
    setGlobalSubmitted(false);
  };

  return (
    <>
      <MotionSection
        ref={sectionRef}
        variant="fade"
        stagger={0.1}
        className="px-5 pb-16 md:pb-20"
      >
        <div className="mx-auto max-w-xl">
          <motion.div variants={motionItem}>
            <RsvpSectionIntro />
          </motion.div>

          <motion.div variants={motionItem}>
            <RsvpCard className="mt-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <RsvpSuccessBody onReset={handleReset} />
                </motion.div>
              ) : (
                <motion.div variants={motionItem}>
                  <RsvpFormBody
                    idPrefix="rsvp-inline"
                    form={form}
                    loading={loading}
                    submitError={submitError}
                    isAbsent={isAbsent}
                    updateField={updateField}
                    setAttendance={setAttendance}
                    handleSubmit={handleSubmit}
                  />
                </motion.div>
              )}
            </RsvpCard>
          </motion.div>
        </div>
      </MotionSection>

      <RsvpModal
        isOpen={modalOpen}
        onClose={closeModal}
        form={form}
        loading={loading}
        submitted={submitted}
        submitError={submitError}
        isAbsent={isAbsent}
        updateField={updateField}
        setAttendance={setAttendance}
        reset={handleReset}
        handleSubmit={handleSubmit}
      />
    </>
  );
}
