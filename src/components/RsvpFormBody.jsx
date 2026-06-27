import { AlertCircle, Heart, LoaderCircle } from "lucide-react";
import { RSVP_SUCCESS_REMINDER } from "../content/wedding";
import { Field } from "./Field";
import { Select } from "./Select";

const ATTENDANCE_OPTIONS = [
  { value: "attend", label: "出席" },
  { value: "absent", label: "无法出席" },
];

const GUEST_OPTIONS = [
  { value: "1", label: "1 人" },
  { value: "2", label: "2 人" },
  { value: "3", label: "3 人" },
  { value: "4", label: "4 人" },
  { value: "5+", label: "5 人及以上" },
];

const INPUT_CLASS =
  "w-full rounded-2xl border border-champagne-200 bg-ivory-50 px-5 py-4 text-base text-ink outline-none transition focus:border-champagne-400 focus:ring-2 focus:ring-champagne-200";

export function RsvpFormBody({
  form,
  loading,
  submitError,
  isAbsent,
  updateField,
  setAttendance,
  handleSubmit,
  idPrefix = "rsvp",
}) {
  return (
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
          id={`${idPrefix}-name`}
          type="text"
          value={form.name}
          onChange={updateField("name")}
          placeholder="请输入您的称呼"
          autoComplete="name"
          maxLength={40}
          className={INPUT_CLASS}
        />
      </Field>

      <Field label="联系电话">
        <input
          id={`${idPrefix}-phone`}
          type="tel"
          value={form.phone}
          onChange={updateField("phone")}
          placeholder="便于新人联系"
          autoComplete="tel"
          inputMode="tel"
          maxLength={20}
          className={INPUT_CLASS}
        />
      </Field>

      <div>
        <label className="mb-2 block text-sm text-ink-soft">是否出席</label>
        <div className="grid grid-cols-2 gap-3">
          {ATTENDANCE_OPTIONS.map((opt) => {
            const active = form.attendance === opt.value;
            return (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-base transition ${
                  active
                    ? "border-champagne-400 bg-gradient-to-br from-champagne-50 to-blush-50 text-champagne-700 shadow-sm"
                    : "border-champagne-200 bg-ivory-50 text-ink-soft"
                }`}
              >
                <input
                  type="radio"
                  name={`${idPrefix}-attendance`}
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
          <Select
            id={`${idPrefix}-guests`}
            value={form.guests}
            onChange={updateField("guests")}
            options={GUEST_OPTIONS}
          />
        </Field>
      )}

      <Field label="留言祝福（可选）">
        <textarea
          id={`${idPrefix}-message`}
          value={form.message}
          onChange={updateField("message")}
          rows={3}
          placeholder="写下您想说的话～"
          maxLength={500}
          className={`${INPUT_CLASS} resize-none`}
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
  );
}

export function RsvpSuccessBody({ onReset }) {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blush-100 to-champagne-100 ring-1 ring-champagne-200">
        <Heart className="h-9 w-9 text-blush-500" />
      </div>
      <h3 className="text-display mb-3 text-2xl font-light text-ink md:text-3xl">
        感谢您的回执
      </h3>
      <p className="mx-auto max-w-md text-sm leading-8 text-ink-soft md:text-base">
        我们已经收到您的出席信息。
      </p>
      <div className="mx-auto mt-4 max-w-md text-sm leading-8 text-ink-soft md:text-base">
        {RSVP_SUCCESS_REMINDER.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      {onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-8 inline-flex items-center justify-center rounded-full border border-champagne-300 bg-white px-6 py-3 text-sm text-champagne-700 shadow-sm transition active:scale-[0.98]"
        >
          再提交一份
        </button>
      ) : null}
    </div>
  );
}
