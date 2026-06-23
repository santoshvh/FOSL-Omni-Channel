import type { Config } from "tailwindcss";
import { foslTailwindPreset } from "../../packages/ui/tailwind.preset";

const config: Config = {
  presets: [foslTailwindPreset],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
