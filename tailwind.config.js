export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        champagne: {
          50: "#FBF7EE",
          100: "#F6EFD9",
          200: "#EBDDB1",
          300: "#DFC988",
          400: "#D4B569",
          500: "#C9A961",
          600: "#B08A47",
          700: "#8A6A35",
          800: "#604A24",
          900: "#3B2D15",
        },
        ivory: {
          50: "#FFFCF7",
          100: "#FBF8F1",
          200: "#F5EEDE",
          300: "#ECE1C5",
          DEFAULT: "#FAF7F0",
        },
        blush: {
          50: "#FDF6F5",
          100: "#FAE8E7",
          200: "#F5D5D6",
          300: "#EBB7B9",
          400: "#DD969A",
          500: "#C97A80",
        },
        ink: {
          DEFAULT: "#5C4A3F",
          soft: "#8B7355",
          light: "#A89479",
        },
      },
      fontFamily: {
        serif: ["'Noto Serif SC'", "'Cormorant Garamond'", "serif"],
        display: ["'Cormorant Garamond'", "'Noto Serif SC'", "serif"],
        sans: ["'Noto Sans SC'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px -28px rgba(192, 154, 86, 0.35)",
        warm: "0 30px 80px -32px rgba(196, 142, 86, 0.45)",
        petal: "0 18px 50px -24px rgba(221, 150, 154, 0.45)",
      },
      backgroundImage: {
        "petal-radial":
          "radial-gradient(circle at 20% 10%, rgba(245, 213, 214, 0.55), transparent 55%), radial-gradient(circle at 80% 90%, rgba(235, 221, 177, 0.55), transparent 55%)",
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
