import { useCountdown } from "../hooks/useCountdown";
import { WEDDING_DATE } from "../content/wedding";

const ITEMS = [
  { key: "days", label: "DAYS", zh: "天" },
  { key: "hours", label: "HOURS", zh: "时" },
  { key: "minutes", label: "MINS", zh: "分" },
];

export function Countdown() {
  const countdown = useCountdown(WEDDING_DATE);

  return (
    <section className="relative z-10 -mt-12 px-5 md:-mt-14 md:px-6">
      <div className="glass-card mx-auto grid max-w-3xl grid-cols-3 gap-3 rounded-[28px] p-5 text-center md:gap-5 md:rounded-[36px] md:p-8">
        {ITEMS.map((item) => (
          <div key={item.key}>
            <p className="text-display text-4xl font-light text-champagne-700 md:text-5xl">
              {countdown[item.key]}
            </p>
            <p className="text-eyebrow mt-2 text-[10px] text-champagne-600 md:text-xs">
              {item.label}
            </p>
            <p className="mt-0.5 text-[11px] text-ink-soft md:text-xs">
              {item.zh}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
