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
            primary: "#02040A",
            secondary: "#080B14",
            tertiary: "#0E121E",
            card: "#121726",
            elevated: "#181E2F",
            bright: "#21293D",
          },
          accent: {
            purple: "#6366F1", // Indigo 500
            violet: "#8B5CF6", // Violet 500
            glow: "#A5B4FC",   // Indigo 300
            lavender: "#C7D2FE", // Indigo 200
            dim: "#312E81",    // Indigo 900
          },
          gold: {
            DEFAULT: "#F59E0B", // Amber 500
            light: "#FBBF24",  // Amber 400
            bright: "#FEF3C7", // Amber 50
          },
          success: "#10B981", // Emerald 500
          danger: "#F43F5E",  // Rose 500
          warning: "#F59E0B", // Amber 500
          text: {
            primary: "#F8FAFC",
            secondary: "#94A3B8",
            muted: "#475569",
          },
          glass: {
            bg: "rgba(255, 255, 255, 0.03)",
            border: "rgba(255, 255, 255, 0.08)",
          },
          rarity: {
            common: "#94A3B8",
            rare: "#3B82F6",
            epic: "#8B5CF6",
            legendary: "#F59E0B",
            mythic: "#F43F5E",
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
          "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #A78BFA 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)",
        "gradient-glass":
          "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)",
      },
      boxShadow: {
        "neon-purple": "0 0 20px rgba(99, 102, 241, 0.3), 0 0 60px rgba(99, 102, 241, 0.1)",
        "neon-violet": "0 0 20px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.1)",
        "neon-gold": "0 0 20px rgba(245, 158, 11, 0.3), 0 0 60px rgba(245, 158, 11, 0.1)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.6)",
        "glass-hover": "0 12px 48px rgba(0, 0, 0, 0.8), 0 0 24px rgba(99, 102, 241, 0.05)",
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
            borderColor: "rgba(99, 102, 241, 0.2)",
            boxShadow: "0 0 10px rgba(99, 102, 241, 0.1)",
          },
          "50%": {
            borderColor: "rgba(139, 92, 246, 0.4)",
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.2)",
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
