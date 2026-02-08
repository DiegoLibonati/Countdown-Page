/** @type {import('tailwindcss').Config} */

const config = {
  content: ["./index.html", "./src/**/*.{ts,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#C2D0F7",
        secondary: "#CCC3F6",
        white: "#FFFFFF",
        black: "#000000",
        background: "#fafafa",
      },
      fontFamily: {
        primary: ["Roboto", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
