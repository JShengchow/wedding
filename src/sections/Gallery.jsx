import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Clock3,
  Heart,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import { MemoryCurve } from "../components/MemoryCurve";
import { galleryPhotos } from "../lib/photos";

const TOGETHER_SINCE = new Date("2023-10-15T00:00:00+08:00");

const COUPLE_FACTS = [
  { value: "12", unit: "Cities", label: "一起走过的城市" },
  { value: "47", unit: "Films", label: "陪你看过的电影" },
  { value: "∞", unit: "Cups", label: "共饮的咖啡" },
  { value: "01", unit: "Forever", label: "答应你的余生" },
];

const COUPLE_VITALS = [
  { key: "He", name: "Zhou Jiansheng", role: "新郎 · 周健声", trait: "理性派 · 在意细节" },
  { key: "She", name: "Chen Xiaoqi", role: "新娘 · 陈晓琪", trait: "感性派 · 喜欢小惊喜" },
];

const MEMORY_REEL = [
  {
    photoIndex: 4,
    tag: "晚风散步",
    chapter: "2023 · 秋",
    caption: "走过的每条路，都因为有你而柔软",
  },
  {
    photoIndex: 8,
    tag: "对视一瞬",
    chapter: "2024 · 冬",
    caption: "笑着对视的那一秒，便是答案",
  },
  {
    photoIndex: 12,
    tag: "日常浪漫",
    chapter: "2024 · 春",
    caption: "把寻常的日子，过成了节日",
  },
  {
    photoIndex: 17,
    tag: "春日告白",
    chapter: "2025 · 春",
    caption: "答应余生的那个春天",
  },
  {
    photoIndex: 20,
    tag: "婚纱白光",
    chapter: "2025 · 夏",
    caption: "婚纱与白光，定格成永远",
  },
];

const REEL_INTERVAL_MS = 5200;

const MOMENT_MODULES = [
  {
    title: "仪式前的小紧张",
    desc: "整理领结和头纱时，心跳比音乐还快一点。",
    photoIndex: 2,
    icon: Clock3,
  },
  {
    title: "对视那一秒",
    desc: "看见彼此走来的瞬间，周围好像突然安静下来。",
    photoIndex: 8,
    icon: Heart,
  },
  {
    title: "笑声与快门声",
    desc: "亲友的掌声、相机快门和祝福，一起留在这个午后。",
    photoIndex: 14,
    icon: Camera,
  },
];

export function Gallery() {
  const [showMemoryWall, setShowMemoryWall] = useState(false);
  const [reelIndex, setReelIndex] = useState(0);
  const [reelPaused, setReelPaused] = useState(false);

  const daysTogether = useMemo(() => {
    const diff = Date.now() - TOGETHER_SINCE.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }, []);

  useEffect(() => {
    if (reelPaused) return undefined;
    const timer = window.setInterval(() => {
      setReelIndex((index) => (index + 1) % MEMORY_REEL.length);
    }, REEL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [reelPaused]);

  const reelCurrent = MEMORY_REEL[reelIndex];

  return (
    <section className="px-5 pb-20 md:px-6">
      <div className="mx-auto mb-10 max-w-5xl text-center">
        <p className="text-eyebrow mb-3 text-xs text-champagne-600">Gallery</p>
        <h3 className="text-display text-3xl font-light text-ink md:text-4xl">
          浪漫瞬间
        </h3>
        <span className="mt-4 inline-block h-px w-16 gold-line" />
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-ink-soft md:text-base">
          这一章不只是一组照片，而是一段由时间、表情与拥抱组成的小电影。
        </p>
      </div>

      <div className="mx-auto max-w-5xl space-y-4 md:space-y-5">
        <div className="grid items-stretch gap-3 md:grid-cols-[1fr_1.05fr] md:gap-4">
          <article className="relative flex flex-col overflow-hidden rounded-[28px] border border-champagne-200/70 bg-ivory-50/90 p-6 shadow-soft backdrop-blur md:p-8">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-12 select-none text-display text-[150px] font-light leading-none text-champagne-300/15 md:text-[180px]"
            >
              N°02
            </span>

            <header className="flex items-start justify-between gap-3">
              <div>
                <p className="text-eyebrow text-[10px] text-champagne-600 md:text-xs">
                  We, In Numbers
                </p>
                <p className="mt-1 text-xs italic text-ink-light md:text-sm">
                  关于我们的小档案
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-champagne-200/80 bg-white/70 px-2.5 py-1 text-[10px] tracking-[0.18em] text-champagne-700">
                <Sparkles className="h-3 w-3" />
                FACT SHEET
              </span>
            </header>

            <div className="mt-7 text-center md:mt-9">
              <p className="text-eyebrow text-[10px] tracking-[0.32em] text-champagne-600">
                Day Together
              </p>
              <p className="mt-3 flex items-end justify-center gap-2 md:gap-3">
                <span className="text-display text-[78px] font-light leading-[0.82] text-champagne-700 md:text-[112px]">
                  {daysTogether}
                </span>
                <span className="pb-3 text-eyebrow text-[10px] text-ink-soft md:text-[11px]">
                  days
                </span>
              </p>
              <p className="mt-3 text-xs leading-6 text-ink-light md:text-sm">
                和你在一起的第 {daysTogether} 天 · 还在持续加一
              </p>
            </div>

            <ul className="mt-7 grid grid-cols-2 gap-2.5 md:mt-9 md:grid-cols-4 md:gap-3">
              {COUPLE_FACTS.map((fact, index) => (
                <li
                  key={fact.label}
                  className="relative overflow-hidden rounded-2xl border border-champagne-100/80 bg-white/65 p-3 text-center backdrop-blur"
                >
                  <span className="absolute left-2 top-2 text-[9px] tracking-[0.22em] text-ink-light/85">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-display text-[28px] font-light leading-none text-champagne-700 md:text-[32px]">
                    {fact.value}
                  </p>
                  <p className="mt-1.5 text-eyebrow text-[9px] text-champagne-600">
                    {fact.unit}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-ink-light">
                    {fact.label}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid grid-cols-2 gap-2.5 md:mt-7 md:gap-3">
              {COUPLE_VITALS.map((person) => (
                <div
                  key={person.key}
                  className="rounded-2xl border border-dashed border-champagne-200/80 bg-white/55 p-3.5"
                >
                  <p className="text-eyebrow text-[9px] tracking-[0.32em] text-champagne-600">
                    {person.key}
                  </p>
                  <p className="text-display mt-2 text-base text-ink md:text-lg">
                    {person.role}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-ink-light">
                    {person.trait}
                  </p>
                  <p className="mt-1.5 text-[10px] tracking-[0.18em] text-champagne-700/80">
                    {person.name}
                  </p>
                </div>
              ))}
            </div>

            <footer className="mt-auto pt-6">
              <div className="flex items-center justify-center gap-3 text-champagne-700">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-champagne-400" />
                <Heart className="h-3 w-3" />
                <span className="h-px w-12 bg-gradient-to-r from-champagne-400 to-transparent" />
              </div>
              <p className="mt-2 text-center text-eyebrow text-[10px] tracking-[0.32em] text-ink-light">
                Co-authoring Forever
              </p>
            </footer>
          </article>

          <article className="flex flex-col overflow-hidden rounded-[28px] border border-champagne-200/70 bg-ivory-50/90 shadow-soft backdrop-blur">
            <figure
              className="memory-reel relative flex-1 min-h-[560px] overflow-hidden border-b border-champagne-100/70 bg-gradient-to-br from-champagne-100/70 via-ivory-50 to-blush-50/50 md:min-h-[640px]"
              onMouseEnter={() => setReelPaused(true)}
              onMouseLeave={() => setReelPaused(false)}
              onTouchStart={() => setReelPaused(true)}
              onTouchEnd={() => setReelPaused(false)}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-16 top-16 z-[1] h-44 w-44 rounded-full bg-blush-200/40 blur-3xl"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 bottom-10 z-[1] h-52 w-52 rounded-full bg-champagne-200/45 blur-3xl"
              />

              <div className="absolute left-4 right-4 top-4 z-[10] flex items-start justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-champagne-200/80 bg-white/85 px-2.5 py-1 text-[10px] tracking-[0.22em] text-champagne-700 backdrop-blur">
                  <Sparkles className="h-3 w-3" />
                  IN MOTION
                </span>

                <button
                  type="button"
                  onClick={() => setReelPaused((value) => !value)}
                  aria-label={reelPaused ? "继续播放" : "暂停轮播"}
                  title={reelPaused ? "继续播放" : "暂停轮播"}
                  className="grid h-7 w-7 place-items-center rounded-full border border-champagne-200/80 bg-white/80 text-champagne-700 backdrop-blur transition hover:bg-white"
                >
                  {reelPaused ? (
                    <Play className="h-3 w-3" />
                  ) : (
                    <Pause className="h-3 w-3" />
                  )}
                </button>
              </div>

              <div className="reel-stack">
                {MEMORY_REEL.map((item, i) => {
                  const total = MEMORY_REEL.length;
                  const offset = ((i - reelIndex) % total + total) % total;
                  let role = "is-hidden";
                  if (offset === 0) role = "is-active";
                  else if (offset === 1) role = "is-next";
                  else if (offset === total - 1) role = "is-prev";

                  const photo = galleryPhotos[item.photoIndex];
                  const isActive = role === "is-active";

                  return (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => setReelIndex(i)}
                      disabled={isActive}
                      tabIndex={role === "is-hidden" ? -1 : 0}
                      aria-hidden={role === "is-hidden"}
                      aria-label={`查看「${item.tag}」`}
                      className={`reel-card ${role}`}
                    >
                      <img
                        key={isActive ? `act-${reelIndex}-${i}` : `idle-${i}`}
                        src={photo.src}
                        alt={photo.alt}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className={`reel-card-image ${isActive ? "is-active" : ""}`}
                      />

                      <span
                        aria-hidden="true"
                        className="reel-card-vignette"
                      />

                      {isActive && (
                        <>
                          <span
                            key={`chip-${reelIndex}`}
                            className="reel-card-chapter"
                          >
                            {item.chapter}
                          </span>

                          <Heart
                            key={`heart-${reelIndex}`}
                            aria-hidden="true"
                            className="memory-reel-heart"
                            fill="rgb(252 220 226)"
                            strokeWidth={0}
                          />

                          <figcaption className="reel-card-caption">
                            <p
                              key={`idx-${reelIndex}`}
                              className="memory-reel-index text-eyebrow text-[10px] tracking-[0.34em] text-white/80"
                            >
                              Chapter {String(i + 1).padStart(2, "0")} ·{" "}
                              {item.tag}
                            </p>
                            <p
                              key={`cap-${reelIndex}`}
                              className="memory-reel-caption mt-2.5 text-display italic leading-relaxed text-[16px] md:text-[18px]"
                            >
                              「 {item.caption} 」
                            </p>
                          </figcaption>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="absolute right-3 top-1/2 z-[8] flex -translate-y-1/2 flex-col gap-2.5 md:right-4">
                <button
                  type="button"
                  onClick={() =>
                    setReelIndex(
                      (idx) => (idx - 1 + MEMORY_REEL.length) % MEMORY_REEL.length,
                    )
                  }
                  aria-label="上一段回忆"
                  className="reel-nav-btn"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setReelIndex((idx) => (idx + 1) % MEMORY_REEL.length)
                  }
                  aria-label="下一段回忆"
                  className="reel-nav-btn"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 z-[6] h-[3px] bg-white/35"
              >
                <span
                  key={`prog-${reelIndex}-${reelPaused ? "p" : "r"}`}
                  className={`memory-reel-progress ${reelPaused ? "is-paused" : ""}`}
                  style={{ animationDuration: `${REEL_INTERVAL_MS}ms` }}
                />
              </span>
            </figure>

            <div className="px-6 pb-7 pt-6 md:px-7 md:pt-7">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-eyebrow text-[10px] text-champagne-600 md:text-xs">
                    Memory Chapters
                  </p>
                  <p className="mt-1 text-[11px] italic leading-snug text-ink-light md:text-xs">
                    五段小章节 · 点击切换 · 鼠标悬停可暂停
                  </p>
                </div>
                <span className="text-display text-[34px] font-light leading-none text-champagne-300/70 md:text-[40px]">
                  {String(reelIndex + 1).padStart(2, "0")}
                  <span className="text-[14px] tracking-[0.22em] text-ink-light/60 md:text-[16px]">
                    /{String(MEMORY_REEL.length).padStart(2, "0")}
                  </span>
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {MEMORY_REEL.map((item, i) => {
                  const isActive = i === reelIndex;
                  return (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => setReelIndex(i)}
                      aria-pressed={isActive}
                      aria-label={`切换到「${item.tag}」`}
                      className={`memory-chip ${isActive ? "is-active" : ""}`}
                    >
                      <span className="memory-chip-index">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="memory-chip-label">{item.tag}</span>
                      {isActive && (
                        <Heart
                          aria-hidden="true"
                          className="memory-chip-heart"
                          fill="currentColor"
                          strokeWidth={0}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center gap-3 text-champagne-700/80">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-champagne-300/70 to-transparent" />
                <span className="text-eyebrow text-[10px] tracking-[0.32em]">
                  Co-authoring Our Reel
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-champagne-300/70 to-transparent" />
              </div>
            </div>
          </article>
        </div>

        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          {MOMENT_MODULES.map((item) => {
            const Icon = item.icon;
            const photo = galleryPhotos[item.photoIndex];

            return (
              <article
                key={item.title}
                className="overflow-hidden rounded-[24px] border border-champagne-200/70 bg-ivory-50/95 shadow-soft"
              >
                <img
                  src={photo.src}
                  alt={`${photo.alt}，${item.title}`}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[5/4] w-full object-cover"
                />
                <div className="p-5">
                  <p className="inline-flex items-center gap-2 text-champagne-600">
                    <Icon className="h-4 w-4" />
                    <span className="text-eyebrow text-[10px] md:text-[11px]">
                      Moment Module
                    </span>
                  </p>
                  <p className="mt-2 text-lg text-ink md:text-xl">{item.title}</p>
                  <p className="mt-1.5 text-sm leading-7 text-ink-soft">{item.desc}</p>
                </div>
              </article>
            );
          })}
        </div>

        <article className="rounded-[30px] border border-champagne-200/70 bg-ivory-50/90 p-4 shadow-soft md:p-6">
          <button
            type="button"
            onClick={() => setShowMemoryWall((prev) => !prev)}
            aria-expanded={showMemoryWall}
            aria-controls="memory-curve-panel"
            className="group w-full rounded-[18px] border border-champagne-200/80 bg-gradient-to-r from-white/85 via-ivory-50/90 to-white/85 px-4 py-3 text-left shadow-sm transition hover:border-champagne-300/90"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-eyebrow text-[10px] text-champagne-600 md:text-[11px]">
                  Memory Curve · 2023 → 2026
                </p>
                <p className="mt-1 text-sm text-ink md:text-[15px]">
                  {showMemoryWall
                    ? "回忆曲线正在徐徐展开"
                    : "顺着岁月的弧线，回望每一段心动"}
                </p>
              </div>
              <span className="grid h-8 w-8 place-items-center rounded-full border border-champagne-200 bg-white/80 text-champagne-700 transition group-hover:border-champagne-300">
                {showMemoryWall ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </span>
            </div>
            <span className="mt-3 block h-1.5 w-full overflow-hidden rounded-full bg-champagne-100/80">
              <span
                className={`block h-full rounded-full bg-gradient-to-r from-champagne-300 via-blush-300 to-champagne-400 transition-all duration-500 ${
                  showMemoryWall ? "w-full" : "w-1/3"
                }`}
              />
            </span>
          </button>

          <div
            id="memory-curve-panel"
            className={`grid transition-all duration-500 ease-out ${
              showMemoryWall
                ? "mt-5 grid-rows-[1fr] opacity-100"
                : "mt-0 grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <MemoryCurve />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
