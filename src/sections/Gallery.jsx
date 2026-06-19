import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import { MemoryMap } from "../components/MemoryMap";
import { carouselPhotos, photoWallPhotos, polaroidPhotos } from "../lib/photos";

const MEMORY_REEL = [
  {
    photoIndex: 0,
    tag: "晚风散步",
    chapter: "2023 · 秋",
    caption: "走过的每条路，都因为有你而柔软",
  },
  {
    photoIndex: 1,
    tag: "对视一瞬",
    chapter: "2024 · 冬",
    caption: "笑着对视的那一秒，便是答案",
  },
  {
    photoIndex: 2,
    tag: "日常浪漫",
    chapter: "2024 · 春",
    caption: "把寻常的日子，过成了节日",
  },
  {
    photoIndex: 3,
    tag: "春日告白",
    chapter: "2025 · 春",
    caption: "答应余生的那个春天",
  },
  {
    photoIndex: 4,
    tag: "婚纱白光",
    chapter: "2025 · 夏",
    caption: "婚纱与白光，定格成永远",
  },
];

const REEL_INTERVAL_MS = 5200;

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
  },
];

const FEATURED_MOSAIC_PHOTO = MOSAIC_PHOTOS[0];
const FIRST_PORTRAIT_ROW = MOSAIC_PHOTOS.slice(1, 3);
const SECOND_LANDSCAPE_MOSAIC_PHOTO = MOSAIC_PHOTOS[5];
const FINAL_PORTRAIT_ROW = MOSAIC_PHOTOS.slice(3, 5);

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

export function Gallery() {
  const [showMemoryWall, setShowMemoryWall] = useState(false);
  const [polaroidIndex, setPolaroidIndex] = useState(0);
  const [reelIndex, setReelIndex] = useState(0);
  const [reelPaused, setReelPaused] = useState(false);
  const [isReelResetting, setIsReelResetting] = useState(false);
  const [reelTouchStart, setReelTouchStart] = useState(null);

  const activeReelIndex = reelIndex % MEMORY_REEL.length;
  const activeReel = MEMORY_REEL[activeReelIndex];
  const reelSlides = [...MEMORY_REEL, MEMORY_REEL[0]];

  useEffect(() => {
    if (reelPaused) return undefined;
    const timer = window.setInterval(() => {
      setIsReelResetting(false);
      setReelIndex((index) => index + 1);
    }, REEL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [reelPaused]);

  const goToReel = (index) => {
    setIsReelResetting(false);
    setReelIndex(index);
  };

  const goToNextReel = () => {
    setIsReelResetting(false);
    setReelIndex((index) => index + 1);
  };

  const goToPrevReel = () => {
    setIsReelResetting(false);
    setReelIndex((index) =>
      index === 0 ? MEMORY_REEL.length - 1 : index - 1,
    );
  };

  const goToPolaroid = (index) => {
    setPolaroidIndex(
      (index + POLAROID_STACK.length) % POLAROID_STACK.length,
    );
  };

  const handleReelTouchStart = (event) => {
    const touch = event.touches[0];
    setReelPaused(true);
    setReelTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleReelTouchEnd = (event) => {
    if (!reelTouchStart) {
      setReelPaused(false);
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - reelTouchStart.x;
    const deltaY = touch.clientY - reelTouchStart.y;
    const isHorizontalSwipe =
      Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;

    if (isHorizontalSwipe) {
      if (deltaX < 0) {
        goToNextReel();
      } else {
        goToPrevReel();
      }
    }

    setReelTouchStart(null);
    setReelPaused(false);
  };

  const handleReelTransitionEnd = () => {
    if (reelIndex < MEMORY_REEL.length) return;

    setIsReelResetting(true);
    setReelIndex(0);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setIsReelResetting(false));
    });
  };

  return (
    <section className="px-5 pb-20 md:px-6">
      <div className="mx-auto mb-10 max-w-5xl text-center">
        <p className="text-eyebrow mb-3 text-xs text-champagne-600">Gallery</p>
        <h3 className="text-display text-3xl font-light text-ink md:text-4xl">
          浪漫瞬间
        </h3>
        <span className="mt-4 inline-block h-px w-16 gold-line" />
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-ink-soft md:text-base">
          愿每一次回望 · 都有温柔作伴
        </p>
      </div>

      <div className="mx-auto max-w-5xl space-y-4 md:space-y-5">
        <div>
          <article className="flex flex-col overflow-hidden rounded-[28px] border border-champagne-200/70 bg-ivory-50/90 shadow-soft backdrop-blur">
            <figure
              className="memory-reel relative aspect-[4/3] overflow-hidden border-b border-champagne-100/70 bg-gradient-to-br from-champagne-100/70 via-ivory-50 to-blush-50/50 md:aspect-[16/9]"
              onMouseEnter={() => setReelPaused(true)}
              onMouseLeave={() => setReelPaused(false)}
              onTouchStart={handleReelTouchStart}
              onTouchEnd={handleReelTouchEnd}
              onTouchCancel={() => {
                setReelTouchStart(null);
                setReelPaused(false);
              }}
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
                  MEMORY REEL
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

              <div className="absolute inset-0 z-[2]" aria-live="polite">
                <div
                  className={`flex h-full will-change-transform ${
                    isReelResetting
                      ? "transition-none"
                      : "transition-transform duration-1000 ease-[cubic-bezier(0.32,0.8,0.32,1)]"
                  }`}
                  style={{ transform: `translateX(-${reelIndex * 100}%)` }}
                  onTransitionEnd={handleReelTransitionEnd}
                >
                  {reelSlides.map((item, i) => {
                    const photo = carouselPhotos[item.photoIndex];
                    const realIndex = i % MEMORY_REEL.length;
                    const isActive = realIndex === activeReelIndex;

                    return (
                      <button
                        key={`${item.tag}-${i}`}
                        type="button"
                        onClick={() => goToReel(realIndex)}
                        aria-label={`查看第 ${realIndex + 1} 张照片`}
                        aria-current={isActive}
                        tabIndex={isActive ? 0 : -1}
                        className="relative h-full min-w-full overflow-hidden border-0 bg-champagne-100 p-0"
                      >
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          loading={realIndex === 0 ? "eager" : "lazy"}
                          decoding="async"
                          className={`h-full w-full object-cover object-center transition-transform duration-[5200ms] ease-linear ${
                            isActive ? "scale-105" : "scale-100"
                          }`}
                        />

                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_46%,rgba(47,38,30,0.28)_100%)]"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                key={`${activeReel.tag}-${activeReelIndex}`}
                className="pointer-events-none absolute bottom-10 left-5 right-5 z-[8] max-w-xl text-white md:bottom-12 md:left-8"
              >
                <p className="text-eyebrow text-[10px] text-white/75 md:text-[11px]">
                  {activeReel.chapter}
                </p>
                <p className="mt-2 text-2xl font-light leading-none text-white text-shadow-soft md:text-4xl">
                  {activeReel.tag}
                </p>
                <p className="mt-2 max-w-sm text-sm leading-7 text-white/80 md:text-base">
                  {activeReel.caption}
                </p>
              </div>

              <div className="absolute bottom-4 left-1/2 z-[9] flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/40 bg-white/50 px-2.5 py-1.5 backdrop-blur">
                {MEMORY_REEL.map((item, i) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => goToReel(i)}
                    aria-label={`切换到第 ${i + 1} 张照片`}
                    aria-current={i === activeReelIndex}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeReelIndex
                        ? "w-4 bg-champagne-600"
                        : "w-1.5 bg-champagne-300/80 hover:bg-champagne-500"
                    }`}
                  />
                ))}
              </div>

            </figure>

            <p className="px-6 py-6 text-center text-sm leading-8 text-ink-soft md:px-8 md:text-base">
              从并肩到相望，
              <br className="md:hidden" />
              从日常到余生，都是我们认真相爱的证明。
            </p>
          </article>
        </div>

        <article className="overflow-hidden rounded-[30px] border border-champagne-200/70 bg-ivory-50/95 p-4 shadow-soft md:p-6 pb-8">
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
              className="relative col-span-2 aspect-[16/9] w-full rotate-[0.5deg] overflow-hidden rounded-[20px] border border-white/60 bg-champagne-100 shadow-sm md:rounded-[26px]"
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
                className="h-full w-full object-cover object-center"
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
          </div>
        </article>

        <article className="overflow-hidden rounded-[30px] border border-champagne-200/70 bg-gradient-to-br from-white/90 via-ivory-50/95 to-blush-50/70 p-4 shadow-soft md:p-6">
          <div className="relative mx-auto min-h-[430px] max-w-xl overflow-hidden rounded-[26px] border border-champagne-200/70 bg-[radial-gradient(circle_at_20%_12%,rgba(245,213,214,0.72),transparent_38%),linear-gradient(135deg,rgba(255,252,247,0.98),rgba(246,239,217,0.7))] md:min-h-[520px]">
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
              const distance =
                (index - polaroidIndex + POLAROID_STACK.length) %
                POLAROID_STACK.length;
              const isActive = index === polaroidIndex;
              const cardTransforms = [
                "translate(-50%, -50%) rotate(-1deg) translateY(-8px) scale(1)",
                "translate(-50%, -50%) rotate(6deg) translate(34px, 28px) scale(0.9)",
                "translate(-50%, -50%) rotate(-7deg) translate(-30px, 34px) scale(0.84)",
              ];

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => goToPolaroid(index)}
                  aria-label={`查看拍立得照片：${item.title}`}
                  aria-current={isActive}
                  className={`absolute left-1/2 top-1/2 w-[84%] max-w-[390px] rounded-[18px] border border-champagne-100 bg-white p-3 text-left shadow-[0_24px_60px_-34px_rgba(92,74,63,0.55)] transition duration-500 hover:shadow-warm md:w-[78%] ${
                    isActive ? "opacity-100" : "opacity-75"
                  }`}
                  style={{
                    transform: cardTransforms[distance],
                    zIndex: POLAROID_STACK.length - distance,
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
                </button>
              );
            })}
          </div>
        </article>

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
        </article>
      </div>

    </section>
  );
}
