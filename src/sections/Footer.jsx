import { Sparkles } from "lucide-react";
import { FloralSprig } from "../components/decor";
import { COUPLE, WEDDING_DATE_FOOTER } from "../content/wedding";

export function Footer() {
  return (
    <footer className="relative px-6 pb-14 text-center text-champagne-700">
      <div className="mx-auto max-w-md">
        <FloralSprig className="mx-auto mb-4 w-44 text-champagne-400/85" />
        <Sparkles className="mx-auto mb-3 h-5 w-5 text-champagne-500" />
        <p className="text-eyebrow mb-3 text-xs">Thank You For Coming</p>
        <p className="text-display mb-2 text-xl font-light italic leading-relaxed text-ink md:text-2xl">
          愿岁月以温柔 · 待你我同行
        </p>
        <p className="text-sm leading-8 text-ink-soft">{WEDDING_DATE_FOOTER}</p>
        <p className="mt-6 text-[11px] tracking-[0.3em] text-ink-light">
          {COUPLE.groomEn} &amp; {COUPLE.brideEn} · 2026.07.18
        </p>
        <p className="mt-4 text-[11px] tracking-wide text-ink-light">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-champagne-600"
          >
            粤ICP备2026067284号
          </a>
        </p>
      </div>
    </footer>
  );
}
