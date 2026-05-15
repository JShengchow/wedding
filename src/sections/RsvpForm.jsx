import { useRef, useState } from "react";
import { AlertCircle, Heart, LoaderCircle } from "lucide-react";
import { Field } from "../components/Field";
import { submitRsvp } from "../lib/supabase";

const INITIAL_FORM = {
  name: "",
  phone: "",
  attendance: "attend",
  guests: "1",
  message: "",
  hp: "",
};

const ATTENDANCE_OPTIONS = [
  { value: "attend", label: "出席" },
  { value: "absent", label: "无法出席" },
];

const GUEST_OPTIONS = [
  { value: "1", label: "1 人" },
  { value: "2", label: "2 人" },
  { value: "3", label: "3 人" },
  { value: "4+", label: "4 人及以上" },
];

const SUBMIT_THROTTLE_MS = 10 * 1000;

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

  if (/check constraint|violates check/i.test(message)) {
    return "提交失败：内容超出限制，请检查姓名 / 手机号 / 留言长度。";
  }

  return "提交暂时失败，请稍后再试，或直接联系新人确认回执。";
}

export function RsvpForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const lastSubmittedAt = useRef(0);

  const updateField = (key) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setAttendance = (value) => {
    setForm((prev) => ({ ...prev, attendance: value }));
  };

  const reset = () => {
    setSubmitted(false);
    setSubmitError("");
    setForm(INITIAL_FORM);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (form.hp) {
      setSubmitted(true);
      return;
    }

    const now = Date.now();
    if (now - lastSubmittedAt.current < SUBMIT_THROTTLE_MS) {
      return;
    }

    if (!form.name.trim() || !form.phone.trim()) {
      setSubmitError("请填写姓名与联系电话");
      return;
    }

    const isAbsent = form.attendance === "absent";

    try {
      setLoading(true);
      await submitRsvp({
        name: form.name.trim(),
        phone: form.phone.trim(),
        attendance: form.attendance,
        guests: isAbsent ? "0" : form.guests,
        message: form.message,
      });
      lastSubmittedAt.current = Date.now();
      setSubmitted(true);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }
      setSubmitError(getSubmitErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const isAbsent = form.attendance === "absent";

  return (
    <section className="px-5 pb-16 md:pb-20">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <p className="text-eyebrow mb-3 text-xs text-champagne-600">RSVP</p>
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
                onClick={reset}
                className="mt-8 inline-flex items-center justify-center rounded-full border border-champagne-300 bg-white px-6 py-3 text-sm text-champagne-700 shadow-sm transition active:scale-[0.98]"
              >
                再提交一份
              </button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {submitError ? (
                <div
                  role="alert"
                  className="flex gap-3 rounded-2xl border border-blush-300 bg-blush-50 px-4 py-3 text-sm leading-6 text-blush-500"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>{submitError}</p>
                </div>
              ) : null}

              <div aria-hidden="true" className="absolute left-[-9999px]">
                <label>
                  Company
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.hp}
                    onChange={updateField("hp")}
                  />
                </label>
              </div>

              <Field label="您的姓名">
                <input
                  type="text"
                  value={form.name}
                  onChange={updateField("name")}
                  placeholder="请输入您的称呼"
                  autoComplete="name"
                  maxLength={40}
                  className="w-full rounded-2xl border border-champagne-200 bg-white px-5 py-4 text-base outline-none transition focus:border-champagne-400 focus:ring-2 focus:ring-champagne-200"
                />
              </Field>

              <Field label="联系电话">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={updateField("phone")}
                  placeholder="便于新人联系"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={20}
                  className="w-full rounded-2xl border border-champagne-200 bg-white px-5 py-4 text-base outline-none transition focus:border-champagne-400 focus:ring-2 focus:ring-champagne-200"
                />
              </Field>

              <div>
                <label className="mb-2 block text-sm text-ink-soft">
                  是否出席
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {ATTENDANCE_OPTIONS.map((opt) => {
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
                          value={opt.value}
                          checked={active}
                          onChange={() => setAttendance(opt.value)}
                          className="sr-only"
                        />
                        {active ? <Heart className="h-4 w-4" /> : null}
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {isAbsent ? null : (
                <Field label="出席人数">
                  <select
                    value={form.guests}
                    onChange={updateField("guests")}
                    className="w-full rounded-2xl border border-champagne-200 bg-white px-5 py-4 text-base outline-none transition focus:border-champagne-400 focus:ring-2 focus:ring-champagne-200"
                  >
                    {GUEST_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              <Field label="留言祝福（可选）">
                <textarea
                  value={form.message}
                  onChange={updateField("message")}
                  rows={3}
                  placeholder="写下您想说的话～"
                  maxLength={500}
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
  );
}
