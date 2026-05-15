import { useState } from "react";
import { Camera, ChevronDown, ChevronUp, Clock3, Heart, Sparkles } from "lucide-react";
import { WEDDING_DATE_FULL } from "../content/wedding";
import { galleryPhotos } from "../lib/photos";

const STORY_TIMELINE = [
  {
    stage: "初遇",
    title: "在人海里对上眼神",
    desc: "从一句问候开始，我们慢慢成为彼此最习惯的陪伴。",
  },
  {
    stage: "相知",
    title: "把平凡过成节日",
    desc: "日常散步、深夜聊天、偶尔小旅行，碎片拼成了完整的喜欢。",
  },
  {
    stage: "笃定",
    title: "决定一起走向未来",
    desc: "在一次认真对话之后，我们确认了要把余生写在同一页里。",
  },
  {
    stage: "礼成",
    title: `${WEDDING_DATE_FULL}，与亲友共证`,
    desc: "把这份幸福公开，也把感恩写进每一次举杯与拥抱中。",
  },
];

const MEMORY_TAGS = [
  "慢慢喜欢你",
  "晚风与散步",
  "咖啡与电影",
  "两个人的小庆典",
  "彼此的避风港",
  "把日常过成浪漫",
];

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
  const storyPhoto = galleryPhotos[6];
  const collagePhotos = galleryPhotos.slice(0, 12);

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
        <div className="grid gap-3 md:grid-cols-[1.25fr_0.95fr] md:gap-4">
          <article className="rounded-[28px] border border-champagne-200/70 bg-ivory-50/90 p-6 shadow-soft backdrop-blur md:p-8">
            <div className="flex items-center gap-2 text-champagne-600">
              <Sparkles className="h-4 w-4" />
              <p className="text-eyebrow text-[10px] md:text-xs">Storyline</p>
            </div>

            <ol className="mt-5 space-y-5">
              {STORY_TIMELINE.map((item, index) => (
                <li key={item.stage} className="relative pl-8">
                  {index < STORY_TIMELINE.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-[11px] top-6 h-[calc(100%+14px)] w-px bg-gradient-to-b from-champagne-300/80 to-transparent"
                    />
                  ) : null}

                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[5px] h-[22px] w-[22px] rounded-full border border-champagne-300 bg-gradient-to-br from-champagne-100 to-blush-100"
                  />
                  <p className="text-eyebrow text-[10px] text-champagne-600 md:text-[11px]">
                    {item.stage}
                  </p>
                  <p className="mt-1 text-lg text-ink md:text-xl">{item.title}</p>
                  <p className="mt-1.5 text-sm leading-7 text-ink-soft md:text-base">
                    {item.desc}
                  </p>
                </li>
              ))}
            </ol>
          </article>

          <article className="overflow-hidden rounded-[28px] border border-champagne-200/70 bg-ivory-50/90 shadow-soft backdrop-blur">
            <figure className="overflow-hidden border-b border-champagne-100/70">
              <img
                src={storyPhoto.src}
                alt={`${storyPhoto.alt}，故事章节配图`}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-[1.03]"
              />
            </figure>
            <div className="p-6 md:p-7">
              <p className="text-eyebrow text-[10px] text-champagne-600 md:text-xs">
                Memory Tags
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {MEMORY_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-champagne-200 bg-white/75 px-3 py-1 text-xs text-ink-soft md:text-sm"
                  >
                    {tag}
                  </span>
                ))}
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
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-eyebrow text-[10px] text-champagne-600 md:text-xs">
                Memory Wall
              </p>
              <p className="mt-1 text-xl text-ink md:text-2xl">回忆长廊</p>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowMemoryWall((prev) => !prev)}
              aria-expanded={showMemoryWall}
              aria-controls="memory-wall-grid"
              className="group w-full rounded-[18px] border border-champagne-200/80 bg-gradient-to-r from-white/85 via-ivory-50/90 to-white/85 px-4 py-3 text-left shadow-sm transition hover:border-champagne-300/90"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-eyebrow text-[10px] text-champagne-600 md:text-[11px]">
                    Curated Memory Reel
                  </p>
                  <p className="mt-1 text-sm text-ink md:text-[15px]">
                    {showMemoryWall
                      ? "夏日片段正在舒展"
                      : "收藏的夏日片段，轻触展开"}
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
          </div>

          <div
            id="memory-wall-grid"
            className={`grid transition-all duration-500 ease-out ${
              showMemoryWall
                ? "mt-4 grid-rows-[1fr] opacity-100"
                : "mt-0 grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {collagePhotos.map((photo, index) => {
                  const isHero = index === 0 || index === 5;
                  return (
                    <figure
                      key={photo.src}
                      className={`overflow-hidden rounded-[20px] border border-champagne-100 bg-champagne-100 ${
                        isHero ? "col-span-2 md:col-span-2" : ""
                      }`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        decoding="async"
                        className={`w-full object-cover transition duration-700 hover:scale-[1.03] ${
                          isHero ? "aspect-[16/9] md:aspect-[12/7]" : "aspect-[3/4]"
                        }`}
                      />
                    </figure>
                  );
                })}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
