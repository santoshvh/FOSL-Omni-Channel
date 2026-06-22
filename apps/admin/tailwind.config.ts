import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { primary: "#2E75B6" } } },
  plugins: [],
};
export default config;
