export function FloralSprig({ className = "", flip = false }) {
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
        <ellipse
          cx="38"
          cy="24"
          rx="4.2"
          ry="2.6"
          transform="rotate(-30 38 24)"
        />
        <ellipse
          cx="66"
          cy="22"
          rx="4.2"
          ry="2.6"
          transform="rotate(-30 66 22)"
        />
        <ellipse
          cx="92"
          cy="25"
          rx="4.2"
          ry="2.6"
          transform="rotate(-30 92 25)"
        />
        <ellipse
          cx="116"
          cy="26"
          rx="4.2"
          ry="2.6"
          transform="rotate(-25 116 26)"
        />
        <ellipse
          cx="142"
          cy="28"
          rx="4.2"
          ry="2.6"
          transform="rotate(-25 142 28)"
        />
        <ellipse
          cx="167"
          cy="31"
          rx="4"
          ry="2.4"
          transform="rotate(-20 167 31)"
        />
        <ellipse
          cx="32"
          cy="58"
          rx="4.2"
          ry="2.6"
          transform="rotate(30 32 58)"
        />
        <ellipse
          cx="56"
          cy="58"
          rx="4.2"
          ry="2.6"
          transform="rotate(30 56 58)"
        />
        <ellipse
          cx="82"
          cy="58"
          rx="4.2"
          ry="2.6"
          transform="rotate(30 82 58)"
        />
        <ellipse
          cx="108"
          cy="58"
          rx="4.2"
          ry="2.6"
          transform="rotate(30 108 58)"
        />
        <ellipse
          cx="134"
          cy="58"
          rx="4.2"
          ry="2.6"
          transform="rotate(30 134 58)"
        />
        <circle cx="180" cy="38" r="2.4" fill="currentColor" opacity="0.55" />
      </g>
    </svg>
  );
}

export function RingsIcon({ className = "" }) {
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

export function CoupleSilhouette({ className = "" }) {
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

export function CornerFlourish({ className = "" }) {
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
        <ellipse
          cx="20"
          cy="44"
          rx="3.6"
          ry="2"
          transform="rotate(-40 20 44)"
        />
        <ellipse
          cx="34"
          cy="32"
          rx="3.6"
          ry="2"
          transform="rotate(-40 34 32)"
        />
        <ellipse
          cx="50"
          cy="24"
          rx="3.6"
          ry="2"
          transform="rotate(-40 50 24)"
        />
        <ellipse
          cx="68"
          cy="18"
          rx="3.6"
          ry="2"
          transform="rotate(-40 68 18)"
        />
        <circle cx="84" cy="28" r="1.6" fill="currentColor" opacity="0.6" />
      </g>
    </svg>
  );
}

export function SparkleStar({ className = "" }) {
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
