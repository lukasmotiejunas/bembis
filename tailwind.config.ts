import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        christmas: {
          dark: "#08091a",
          navy: "#0d1230",
          surface: "#111827",
          card: "#131c35",
          border: "#1e2d52",
          gold: "#C9A227",
          "gold-light": "#E8C84A",
          "gold-dim": "#8A6B0F",
          warm: "#FFF5E6",
          "warm-dim": "#C4A882",
          green: "#1E3A1E",
          "green-light": "#2d5a27",
          red: "#8B1A1A",
          "red-light": "#C0392B",
          glow: "rgba(201, 162, 39, 0.25)",
          "glow-warm": "rgba(255, 200, 100, 0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A227 0%, #E8C84A 50%, #C9A227 100%)",
        "dark-gradient": "linear-gradient(180deg, #08091a 0%, #0d1230 100%)",
        "card-gradient": "linear-gradient(145deg, #131c35 0%, #0f1528 100%)",
        "glow-radial": "radial-gradient(ellipse at center, rgba(201, 162, 39, 0.15) 0%, transparent 70%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "snow-fall": "snowFall 10s linear infinite",
        "twinkle": "twinkle 1.5s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "slide-in": "slideIn 0.5s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(201, 162, 39, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(201, 162, 39, 0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        snowFall: {
          "0%": { transform: "translateY(-10px) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
        twinkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.3", transform: "scale(0.8)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      boxShadow: {
        "gold": "0 0 30px rgba(201, 162, 39, 0.4)",
        "gold-sm": "0 0 15px rgba(201, 162, 39, 0.3)",
        "gold-lg": "0 0 60px rgba(201, 162, 39, 0.5)",
        "warm": "0 0 30px rgba(255, 200, 100, 0.3)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 48px rgba(0, 0, 0, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
