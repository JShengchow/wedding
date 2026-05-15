export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        champagne: {
          50: "rgb(var(--c-champagne-50) / <alpha-value>)",
          100: "rgb(var(--c-champagne-100) / <alpha-value>)",
          200: "rgb(var(--c-champagne-200) / <alpha-value>)",
          300: "rgb(var(--c-champagne-300) / <alpha-value>)",
          400: "rgb(var(--c-champagne-400) / <alpha-value>)",
          500: "rgb(var(--c-champagne-500) / <alpha-value>)",
          600: "rgb(var(--c-champagne-600) / <alpha-value>)",
          700: "rgb(var(--c-champagne-700) / <alpha-value>)",
          800: "rgb(var(--c-champagne-800) / <alpha-value>)",
          900: "rgb(var(--c-champagne-900) / <alpha-value>)",
        },
        ivory: {
          50: "rgb(var(--c-ivory-50) / <alpha-value>)",
          100: "rgb(var(--c-ivory-100) / <alpha-value>)",
          200: "rgb(var(--c-ivory-200) / <alpha-value>)",
          300: "rgb(var(--c-ivory-300) / <alpha-value>)",
          DEFAULT: "rgb(var(--c-ivory-default) / <alpha-value>)",
        },
        blush: {
          50: "rgb(var(--c-blush-50) / <alpha-value>)",
          100: "rgb(var(--c-blush-100) / <alpha-value>)",
          200: "rgb(var(--c-blush-200) / <alpha-value>)",
          300: "rgb(var(--c-blush-300) / <alpha-value>)",
          400: "rgb(var(--c-blush-400) / <alpha-value>)",
          500: "rgb(var(--c-blush-500) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--c-ink-default) / <alpha-value>)",
          soft: "rgb(var(--c-ink-soft) / <alpha-value>)",
          light: "rgb(var(--c-ink-light) / <alpha-value>)",
        },
      },
      fontFamily: {
        serif: ["'Noto Serif SC'", "'Cormorant Garamond'", "serif"],
        display: ["'Cormorant Garamond'", "'Noto Serif SC'", "serif"],
        sans: ["'Noto Sans SC'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        warm: "var(--shadow-warm)",
        petal: "var(--shadow-petal)",
      },
      backgroundImage: {
        "petal-radial": "var(--bg-petal-radial)",
        "veil":
          "linear-gradient(180deg, rgba(255, 252, 247, 0) 0%, rgba(255, 252, 247, 0.6) 60%, #FAF7F0 100%)",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "fade-up": "fadeUp 1.2s ease-out forwards",
        shimmer: "shimmer 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%, 100%": { opacity: 0.55 },
          "50%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
