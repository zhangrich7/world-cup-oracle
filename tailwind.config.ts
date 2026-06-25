import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(9, 9, 11)",
        neon: "rgb(0, 255, 170)",
        "neon-dim": "rgba(0, 255, 170, 0.15)",
        "neon-glow": "rgba(0, 255, 170, 0.3)",
        surface: "rgb(19, 19, 24)",
        "surface-light": "rgb(26, 26, 34)",
        muted: "rgb(113, 113, 122)",
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
