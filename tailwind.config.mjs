import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,mdx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        redRose: ["Redrose", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        baba: "var(--baba)",
        almostBlack: "var(--almost-black)",
        primary: "var(--toxic-green)",
        secondary: "var(--toxic-purple)",
        primaryDarker: "var(--darker-green)",
        secondaryDarker: "var(--darker-purple)",
      },
    },
  },
  plugins: [],
};
