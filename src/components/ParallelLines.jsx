import { COUPLE } from "../content/wedding";
import { parallelPhotos } from "../lib/photos";

function ChildhoodPortrait({ src, alt }) {
  return (
    <div className="h-[clamp(7.5rem,28vw,9.5rem)] w-[clamp(7.5rem,28vw,9.5rem)] shrink-0 rounded-full border border-blush-400/80 bg-ivory p-[clamp(0.3rem,1.6vw,0.45rem)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.65)]">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full rounded-full object-cover object-center"
      />
    </div>
  );
}

export function ParallelLines() {
  return (
    <div className="mx-auto grid w-full max-w-md grid-cols-2 justify-items-center gap-x-4 md:max-w-lg md:gap-x-10">
      <ChildhoodPortrait
        src={parallelPhotos.groom}
        alt={`${COUPLE.groomZh}童年照`}
      />
      <ChildhoodPortrait
        src={parallelPhotos.bride}
        alt={`${COUPLE.brideZh}童年照`}
      />
    </div>
  );
}
