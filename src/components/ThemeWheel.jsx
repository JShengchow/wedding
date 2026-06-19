import { useCallback, useEffect, useRef, useState } from "react";
import { Music2, Palette, Sparkles, X } from "lucide-react";
import { BGM_SRC } from "../content/wedding";

const AUTO_CLOSE_MS = 5000;
const EDGE_GAP = 12;

function getInitialTop() {
  if (typeof window === "undefined") return 140;
  return Math.round(window.innerHeight * 0.42);
}

export function ThemeWheel({ themes, activeTheme, onChange }) {
  const active = themes.find((item) => item.id === activeTheme) || themes[0];
  const audioRef = useRef(null);
  const dockRef = useRef(null);
  const ignoreClickRef = useRef(false);
  const dragStateRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    startTop: 0,
  });
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [dockSide, setDockSide] = useState("right");
  const [dockTop, setDockTop] = useState(getInitialTop);
  const [dragging, setDragging] = useState(false);
  const [activityToken, setActivityToken] = useState(0);

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

    const timer = window.setTimeout(() => {
      setOpen(false);
    }, AUTO_CLOSE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open, activityToken]);

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

    setOpen((value) => !value);
    markActivity();
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

  return (
    <div
      ref={dockRef}
      className={`floating-dock side-${dockSide} ${open ? "is-open" : ""} ${dragging ? "is-dragging" : ""}`}
      style={{ top: `${dockTop}px` }}
    >
      <audio ref={audioRef} loop preload="none" src={BGM_SRC} />

      <button
        type="button"
        onClick={handleTriggerClick}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
        className="floating-dock-trigger"
        aria-label={open ? "收起主题与音乐控制" : "展开主题与音乐控制"}
        title={open ? "收起控制" : "展开控制"}
      >
        {open ? <X className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </button>

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
  );
}
