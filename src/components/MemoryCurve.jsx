import { useMemo, useState } from "react";
import { CalendarHeart, Heart, Sparkles } from "lucide-react";
import { galleryPhotos } from "../lib/photos";

const MEMORY_JOURNEY = [
  {
    year: "2023",
    chapter: "Chapter I",
    title: "相识",
    accent: "初春",
    summary: "从一杯咖啡开始的故事",
    moments: [
      {
        month: "03",
        label: "Mar.",
        title: "命中注定的相遇",
        desc: "在朋友的小聚上，第一次认真看见对方。",
        photoIndex: 0,
      },
      {
        month: "06",
        label: "Jun.",
        title: "第一次单独约会",
        desc: "夏夜的咖啡馆，时间走得很慢。",
        photoIndex: 4,
      },
      {
        month: "10",
        label: "Oct.",
        title: "秋日里正式在一起",
        desc: "约定不再当朋友，要一起走更远。",
        photoIndex: 8,
      },
    ],
  },
  {
    year: "2024",
    chapter: "Chapter II",
    title: "相知",
    accent: "细水长流",
    summary: "一起把日子过成节日",
    moments: [
      {
        month: "02",
        label: "Feb.",
        title: "把家人介绍给彼此",
        desc: "新年和爱的人一起，年味更暖。",
        photoIndex: 3,
      },
      {
        month: "05",
        label: "May",
        title: "搬进同一间房子",
        desc: "晚归有灯亮着，琐事也变成浪漫。",
        photoIndex: 11,
      },
      {
        month: "09",
        label: "Sep.",
        title: "一起去看海",
        desc: "把愿望清单上的远方，慢慢实现。",
        photoIndex: 15,
      },
    ],
  },
  {
    year: "2025",
    chapter: "Chapter III",
    title: "笃定",
    accent: "答应余生",
    summary: "决定一起走完全程",
    moments: [
      {
        month: "04",
        label: "Apr.",
        title: "他说，嫁给我",
        desc: "戒指与眼泪一起出现的春日午后。",
        photoIndex: 17,
      },
      {
        month: "08",
        label: "Aug.",
        title: "拍下婚纱照",
        desc: "光线、白纱、彼此的笑——存进余生的相册。",
        photoIndex: 20,
      },
      {
        month: "12",
        label: "Dec.",
        title: "婚礼筹备",
        desc: "讨论场地、流程，期待把礼物送给亲友。",
        photoIndex: 22,
      },
    ],
  },
  {
    year: "2026",
    chapter: "Finale",
    title: "礼成",
    accent: "盛夏共证",
    summary: "把幸福告诉所有人",
    moments: [
      {
        month: "07",
        label: "07.18",
        title: "婚礼当日",
        desc: "2026 年 7 月 18 日，让所爱与所爱见证幸福。",
        photoIndex: 6,
        isHighlight: true,
      },
    ],
  },
];

const CURVE_W = 1200;
const CURVE_H = 500;
const CURVE_MID = CURVE_H / 2 - 20;

function buildCurvePath(positions) {
  if (positions.length === 0) return "";
  if (positions.length === 1) {
    const { x, y } = positions[0];
    return `M ${x - 220} ${y + 80} C ${x - 90} ${y - 100}, ${x + 90} ${y - 100}, ${x + 220} ${y + 80}`;
  }

  let d = `M ${positions[0].x} ${positions[0].y}`;
  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];
    const mx = (prev.x + curr.x) / 2;
    d += ` C ${mx} ${prev.y}, ${mx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

function computePositions(moments) {
  const count = moments.length;
  const margin = 110;

  if (count === 1) {
    return [{ x: CURVE_W / 2, y: CURVE_MID }];
  }

  return moments.map((_, i) => {
    const ratio = i / (count - 1);
    const x = margin + ratio * (CURVE_W - margin * 2);
    const wave = Math.sin(ratio * Math.PI * 1.15 + 0.2) * 120;
    const y = CURVE_MID - wave;
    return { x, y };
  });
}

export function MemoryCurve() {
  const [activeYear, setActiveYear] = useState(MEMORY_JOURNEY[0].year);
  const [activeMomentIndex, setActiveMomentIndex] = useState(0);

  const chapter = useMemo(
    () =>
      MEMORY_JOURNEY.find((item) => item.year === activeYear) ||
      MEMORY_JOURNEY[0],
    [activeYear],
  );

  const positions = useMemo(
    () => computePositions(chapter.moments),
    [chapter],
  );

  const pathD = useMemo(() => buildCurvePath(positions), [positions]);

  function handleSelectYear(year) {
    setActiveYear(year);
    setActiveMomentIndex(0);
  }

  const activeMoment = chapter.moments[activeMomentIndex] || chapter.moments[0];
  const activePhoto =
    galleryPhotos[activeMoment?.photoIndex ?? 0] || galleryPhotos[0];

  return (
    <div className="memory-curve">
      <header className="flex flex-col gap-2 text-center md:items-center">
        <p className="text-eyebrow text-[10px] text-champagne-600 md:text-xs">
          Memory Curve
        </p>
        <p className="text-xl text-ink md:text-2xl">回忆曲线</p>
        <p className="mx-auto max-w-xl text-sm leading-7 text-ink-soft md:text-base">
          把岁月卷成一条柔软的线，沿着年份与月份漫步，遇见每一个被珍藏的瞬间。
        </p>
      </header>

      <div className="memory-year-track mt-7 md:mt-9">
        <ul className="memory-year-list">
          {MEMORY_JOURNEY.map((item) => {
            const isActive = item.year === activeYear;
            return (
              <li
                key={item.year}
                className={`memory-year-item ${isActive ? "is-active" : ""}`}
              >
                <span className="memory-year-mark" aria-hidden="true">
                  {isActive ? "◆" : ""}
                </span>

                <button
                  type="button"
                  onClick={() => handleSelectYear(item.year)}
                  aria-pressed={isActive}
                  aria-label={`查看 ${item.year} 年 ${item.title} 的回忆曲线`}
                  className="memory-year-button"
                >
                  <span className="memory-year-number">{item.year}</span>
                </button>

                <span className="memory-year-dot" aria-hidden="true" />

                <span className="memory-year-meta">
                  <span className="memory-year-chapter">{item.chapter}</span>
                  <span className="memory-year-title">{item.title}</span>
                  <span className="memory-year-accent">
                    {item.accent} · {String(item.moments.length).padStart(2, "0")}
                    {" moments"}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-champagne-700 md:justify-start">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="text-eyebrow text-[10px] md:text-[11px]">
            {chapter.chapter} · {chapter.accent}
          </span>
        </span>
        <span className="hidden h-px flex-1 bg-gradient-to-r from-champagne-300/70 to-transparent md:block" />
        <span className="text-sm italic text-ink-soft">{chapter.summary}</span>
      </div>

      <div className="memory-curve-stage relative mt-6 hidden md:block">
        <span className="memory-curve-watermark" aria-hidden="true">
          {chapter.year}
        </span>
        <div className="relative aspect-[12/5]">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${CURVE_W} ${CURVE_H}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="memoryCurveStroke" x1="0" y1="0" x2="1" y2="0">
                <stop
                  offset="0%"
                  stopColor="rgb(var(--c-champagne-300))"
                  stopOpacity="0.6"
                />
                <stop offset="40%" stopColor="rgb(var(--c-blush-400))" />
                <stop offset="100%" stopColor="rgb(var(--c-champagne-600))" />
              </linearGradient>
              <linearGradient id="memoryCurveGlow" x1="0" y1="0" x2="1" y2="0">
                <stop
                  offset="0%"
                  stopColor="rgb(var(--c-champagne-200))"
                  stopOpacity="0.55"
                />
                <stop
                  offset="100%"
                  stopColor="rgb(var(--c-blush-300))"
                  stopOpacity="0.45"
                />
              </linearGradient>
            </defs>

            <path
              d={pathD}
              fill="none"
              stroke="url(#memoryCurveGlow)"
              strokeWidth="16"
              strokeLinecap="round"
              opacity="0.55"
              style={{ filter: "blur(10px)" }}
            />

            <path
              d={pathD}
              fill="none"
              stroke="url(#memoryCurveStroke)"
              strokeWidth="2.4"
              strokeLinecap="round"
              className="memory-curve-path"
            />

            <path
              d={pathD}
              fill="none"
              stroke="rgb(var(--c-ivory-50))"
              strokeWidth="1"
              strokeDasharray="2 7"
              strokeLinecap="round"
              opacity="0.6"
            />

            {positions.map((point, index) => {
              const moment = chapter.moments[index];
              const isActive = index === activeMomentIndex;
              const accent = moment.isHighlight
                ? "rgb(var(--c-blush-500))"
                : "rgb(var(--c-champagne-600))";
              return (
                <g key={`dot-${index}`} className="memory-node-glow">
                  {isActive ? (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="22"
                      fill={accent}
                      opacity="0.18"
                    />
                  ) : null}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isActive ? 12 : 9}
                    fill="rgb(var(--c-ivory-50))"
                    stroke={accent}
                    strokeWidth="1.8"
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isActive ? 5 : 3.5}
                    fill={accent}
                  />
                </g>
              );
            })}
          </svg>

          {chapter.moments.map((moment, index) => {
            const xPct = (positions[index].x / CURVE_W) * 100;
            const yPct = (positions[index].y / CURVE_H) * 100;
            const placeAbove = index % 2 === 0;
            const isActive = index === activeMomentIndex;

            return (
              <div
                key={`label-${moment.month}-${index}`}
                className={`pointer-events-none absolute -translate-x-1/2 text-center transition-all duration-500 ${
                  isActive ? "scale-105" : "opacity-80"
                }`}
                style={{
                  left: `${xPct}%`,
                  top: placeAbove
                    ? `calc(${yPct}% - 92px)`
                    : `calc(${yPct}% + 32px)`,
                }}
              >
                <p
                  className={`text-display text-[40px] leading-none ${
                    moment.isHighlight
                      ? "text-blush-500"
                      : "text-champagne-700"
                  }`}
                >
                  {moment.month}
                </p>
                <p className="mt-1 text-eyebrow text-[10px] text-ink-soft">
                  {moment.label}
                </p>
                {moment.isHighlight ? (
                  <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-blush-500">
                    <Heart className="h-3 w-3" />
                    Wedding Day
                  </p>
                ) : null}
              </div>
            );
          })}

          {chapter.moments.map((moment, index) => {
            const xPct = (positions[index].x / CURVE_W) * 100;
            const yPct = (positions[index].y / CURVE_H) * 100;

            return (
              <button
                key={`hit-${moment.month}-${index}`}
                type="button"
                onClick={() => setActiveMomentIndex(index)}
                aria-label={`查看 ${chapter.year} 年 ${moment.month} 月的回忆：${moment.title}`}
                className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ left: `${xPct}%`, top: `${yPct}%` }}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-6 md:hidden">
        <ol className="space-y-2.5">
          {chapter.moments.map((moment, index) => {
            const isActive = index === activeMomentIndex;
            return (
              <li key={`m-${moment.month}-${index}`}>
                <button
                  type="button"
                  onClick={() => setActiveMomentIndex(index)}
                  aria-pressed={isActive}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition ${
                    isActive
                      ? "border-champagne-400 bg-gradient-to-r from-champagne-50 via-blush-50 to-ivory-50 shadow-sm"
                      : "border-champagne-200 bg-white/70"
                  }`}
                >
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border ${
                      moment.isHighlight
                        ? "border-blush-300 bg-gradient-to-br from-blush-100 to-blush-200 text-blush-500"
                        : "border-champagne-200 bg-gradient-to-br from-champagne-100 to-blush-100 text-champagne-700"
                    }`}
                  >
                    <span className="text-display text-base">
                      {moment.month}
                    </span>
                  </span>
                  <span className="flex-1">
                    <span className="block text-eyebrow text-[10px] text-champagne-600">
                      {moment.label}
                    </span>
                    <span className="mt-0.5 block text-sm text-ink">
                      {moment.title}
                    </span>
                  </span>
                  {moment.isHighlight ? (
                    <Heart className="h-4 w-4 text-blush-500" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-6 overflow-hidden rounded-[26px] border border-champagne-200/70 bg-white/75 shadow-sm">
        <div className="grid md:grid-cols-[0.85fr_1.15fr]">
          <figure className="relative aspect-[5/4] overflow-hidden bg-champagne-100 md:aspect-auto">
            <img
              src={activePhoto.src}
              alt={`${activePhoto.alt}，${activeMoment.title}`}
              loading="lazy"
              decoding="async"
              className="memory-photo h-full w-full object-cover"
              key={`${chapter.year}-${activeMoment.month}-${activeMomentIndex}`}
            />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ivory-50/90 px-3 py-1 text-[11px] text-champagne-700 backdrop-blur">
              <CalendarHeart className="h-3.5 w-3.5" />
              {chapter.year}.{activeMoment.month}
            </span>
          </figure>

          <div className="p-5 md:p-7">
            <p className="text-eyebrow text-[10px] text-champagne-600 md:text-xs">
              {chapter.chapter} · {activeMoment.label}
            </p>
            <p className="mt-2 text-xl text-ink md:text-2xl">
              {activeMoment.title}
            </p>
            <p className="mt-3 text-sm leading-7 text-ink-soft md:text-base">
              {activeMoment.desc}
            </p>

            <div className="mt-5 flex items-center gap-2">
              {chapter.moments.map((m, i) => (
                <button
                  key={`pip-${m.month}-${i}`}
                  type="button"
                  onClick={() => setActiveMomentIndex(i)}
                  aria-label={`切换到 ${m.label}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeMomentIndex
                      ? "w-8 bg-gradient-to-r from-champagne-400 via-blush-400 to-champagne-500"
                      : "w-3 bg-champagne-200 hover:bg-champagne-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-[11px] tracking-[0.18em] text-ink-light">
                {String(activeMomentIndex + 1).padStart(2, "0")} /{" "}
                {String(chapter.moments.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
