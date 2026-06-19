import { CornerFlourish, RingsIcon } from "../components/decor";
import { storyPhoto } from "../lib/photos";

export function OurStory() {
  return (
    <section className="px-5 pb-14 pt-6 md:pb-16">
      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2 md:gap-6">
        <div className="relative overflow-hidden rounded-[32px] border border-champagne-100 bg-ivory-50/90 p-8 shadow-soft backdrop-blur md:p-10">
          <CornerFlourish className="absolute -right-2 -top-2 h-20 w-20 text-champagne-300/70" />
          <p className="text-eyebrow mb-4 text-xs text-champagne-600">
            Love & Friendship
          </p>
          <h3 className="text-display mb-6 text-3xl font-light leading-relaxed text-ink md:text-[2rem]">
            爱情与友情
          </h3>
          <p className="text-base leading-9 text-ink-soft md:text-lg">
            在生命中留下痕迹
            <br className="md:hidden" />
            共同构筑了我们人生平原的蹊径
            <br />
            谢谢你的出现
            <br className="md:hidden" />
            让我们留下很多值得记录的瞬间
          </p>
          <div className="mt-8 flex items-center justify-start gap-3 text-champagne-600">
            <RingsIcon className="h-7 w-12" />
            <span className="text-display italic text-sm tracking-wider">
              Forever &amp; Always
            </span>
          </div>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-[32px] border border-champagne-100 bg-champagne-100 shadow-soft">
          <img
            src={storyPhoto}
            alt="我们的故事"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/50" />
        </div>
      </div>
    </section>
  );
}
