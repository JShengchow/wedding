import { motion } from "framer-motion";
import { MotionSection, motionItem, scatterItem } from "../components/MotionSection";
import { sunsetPhotos } from "../lib/photos";

const STILLS = [
  {
    tag: "草海余晖",
    caption: "向着同一片金色，并肩而行",
    layout: "hero",
  },
  {
    tag: "提琴轻语",
    caption: "每一弓，都是说不出口的情话",
    layout: "left",
  },
  {
    tag: "回眸一瞬",
    caption: "你在光里，光也在你眼里",
    layout: "right",
  },
  {
    tag: "彼此相望",
    caption: "湖面的波光，是我们未来的倒影",
    layout: "finale",
  },
];

export function SunsetPhotos() {
  if (!sunsetPhotos.length) return null;

  const [heroPhoto, ...detailPhotos] = sunsetPhotos;
  const finalePhoto = detailPhotos.pop();

  return (
    <MotionSection
      variant="fade"
      stagger={0.1}
      viewportAmount={0.08}
      className="relative z-10 px-5 pb-14 md:px-6 md:pb-20"
    >
      <motion.div variants={motionItem} className="mx-auto mb-10 max-w-5xl text-center">
        <p className="text-eyebrow mb-3 text-xs text-champagne-600">Golden Hour</p>
        <h3 className="text-display text-3xl font-light text-ink md:text-4xl">
          日落时分
        </h3>
        <span className="mt-4 inline-block h-px w-16 gold-line" />
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-ink-soft md:text-base">
          提琴、晚风与金色湖面 · 把这一天的温柔留给我们
        </p>
      </motion.div>

      <div className="mx-auto max-w-5xl space-y-10 md:space-y-14">
        <motion.figure variants={scatterItem} className="-mx-5 md:mx-0">
          <div className="overflow-hidden md:rounded-[32px] md:border md:border-champagne-200/70 md:shadow-warm">
            <img
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="aspect-[16/10] w-full object-cover object-center md:aspect-[21/9]"
            />
          </div>
          <figcaption className="mt-4 px-1 text-center md:mt-5">
            <p className="text-display text-xl font-light text-ink md:text-2xl">
              {STILLS[0].tag}
            </p>
            <p className="mt-2 text-sm leading-7 text-ink-soft">{STILLS[0].caption}</p>
          </figcaption>
        </motion.figure>

        <div className="grid gap-8 md:grid-cols-2 md:gap-6">
          {detailPhotos.map((photo, index) => {
            const still = STILLS[index + 1];
            const stagger = index === 0 ? "md:translate-y-6" : "md:-translate-y-2";

            return (
              <motion.figure
                key={photo.src}
                variants={scatterItem}
                className={stagger}
              >
                <div className="overflow-hidden rounded-[24px] border border-champagne-200/70 shadow-soft md:rounded-[28px]">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover object-center"
                  />
                </div>
                <figcaption className="mt-4 px-1">
                  <p className="text-display text-lg font-light text-ink md:text-xl">
                    {still.tag}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-ink-soft">{still.caption}</p>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>

        {finalePhoto ? (
          <motion.figure variants={scatterItem} className="-mx-5 md:mx-0">
            <div className="overflow-hidden md:rounded-[32px] md:border md:border-champagne-200/70 md:shadow-warm">
              <img
                src={finalePhoto.src}
                alt={finalePhoto.alt}
                loading="lazy"
                decoding="async"
                className="aspect-[16/10] w-full object-cover object-center md:aspect-[21/9]"
              />
            </div>
            <figcaption className="mt-4 px-1 text-center md:mt-5">
              <p className="text-display text-xl font-light text-ink md:text-2xl">
                {STILLS[3].tag}
              </p>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{STILLS[3].caption}</p>
            </figcaption>
          </motion.figure>
        ) : null}
      </div>
    </MotionSection>
  );
}
