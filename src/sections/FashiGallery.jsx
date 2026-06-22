import { motion } from "framer-motion";
import { motionItem, scatterItem } from "../components/MotionSection";
import { fashiPhotos } from "../lib/photos";

const LANDSCAPE_STILLS = [
  {
    photoIndex: 0,
    tag: "午后书页",
    caption: "把时间翻慢一点，等你也入座",
    aspect: "aspect-[3/2] md:aspect-[21/9]",
    rotate: "-rotate-[0.4deg]",
  },
  {
    photoIndex: 2,
    tag: "独自斟茶",
    caption: "等候也要穿得隆重",
    aspect: "aspect-[4/3]",
    rotate: "rotate-[0.7deg] md:-translate-y-2",
  },
  {
    photoIndex: 3,
    tag: "湖面金光",
    caption: "把浪漫铺在草地上",
    aspect: "aspect-[4/3]",
    rotate: "-rotate-[0.6deg] md:translate-y-3",
  },
  {
    photoIndex: 4,
    tag: "彼此相望",
    caption: "连风都学会轻声",
    aspect: "aspect-[3/2] md:aspect-[21/9]",
    rotate: "rotate-[0.3deg]",
  },
];

const PORTRAIT_LOOKBOOK = [
  {
    photoIndex: 1,
    tag: "花间低眉",
    caption: "温柔落在指间",
    side: "left",
    objectPosition: "object-[center_40%]",
  },
  {
    photoIndex: 5,
    tag: "伞下相依",
    caption: "只在这一刻停留",
    side: "right",
    objectPosition: "object-[center_35%]",
  },
  {
    photoIndex: 6,
    tag: "草地誓言",
    caption: "把余生交到你手里",
    side: "left",
    objectPosition: "object-[center_45%]",
  },
  {
    photoIndex: 7,
    tag: "提琴落日",
    caption: "把余晖谱成一首情诗",
    side: "right",
    objectPosition: "object-[center_30%]",
    featured: true,
  },
];

const portraitItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

function LookbookFrame({ photo, still }) {
  return (
    <motion.figure
      variants={portraitItem}
      className={`group w-[86%] ${still.side === "right" ? "ml-auto" : ""} ${
        still.featured ? "md:w-[94%]" : ""
      }`}
    >
      <div className="overflow-hidden rounded-[20px] border border-white/70 bg-champagne-100 shadow-soft transition duration-500 group-hover:shadow-warm md:rounded-[26px]">
        <div className="aspect-[3/4] w-full overflow-hidden">
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className={`block h-full w-full object-cover ${still.objectPosition ?? "object-center"}`}
          />
        </div>
      </div>
      <figcaption
        className={`mt-4 max-w-[18rem] ${
          still.side === "right"
            ? "ml-auto border-r-2 pr-4 text-right"
            : "border-l-2 pl-4"
        } ${still.featured ? "border-champagne-500" : "border-champagne-400"}`}
      >
        <p className="text-display text-lg font-light text-ink md:text-xl">
          {still.tag}
        </p>
        <p className="mt-1.5 text-sm leading-7 text-ink-soft">{still.caption}</p>
      </figcaption>
    </motion.figure>
  );
}

function PortraitLookbook() {
  const leftItems = PORTRAIT_LOOKBOOK.filter((item) => item.side === "left");
  const rightItems = PORTRAIT_LOOKBOOK.filter((item) => item.side === "right");

  return (
    <>
      <div className="space-y-14 md:hidden">
        {PORTRAIT_LOOKBOOK.map((still) => (
          <LookbookFrame
            key={still.tag}
            photo={fashiPhotos[still.photoIndex]}
            still={still}
          />
        ))}
      </div>

      <div className="hidden md:grid md:grid-cols-2 md:gap-x-12">
        <div className="space-y-20">
          {leftItems.map((still) => (
            <LookbookFrame
              key={still.tag}
              photo={fashiPhotos[still.photoIndex]}
              still={still}
            />
          ))}
        </div>
        <div className="space-y-20 pt-28">
          {rightItems.map((still) => (
            <LookbookFrame
              key={still.tag}
              photo={fashiPhotos[still.photoIndex]}
              still={still}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function FashiFrame({ photo, still, className = "" }) {
  const frameClass = still.rotate ?? "";
  const imageClass = still.aspect ?? "aspect-[3/4]";

  return (
    <figure className={`group ${frameClass} ${className}`}>
      <div className="overflow-hidden rounded-[20px] border border-white/70 bg-champagne-100 shadow-soft transition duration-500 group-hover:shadow-warm md:rounded-[26px]">
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className={`w-full object-cover object-center transition duration-700 group-hover:scale-[1.02] ${imageClass}`}
        />
      </div>
      <figcaption className="mt-3 px-0.5">
        <p className="text-display text-base font-light text-ink md:text-lg">
          {still.tag}
        </p>
        <p className="mt-1 text-xs leading-6 text-ink-soft md:text-sm">
          {still.caption}
        </p>
      </figcaption>
    </figure>
  );
}

export function FashiGallery() {
  if (!fashiPhotos.length) return null;

  const [heroStill, ...middleStills] = LANDSCAPE_STILLS;
  const finaleStill = middleStills.pop();
  const gridStills = middleStills;

  return (
    <motion.article
      variants={motionItem}
      className="overflow-hidden rounded-[30px] border border-champagne-200/70 bg-ivory-50/95 p-4 shadow-soft md:p-6"
    >
      <div className="mb-6 flex flex-col gap-2 md:mb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-eyebrow text-[10px] text-champagne-600 md:text-[11px]">
            French Vintage · Lakeside Tea
          </p>
          <h4 className="mt-2 text-display text-2xl font-light text-ink md:text-3xl">
            法式复古
          </h4>
        </div>
        <p className="max-w-xs text-sm leading-7 text-ink-soft">
          蕾丝、午茶与湖风 · 把旧日浪漫带回今天
        </p>
      </div>

      <div className="space-y-8 md:space-y-10">
        <section aria-label="湖畔午茶横图">
          <div className="mb-5 flex items-center gap-3">
            <span className="text-eyebrow text-[10px] tracking-[0.22em] text-champagne-700">
              I · 湖畔午茶
            </span>
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-gradient-to-r from-champagne-300/80 to-transparent"
            />
          </div>

          <div className="space-y-4 md:space-y-5">
            <motion.div variants={scatterItem}>
              <FashiFrame
                photo={fashiPhotos[heroStill.photoIndex]}
                still={heroStill}
              />
            </motion.div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {gridStills.map((still) => (
                <motion.div key={still.tag} variants={scatterItem}>
                  <FashiFrame
                    photo={fashiPhotos[still.photoIndex]}
                    still={still}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div variants={scatterItem}>
              <FashiFrame
                photo={fashiPhotos[finaleStill.photoIndex]}
                still={finaleStill}
              />
            </motion.div>
          </div>
        </section>

        <div className="flex items-center gap-3 py-1 md:py-2">
          <span
            aria-hidden="true"
            className="h-px flex-1 bg-gradient-to-r from-transparent via-champagne-300/80 to-champagne-200/30"
          />
          <p className="text-center text-[11px] leading-5 tracking-[0.2em] text-champagne-700 md:text-xs">
            靠近一点 · 看见更多
          </p>
          <span
            aria-hidden="true"
            className="h-px flex-1 bg-gradient-to-l from-transparent via-champagne-300/80 to-champagne-200/30"
          />
        </div>

        <section aria-label="近景竖图">
          <div className="mb-5 flex items-center gap-3">
            <span className="text-eyebrow text-[10px] tracking-[0.22em] text-champagne-700">
              II · 近处温柔
            </span>
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-gradient-to-r from-champagne-300/80 to-transparent"
            />
          </div>

          <PortraitLookbook />
        </section>
      </div>
    </motion.article>
  );
}
