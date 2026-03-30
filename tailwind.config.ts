import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hq: {
          bg: {
            primary: "#040814",
            secondary: "#070D1F",
            tertiary: "#0B1426",
            card: "#111A2E",
            elevated: "#1A2540",
            bright: "#233458",
          },
          accent: {
            purple: "#6D28D9",
            violet: "#D946EF",
            glow: "#22D3EE",
            lavender: "#A5F3FC",
            dim: "#4F46E5",
          },
          gold: {
            DEFAULT: "#F59E0B",
            light: "#FBBF24",
            bright: "#FFB148",
          },
          success: "#10B981",
          danger: "#EF4444",
          warning: "#F59E0B",
          text: {
            primary: "#F8FAFC",
            secondary: "#B3C1D8",
            muted: "#7F8BA3",
          },
          glass: {
            bg: "rgba(255, 255, 255, 0.05)",
            border: "rgba(255, 255, 255, 0.10)",
          },
          rarity: {
            common: "#94A3B8",
            rare: "#3B82F6",
            epic: "#A855F7",
            legendary: "#F59E0B",
            mythic: "#EF4444",
          },
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', "sans-serif"],
        body: ['"Sora"', "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-purple":
          "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #C084FC 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
        "gradient-glass":
          "linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)",
      },
      boxShadow: {
        "neon-purple": "0 0 20px rgba(124, 58, 237, 0.4), 0 0 60px rgba(124, 58, 237, 0.15)",
        "neon-violet": "0 0 20px rgba(168, 85, 247, 0.4), 0 0 60px rgba(168, 85, 247, 0.15)",
        "neon-gold": "0 0 20px rgba(245, 158, 11, 0.4), 0 0 60px rgba(245, 158, 11, 0.15)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.4)",
        "glass-hover": "0 12px 48px rgba(0, 0, 0, 0.5), 0 0 24px rgba(124, 58, 237, 0.1)",
      },
      animation: {
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "spin-slow": "spin 20s linear infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "ticker": "ticker 30s linear infinite",
        "border-glow": "border-glow 3s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-10px) rotate(1deg)" },
          "66%": { transform: "translateY(5px) rotate(-1deg)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "border-glow": {
          "0%, 100%": {
            borderColor: "rgba(124, 58, 237, 0.3)",
            boxShadow: "0 0 10px rgba(124, 58, 237, 0.1)",
          },
          "50%": {
            borderColor: "rgba(168, 85, 247, 0.6)",
            boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)",
          },
        },
      },
      backdropBlur: {
        glass: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
