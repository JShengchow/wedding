import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { MemoryMap } from "../components/MemoryMap";
import { MotionSection, motionItem, scatterItem } from "../components/MotionSection";
import { FashiGallery } from "./FashiGallery";
import { carouselPhotos, photoWallPhotos, polaroidPhotos, senxiPhotos } from "../lib/photos";

const MEMORY_STILLS = [
  {
    photoIndex: 0,
    orientation: "landscape",
    tag: "晚风散步",
    chapter: "2023 · 秋",
    caption: "走过的每条路，都因为有你而柔软",
  },
  {
    photoIndex: 1,
    orientation: "landscape",
    tag: "对视一瞬",
    chapter: "2024 · 冬",
    caption: "笑着对视的那一秒，便是答案",
  },
  {
    photoIndex: 2,
    orientation: "landscape",
    tag: "日常浪漫",
    chapter: "2024 · 春",
    caption: "把寻常的日子，过成了节日",
  },
  {
    photoIndex: 3,
    orientation: "landscape",
    tag: "春日告白",
    chapter: "2025 · 春",
    caption: "答应余生的那个春天",
  },
  {
    photoIndex: 4,
    orientation: "landscape",
    tag: "婚纱白光",
    chapter: "2025 · 夏",
    caption: "婚纱与白光，定格成永远",
  },
];

const MOSAIC_PHOTOS = [
  {
    title: "photowall-017",
    desc: "把一路相伴的心动放大",
    photoIndex: 0,
    orientation: "landscape",
  },
  {
    title: "photowall-012",
    desc: "把相伴的步调，留在同一束光里。",
    photoIndex: 2,
    orientation: "portrait",
  },
  {
    title: "photowall-013",
    desc: "回头一笑，是刚刚好的心动。",
    photoIndex: 1,
    orientation: "portrait",
  },
  {
    title: "photowall-014",
    desc: "不用言语，也能看见彼此。",
    photoIndex: 3,
    orientation: "portrait",
  },
  {
    title: "photowall-015",
    desc: "海边的风，把约定吹得很轻。",
    photoIndex: 4,
    orientation: "portrait",
  },
  {
    title: "photowall-016",
    desc: "把一片蓝色海光，留给未来回望。",
    photoIndex: 5,
    orientation: "landscape",
    useOriginalAspect: true,
  },
];

const FEATURED_MOSAIC_PHOTO = MOSAIC_PHOTOS[0];
const FIRST_PORTRAIT_ROW = MOSAIC_PHOTOS.slice(1, 3);
const SECOND_LANDSCAPE_MOSAIC_PHOTO = MOSAIC_PHOTOS[5];
const FINAL_PORTRAIT_ROW = MOSAIC_PHOTOS.slice(3, 5);

const SENXI_WALL_STILLS = [
  {
    photoIndex: 1,
    tag: "senxi-02",
    rotate: "-rotate-[0.4deg]",
    objectPosition: "object-[center_42%]",
  },
  {
    photoIndex: 0,
    tag: "senxi-01",
    rotate: "rotate-[0.5deg]",
    objectPosition: "object-center",
  },
];

const POLAROID_STACK = [
  {
    title: "把心跳藏进春风",
    date: "CARD / 01",
    photoIndex: 0,
  },
  {
    title: "与你共赴白光",
    date: "CARD / 02",
    photoIndex: 1,
  },
  {
    title: "余生慢慢相爱",
    date: "CARD / 03",
    photoIndex: 2,
  },
];

const POLAROID_COLLAPSED_TRANSFORMS = [
  "translate(-50%, -50%) rotate(-1deg) translateY(-8px) scale(1)",
  "translate(-50%, -50%) rotate(6deg) translate(34px, 28px) scale(0.9)",
  "translate(-50%, -50%) rotate(-7deg) translate(-30px, 34px) scale(0.84)",
];

const POLAROID_EXPANDED_TOPS = ["19%", "50%", "81%"];

const POLAROID_EXPANDED_TRANSFORMS = [
  "translate(-55%, -50%) rotate(-5deg) scale(0.9)",
  "translate(-45%, -50%) rotate(2deg) scale(0.94)",
  "translate(-54%, -50%) rotate(6deg) scale(0.9)",
];

export function Gallery() {
  const [showMemoryWall, setShowMemoryWall] = useState(false);
  const [polaroidsExpanded, setPolaroidsExpanded] = useState(
    () => typeof window !== "undefined" && !("IntersectionObserver" in window),
  );
  const polaroidStackRef = useRef(null);

  useEffect(() => {
    const stackNode = polaroidStackRef.current;

    if (!stackNode) return undefined;

    if (!("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPolaroidsExpanded(entry.isIntersecting);
      },
      {
        rootMargin: "-8% 0px -16% 0px",
        threshold: 0.34,
      },
    );

    observer.observe(stackNode);

    return () => observer.disconnect();
  }, []);

  return (
    <MotionSection
      variant="fade"
      stagger={0.09}
      viewportAmount={0.02}
      className="px-5 pb-20 md:px-6"
    >
      <motion.div variants={motionItem} className="mx-auto mb-10 max-w-5xl text-center">
        <p className="text-eyebrow mb-3 text-xs text-champagne-600">Gallery</p>
        <h3 className="text-display text-3xl font-light text-ink md:text-4xl">
          浪漫瞬间
        </h3>
        <span className="mt-4 inline-block h-px w-16 gold-line" />
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-ink-soft md:text-base">
          愿每一次回望 · 都有温柔作伴
        </p>
      </motion.div>

      <div className="mx-auto max-w-5xl space-y-4 md:space-y-5">
        <motion.div variants={motionItem}>
          <article className="relative space-y-10 md:space-y-14">
            {MEMORY_STILLS.slice(0, 2).map((item, index) => {
              const photo = carouselPhotos[item.photoIndex];

              return (
                <motion.figure
                  key={item.tag}
                  variants={scatterItem}
                  className="-mx-5 md:mx-0"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="aspect-video w-full object-cover object-center"
                  />
                </motion.figure>
              );
            })}

            <motion.div
              variants={motionItem}
              className="grid gap-6 md:grid-cols-[0.82fr_1fr] md:items-start"
            >
              <p className="text-display text-5xl font-light leading-[0.96] text-ink-light md:text-6xl">
                I love you
                <br />
                forever
              </p>
              <p className="text-sm leading-8 tracking-[0.14em] text-ink-soft md:text-right md:text-base">
                从并肩到相望
                <br />
                从日常到余生
                <br />
                都是我们认真相爱的证明
              </p>
            </motion.div>

            <div className="space-y-12 md:space-y-16">
              {MEMORY_STILLS.slice(2).map((item, index) => {
                const photo = carouselPhotos[item.photoIndex];
                const imageOnLeft = index % 2 === 1;
                const stagger = [
                  "",
                  "md:translate-y-8",
                  "md:-translate-y-4",
                ][index];

                return (
                  <motion.figure
                    key={item.tag}
                    variants={scatterItem}
                    className={`grid items-center gap-4 md:gap-8 ${
                      imageOnLeft
                        ? "grid-cols-[1fr_0.42fr] md:grid-cols-[1fr_0.32fr]"
                        : "grid-cols-[0.42fr_1fr] md:grid-cols-[0.32fr_1fr]"
                    } ${stagger}`}
                  >
                    <figcaption
                      className={`relative z-[1] ${
                        imageOnLeft ? "order-2 text-right md:text-left" : ""
                      }`}
                    >
                      <p className="text-display text-2xl font-light leading-none text-ink md:text-4xl">
                        {item.tag}
                      </p>
                      <p className="mt-3 text-xs leading-6 text-ink-soft md:text-base md:leading-8">
                        {item.caption}
                      </p>
                    </figcaption>

                    <div className={`overflow-hidden ${imageOnLeft ? "order-1" : ""}`}>
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className="aspect-[3/2] w-full object-cover object-center"
                      />
                    </div>
                  </motion.figure>
                );
              })}
            </div>
          </article>
        </motion.div>

        <motion.article
          variants={motionItem}
          className="overflow-hidden rounded-[30px] border border-champagne-200/70 bg-ivory-50/95 p-4 shadow-soft md:p-6 pb-8"
        >
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-eyebrow text-[10px] text-champagne-600 md:text-[11px]">
                Photo Wall · Our Moments
              </p>
              <h4 className="mt-2 text-display text-2xl font-light text-ink md:text-3xl">
                我们的片刻
              </h4>
            </div>
            <p className="max-w-sm text-sm leading-7 text-ink-soft">
              回头一笑，是刚刚好的心动。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
            <div
              className="relative col-span-2 aspect-[16/9] w-full -rotate-[0.5deg] overflow-hidden rounded-[20px] border border-white/60 bg-champagne-100 shadow-sm md:rounded-[26px]"
            >
              <img
                src={photoWallPhotos[FEATURED_MOSAIC_PHOTO.photoIndex].src}
                alt={photoWallPhotos[FEATURED_MOSAIC_PHOTO.photoIndex].alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="col-span-2 grid grid-cols-2 items-start gap-2.5 sm:gap-3 md:gap-4">
              {FIRST_PORTRAIT_ROW.map((item, index) => {
                const photo = photoWallPhotos[item.photoIndex];
                const cardOffset = [
                  "-rotate-[1deg]",
                  "translate-y-5 rotate-[0.8deg] md:translate-y-8",
                ][index];

                return (
                  <div
                    key={item.title}
                    className={`relative aspect-[3/4] w-full overflow-hidden rounded-[16px] border border-white/60 bg-champagne-100 shadow-sm md:rounded-[24px] ${cardOffset}`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-[center_42%]"
                    />
                  </div>
                );
              })}
            </div>

            <div className="col-span-2 flex items-center gap-3 pb-1 pt-4 md:gap-4 md:pb-2 md:pt-6">
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-gradient-to-r from-transparent via-champagne-300/80 to-champagne-200/30"
              />
              <p className="text-center text-[11px] leading-5 tracking-[0.18em] text-champagne-700 md:text-xs">
                把相伴的步调，留在同一束光里
              </p>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-gradient-to-l from-transparent via-champagne-300/80 to-champagne-200/30"
              />
            </div>

            <div
              className={`relative col-span-2 w-full rotate-[0.5deg] overflow-hidden rounded-[20px] border border-white/60 bg-champagne-100 shadow-sm md:rounded-[26px] ${
                SECOND_LANDSCAPE_MOSAIC_PHOTO.useOriginalAspect
                  ? ""
                  : "aspect-[16/9]"
              }`}
            >
              <img
                src={
                  photoWallPhotos[SECOND_LANDSCAPE_MOSAIC_PHOTO.photoIndex].src
                }
                alt={
                  photoWallPhotos[SECOND_LANDSCAPE_MOSAIC_PHOTO.photoIndex].alt
                }
                loading="lazy"
                decoding="async"
                className={
                  SECOND_LANDSCAPE_MOSAIC_PHOTO.useOriginalAspect
                    ? "block h-auto w-full"
                    : "h-full w-full object-cover object-center"
                }
              />
            </div>

            <div className="col-span-2 grid grid-cols-2 items-start gap-2.5 sm:gap-3 md:gap-4">
              {FINAL_PORTRAIT_ROW.map((item, index) => {
                const photo = photoWallPhotos[item.photoIndex];
                const cardOffset = [
                  "-translate-y-1 -rotate-[0.7deg] md:-translate-y-2",
                  "translate-y-4 rotate-[0.8deg] md:translate-y-6",
                ][index];

                return (
                  <div
                    key={item.title}
                    className={`relative aspect-[3/4] w-full overflow-hidden rounded-[16px] border border-white/60 bg-champagne-100 shadow-sm md:rounded-[24px] ${cardOffset}`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-[center_42%]"
                    />
                  </div>
                );
              })}
            </div>

            <div className="col-span-2 flex items-center gap-3 pb-1 pt-4 md:gap-4 md:pb-2 md:pt-8">
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-gradient-to-r from-transparent via-champagne-300/80 to-champagne-200/30"
              />
              <p className="text-center text-[11px] leading-5 tracking-[0.18em] text-champagne-700 md:text-xs">
                林深时见 · 心也安静
              </p>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-gradient-to-l from-transparent via-champagne-300/80 to-champagne-200/30"
              />
            </div>

            {SENXI_WALL_STILLS.map((still) => {
              const photo = senxiPhotos[still.photoIndex];

              return (
                <div
                  key={still.tag}
                  className={`relative col-span-2 aspect-[3/2] w-full overflow-hidden rounded-[20px] border border-white/60 bg-champagne-100 shadow-sm md:rounded-[26px] ${still.rotate}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    className={`h-full w-full object-cover ${still.objectPosition}`}
                  />
                </div>
              );
            })}
          </div>
        </motion.article>

        <motion.article
          variants={motionItem}
          className="overflow-hidden rounded-[30px] border border-champagne-200/70 bg-gradient-to-br from-white/90 via-ivory-50/95 to-blush-50/70 p-4 shadow-soft md:p-6"
        >
          <div
            ref={polaroidStackRef}
            aria-label="自动展开的拍立得照片组"
            className="relative mx-auto min-h-[640px] max-w-xl overflow-hidden rounded-[26px] border border-champagne-200/70 bg-[radial-gradient(circle_at_20%_12%,rgba(245,213,214,0.72),transparent_38%),linear-gradient(135deg,rgba(255,252,247,0.98),rgba(246,239,217,0.7))] transition-[min-height] duration-700 ease-out md:min-h-[760px]"
          >
            <span
              aria-hidden="true"
              className="absolute left-7 top-7 h-px w-24 rotate-[-14deg] bg-champagne-300/70"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-8 right-7 h-px w-28 rotate-[18deg] bg-blush-300/70"
            />

            {POLAROID_STACK.map((item, index) => {
              const photo = polaroidPhotos[item.photoIndex];

              return (
                <figure
                  key={item.title}
                  className="absolute left-1/2 m-0 w-[70%] max-w-[340px] rounded-[18px] border border-champagne-100 bg-white p-3 text-left shadow-[0_24px_60px_-34px_rgba(92,74,63,0.55)] transition-[top,transform,opacity,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:w-[60%]"
                  style={{
                    opacity: polaroidsExpanded ? 1 : index === 0 ? 1 : 0.78,
                    top: polaroidsExpanded
                      ? POLAROID_EXPANDED_TOPS[index]
                      : "50%",
                    transform: polaroidsExpanded
                      ? POLAROID_EXPANDED_TRANSFORMS[index]
                      : POLAROID_COLLAPSED_TRANSFORMS[index],
                    transitionDelay: polaroidsExpanded
                      ? `${index * 120}ms`
                      : "0ms",
                    zIndex: POLAROID_STACK.length - index,
                  }}
                >
                  <img
                    src={photo.src}
                    alt={`${photo.alt}，${item.title}`}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/10] w-full rounded-[12px] object-cover object-center"
                  />
                  <span className="block px-1 pb-1 pt-3">
                    <span className="text-eyebrow block text-[9px] text-champagne-600">
                      {item.date}
                    </span>
                    <span className="mt-1 block text-xl font-light text-ink">
                      {item.title}
                    </span>
                  </span>
                </figure>
              );
            })}
          </div>
        </motion.article>

        <FashiGallery />

        <motion.article
          variants={motionItem}
          className="rounded-[30px] border border-champagne-200/70 bg-ivory-50/90 p-4 shadow-soft md:p-6"
        >
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
                  Love Map · Travel + Home
                </p>
                <p className="mt-1 text-sm text-ink md:text-[15px]">
                  {showMemoryWall
                    ? "城市坐标正在闪闪发光"
                    : "点亮中国地图，看看我们走过的城市"}
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
              {showMemoryWall ? <MemoryMap /> : null}
            </div>
          </div>
        </motion.article>
      </div>

    </MotionSection>
  );
}
