import { Heart } from "lucide-react";
import { CornerFlourish, CoupleSilhouette } from "../components/decor";
import { COUPLE } from "../content/wedding";

export function Vow() {
  return (
    <section className="relative px-5 pb-14 md:pb-20">
      <div className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-[36px] border border-blush-200/70 bg-gradient-to-br from-blush-50 via-ivory-50 to-champagne-50 p-8 text-center shadow-petal md:p-12">
          <CornerFlourish className="absolute -left-3 -top-3 h-24 w-24 text-champagne-300/80" />
          <CornerFlourish className="absolute -bottom-3 -right-3 h-24 w-24 -scale-100 text-champagne-300/80" />

          <CoupleSilhouette className="mx-auto h-20 w-32 text-champagne-700" />

          <p className="text-eyebrow mt-5 text-xs text-champagne-700">
            A Heartfelt Note
          </p>

          <p className="text-display mt-5 text-2xl font-light italic leading-relaxed text-ink md:text-[1.7rem]">
            「 愿往后岁岁年年 ，
            <br />
            我们与您 ， 都被温柔相待 。 」
          </p>

          <p className="mx-auto mt-6 max-w-md text-sm leading-8 text-ink-soft md:text-base">
            感谢一路以来的陪伴与祝福，
            <br className="md:hidden" />
            是您让我们的故事更加温暖。
            <br />
            期待与您在这个夏天再次相遇——
            <br />
            共饮一杯喜酒，共赴一程幸福。
          </p>

          <div className="mt-7 flex items-center justify-center gap-3 text-champagne-700">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-champagne-400" />
            <Heart className="h-4 w-4" />
            <span className="h-px w-12 bg-gradient-to-r from-champagne-400 to-transparent" />
          </div>

          <p className="text-display mt-5 text-base italic tracking-wider text-champagne-700 md:text-lg">
            {COUPLE.groomZh} &amp; {COUPLE.brideZh}
          </p>
        </div>
      </div>
    </section>
  );
}
