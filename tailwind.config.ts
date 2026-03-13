import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 12px 48px rgba(59, 130, 246, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
