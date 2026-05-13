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

  const weddingDate = useMemo(() => new Date("2025-07-18T15:00:00"), []);
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

      audio
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => setMusicPlaying(false));
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
    <div className="min-h-screen bg-[#f7f5ef] text-[#6b7157] overflow-hidden relative">
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
        className="fixed top-5 right-5 z-50 w-14 h-14 rounded-full bg-white/85 backdrop-blur border border-white shadow-xl flex items-center justify-center"
      >
        <Music2 className={`w-5 h-5 ${musicPlaying ? "animate-spin" : ""}`} />
      </button>

      <section className="relative flex min-h-[100svh] overflow-hidden bg-[#b9c3a1]">
        <img
          src={heroImage}
          alt="陈晓琪与周健声婚纱照"
          className="absolute inset-0 h-full w-full object-cover object-[48%_center] md:object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/5 to-[#f7f5ef]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#f7f5ef] via-[#f7f5ef]/45 to-transparent" />

        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-between px-5 pb-10 pt-16 text-center md:px-10 md:pb-14"
        >
          <div className="mx-auto w-full max-w-3xl text-white drop-shadow-md">
            <p className="mb-4 text-xs tracking-[0.32em] text-white/90 md:text-sm">
              WEDDING PARTY
            </p>

            <p className="text-[clamp(2.5rem,13vw,5.5rem)] font-light italic leading-none">
              We Are
            </p>

            <p className="mx-auto mt-3 flex max-w-[92vw] flex-col items-center text-[clamp(2.6rem,12vw,5.75rem)] font-light leading-[0.95] md:block">
              <span>Getting</span>
              <span className="md:ml-3">Married</span>
            </p>
          </div>

          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.2 }}
            className="mx-auto flex w-full max-w-[min(92vw,720px)] flex-col items-center text-center text-[#687053] md:text-white md:drop-shadow-md"
          >
            <div className="flex w-full flex-col items-center text-center">
              <p className="w-full text-center text-[clamp(2.35rem,12vw,5rem)] font-light leading-none">
                陈晓琪
              </p>
              <div className="my-3 flex w-full items-center justify-center gap-4 text-sm tracking-[0.28em] text-[#929976] md:text-white/90">
                <span className="h-px w-16 bg-current/45" />
                <span>&amp;</span>
                <span className="h-px w-16 bg-current/45" />
              </div>
              <p className="w-full text-center text-[clamp(2.35rem,12vw,5rem)] font-light leading-none">
                周健声
              </p>
            </div>

            <p className="mt-5 text-sm tracking-[0.22em] text-[#7f8766] md:text-lg md:text-white/95">
              2025.07.18 · 15:00
            </p>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-8 flex justify-center text-[#899169] md:text-white"
            >
              <ChevronDown className="h-7 w-7 opacity-80" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative z-10 -mt-8 px-5 md:-mt-10 md:px-6">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-3 rounded-3xl border border-white/70 bg-white/80 p-5 text-center shadow-2xl backdrop-blur-xl md:gap-5 md:rounded-[36px] md:p-8">
          <div>
            <p className="text-3xl font-light md:text-4xl">{countdown.days}</p>
            <p className="mt-2 text-[0.65rem] tracking-[0.24em] md:text-xs md:tracking-[0.3em]">
              DAYS
            </p>
          </div>

          <div>
            <p className="text-3xl font-light md:text-4xl">{countdown.hours}</p>
            <p className="mt-2 text-[0.65rem] tracking-[0.24em] md:text-xs md:tracking-[0.3em]">
              HOURS
            </p>
          </div>

          <div>
            <p className="text-3xl font-light md:text-4xl">
              {countdown.minutes}
            </p>
            <p className="mt-2 text-[0.65rem] tracking-[0.24em] md:text-xs md:tracking-[0.3em]">
              MINS
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 text-center max-w-3xl mx-auto relative z-10">
        <p className="text-sm tracking-[0.3em] uppercase mb-6 text-[#9aa182]">
          Invitation
        </p>

        <h3 className="text-3xl md:text-4xl mb-6 leading-relaxed font-light">
          诚邀您见证我们的幸福
        </h3>

        <p className="leading-8 text-base text-[#7d8467]">
          我们将在夏日草坪与海风之间，举办一场轻松而温柔的婚礼派对。
          希望最重要的你，也能来到现场，与我们一起分享这份喜悦与浪漫。
        </p>
      </section>

      <section className="px-5 pb-14">
        <div className="mx-auto mb-14 grid max-w-5xl gap-5 md:mb-16 md:grid-cols-2 md:gap-6">
          <div className="bg-white/75 backdrop-blur rounded-[32px] p-8 border border-white/60 shadow-lg">
            <p className="text-sm tracking-[0.3em] uppercase text-[#9aa182] mb-5">
              Our Story
            </p>

            <h3 className="text-3xl mb-6 font-light leading-relaxed">
              从相遇，到决定共度余生
            </h3>

            <p className="leading-8 text-[#7d8467]">
              我们想把关于爱的温柔、海风、花草、晚霞与夏天，全部留在这一天。
              希望你也能来到这里，陪我们一起收藏这份幸福。
            </p>
          </div>

          <div className="min-h-[320px] overflow-hidden rounded-[32px] bg-[#cfd6b8] shadow-lg md:min-h-[360px]">
            <img
              src={storyPhoto}
              alt="我们的故事"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="max-w-xl mx-auto bg-white/80 backdrop-blur rounded-[32px] shadow-sm border border-[#e7e4d9] p-8">
          <div className="space-y-8">
            <div className="flex gap-4">
              <CalendarDays className="w-6 h-6 mt-1 text-[#9aa182]" />
              <div>
                <p className="text-xs tracking-[0.3em] uppercase mb-2 text-[#9aa182]">
                  Date
                </p>
                <p className="text-2xl">2025 年 7 月 18 日 星期五</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock3 className="w-6 h-6 mt-1 text-[#9aa182]" />
              <div>
                <p className="text-xs tracking-[0.3em] uppercase mb-2 text-[#9aa182]">
                  Time
                </p>
                <p className="text-2xl">15:00 PM</p>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="w-6 h-6 mt-1 text-[#9aa182]" />
              <div>
                <p className="text-xs tracking-[0.3em] uppercase mb-2 text-[#9aa182]">
                  Location
                </p>
                <p className="text-2xl mb-2">深圳深礼堂后海店</p>
                <p className="text-sm text-[#909777] leading-7">
                  深圳市南山区后海滨路东滨路3366号
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <a
              href="https://maps.apple.com/?q=深圳深礼堂后海店"
              className="inline-flex items-center gap-2 bg-[#aab48c] text-white px-8 py-4 rounded-full shadow-lg"
            >
              <MapPin className="w-5 h-5" />
              打开地图导航
            </a>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="max-w-xl mx-auto bg-[#fdfcf8] border border-[#ebe7dc] rounded-[32px] p-8 shadow-sm">
          <div className="text-center mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-[#9aa182] mb-3">
              RSVP
            </p>
            <h3 className="text-3xl font-light">宾客回执</h3>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <div className="w-24 h-24 rounded-full bg-[#eef2e4] mx-auto flex items-center justify-center mb-6">
                <Heart className="w-10 h-10" />
              </div>

              <h3 className="text-3xl mb-4 font-light">感谢您的回执</h3>

              <p className="leading-8 text-[#8c9375] max-w-md mx-auto">
                我们已经收到您的出席信息，期待在这个夏日午后与您相见。
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
                className="mt-8 inline-flex items-center justify-center rounded-full border border-[#d8d4c8] bg-white px-6 py-3 text-sm text-[#6b7157] shadow-sm"
              >
                再提交一份
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {submitError ? (
                <div
                  role="alert"
                  className="flex gap-3 rounded-2xl border border-[#e1b8a8] bg-[#fff6f1] px-4 py-3 text-sm leading-6 text-[#9a604c]"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>{submitError}</p>
                </div>
              ) : null}

              <div>
                <label className="block mb-2 text-sm">您的姓名</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="请输入姓名"
                  autoComplete="name"
                  className="w-full rounded-2xl border border-[#d8d4c8] bg-white px-5 py-4 outline-none focus:ring-2 focus:ring-[#cfd6b8]"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">联系电话</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                  placeholder="请输入手机号"
                  autoComplete="tel"
                  inputMode="tel"
                  className="w-full rounded-2xl border border-[#d8d4c8] bg-white px-5 py-4 outline-none focus:ring-2 focus:ring-[#cfd6b8]"
                />
              </div>

              <div>
                <label className="block mb-3 text-sm">是否出席</label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="border border-[#d8d4c8] rounded-2xl p-4 flex items-center gap-3 bg-white cursor-pointer">
                    <input
                      type="radio"
                      name="attendance"
                      checked={form.attendance === "attend"}
                      onChange={() => setForm({ ...form, attendance: "attend" })}
                    />
                    <span>出席</span>
                  </label>

                  <label className="border border-[#d8d4c8] rounded-2xl p-4 flex items-center gap-3 bg-white cursor-pointer">
                    <input
                      type="radio"
                      name="attendance"
                      checked={form.attendance === "absent"}
                      onChange={() => setForm({ ...form, attendance: "absent" })}
                    />
                    <span>无法出席</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm">出席人数</label>
                <select
                  value={form.guests}
                  onChange={(event) =>
                    setForm({ ...form, guests: event.target.value })
                  }
                  className="w-full rounded-2xl border border-[#d8d4c8] bg-white px-5 py-4 outline-none focus:ring-2 focus:ring-[#cfd6b8]"
                >
                  <option value="1">1 人</option>
                  <option value="2">2 人</option>
                  <option value="3">3 人</option>
                  <option value="4+">4 人及以上</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm">留言祝福（可选）</label>
                <textarea
                  value={form.message}
                  onChange={(event) =>
                    setForm({ ...form, message: event.target.value })
                  }
                  rows={4}
                  placeholder="写下你的祝福吧～"
                  className="w-full rounded-2xl border border-[#d8d4c8] bg-white px-5 py-4 outline-none resize-none focus:ring-2 focus:ring-[#cfd6b8]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#aab48c] text-white py-4 text-lg tracking-wider shadow-lg shadow-[#aab48c]/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
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

              <p className="text-center text-xs leading-5 text-[#a2a78f]">
                提交后将保存您的回执信息，便于新人安排座席与接待。
              </p>
            </form>
          )}
        </div>
      </section>

      {featurePhotos.length > 0 ? (
        <section className="px-5 pb-16 md:px-6">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {featurePhotos.map((photo, index) => (
              <div
                key={photo.src}
                className="overflow-hidden rounded-[24px] bg-[#dfe6d1] shadow-lg md:rounded-[28px]"
              >
                <img
                  src={photo.src}
                  alt={`精选婚纱照 ${index + 1}`}
                  loading="lazy"
                  className="aspect-[3/4] h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="px-5 pb-20 md:px-6">
        <div className="mx-auto mb-10 max-w-5xl text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-[#9aa182] mb-4">
            Gallery
          </p>

          <h3 className="text-3xl font-light md:text-4xl">
            关于我们的浪漫瞬间
          </h3>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {localPhotos.slice(0, 30).map((photo, index) => (
            <figure
              key={photo.src}
              className={`overflow-hidden rounded-[22px] bg-[#dfe6d1] shadow-lg md:rounded-[28px] ${
                index % 7 === 0 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className={`w-full object-cover ${
                  index % 7 === 0 ? "aspect-[4/3] md:aspect-[3/4]" : "aspect-[3/4]"
                }`}
              />
            </figure>
          ))}
        </div>
      </section>

      <footer className="pb-14 text-center text-[#9aa182] px-6">
        <Sparkles className="w-6 h-6 mx-auto mb-4" />
        <p className="text-sm tracking-[0.25em] uppercase mb-4">
          Thank You For Coming
        </p>

        <p className="leading-8 text-sm max-w-lg mx-auto">
          我们期待在这个盛夏，与你共同度过一个温柔、浪漫、值得珍藏的午后。
        </p>
      </footer>
    </div>
  );
}
