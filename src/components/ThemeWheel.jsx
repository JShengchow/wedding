import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardPen, Music2, Palette, Sparkles } from "lucide-react";
import { useRsvpUI } from "../context/RsvpUIContext";
import { BGM_SRC } from "../content/wedding";
import { trackVisit } from "../lib/visitor";

const AUTO_CLOSE_MS = 5000;
const ONBOARDING_EXIT_MS = 620;
const RSVP_HINT_MS = 6000;
const EDGE_GAP = 12;

function getInitialTop() {
  if (typeof window === "undefined") return 140;
  return Math.round(window.innerHeight * 0.42);
}

export function ThemeWheel({ themes, activeTheme, onChange }) {
  const { showFloatingPrompt, submitted, openModal } = useRsvpUI();
  const showRsvpPrompt = showFloatingPrompt && !submitted;
  const active = themes.find((item) => item.id === activeTheme) || themes[0];
  const audioRef = useRef(null);
  const dockRef = useRef(null);
  const ignoreClickRef = useRef(false);
  const onboardingTimerRef = useRef(null);
  const dragStateRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    startTop: 0,
  });
  const [open, setOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingLeaving, setOnboardingLeaving] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [dockSide, setDockSide] = useState("right");
  const [dockTop, setDockTop] = useState(getInitialTop);
  const [dragging, setDragging] = useState(false);
  const [activityToken, setActivityToken] = useState(0);
  const [rsvpHintVisible, setRsvpHintVisible] = useState(false);

  const markActivity = () => {
    setActivityToken((value) => value + 1);
  };

  const clampTop = useCallback((candidate) => {
    if (typeof window === "undefined") return candidate;

    const dockHeight = dockRef.current?.offsetHeight || 180;
    const maxTop = Math.max(EDGE_GAP, window.innerHeight - dockHeight - EDGE_GAP);
    return Math.min(maxTop, Math.max(EDGE_GAP, candidate));
  }, []);

  useEffect(() => {
    return () => {
      if (onboardingTimerRef.current) {
        window.clearTimeout(onboardingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!showOnboarding) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showOnboarding]);

  useEffect(() => {
    const handleResize = () => {
      setDockTop((current) => clampTop(current));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [clampTop]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setDockTop((current) => clampTop(current));
    });
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [open, clampTop]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (dockRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const timer = window.setTimeout(() => {
      setOpen(false);
    }, AUTO_CLOSE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open, activityToken]);

  useEffect(() => {
    if (!showRsvpPrompt || open) {
      setRsvpHintVisible(false);
      return undefined;
    }

    setRsvpHintVisible(true);
    const timer = window.setTimeout(() => {
      setRsvpHintVisible(false);
    }, RSVP_HINT_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showRsvpPrompt, open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleScroll = () => {
      setOpen(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [open]);

  const handleTriggerClick = () => {
    if (ignoreClickRef.current) {
      ignoreClickRef.current = false;
      return;
    }

    markActivity();
    if (open) return;

    setOpen(true);
  };

  const handleDragStart = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    dragStateRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      startTop: dockTop,
    };

    setDragging(true);
    markActivity();
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragMove = (event) => {
    const state = dragStateRef.current;
    if (!state.active) return;

    const deltaX = event.clientX - state.startX;
    const deltaY = event.clientY - state.startY;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 4) {
      state.moved = true;
    }

    setDockTop(clampTop(state.startTop + deltaY));
    setDockSide(event.clientX <= window.innerWidth / 2 ? "left" : "right");
  };

  const handleDragEnd = (event) => {
    const state = dragStateRef.current;
    if (!state.active) return;

    dragStateRef.current.active = false;
    if (state.moved) {
      ignoreClickRef.current = true;
      markActivity();
    }

    setDragging(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    markActivity();

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  const enterInvitation = (shouldPlayMusic) => {
    trackVisit({
      theme: activeTheme,
      audioMode: shouldPlayMusic ? "music" : "muted",
    });

    const audio = audioRef.current;
    markActivity();

    if (shouldPlayMusic && audio) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else if (audio) {
      audio.pause();
      setPlaying(false);
    }

    setOnboardingLeaving(true);
    onboardingTimerRef.current = window.setTimeout(() => {
      setShowOnboarding(false);
      setOnboardingLeaving(false);
      setOpen(false);
    }, ONBOARDING_EXIT_MS);
  };

  return (
    <>
      {showOnboarding ? (
        <div
          className={`theme-onboarding ${onboardingLeaving ? "is-leaving" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="theme-onboarding-title"
          aria-describedby="theme-onboarding-desc"
        >
          <div className="theme-onboarding-card">
            <span className="theme-onboarding-orbit" aria-hidden="true" />
            <div className="theme-onboarding-icon" aria-hidden="true">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-eyebrow text-[10px] text-champagne-600">
              Before We Begin
            </p>
            <h2
              id="theme-onboarding-title"
              className="mt-2 text-display text-2xl font-light text-ink"
            >
              选一个喜欢的您喜欢的色系
            </h2>
            <p
              id="theme-onboarding-desc"
              className="mx-auto mt-3 max-w-[17rem] text-sm leading-7 text-ink-soft"
            >
              进入我们的邀请函
            </p>

            <div className="theme-onboarding-swatches">
              {themes.map((theme) => {
                const isActive = theme.id === activeTheme;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    aria-label={`选择${theme.label}`}
                    title={theme.label}
                    onClick={() => {
                      onChange(theme.id);
                      markActivity();
                    }}
                    className={`theme-onboarding-swatch ${
                      isActive ? "is-active" : ""
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${theme.preview[0]} 0%, ${theme.preview[1]} 100%)`,
                    }}
                  >
                    <span>{theme.labelShort}</span>
                  </button>
                );
              })}
            </div>

            <div className="theme-onboarding-actions">
              <button
                type="button"
                className="theme-onboarding-primary"
                onClick={() => enterInvitation(true)}
              >
                <Music2 className="h-4 w-4" />
                播放音乐进入
              </button>
              <button
                type="button"
                className="theme-onboarding-secondary"
                onClick={() => enterInvitation(false)}
              >
                静音进入
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div
        ref={dockRef}
        className={`floating-dock side-${dockSide} ${open ? "is-open" : ""} ${dragging ? "is-dragging" : ""}`}
        style={{ top: `${dockTop}px` }}
      >
        <audio ref={audioRef} loop preload="none" src={BGM_SRC} />

        <div className="floating-dock-triggers">
          <button
            type="button"
            onClick={handleTriggerClick}
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
            className="floating-dock-trigger"
            aria-label={open ? "主题与音乐控制入口" : "展开主题与音乐控制"}
            title={open ? "主题与音乐" : "展开控制"}
          >
            <Sparkles className="h-4 w-4" />
          </button>

          <AnimatePresence>
            {showRsvpPrompt ? (
              <motion.div
                key="rsvp-prompt"
                className="floating-dock-rsvp-wrap"
                initial={{ opacity: 0, x: 14, scale: 0.72 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.8 }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 24,
                  mass: 0.7,
                }}
              >
                <AnimatePresence>
                  {rsvpHintVisible ? (
                    <motion.div
                      key="rsvp-hint"
                      className="floating-dock-rsvp-hint"
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 4 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    >
                      <span>记得点这里填写回执喔</span>
                      <span className="floating-dock-rsvp-hint-arrow" aria-hidden="true" />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                <button
                  type="button"
                  className="floating-dock-trigger floating-dock-trigger-rsvp"
                  aria-label="填写宾客回执"
                  title="填写回执"
                  onClick={openModal}
                >
                  <ClipboardPen className="h-4 w-4" />
                  <span className="floating-dock-trigger-rsvp-ring" aria-hidden="true" />
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="floating-dock-panel" onPointerDownCapture={markActivity}>
          <div className="floating-dock-row">
            <div className="floating-dock-label">
              <Music2 className="h-4 w-4" />
              <span>背景音乐</span>
            </div>
            <button
              type="button"
              onClick={toggleMusic}
              className={`floating-music-btn ${playing ? "is-playing" : ""}`}
            >
              <Music2
                className={playing ? "h-4 w-4 animate-spin [animation-duration:4s]" : "h-4 w-4"}
              />
              <span>{playing ? "暂停" : "播放"}</span>
            </button>
          </div>

          <div className="floating-dock-row floating-dock-row-theme">
            <div className="floating-dock-label">
              <Palette className="h-4 w-4" />
              <span>{active.labelShort}</span>
            </div>
            <div className="floating-theme-swatches">
              {themes.map((theme) => {
                const isActive = theme.id === activeTheme;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    aria-label={`切换到${theme.label}`}
                    title={theme.label}
                    onClick={() => {
                      onChange(theme.id);
                      markActivity();
                    }}
                    className={`floating-theme-swatch ${isActive ? "is-active" : ""}`}
                    style={{
                      background: `linear-gradient(135deg, ${theme.preview[0]} 0%, ${theme.preview[1]} 100%)`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
