import { useState } from "react";
import { featurePhotos } from "../lib/photos";

export function FeaturePhotos() {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!featurePhotos.length) return null;

  return (
    <section className="px-5 pb-14 md:px-6">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {featurePhotos.map((photo, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              type="button"
              key={photo.src}
              onClick={() => setActiveIndex(index)}
              aria-pressed={isActive}
              className={`group overflow-hidden rounded-[24px] border bg-champagne-100 p-0 shadow-soft transition duration-300 active:scale-[0.985] md:rounded-[28px] ${
                isActive
                  ? "border-champagne-300 ring-2 ring-champagne-200/70"
                  : "border-champagne-100"
              }`}
              aria-label={`选中${photo.alt}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className={`aspect-[3/4] h-full w-full object-cover transition duration-300 group-active:scale-[1.015] ${
                  isActive ? "scale-[1.012]" : "scale-100"
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
