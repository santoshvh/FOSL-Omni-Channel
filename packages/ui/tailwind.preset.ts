import type { Config } from "tailwindcss";

/** Shared FOSL brand tokens — yellow primary from Logo_FOSL.svg (#FED318) */
export const foslTailwindPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FED318",
          dark: "#E5BC00",
          light: "#FFF4B8",
          muted: "#FFFBEB",
          foreground: "#231F20",
        },
        ink: "#231F20",
        surface: {
          DEFAULT: "#F4F6F8",
          card: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        elevated: "0 12px 40px -12px rgb(0 0 0 / 0.15)",
        soft: "0 4px 24px -4px rgb(0 0 0 / 0.08)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
};
