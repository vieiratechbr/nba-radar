import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        court: {
          black: "#07080b",
          ink: "#101116",
          slate: "#191b22",
          line: "#2a2d37",
          red: "#d71920",
          redDark: "#9f1117",
          silver: "#b9c0cc"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(215, 25, 32, 0.24), 0 22px 80px rgba(0, 0, 0, 0.45)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
