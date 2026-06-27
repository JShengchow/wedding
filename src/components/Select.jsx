import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

const TRIGGER_CLASS =
  "flex w-full items-center justify-between gap-3 rounded-2xl border border-champagne-200 bg-ivory-50 px-5 py-4 text-left text-base text-ink outline-none transition focus:border-champagne-400 focus:ring-2 focus:ring-champagne-200";

function getThemeWrapperClass(element) {
  const root = element?.closest(".theme-app");
  if (!root) return "theme-app";

  const themeVariant = [...root.classList].find(
    (className) => className.startsWith("theme-") && className !== "theme-app",
  );

  return themeVariant ? `theme-app ${themeVariant}` : "theme-app";
}

export function Select({
  id,
  value,
  onChange,
  options,
  placeholder = "请选择",
  disabled = false,
}) {
  const listboxId = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [panelStyle, setPanelStyle] = useState(null);
  const [themeClassName, setThemeClassName] = useState("theme-app");

  const selectedOption = options.find((opt) => opt.value === value);
  const selectedIndex = options.findIndex((opt) => opt.value === value);

  const updatePanelPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    setThemeClassName(getThemeWrapperClass(trigger));

    const rect = trigger.getBoundingClientRect();
    const gap = 8;
    const maxHeight = 240;
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUpward = spaceBelow < maxHeight && spaceAbove > spaceBelow;

    setPanelStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      zIndex: 90,
      ...(openUpward
        ? { bottom: window.innerHeight - rect.top + gap }
        : { top: rect.bottom + gap }),
    });
  };

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const selectValue = (nextValue) => {
    onChange({ target: { value: nextValue } });
    close();
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return undefined;

    updatePanelPosition();

    const handlePointerDown = (event) => {
      if (
        rootRef.current?.contains(event.target) ||
        event.target.closest(`[data-select-panel="${listboxId}"]`)
      ) {
        return;
      }
      close();
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        triggerRef.current?.focus();
      }
    };

    const handleLayoutChange = () => {
      updatePanelPosition();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleLayoutChange);
    window.addEventListener("scroll", handleLayoutChange, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleLayoutChange);
      window.removeEventListener("scroll", handleLayoutChange, true);
    };
  }, [listboxId, open]);

  const handleTriggerKeyDown = (event) => {
    if (disabled) return;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
          return;
        }
        setActiveIndex((prev) => {
          if (event.key === "ArrowDown") {
            return prev < options.length - 1 ? prev + 1 : 0;
          }
          return prev > 0 ? prev - 1 : options.length - 1;
        });
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open && activeIndex >= 0) {
          selectValue(options[activeIndex].value);
        } else {
          setOpen(true);
          setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          close();
        }
        break;
      default:
        break;
    }
  };

  const panel = open && panelStyle
    ? createPortal(
        <div className={themeClassName} style={panelStyle}>
          <ul
            id={listboxId}
            role="listbox"
            data-select-panel={listboxId}
            aria-activedescendant={
              activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
            }
            className="max-h-60 overflow-y-auto rounded-2xl border border-champagne-200 bg-ivory-50 p-1.5 text-ink shadow-soft"
          >
            {options.map((opt, index) => {
              const selected = opt.value === value;
              const active = index === activeIndex;

              return (
                <li key={opt.value} role="presentation">
                  <button
                    id={`${id}-option-${index}`}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectValue(opt.value)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-base transition ${
                      selected
                        ? "border border-champagne-300/70 bg-gradient-to-br from-champagne-50 to-blush-50 text-champagne-700 shadow-sm"
                        : active
                          ? "bg-champagne-100 text-ink"
                          : "text-ink-soft hover:bg-champagne-50 hover:text-ink"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selected ? (
                      <Check className="h-4 w-4 shrink-0 text-champagne-600" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>,
        document.body,
      )
    : null;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => {
          if (disabled) return;
          if (open) {
            close();
            return;
          }
          setOpen(true);
          setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        }}
        onKeyDown={handleTriggerKeyDown}
        className={`${TRIGGER_CLASS} ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        } ${open ? "border-champagne-400 ring-2 ring-champagne-200" : ""}`}
      >
        <span className={selectedOption ? "text-ink" : "text-ink-light"}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-champagne-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {panel}
    </div>
  );
}
