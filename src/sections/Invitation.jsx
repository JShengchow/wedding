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
        好久不见，当你收到这封邀请函
        <br />
        我们已经在倒数着日子，期待与你相见
        <br />
        在我们最重要的这一天
        <br />
        邀请并期待你一同见证我们的幸福时刻
      </p>

      <div className="mt-10 flex items-center justify-center">
        <FloralSprig className="w-44 text-champagne-400/80 md:w-56" />
      </div>
    </section>
  );
}
