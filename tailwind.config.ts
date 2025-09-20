

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./*.{html,js,ts,jsx,tsx}", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C2D0F7",
        secondary: "#CCC3F6",
        white: "#FFFFFF",
        black: "#000000",
        background: "#fafafa",
      },
    },
  },
  plugins: [],
};

export default config;