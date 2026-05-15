import { galleryPhotos } from "../lib/photos";

export function Gallery() {
  return (
    <section className="px-5 pb-20 md:px-6">
      <div className="mx-auto mb-10 max-w-5xl text-center">
        <p className="text-eyebrow mb-3 text-xs text-champagne-600">Gallery</p>
        <h3 className="text-display text-3xl font-light text-ink md:text-4xl">
          浪漫瞬间
        </h3>
        <span className="mt-4 inline-block h-px w-16 gold-line" />
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {galleryPhotos.map((photo, index) => {
          const isWide = index % 7 === 0;
          return (
            <figure
              key={photo.src}
              className={`overflow-hidden rounded-[22px] border border-champagne-100 bg-champagne-100 shadow-soft md:rounded-[28px] ${
                isWide ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className={`w-full object-cover transition duration-700 hover:scale-[1.03] ${
                  isWide ? "aspect-[4/3] md:aspect-[3/4]" : "aspect-[3/4]"
                }`}
              />
            </figure>
          );
        })}
      </div>
    </section>
  );
}
