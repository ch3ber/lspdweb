import type { Config } from "tailwindcss";
import catppuccin from "@catppuccin/tailwindcss";

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
        alt: "var(--background-alt)",
        foreground: "var(--foreground)",
        mocha: {
          100: "#cdd6f4",
          200: "#bac2de",
        },
      },
    },
  },
  plugins: [
    catppuccin({
      defaultFlavour: "mocha",
      prefix: "ctp",
    }),
  ],
};
export default config;
