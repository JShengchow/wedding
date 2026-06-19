import features01 from "../assets/photos/features-01.webp";
import features02 from "../assets/photos/features-02.webp";
import features03 from "../assets/photos/features-03.webp";
import features04 from "../assets/photos/features-04.webp";
import gallery01 from "../assets/photos/gallery-01.webp";
import gallery02 from "../assets/photos/gallery-02.webp";
import gallery03 from "../assets/photos/gallery-03.webp";
import gallery04 from "../assets/photos/gallery-04.webp";
import gallery05 from "../assets/photos/gallery-05.webp";
import gallery06 from "../assets/photos/gallery-06.webp";
import gallery07 from "../assets/photos/gallery-07.webp";
import gallery08 from "../assets/photos/gallery-08.webp";
import gallery09 from "../assets/photos/gallery-09.webp";
import gallery10 from "../assets/photos/gallery-10.webp";
import gallery11 from "../assets/photos/gallery-11.webp";
import gallery12 from "../assets/photos/gallery-12.webp";
import gallery13 from "../assets/photos/gallery-13.webp";
import gallery14 from "../assets/photos/gallery-14.webp";
import gallery15 from "../assets/photos/gallery-15.webp";
import gallery16 from "../assets/photos/gallery-16.webp";
import gallery17 from "../assets/photos/gallery-17.webp";
import gallery18 from "../assets/photos/gallery-18.webp";
import gallery19 from "../assets/photos/gallery-19.webp";
import gallery20 from "../assets/photos/gallery-20.webp";
import gallery21 from "../assets/photos/gallery-21.webp";
import gallery22 from "../assets/photos/gallery-22.webp";
import gallery23 from "../assets/photos/gallery-23.webp";
import gallery24 from "../assets/photos/gallery-24.webp";
import hero01Cover from "../assets/photos/hero-01-cover.webp";
import kapian01 from "../assets/photos/kapian-01.webp";
import kapian02 from "../assets/photos/kapian-02.webp";
import kapian03 from "../assets/photos/kapian-03.webp";
import lunbo01 from "../assets/photos/lunbo-01.webp";
import lunbo02 from "../assets/photos/lunbo-02.webp";
import lunbo03 from "../assets/photos/lunbo-03.webp";
import lunbo04 from "../assets/photos/lunbo-04.webp";
import lunbo05 from "../assets/photos/lunbo-05.webp";
import photowall012 from "../assets/photos/photowall-012.webp";
import photowall013 from "../assets/photos/photowall-013.webp";
import photowall014 from "../assets/photos/photowall-014.webp";
import photowall015 from "../assets/photos/photowall-015.webp";
import photowall016 from "../assets/photos/photowall-016.webp";
import photowall017 from "../assets/photos/photowall-017.webp";
import story01Open from "../assets/photos/story-01-open.webp";

const galleryAssets = [
  gallery01,
  gallery02,
  gallery03,
  gallery04,
  gallery05,
  gallery06,
  gallery07,
  gallery08,
  gallery09,
  gallery10,
  gallery11,
  gallery12,
  gallery13,
  gallery14,
  gallery15,
  gallery16,
  gallery17,
  gallery18,
  gallery19,
  gallery20,
  gallery21,
  gallery22,
  gallery23,
  gallery24,
];

const featureAssets = [
  { src: features02, name: "features-01" },
  { src: features03, name: "features-02" },
  { src: features01, name: "features-03" },
  { src: features04, name: "features-04" },
];
const photoWallAssets = [
  { src: photowall017, name: "photowall-017" },
  { src: photowall012, name: "photowall-012" },
  { src: photowall013, name: "photowall-013" },
  { src: photowall014, name: "photowall-014" },
  { src: photowall015, name: "photowall-015" },
  { src: photowall016, name: "photowall-016" },
];
const polaroidAssets = [
  { src: kapian01, name: "kapian-01" },
  { src: kapian02, name: "kapian-02" },
  { src: kapian03, name: "kapian-03" },
];
const carouselAssets = [lunbo01, lunbo02, lunbo03, lunbo04, lunbo05];
const travelPhotoModules = import.meta.glob("../assets/photos/travel-*.webp", {
  eager: true,
  import: "default",
});

function getTravelPhotoSrc(name) {
  return travelPhotoModules[`../assets/photos/${name}.webp`];
}

function makeTravelPhotos(city, names) {
  return names.map((name) => ({
    src: getTravelPhotoSrc(name),
    alt: `${city}旅行回忆 ${name.replace("travel-", "")}`,
  }));
}

export const heroPhoto = hero01Cover;

export const storyPhoto = story01Open;

export const featurePhotos = featureAssets.map((photo) => ({
  src: photo.src,
  alt: `婚纱照精选 ${photo.name}`,
}));

export const photoWallPhotos = photoWallAssets.map((photo) => ({
  src: photo.src,
  alt: `照片墙 ${photo.name}`,
}));

export const polaroidPhotos = polaroidAssets.map((photo) => ({
  src: photo.src,
  alt: `卡片照片 ${photo.name}`,
}));

export const carouselPhotos = carouselAssets.map((src, index) => ({
  src,
  alt: `轮播婚纱照 ${index + 1}`,
}));

export const galleryPhotos = galleryAssets.map((src, index) => ({
  src,
  alt: `婚纱照 ${index + 1}`,
}));

export const travelPhotos = {
  xiamen: makeTravelPhotos("厦门", [
    "travel-xiamen-01",
    "travel-xiamen-02",
    "travel-xiamen-03",
    "travel-xiamen-04",
    "travel-xiamen-05",
    "travel-xiamen-06",
  ]),
  xinjiang: makeTravelPhotos("新疆", [
    "travel-xinjiang-01",
    "travel-xinjiang-02",
    "travel-xinjiang-03",
    "travel-xinjiang-04",
    "travel-xinjiang-05",
    "travel-xinjiang-06",
    "travel-xinjiang-07",
    "travel-xinjiang-08",
    "travel-xinjiang-09",
    "travel-xinjiang-10",
  ]),
  shantou: makeTravelPhotos("汕头", [
    "travel-shantou-01",
    "travel-shantou-02",
    "travel-shantou-03",
    "travel-shantou-04",
  ]),
  hongkong: makeTravelPhotos("香港", [
    "travel-hongkong-01",
    "travel-hongkong-02",
    "travel-hongkong-03",
    "travel-hongkong-04",
  ]),
  changsha: makeTravelPhotos("长沙", [
    "travel-changsha-01",
    "travel-changsha-02",
    "travel-changsha-03",
    "travel-changsha-04",
  ]),
  xian: makeTravelPhotos("西安", [
    "travel-xian-01",
    "travel-xian-02",
    "travel-xian-03",
    "travel-xian-04",
  ]),
  guizhou: makeTravelPhotos("贵州", [
    "travel-guizhou-01",
    "travel-guizhou-02",
    "travel-guizhou-03",
    "travel-guizhou-04",
    "travel-guizhou-05",
  ]),
  chengdu: makeTravelPhotos("成都", ["travel-chengdu-01"]),
  chongqing: makeTravelPhotos("重庆", [
    "travel-chongqing-01",
    "travel-chongqing-02",
    "travel-chongqing-03",
  ]),
  huizhou: makeTravelPhotos("惠州", [
    "travel-huizhou-01",
    "travel-huizhou-02",
    "travel-huizhou-03",
    "travel-huizhou-04",
    "travel-huizhou-05",
  ]),
  shenzhen: makeTravelPhotos("深圳", [
    "travel-shenzhen-01",
    "travel-shenzhen-02",
    "travel-huizhou-04",
    "travel-huizhou-05",
  ]),
};
