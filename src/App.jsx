import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  Clock3,
  Heart,
  LoaderCircle,
  MapPin,
  Music2,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { submitRsvp } from "./lib/supabase";
import heroImage from "./assets/seekiss.png";

const photoModules = import.meta.glob("./assets/*_1_105_c.jpeg", {
  eager: true,
  import: "default",
});

const localPhotos = Object.entries(photoModules)
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([, src], index) => ({
    src,
    alt: `婚纱照 ${index + 1}`,
  }));

const storyPhoto = localPhotos[12]?.src || heroImage;
const featurePhotos = [
  localPhotos[4],
  localPhotos[17],
  localPhotos[28],
  localPhotos[39],
].filter(Boolean);

const VENUE = {
  name: "深礼堂 · 后海店",
  address: "深圳市南山区南海大道 1090 号招商花园城 L5 层",
  shortAddress: "南海大道1090号 招商花园城L5",
};

const MAP_QUERY = encodeURIComponent(
  `${VENUE.name} ${VENUE.address}`,
);

const SCHEDULE = [
  { time: "14:30", title: "宾客签到", desc: "签到留念 · 入席候场" },
  { time: "15:00", title: "婚礼仪式", desc: "证婚 · 交换戒指 · 互许诺言" },
  { time: "16:00", title: "合影留念", desc: "亲友合影 · 茶歇时光" },
  { time: "17:30", title: "晚宴开席", desc: "举杯共贺 · 共享盛宴" },
  { time: "20:00", title: "甜蜜礼成", desc: "余韵悠长 · 感谢相伴" },
];

// ——— 手绘 SVG 装饰 ———

function FloralSprig({ className = "", flip = false }) {
  return (
    <svg
      viewBox="0 0 200 80"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 40 Q 60 30 110 38 T 195 42" />
        <path d="M30 40 Q 32 30 38 26" />
        <path d="M55 38 Q 58 28 66 24" />
        <path d="M80 38 Q 84 30 92 27" />
        <path d="M105 38 Q 108 30 116 28" />
        <path d="M130 39 Q 134 32 142 30" />
        <path d="M155 40 Q 159 34 167 33" />
        <path d="M40 42 Q 38 52 32 56" />
        <path d="M65 41 Q 64 52 56 56" />
        <path d="M90 41 Q 90 52 82 56" />
        <path d="M115 41 Q 116 52 108 56" />
        <path d="M140 42 Q 142 52 134 56" />
        <ellipse cx="38" cy="24" rx="4.2" ry="2.6" transform="rotate(-30 38 24)" />
        <ellipse cx="66" cy="22" rx="4.2" ry="2.6" transform="rotate(-30 66 22)" />
        <ellipse cx="92" cy="25" rx="4.2" ry="2.6" transform="rotate(-30 92 25)" />
        <ellipse cx="116" cy="26" rx="4.2" ry="2.6" transform="rotate(-25 116 26)" />
        <ellipse cx="142" cy="28" rx="4.2" ry="2.6" transform="rotate(-25 142 28)" />
        <ellipse cx="167" cy="31" rx="4" ry="2.4" transform="rotate(-20 167 31)" />
        <ellipse cx="32" cy="58" rx="4.2" ry="2.6" transform="rotate(30 32 58)" />
        <ellipse cx="56" cy="58" rx="4.2" ry="2.6" transform="rotate(30 56 58)" />
        <ellipse cx="82" cy="58" rx="4.2" ry="2.6" transform="rotate(30 82 58)" />
        <ellipse cx="108" cy="58" rx="4.2" ry="2.6" transform="rotate(30 108 58)" />
        <ellipse cx="134" cy="58" rx="4.2" ry="2.6" transform="rotate(30 134 58)" />
        <circle cx="180" cy="38" r="2.4" fill="currentColor" opacity="0.55" />
      </g>
    </svg>
  );
}

function RingsIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 80 56" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="gold-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6C77E" />
          <stop offset="55%" stopColor="#C9A961" />
          <stop offset="100%" stopColor="#8A6A35" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#gold-ring)" strokeWidth="1.8">
        <circle cx="28" cy="32" r="18" />
        <circle cx="52" cy="32" r="18" />
        <path d="M22 14 L26 8 L34 8 L30 14 Z" fill="url(#gold-ring)" />
        <path d="M46 14 L50 8 L58 8 L54 14 Z" fill="url(#gold-ring)" />
      </g>
    </svg>
  );
}

function CoupleSilhouette({ className = "" }) {
  return (
    <svg viewBox="0 0 160 110" className={className} aria-hidden="true">
      <g fill="currentColor" opacity="0.85">
        <path d="M58 36 Q56 26 64 22 Q70 18 76 22 Q82 26 80 36 Q80 42 76 46 L78 54 Q80 56 80 60 L78 64 Q80 70 78 78 L80 102 L70 102 L66 80 Q62 70 64 64 L62 60 Q62 56 64 54 L66 46 Q60 42 58 36 Z" />
        <path d="M96 38 Q94 28 102 24 Q108 20 114 24 Q120 28 118 38 Q118 44 114 48 L116 56 Q120 58 122 64 L124 76 L132 84 L130 88 L120 80 L116 84 L118 102 L108 102 L106 80 Q102 70 104 64 L102 58 Q102 54 104 52 L106 48 Q98 44 96 38 Z" />
        <circle cx="70" cy="14" r="6" />
        <circle cx="108" cy="16" r="6" />
        <path
          d="M88 32 C 85 28 78 28 76 33 C 74 38 88 48 88 48 C 88 48 102 38 100 33 C 98 28 91 28 88 32 Z"
          fill="#DD969A"
        />
      </g>
    </svg>
  );
}

function CornerFlourish({ className = "" }) {
  return (
    <svg viewBox="0 0 90 90" className={className} aria-hidden="true">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 82 Q 20 64 32 56 Q 50 46 64 40 Q 76 36 84 30" />
        <path d="M18 70 Q 14 60 18 50" />
        <path d="M32 56 Q 28 46 32 36" />
        <path d="M48 46 Q 44 38 50 28" />
        <path d="M64 40 Q 62 30 70 22" />
        <ellipse cx="20" cy="44" rx="3.6" ry="2" transform="rotate(-40 20 44)" />
        <ellipse cx="34" cy="32" rx="3.6" ry="2" transform="rotate(-40 34 32)" />
        <ellipse cx="50" cy="24" rx="3.6" ry="2" transform="rotate(-40 50 24)" />
        <ellipse cx="68" cy="18" rx="3.6" ry="2" transform="rotate(-40 68 18)" />
        <circle cx="84" cy="28" r="1.6" fill="currentColor" opacity="0.6" />
      </g>
    </svg>
  );
}

function SparkleStar({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 1 L13.6 9.2 L21.5 11 L13.6 12.8 L12 21 L10.4 12.8 L2.5 11 L10.4 9.2 Z"
        opacity="0.85"
      />
    </svg>
  );
}

function getSubmitErrorMessage(error) {
  const message = error?.message || "";

  if (/invalid api key/i.test(message)) {
    return "提交失败：数据服务密钥无效，请联系新人确认 Supabase API key。";
  }

  if (/row-level security|violates row-level security/i.test(message)) {
    return "提交失败：数据库权限还未允许公开回执写入，请检查 Supabase RLS policy。";
  }

  if (/column .* does not exist|schema cache/i.test(message)) {
    return "提交失败：数据库表字段和页面不一致，请检查 wedding_rsvp 表结构。";
  }

  return "提交暂时失败，请稍后再试，或直接联系新人确认回执。";
}

export default function WeddingInvitationH5() {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    attendance: "attend",
    guests: "1",
    message: "",
  });

  const weddingDate = useMemo(() => new Date("2026-07-18T15:00:00"), []);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const diff = weddingDate.getTime() - Date.now();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      });
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, [weddingDate]);

  useEffect(() => {
    const unlockAudio = () => {
      const audio = document.getElementById("bgm");

      if (!audio || musicPlaying) return;

      // audio
      //   .play()
      //   .then(() => setMusicPlaying(true))
      //   .catch(() => setMusicPlaying(false));
    };

    window.addEventListener("click", unlockAudio, { once: true });

    return () => window.removeEventListener("click", unlockAudio);
  }, [musicPlaying]);

  const toggleMusic = () => {
    const audio = document.getElementById("bgm");

    if (!audio) return;

    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => setMusicPlaying(true))
      .catch(() => setMusicPlaying(false));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!form.name.trim() || !form.phone.trim()) {
      setSubmitError("请填写姓名与联系电话");
      return;
    }

    try {
      setLoading(true);
      await submitRsvp({
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setSubmitError(getSubmitErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-ivory text-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-petal-radial opacity-70"
      />

      <audio
        id="bgm"
        loop
        preload="none"
        src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8e0b6f4.mp3"
      />

      <button
        type="button"
        onClick={toggleMusic}
        aria-label={musicPlaying ? "暂停音乐" : "播放音乐"}
        className="fixed right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-champagne-200 bg-ivory-50/90 text-champagne-700 shadow-soft backdrop-blur md:h-14 md:w-14"
      >
        <Music2
          className={`h-5 w-5 ${musicPlaying ? "animate-spin [animation-duration:6s]" : ""}`}
        />
      </button>

      {/* —— HERO —— */}
      <section className="relative flex min-h-[100svh] overflow-hidden">
        <img
          src={heroImage}
          alt="周健声与陈晓琪婚纱照"
          className="absolute inset-0 h-full w-full object-cover object-[48%_center] md:object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#1f1812]/35 via-[#1f1812]/10 to-ivory" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ivory via-ivory/65 to-transparent" />

        <FloralSprig className="absolute left-1/2 top-12 -translate-x-1/2 text-champagne-100/85 w-[260px] md:w-[340px]" />
        <FloralSprig
          flip
          className="absolute left-1/2 top-[110px] -translate-x-1/2 text-champagne-100/60 w-[200px] md:w-[260px]"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-between px-5 pb-12 pt-24 text-center md:px-10 md:pb-16 md:pt-28"
        >
          <div className="mx-auto w-full max-w-3xl text-white drop-shadow">
            <p className="text-eyebrow mb-3 text-[11px] text-white/90 md:text-xs">
              The Wedding of
            </p>
            <p className="text-display text-[clamp(2.6rem,13vw,5.5rem)] font-light italic leading-none">
              We Are
            </p>
            <p className="text-display mx-auto mt-2 flex max-w-[92vw] flex-col items-center text-[clamp(2.6rem,12vw,5.5rem)] font-light italic leading-[0.95] md:block">
              <span>Getting</span>
              <span className="md:ml-3">Married</span>
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="mx-auto flex w-full max-w-[min(92vw,720px)] flex-col items-center text-center"
          >
            <SparkleStar className="mb-4 h-5 w-5 text-champagne-500 animate-shimmer" />

            <div className="flex w-full flex-col items-center text-center text-ink">
              <p className="text-display w-full text-[clamp(2.1rem,10.5vw,4.25rem)] font-light leading-none tracking-wide">
                周 健 声
              </p>
              <div className="my-4 flex w-full items-center justify-center gap-3 text-champagne-600">
                <span className="h-px w-14 bg-gradient-to-r from-transparent via-champagne-400 to-transparent md:w-20" />
                <span className="text-display text-lg italic md:text-2xl">&amp;</span>
                <span className="h-px w-14 bg-gradient-to-r from-transparent via-champagne-400 to-transparent md:w-20" />
              </div>
              <p className="text-display w-full text-[clamp(2.1rem,10.5vw,4.25rem)] font-light leading-none tracking-wide">
                陈 晓 琪
              </p>
            </div>

            <p className="mt-6 inline-flex items-center gap-3 rounded-full border border-champagne-300/70 bg-ivory-50/70 px-5 py-2 text-sm text-champagne-700 backdrop-blur md:text-base">
              <CalendarDays className="h-4 w-4" />
              2026 · 07 · 18 · 周六 · 15:00
            </p>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2.4 }}
              className="mt-6 flex justify-center text-champagne-600"
            >
              <ChevronDown className="h-6 w-6 opacity-80" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* —— COUNTDOWN —— */}
      <section className="relative z-10 -mt-12 px-5 md:-mt-14 md:px-6">
        <div className="glass-card mx-auto grid max-w-3xl grid-cols-3 gap-3 rounded-[28px] p-5 text-center md:gap-5 md:rounded-[36px] md:p-8">
          {[
            { label: "DAYS", value: countdown.days, zh: "天" },
            { label: "HOURS", value: countdown.hours, zh: "时" },
            { label: "MINS", value: countdown.minutes, zh: "分" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-display text-4xl font-light text-champagne-700 md:text-5xl">
                {item.value}
              </p>
              <p className="text-eyebrow mt-2 text-[10px] text-champagne-600 md:text-xs">
                {item.label}
              </p>
              <p className="mt-0.5 text-[11px] text-ink-soft md:text-xs">
                {item.zh}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* —— INVITATION —— */}
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

      {/* —— OUR STORY —— */}
      <section className="px-5 pb-14 pt-6 md:pb-16">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2 md:gap-6">
          <div className="relative overflow-hidden rounded-[32px] border border-champagne-100 bg-ivory-50/90 p-8 shadow-soft backdrop-blur md:p-10">
            <CornerFlourish className="absolute -right-2 -top-2 h-20 w-20 text-champagne-300/70" />
            <p className="text-eyebrow mb-4 text-xs text-champagne-600">
              Our Story
            </p>
            <h3 className="text-display mb-6 text-3xl font-light leading-relaxed text-ink md:text-[2rem]">
              从相遇，到决定共度余生
            </h3>
            <p className="text-base leading-9 text-ink-soft md:text-lg">
              一杯咖啡，一段晚风，
              <br className="md:hidden" />
              从陌生人，到走进彼此的余生。
              <br />
              在岁月里相互温柔，在平凡中彼此守候——
              <br className="md:hidden" />
              这便是我们想与你分享的爱情。
            </p>
            <div className="mt-8 flex items-center justify-start gap-3 text-champagne-600">
              <RingsIcon className="h-7 w-12" />
              <span className="text-display italic text-sm tracking-wider">
                Forever &amp; Always
              </span>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-[32px] border border-champagne-100 bg-champagne-100 shadow-soft md:min-h-[400px]">
            <img
              src={storyPhoto}
              alt="我们的故事"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/50" />
          </div>
        </div>
      </section>

      {/* —— DETAILS —— */}
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
                title="2026 年 7 月 18 日"
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

      {/* —— SCHEDULE —— */}
      <section className="px-5 pb-14 md:pb-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow mb-3 text-xs text-champagne-600">
            Wedding Schedule
          </p>
          <h3 className="text-display text-3xl font-light text-ink md:text-4xl">
            当日流程
          </h3>
          <span className="mt-4 inline-block h-px w-16 gold-line" />
          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-ink-soft md:text-base">
            轻松随意 · 无需拘束，
            <br className="md:hidden" />
            欢迎您在合适的时间到场，一同共享喜悦。
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-[32px] border border-champagne-200/70 bg-ivory-50/90 p-6 shadow-soft backdrop-blur md:p-10">
          <ol className="relative space-y-7 md:space-y-8">
            <span
              aria-hidden="true"
              className="absolute left-[68px] top-2 bottom-2 w-px bg-gradient-to-b from-champagne-200 via-champagne-400/70 to-champagne-200 md:left-[88px]"
            />
            {SCHEDULE.map((item) => (
              <li key={item.time} className="relative flex items-start gap-5">
                <p className="text-display w-14 shrink-0 text-right text-2xl font-light text-champagne-700 md:w-20 md:text-3xl">
                  {item.time}
                </p>
                <span
                  aria-hidden="true"
                  className="relative mt-2 grid h-4 w-4 shrink-0 place-items-center"
                >
                  <span className="absolute inset-0 rounded-full bg-blush-100" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-gradient-to-br from-champagne-300 to-champagne-600 shadow-[0_0_0_3px_rgba(255,252,247,0.95)]" />
                </span>
                <div className="flex-1 pt-0.5">
                  <p className="text-lg font-medium text-ink md:text-xl">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-ink-soft md:text-base">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* —— MESSAGE / VOW —— */}
      <section className="relative px-5 pb-14 md:pb-20">
        <div className="mx-auto max-w-2xl">
          <div className="relative overflow-hidden rounded-[36px] border border-blush-200/70 bg-gradient-to-br from-blush-50 via-ivory-50 to-champagne-50 p-8 text-center shadow-petal md:p-12">
            <CornerFlourish className="absolute -left-3 -top-3 h-24 w-24 text-champagne-300/80" />
            <CornerFlourish
              className="absolute -bottom-3 -right-3 h-24 w-24 -scale-100 text-champagne-300/80"
            />

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
              周健声 &amp; 陈晓琪
            </p>
          </div>
        </div>
      </section>

      {/* —— RSVP —— */}
      <section className="px-5 pb-16 md:pb-20">
        <div className="mx-auto max-w-xl">
          <div className="text-center">
            <p className="text-eyebrow mb-3 text-xs text-champagne-600">
              RSVP
            </p>
            <h3 className="text-display text-3xl font-light text-ink md:text-4xl">
              宾客回执
            </h3>
            <span className="mt-4 inline-block h-px w-16 gold-line" />
            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-ink-soft">
              您的回执将帮助我们更好地安排座席与接待
            </p>
          </div>

          <div className="mt-8 rounded-[32px] border border-champagne-200/70 bg-ivory-50/95 p-6 shadow-soft backdrop-blur md:p-10">
            {submitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blush-100 to-champagne-100 ring-1 ring-champagne-200">
                  <Heart className="h-9 w-9 text-blush-500" />
                </div>
                <h3 className="text-display mb-3 text-2xl font-light text-ink md:text-3xl">
                  感谢您的回执
                </h3>
                <p className="mx-auto max-w-md text-sm leading-8 text-ink-soft md:text-base">
                  我们已经收到您的出席信息，
                  <br className="md:hidden" />
                  期待在这个夏日午后与您相见。
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSubmitError("");
                    setForm({
                      name: "",
                      phone: "",
                      attendance: "attend",
                      guests: "1",
                      message: "",
                    });
                  }}
                  className="mt-8 inline-flex items-center justify-center rounded-full border border-champagne-300 bg-white px-6 py-3 text-sm text-champagne-700 shadow-sm transition active:scale-[0.98]"
                >
                  再提交一份
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                {submitError ? (
                  <div
                    role="alert"
                    className="flex gap-3 rounded-2xl border border-blush-300 bg-blush-50 px-4 py-3 text-sm leading-6 text-blush-500"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>{submitError}</p>
                  </div>
                ) : null}

                <Field label="您的姓名">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    placeholder="请输入您的称呼"
                    autoComplete="name"
                    className="w-full rounded-2xl border border-champagne-200 bg-white px-5 py-4 text-base outline-none transition focus:border-champagne-400 focus:ring-2 focus:ring-champagne-200"
                  />
                </Field>

                <Field label="联系电话">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      setForm({ ...form, phone: event.target.value })
                    }
                    placeholder="便于新人联系"
                    autoComplete="tel"
                    inputMode="tel"
                    className="w-full rounded-2xl border border-champagne-200 bg-white px-5 py-4 text-base outline-none transition focus:border-champagne-400 focus:ring-2 focus:ring-champagne-200"
                  />
                </Field>

                <div>
                  <label className="mb-2 block text-sm text-ink-soft">
                    是否出席
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "attend", label: "出席" },
                      { value: "absent", label: "无法出席" },
                    ].map((opt) => {
                      const active = form.attendance === opt.value;
                      return (
                        <label
                          key={opt.value}
                          className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-base transition ${
                            active
                              ? "border-champagne-400 bg-gradient-to-br from-champagne-50 to-blush-50 text-champagne-700 shadow-sm"
                              : "border-champagne-200 bg-white text-ink-soft"
                          }`}
                        >
                          <input
                            type="radio"
                            name="attendance"
                            checked={active}
                            onChange={() =>
                              setForm({ ...form, attendance: opt.value })
                            }
                            className="hidden"
                          />
                          {active ? <Heart className="h-4 w-4" /> : null}
                          <span>{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <Field label="出席人数">
                  <select
                    value={form.guests}
                    onChange={(event) =>
                      setForm({ ...form, guests: event.target.value })
                    }
                    className="w-full rounded-2xl border border-champagne-200 bg-white px-5 py-4 text-base outline-none transition focus:border-champagne-400 focus:ring-2 focus:ring-champagne-200"
                  >
                    <option value="1">1 人</option>
                    <option value="2">2 人</option>
                    <option value="3">3 人</option>
                    <option value="4+">4 人及以上</option>
                  </select>
                </Field>

                <Field label="留言祝福（可选）">
                  <textarea
                    value={form.message}
                    onChange={(event) =>
                      setForm({ ...form, message: event.target.value })
                    }
                    rows={3}
                    placeholder="写下您想说的话～"
                    className="w-full resize-none rounded-2xl border border-champagne-200 bg-white px-5 py-4 text-base outline-none transition focus:border-champagne-400 focus:ring-2 focus:ring-champagne-200"
                  />
                </Field>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-champagne-400 via-champagne-500 to-champagne-600 py-4 text-base tracking-wider text-white shadow-warm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 md:text-lg"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      提交中
                    </>
                  ) : (
                    "提交回执"
                  )}
                </button>

                <p className="text-center text-xs leading-5 text-ink-light">
                  提交后将保存您的回执信息 · 仅用于本场婚礼安排
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* —— FEATURE PHOTOS —— */}
      {featurePhotos.length > 0 ? (
        <section className="px-5 pb-14 md:px-6">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {featurePhotos.map((photo, index) => (
              <div
                key={photo.src}
                className="overflow-hidden rounded-[24px] border border-champagne-100 bg-champagne-100 shadow-soft md:rounded-[28px]"
              >
                <img
                  src={photo.src}
                  alt={`精选婚纱照 ${index + 1}`}
                  loading="lazy"
                  className="aspect-[3/4] h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* —— GALLERY —— */}
      <section className="px-5 pb-20 md:px-6">
        <div className="mx-auto mb-10 max-w-5xl text-center">
          <p className="text-eyebrow mb-3 text-xs text-champagne-600">
            Gallery
          </p>
          <h3 className="text-display text-3xl font-light text-ink md:text-4xl">
            浪漫瞬间
          </h3>
          <span className="mt-4 inline-block h-px w-16 gold-line" />
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {localPhotos.slice(0, 24).map((photo, index) => (
            <figure
              key={photo.src}
              className={`overflow-hidden rounded-[22px] border border-champagne-100 bg-champagne-100 shadow-soft md:rounded-[28px] ${
                index % 7 === 0 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className={`w-full object-cover transition duration-700 hover:scale-[1.03] ${
                  index % 7 === 0
                    ? "aspect-[4/3] md:aspect-[3/4]"
                    : "aspect-[3/4]"
                }`}
              />
            </figure>
          ))}
        </div>
      </section>

      {/* —— FOOTER —— */}
      <footer className="relative px-6 pb-14 text-center text-champagne-700">
        <div className="mx-auto max-w-md">
          <FloralSprig className="mx-auto mb-4 w-44 text-champagne-400/85" />
          <Sparkles className="mx-auto mb-3 h-5 w-5 text-champagne-500" />
          <p className="text-eyebrow mb-3 text-xs">Thank You For Coming</p>
          <p className="text-display mb-2 text-xl font-light italic leading-relaxed text-ink md:text-2xl">
            愿岁月以温柔 · 待你我同行
          </p>
          <p className="text-sm leading-8 text-ink-soft">
            盛夏 · 七月十八 · 期待与您相见
          </p>
          <p className="mt-6 text-[11px] tracking-[0.3em] text-ink-light">
            ZHOU &amp; CHEN · 2026.07.18
          </p>
        </div>
      </footer>
    </div>
  );
}

function DetailRow({ icon, label, title, subtitle }) {
  return (
    <div className="flex items-start gap-4">
      <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-champagne-100 to-blush-100 text-champagne-700 ring-1 ring-champagne-200/80">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-eyebrow text-[10px] text-champagne-600 md:text-xs">
          {label}
        </p>
        <p className="mt-1 text-xl font-medium text-ink md:text-2xl">{title}</p>
        {subtitle ? (
          <p className="mt-1.5 text-sm leading-7 text-ink-soft md:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-ink-soft">{label}</label>
      {children}
    </div>
  );
}
