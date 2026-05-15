import { CornerFlourish, RingsIcon } from "../components/decor";
import { storyPhoto } from "../lib/photos";

export function OurStory() {
  return (
    <section className="px-5 pb-14 pt-6 md:pb-16">
      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2 md:gap-6">
        <div className="relative overflow-hidden rounded-[32px] border border-champagne-100 bg-ivory-50/90 p-8 shadow-soft backdrop-blur md:p-10">
          <CornerFlourish className="absolute -right-2 -top-2 h-20 w-20 text-champagne-300/70" />
          <p className="text-eyebrow mb-4 text-xs text-champagne-600">
            Our Story
          </p>
          <h3 className="text-display mb-6 text-3xl font-light leading-relaxed text-ink md:text-[2rem]">
            从相遇，到决定共度余生
          </h3>
          <p className="text-base leading-9 text-ink-soft md:text-lg">
            一杯咖啡，一段晚风，
            <br className="md:hidden" />
            从陌生人，到走进彼此的余生。
            <br />
            在岁月里相互温柔，在平凡中彼此守候——
            <br className="md:hidden" />
            这便是我们想与你分享的爱情。
          </p>
          <div className="mt-8 flex items-center justify-start gap-3 text-champagne-600">
            <RingsIcon className="h-7 w-12" />
            <span className="text-display italic text-sm tracking-wider">
              Forever &amp; Always
            </span>
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-[32px] border border-champagne-100 bg-champagne-100 shadow-soft md:min-h-[400px]">
          <img
            src={storyPhoto}
            alt="我们的故事"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/50" />
        </div>
      </div>
    </section>
  );
}
