/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.{html,js,ts}", "./src/**/*.{html,js,ts}"],
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
