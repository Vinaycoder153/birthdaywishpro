import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#060105",
        crystal: "rgba(20, 7, 15, 0.7)",
        rosegold: "#f3ce7a",
        magenta: "#ff2a5f",
        stardust: "#ffb3c6",
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
        script: ["var(--font-dancing)", "cursive"],
      },
      backgroundImage: {
        "velvet-radial":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,42,95,0.25), transparent), radial-gradient(ellipse 60% 50% at 90% 90%, rgba(243,206,122,0.12), transparent)",
        "gold-foil":
          "linear-gradient(135deg, #f3ce7a 0%, #fff3d6 20%, #d9a441 40%, #f3ce7a 60%, #fff3d6 80%, #d9a441 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(255,42,95,0.35)",
        "glow-gold": "0 0 30px rgba(243,206,122,0.45)",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-10px)" },
          "40%": { transform: "translateX(10px)" },
          "60%": { transform: "translateX(-8px)" },
          "80%": { transform: "translateX(8px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseglow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
        float: "float 6s ease-in-out infinite",
        pulseglow: "pulseglow 2.2s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
