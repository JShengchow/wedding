import { SCHEDULE } from "../content/wedding";

export function Schedule() {
  return (
    <section className="px-5 pb-14 md:pb-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-eyebrow mb-3 text-xs text-champagne-600">
          Wedding Schedule
        </p>
        <h3 className="text-display text-3xl font-light text-ink md:text-4xl">
          当日流程
        </h3>
        <span className="mt-4 inline-block h-px w-16 gold-line" />
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-ink-soft md:text-base">
          轻松随意 · 无需拘束，
          <br className="md:hidden" />
          欢迎您在合适的时间到场，一同共享喜悦。
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-[32px] border border-champagne-200/70 bg-ivory-50/90 p-6 shadow-soft backdrop-blur md:p-10">
        <ol className="relative space-y-7 md:space-y-8">
          <span
            aria-hidden="true"
            className="absolute left-[68px] top-2 bottom-2 w-px bg-gradient-to-b from-champagne-200 via-champagne-400/70 to-champagne-200 md:left-[88px]"
          />
          {SCHEDULE.map((item) => (
            <li key={item.time} className="relative flex items-start gap-5">
              <p className="text-display w-14 shrink-0 text-right text-2xl font-light text-champagne-700 md:w-20 md:text-3xl">
                {item.time}
              </p>
              <span
                aria-hidden="true"
                className="relative mt-2 grid h-4 w-4 shrink-0 place-items-center"
              >
                <span className="absolute inset-0 rounded-full bg-blush-100" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-gradient-to-br from-champagne-300 to-champagne-600 shadow-[0_0_0_3px_rgba(255,252,247,0.95)]" />
              </span>
              <div className="flex-1 pt-0.5">
                <p className="text-lg font-medium text-ink md:text-xl">
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-7 text-ink-soft md:text-base">
                  {item.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
