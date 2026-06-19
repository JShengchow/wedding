import { useEffect, useMemo, useState } from "react";
import chinaNationUrl from "cn-atlas/nation.json?url";
import { Camera, Heart, MapPin, Navigation, Sparkles } from "lucide-react";
import { travelPhotos } from "../lib/photos";

const MAP_W = 820;
const MAP_H = 760;
const MAP_PADDING = 128;

const CITY_MEMORIES = [
  {
    city: "厦门",
    province: "Fujian",
    visitedAt: "2023.03",
    note: "海风里的第一站",
    desc: "把初春交给海边，慢慢走过老街、岛屿和被风吹亮的傍晚。",
    coords: [118.0894, 24.4798],
    offset: { x: 14, y: -8 },
    labelPoint: { x: 694, y: 392 },
    photoKey: "xiamen",
  },
  {
    city: "新疆",
    province: "Xinjiang",
    visitedAt: "2025.08 · 2026.02",
    note: "把远方走成辽阔",
    desc: "夏天和冬天都去过一次，同一片辽阔换了颜色，也让我们多了一份新的约定。",
    coords: [87.6168, 43.8256],
    offset: { x: -12, y: -6 },
    labelPoint: { x: 92, y: 160 },
    photoKey: "xinjiang",
  },
  {
    city: "汕头",
    province: "Guangdong",
    visitedAt: "2023.05",
    note: "鲜甜的一座城",
    desc: "一顿饭、一阵风、一条小路，都带着属于潮汕的热闹和温柔。",
    coords: [116.6819, 23.3541],
    offset: { x: -18, y: 0 },
    labelPoint: { x: 706, y: 462 },
    photoKey: "shantou",
  },
  {
    city: "香港",
    province: "Hong Kong",
    visitedAt: "2023.08",
    note: "维港夜色和你",
    desc: "人潮、灯光和叮叮车都很快，只有牵着的手让时间慢下来。",
    coords: [114.1694, 22.3193],
    offset: { x: 26, y: 16 },
    labelPoint: { x: 700, y: 532 },
    photoKey: "hongkong",
  },
  {
    city: "长沙",
    province: "Hunan",
    visitedAt: "2023.12",
    note: "把快乐吃进晚风里",
    desc: "奶茶、夜市和冬天的热气，都是我们收藏过的甜味坐标。",
    coords: [112.9388, 28.2282],
    labelPoint: { x: 690, y: 306 },
    photoKey: "changsha",
  },
  {
    city: "西安",
    province: "Shaanxi",
    visitedAt: "2024.02",
    note: "古城墙下慢慢散步",
    desc: "钟声、灯火和长街，把普通的一晚变得很有纪念意义。",
    coords: [108.9398, 34.3416],
    labelPoint: { x: 116, y: 286 },
    photoKey: "xian",
  },
  {
    city: "贵州",
    province: "Guizhou",
    visitedAt: "2024.06",
    note: "山水把夏天放慢",
    desc: "把视线交给群山和云雾，也把赶路的日子过成一起冒险。",
    coords: [106.7135, 26.5783],
    labelPoint: { x: 126, y: 508 },
    photoKey: "guizhou",
  },
  {
    city: "成都",
    province: "Sichuan",
    visitedAt: "2024.07",
    note: "松弛的日子很像你",
    desc: "在成都的慢节奏里吃饭、散步、聊天，把赶路变成很舒服的日常。",
    coords: [104.0668, 30.5728],
    labelPoint: { x: 112, y: 392 },
    photoKey: "chengdu",
  },
  {
    city: "重庆",
    province: "Chongqing",
    visitedAt: "2024.07",
    note: "山城的灯亮起来",
    desc: "在重庆的坡道、江风和灯火里，热烈地记住了那几天。",
    coords: [106.5516, 29.563],
    labelPoint: { x: 124, y: 454 },
    photoKey: "chongqing",
  },
  {
    city: "惠州",
    province: "Guangdong",
    visitedAt: "2025.07",
    note: "南方傍晚刚刚好",
    desc: "海边和晚霞都很近，把短途出发也过成了小小旅行。",
    coords: [114.4168, 23.1115],
    offset: { x: 18, y: -4 },
    labelPoint: { x: 604, y: 660 },
    photoKey: "huizhou",
  },
  {
    city: "深圳",
    province: "Guangdong",
    visitedAt: "Home Base",
    note: "把日子慢慢过成家",
    desc: "旅行会出发，也会回到这里。更多细碎、真实、长久的生活轨迹，都在深圳慢慢发生。",
    coords: [114.0579, 22.5431],
    offset: { x: 34, y: 8 },
    labelPoint: { x: 720, y: 620 },
    photoKey: "shenzhen",
    isHome: true,
  },
];

const SHENZHEN_STORY = [
  {
    title: "日常落脚",
    desc: "下班后的晚饭、周末的散步，慢慢把城市过成我们的家。",
  },
  {
    title: "朋友与家人",
    desc: "许多见面、聚餐和祝福，都在这里有了具体的声音。",
  },
  {
    title: "晚霞路线",
    desc: "从海边到街角，很多没有计划的傍晚，反而最像生活。",
  },
  {
    title: "婚礼起点",
    desc: "最后回到深圳，把一路走来的故事，认真交给未来。",
  },
];

function getFeatures(data) {
  if (data.type === "FeatureCollection") return data.features || [];
  if (data.type === "Feature") return [data];
  return [{ type: "Feature", geometry: data, properties: {} }];
}

function visitCoordinates(coordinates, callback) {
  if (!Array.isArray(coordinates)) return;
  if (typeof coordinates[0] === "number" && typeof coordinates[1] === "number") {
    callback(coordinates);
    return;
  }
  coordinates.forEach((item) => visitCoordinates(item, callback));
}

function createProjection(features) {
  const bounds = {
    minLon: Infinity,
    maxLon: -Infinity,
    minLat: Infinity,
    maxLat: -Infinity,
  };

  features.forEach((feature) => {
    visitCoordinates(feature.geometry?.coordinates, ([lon, lat]) => {
      bounds.minLon = Math.min(bounds.minLon, lon);
      bounds.maxLon = Math.max(bounds.maxLon, lon);
      bounds.minLat = Math.min(bounds.minLat, lat);
      bounds.maxLat = Math.max(bounds.maxLat, lat);
    });
  });

  const width = bounds.maxLon - bounds.minLon;
  const height = bounds.maxLat - bounds.minLat;
  const scale = Math.min(
    (MAP_W - MAP_PADDING * 2) / width,
    (MAP_H - MAP_PADDING * 2) / height,
  );
  const xOffset = (MAP_W - width * scale) / 2;
  const yOffset = (MAP_H - height * scale) / 2;

  return ([lon, lat], offset = { x: 0, y: 0 }) => {
    const x = xOffset + (lon - bounds.minLon) * scale + (offset.x || 0);
    const y = yOffset + (bounds.maxLat - lat) * scale + (offset.y || 0);
    return { x, y };
  };
}

function ringToPath(ring, project) {
  return ring
    .map((coordinate, index) => {
      const { x, y } = project(coordinate);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ")
    .concat(" Z");
}

function geometryToPath(geometry, project) {
  if (!geometry) return "";

  if (geometry.type === "Polygon") {
    return geometry.coordinates.map((ring) => ringToPath(ring, project)).join(" ");
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .flatMap((polygon) => polygon.map((ring) => ringToPath(ring, project)))
      .join(" ");
  }

  if (geometry.type === "GeometryCollection") {
    return geometry.geometries.map((item) => geometryToPath(item, project)).join(" ");
  }

  return "";
}

function buildRoutePath(cities) {
  return cities
    .map((city, index) => `${index === 0 ? "M" : "L"} ${city.point.x} ${city.point.y}`)
    .join(" ");
}

function buildMapModel(chinaData) {
  const features = getFeatures(chinaData);
  const projectToMap = createProjection(features);
  const chinaPath = features
    .map((feature) => geometryToPath(feature.geometry, projectToMap))
    .join(" ");
  const cityPoints = CITY_MEMORIES.map((city) => ({
    ...city,
    point: projectToMap(city.coords, city.offset),
    labelPoint: city.labelPoint,
  }));

  return { chinaPath, cityPoints };
}

export function MemoryMap() {
  const [mapModel, setMapModel] = useState(null);
  const [activeCityIndex, setActiveCityIndex] = useState(CITY_MEMORIES.length - 1);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      const response = await fetch(chinaNationUrl);
      const chinaData = await response.json();
      if (!cancelled) {
        setMapModel(buildMapModel(chinaData));
      }
    }

    loadMap().catch((error) => {
      console.error("Failed to load China map data", error);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const cityPoints = useMemo(() => mapModel?.cityPoints || [], [mapModel]);
  const routePath = useMemo(() => buildRoutePath(cityPoints), [cityPoints]);
  const activeCity =
    cityPoints[activeCityIndex] ||
    CITY_MEMORIES[activeCityIndex] ||
    CITY_MEMORIES[0];
  const activePhotos = travelPhotos[activeCity.photoKey] || travelPhotos.xiamen;
  const activePhoto = activePhotos[activePhotoIndex] || activePhotos[0];

  function handleSelectCity(index) {
    setActiveCityIndex(index);
    setActivePhotoIndex(0);
  }

  return (
    <div className="memory-map">
      <header className="flex flex-col gap-2 text-center md:items-center">
        <p className="text-eyebrow text-[10px] text-champagne-600 md:text-xs">
          Love Map
        </p>
        <p className="text-xl text-ink md:text-2xl">一起走过的中国</p>
        <p className="mx-auto max-w-xl text-sm leading-7 text-ink-soft md:text-base">
          旅行坐标一路亮起，最后回到深圳。点击城市或省份，查看那一站的照片与片段。
        </p>
      </header>

      <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-[1.12fr_0.88fr] md:gap-5">
        <div className="relative overflow-hidden rounded-[28px] border border-champagne-200/70 bg-gradient-to-br from-white/85 via-ivory-50/90 to-blush-50/45 p-4 shadow-sm md:p-6">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-12 top-8 h-44 w-44 rounded-full bg-blush-200/35 blur-3xl"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 bottom-6 h-52 w-52 rounded-full bg-champagne-200/45 blur-3xl"
          />

          <div className="relative">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-champagne-200/80 bg-white/75 px-3 py-1.5 text-[10px] tracking-[0.22em] text-champagne-700 backdrop-blur">
                <Navigation className="h-3.5 w-3.5" />
                TRAVEL STOPS · HOME
              </span>
              <span className="text-[11px] leading-5 text-ink-light">
                周边标签 · 连线指引
              </span>
            </div>

            <div className="memory-map-stage relative aspect-[82/76]">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="中国地图形式的旅行回忆坐标"
              >
                <defs>
                  <linearGradient id="memoryMapLand" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgb(var(--c-ivory-50))" />
                    <stop offset="48%" stopColor="rgb(var(--c-champagne-100))" />
                    <stop offset="100%" stopColor="rgb(var(--c-blush-100))" />
                  </linearGradient>
                  <linearGradient id="memoryMapStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgb(var(--c-champagne-300))" />
                    <stop offset="55%" stopColor="rgb(var(--c-blush-400))" />
                    <stop offset="100%" stopColor="rgb(var(--c-champagne-600))" />
                  </linearGradient>
                  <filter id="memoryMapGlow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feColorMatrix
                      in="blur"
                      type="matrix"
                      values="1 0 0 0 0.78 0 1 0 0 0.48 0 0 1 0 0.48 0 0 0 0.45 0"
                    />
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {mapModel ? (
                  <>
                    <path
                      d={mapModel.chinaPath}
                      fill="url(#memoryMapLand)"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      stroke="rgb(var(--c-champagne-400) / 0.58)"
                      strokeWidth="1.15"
                      className="memory-map-land"
                    />
                    <path
                      d={mapModel.chinaPath}
                      fill="none"
                      stroke="rgb(var(--c-ivory-50) / 0.72)"
                      strokeWidth="4"
                      opacity="0.28"
                    />
                  </>
                ) : (
                  <rect
                    x="120"
                    y="120"
                    width="580"
                    height="360"
                    rx="180"
                    fill="rgb(var(--c-champagne-100) / 0.46)"
                    stroke="rgb(var(--c-champagne-300) / 0.32)"
                    strokeDasharray="8 10"
                  />
                )}

                {mapModel ? (
                  <>
                    <path
                      d={routePath}
                      fill="none"
                      stroke="rgb(var(--c-blush-300) / 0.34)"
                      strokeWidth="13"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#memoryMapGlow)"
                    />
                    <path
                      d={routePath}
                      fill="none"
                      stroke="url(#memoryMapStroke)"
                      strokeWidth="2.2"
                      strokeDasharray="5 10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="memory-map-route"
                    />
                  </>
                ) : null}

                {cityPoints.map((city, index) => {
                  const isActive = index === activeCityIndex;
                  return (
                    <path
                      key={`guide-${city.city}`}
                      d={`M ${city.point.x} ${city.point.y} L ${city.labelPoint.x} ${city.labelPoint.y}`}
                      fill="none"
                      stroke={
                        isActive
                          ? "rgb(var(--c-blush-500) / 0.72)"
                          : "rgb(var(--c-champagne-500) / 0.34)"
                      }
                      strokeWidth={isActive ? "1.8" : "1.1"}
                      strokeLinecap="round"
                      strokeDasharray={isActive ? "0" : "3 8"}
                      className="memory-map-callout-line"
                    />
                  );
                })}

                {cityPoints.map((city, index) => {
                  const isActive = index === activeCityIndex;
                  return (
                    <g key={`pin-${city.city}`} className="memory-map-node">
                      {isActive ? (
                        <circle
                          cx={city.point.x}
                          cy={city.point.y}
                          r="24"
                          fill="rgb(var(--c-blush-400))"
                          opacity="0.18"
                        />
                      ) : null}
                      <circle
                        cx={city.point.x}
                        cy={city.point.y}
                        r={isActive ? 10 : 7}
                        fill="rgb(var(--c-ivory-50))"
                        stroke={
                          city.isHome
                            ? "rgb(var(--c-blush-500))"
                            : "rgb(var(--c-champagne-600))"
                        }
                        strokeWidth="2"
                      />
                      <circle
                        cx={city.point.x}
                        cy={city.point.y}
                        r={isActive ? 4.5 : 3}
                        fill={
                          city.isHome
                            ? "rgb(var(--c-blush-500))"
                            : "rgb(var(--c-champagne-600))"
                        }
                      />
                    </g>
                  );
                })}
              </svg>

              {cityPoints.map((city, index) => {
                const isActive = index === activeCityIndex;
                return (
                  <button
                    key={city.city}
                    type="button"
                    onClick={() => handleSelectCity(index)}
                    aria-pressed={isActive}
                    aria-label={`查看 ${city.city} 的旅行照片`}
                    className={`memory-map-pin ${isActive ? "is-active" : ""}`}
                    style={{
                      left: `${(city.labelPoint.x / MAP_W) * 100}%`,
                      top: `${(city.labelPoint.y / MAP_H) * 100}%`,
                    }}
                  >
                    <span className="memory-map-pin-dot" aria-hidden="true" />
                    <span className="memory-map-pin-label">{city.city}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <article className="overflow-hidden rounded-[28px] border border-champagne-200/70 bg-white/78 shadow-sm backdrop-blur">
          <figure className="relative aspect-[4/3] overflow-hidden bg-champagne-100">
            <img
              key={`${activeCity.city}-${activePhoto.src}`}
              src={activePhoto.src}
              alt={`${activePhoto.alt}，${activeCity.city}旅行回忆`}
              loading="lazy"
              decoding="async"
              className="memory-photo h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/56 via-black/10 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-eyebrow text-[10px] tracking-[0.34em] text-white/75">
                {activeCity.province} · {activeCity.visitedAt}
              </p>
              <p className="mt-2 flex items-center gap-2 text-display text-3xl font-light leading-none md:text-4xl">
                <MapPin className="h-5 w-5 text-blush-100" />
                {activeCity.city}
              </p>
            </figcaption>
          </figure>

          <div className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-2 text-champagne-700">
                  {activeCity.isHome ? (
                    <Heart className="h-4 w-4 fill-current" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span className="text-eyebrow text-[10px] md:text-[11px]">
                    {activeCity.isHome ? "Home Base" : "Travel Memory"}
                  </span>
                </p>
                <p className="mt-2 text-xl text-ink md:text-2xl">
                  {activeCity.note}
                </p>
              </div>
              <span className="rounded-full border border-champagne-200/80 bg-ivory-50 px-3 py-1 text-[10px] tracking-[0.22em] text-champagne-700">
                {activeCity.isHome ? "HOME BASE" : "MEMORY STOP"}
              </span>
            </div>

            <p className="mt-3 text-sm leading-7 text-ink-soft md:text-base">
              {activeCity.desc}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {activePhotos.map((photo, index) => (
                <button
                  key={`${activeCity.city}-thumb-${photo.src}`}
                  type="button"
                  onClick={() => setActivePhotoIndex(index)}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-champagne-100 bg-champagne-100"
                  aria-label={`查看 ${activeCity.city} 的缩略照片`}
                >
                  <img
                    src={photo.src}
                    alt={`${photo.alt}，${activeCity.city}照片`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-white/82 text-[10px] text-champagne-700 backdrop-blur">
                    <Camera className="h-3 w-3" />
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2">
              {CITY_MEMORIES.map((city, index) => (
                <button
                  key={`pip-${city.city}`}
                  type="button"
                  onClick={() => handleSelectCity(index)}
                  aria-label={`切换到 ${city.city}`}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeCityIndex
                      ? "w-8 bg-gradient-to-r from-champagne-400 via-blush-400 to-champagne-500"
                      : "w-2.5 bg-champagne-200 hover:bg-champagne-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </article>
      </div>

      <article className="mt-4 overflow-hidden rounded-[28px] border border-champagne-200/70 bg-gradient-to-r from-white/82 via-ivory-50/88 to-blush-50/45 p-5 shadow-sm md:mt-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <p className="inline-flex items-center gap-2 text-champagne-700">
              <Heart className="h-4 w-4 fill-current" />
              <span className="text-eyebrow text-[10px] md:text-[11px]">
                Shenzhen Storyline
              </span>
            </p>
            <p className="mt-2 text-xl text-ink md:text-2xl">深圳 · 把日子过成家</p>
            <p className="mt-2 text-sm leading-7 text-ink-soft">
              旅行地图记录远方，深圳这一条线记录生活本身：更多见面、晚霞、朋友和未来，都在这里慢慢长出来。
            </p>
          </div>
        </div>

        <ol className="mt-5 grid gap-3 md:grid-cols-4">
          {SHENZHEN_STORY.map((item) => (
            <li
              key={item.title}
              className="relative rounded-2xl border border-champagne-100/80 bg-white/65 p-4"
            >
              <span
                aria-hidden="true"
                className="block h-1 w-8 rounded-full bg-gradient-to-r from-champagne-300 to-blush-300"
              />
              <p className="mt-2 text-base text-ink">{item.title}</p>
              <p className="mt-1.5 text-xs leading-6 text-ink-light">{item.desc}</p>
            </li>
          ))}
        </ol>
      </article>
    </div>
  );
}
