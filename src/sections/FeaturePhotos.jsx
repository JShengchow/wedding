import { featurePhotos } from "../lib/photos";

export function FeaturePhotos() {
  if (!featurePhotos.length) return null;

  return (
    <section className="px-5 pb-14 md:px-6">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {featurePhotos.map((photo) => (
          <div
            key={photo.src}
            className="overflow-hidden rounded-[24px] border border-champagne-100 bg-champagne-100 shadow-soft md:rounded-[28px]"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              className="aspect-[3/4] h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
