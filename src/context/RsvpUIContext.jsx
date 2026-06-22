import { createContext, useCallback, useContext, useMemo, useState } from "react";

const RsvpUIContext = createContext(null);

export function RsvpUIProvider({ children }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showFloatingPrompt, setShowFloatingPrompt] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const openModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      modalOpen,
      openModal,
      closeModal,
      showFloatingPrompt,
      setShowFloatingPrompt,
      submitted,
      setSubmitted,
    }),
    [modalOpen, openModal, closeModal, showFloatingPrompt, submitted],
  );

  return (
    <RsvpUIContext.Provider value={value}>{children}</RsvpUIContext.Provider>
  );
}

export function useRsvpUI() {
  const context = useContext(RsvpUIContext);
  if (!context) {
    throw new Error("useRsvpUI must be used within RsvpUIProvider");
  }
  return context;
}
