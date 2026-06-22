import { useRef, useState } from "react";
import { submitRsvp } from "../lib/supabase";

export const INITIAL_RSVP_FORM = {
  name: "",
  phone: "",
  attendance: "attend",
  guests: "1",
  message: "",
  hp: "",
};

const SUBMIT_THROTTLE_MS = 10 * 1000;

export function getSubmitErrorMessage(error) {
  const code = error?.code || "";

  switch (code) {
    case "too_many_requests":
      return "提交过于频繁，请稍候再试。";
    case "bad_name":
      return "请填写姓名（1 - 40 个字符）。";
    case "bad_phone":
      return "请填写有效的联系电话（6 - 20 位）。";
    case "bad_attendance":
      return "请选择出席状态。";
    case "bad_guests":
    case "bad_guests_for_absent":
      return "请选择出席人数。";
    case "bad_message":
      return "留言长度请控制在 500 字以内。";
    case "bad_body":
      return "提交内容格式异常，请刷新后重试。";
    case "network_error":
      return "网络连接异常，已为您临时保存，稍后请再试。";
    case "server_error":
      return "服务暂时不可用，请稍后再试，或直接联系新人确认回执。";
    default:
      return "提交暂时失败，请稍后再试，或直接联系新人确认回执。";
  }
}

export function useRsvpForm({ onSubmitted } = {}) {
  const [form, setForm] = useState(INITIAL_RSVP_FORM);
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
    setForm(INITIAL_RSVP_FORM);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (form.hp) {
      setSubmitted(true);
      onSubmitted?.();
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
      onSubmitted?.();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }
      setSubmitError(getSubmitErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    submitted,
    submitError,
    isAbsent: form.attendance === "absent",
    updateField,
    setAttendance,
    reset,
    handleSubmit,
  };
}
