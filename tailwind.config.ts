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
        sireon: {
          ink: "#030712",
          midnight: "#071324",
          navy: "#0B1F3A",
          blue: "#2F80FF",
          cyan: "#00E5FF",
          emerald: "#19F6B1",
          magenta: "#FF3EA5",
          coral: "#FF7A3D",
          violet: "#8B5CF6",
          steel: "#A7B4C8",
          mist: "#22324A",
          ice: "#0E1A2D",
          mint: "#19F6B1",
          amber: "#FFB020",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "Manrope", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "Sora", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 28px 90px rgba(0, 0, 0, 0.32)",
        line: "0 1px 0 rgba(255, 255, 255, 0.08)",
        neon: "0 0 38px rgba(0, 229, 255, 0.22)",
        ember: "0 0 42px rgba(255, 62, 165, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
