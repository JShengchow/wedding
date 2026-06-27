export function DetailRow({ icon, label, title, subtitle, onContentClick }) {
  const interactive = Boolean(onContentClick);

  return (
    <div className="flex items-start gap-4">
      <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-champagne-100 to-blush-100 text-champagne-700 ring-1 ring-champagne-200/80">
        {icon}
      </span>
      <div
        className={
          interactive
            ? "flex-1 cursor-pointer rounded-xl px-1 py-0.5 -mx-1 transition active:scale-[0.99] active:opacity-80"
            : "flex-1"
        }
        onClick={onContentClick}
        onKeyDown={
          interactive
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onContentClick(event);
                }
              }
            : undefined
        }
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? "复制地址" : undefined}
      >
        <p className="text-eyebrow text-[10px] text-champagne-600 md:text-xs">
          {label}
        </p>
        <p className="mt-1 text-xl font-medium text-ink md:text-2xl">{title}</p>
        {subtitle ? (
          <p className="mt-1.5 text-sm leading-7 text-ink-soft md:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
