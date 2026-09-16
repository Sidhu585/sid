import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#170F1C",
          soft: "#231726",
          raised: "#2E1E33",
          line: "#3D2A42",
        },
        paper: {
          DEFAULT: "#FBF3EC",
          dim: "#C9B9C2",
          faint: "#8C7A88",
        },
        gold: {
          DEFAULT: "#F2B84B",
          soft: "#F6CB78",
          deep: "#C98F2B",
        },
        ember: {
          DEFAULT: "#FF7A45",
          deep: "#E15A2A",
        },
        blush: {
          DEFAULT: "#E8A0A8",
          soft: "#F0BFC5",
          deep: "#CC7D87",
        },
        lilac: {
          DEFAULT: "#A594C4",
          soft: "#C2B4DA",
          deep: "#8571A8",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "drift": {
          "0%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-14px) translateX(6px)" },
          "100%": { transform: "translateY(0) translateX(0)" },
        },
        "pop": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "drift": "drift 6s ease-in-out infinite",
        "pop": "pop 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
