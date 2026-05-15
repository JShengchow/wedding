import { FloralSprig, SparkleStar } from "../components/decor";

export function Invitation() {
  return (
    <section className="relative z-10 mx-auto max-w-3xl px-6 pb-6 pt-20 text-center md:pt-24">
      <p className="text-eyebrow mb-4 text-xs text-champagne-600">
        Save The Date
      </p>
      <div className="gold-divider mb-6 text-champagne-500">
        <SparkleStar className="h-3.5 w-3.5" />
      </div>
      <h2 className="text-display mb-5 text-3xl font-light leading-relaxed text-ink md:text-4xl">
        诚邀您莅临 · 共证幸福
      </h2>
      <p className="mx-auto max-w-xl text-base leading-9 text-ink-soft md:text-lg">
        盛夏将至，我们将在熟悉的城市，以最真挚的心意，
        <br className="hidden md:inline" />
        办一场温柔而隆重的婚礼。
        <br />
        愿您拨冗莅临，与我们一同在这份美好里，留下值得珍藏的回忆。
      </p>

      <div className="mt-10 flex items-center justify-center">
        <FloralSprig className="w-44 text-champagne-400/80 md:w-56" />
      </div>
    </section>
  );
}
