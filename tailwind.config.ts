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
        background: "var(--background)",
        foreground: "var(--foreground)",

        // ── Core palette ──────────────────────────
        tierra: "#1C1916", // deep warm charcoal (main dark)
        crema: "#F5EFE6", // warm cream (main light bg)
        dorado: "#C9A84C", // brand gold (accent primary)

        // ── Brand navy scale ──────────────────────
        navy: {
          DEFAULT: "#1A2752",
          950: "#070D1C", // abyss — bandas, overlays y cintas
          900: "#0F1A30", // darkest — deep backgrounds
          800: "#15214A", // hover backgrounds
          700: "#1A2752", // brand base
        },
        smoke: "#2A3A52", // gray smoke — subtle dark backgrounds

        // ── Neutral grays (cool, harmonize with navy) ─
        gray: {
          400: "#9AA3B5", // body text on dark navy
          500: "#6E7686", // body text on white
          600: "#545D70", // stronger secondary text
        },

        // ── Pastel / mid-tones ────────────────────
        arena: "#EAD9C4", // warm sand — secondary backgrounds
        salvia: "#7A9E7E", // muted sage green — Patagonia landscape
        piedra: "#9E8E80", // warm stone grey — mid tone
        humo: "#F0E8DC", // very light warm smoke — card bg

        // ── Extended earth palette (for fine control) ─
        earth: {
          950: "#0E0C09",
          900: "#1C1916",
          800: "#2E2923",
          700: "#40372F",
          400: "#8C7860",
          200: "#C8B4A0",
        },
        gold: {
          500: "#C9A84C", // accent primary
          400: "#D4B86A",
          300: "#E0CB8E",
          200: "#E8D5B7", // oro light — hovers & highlights
          100: "#F3E9D3",
        },
      },
      fontFamily: {
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
        outfit: ["var(--font-outfit)", "system-ui", "sans-serif"],
        cormorant: ["var(--font-outfit)", "system-ui", "sans-serif"],
        body: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        inter: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        accent: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        sohne: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
