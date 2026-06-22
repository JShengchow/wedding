export function RsvpSectionIntro({ titleId }) {
  return (
    <div className="text-center">
      <p className="text-eyebrow mb-3 text-xs text-champagne-600">RSVP</p>
      <h3
        id={titleId}
        className="text-display text-3xl font-light text-ink md:text-4xl"
      >
        宾客回执
      </h3>
      <span className="mt-4 inline-block h-px w-16 gold-line" />
      <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-ink-soft">
        您的回执将帮助我们更好地安排座席与接待
      </p>
    </div>
  );
}

export function RsvpCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-[32px] border border-champagne-200/70 bg-ivory-50/95 p-6 shadow-soft backdrop-blur md:p-10 ${className}`}
    >
      {children}
    </div>
  );
}
