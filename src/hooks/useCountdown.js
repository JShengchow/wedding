import { useEffect, useState } from "react";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function calc(target) {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, done: true };
  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    done: false,
  };
}

export function useCountdown(targetDate, tickMs = 30 * 1000) {
  const target =
    targetDate instanceof Date ? targetDate.getTime() : Number(targetDate);
  const [state, setState] = useState(() => calc(target));

  useEffect(() => {
    const timer = window.setInterval(() => setState(calc(target)), tickMs);
    return () => window.clearInterval(timer);
  }, [target, tickMs]);

  return state;
}
