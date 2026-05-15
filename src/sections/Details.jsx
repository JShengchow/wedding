import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { DetailRow } from "../components/DetailRow";
import { MAP_QUERY, VENUE, WEDDING_DATE_FULL } from "../content/wedding";

export function Details() {
  return (
    <section className="px-5 pb-14 md:pb-16">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <p className="text-eyebrow mb-3 text-xs text-champagne-600">
            Ceremony Details
          </p>
          <h3 className="text-display text-3xl font-light text-ink md:text-4xl">
            婚礼信息
          </h3>
          <span className="mt-4 inline-block h-px w-16 gold-line" />
        </div>

        <div className="mt-8 rounded-[32px] border border-champagne-200/70 bg-ivory-50/90 p-8 shadow-soft backdrop-blur md:p-10">
          <div className="space-y-7">
            <DetailRow
              icon={<CalendarDays className="h-5 w-5" />}
              label="Date"
              title={WEDDING_DATE_FULL}
              subtitle="星期六 · 盛夏良辰"
            />

            <div className="h-px gold-line" />

            <DetailRow
              icon={<Clock3 className="h-5 w-5" />}
              label="Time"
              title="下午 15:00"
              subtitle="14:30 开始签到 入席"
            />

            <div className="h-px gold-line" />

            <DetailRow
              icon={<MapPin className="h-5 w-5" />}
              label="Venue"
              title={VENUE.name}
              subtitle={VENUE.address}
            />
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <a
              href={`https://uri.amap.com/search?keyword=${MAP_QUERY}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-champagne-400 to-champagne-600 px-8 py-4 text-base text-white shadow-warm transition active:scale-[0.98]"
            >
              <MapPin className="h-5 w-5" />
              打开地图导航
            </a>
            <p className="text-xs text-ink-light">
              高德 / 苹果地图均可识别 「{VENUE.shortAddress}」
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
