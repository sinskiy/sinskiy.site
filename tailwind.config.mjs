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
        primary: "hsl(var(--toxic-green) / <alpha-value>)",
        secondary: "hsl(var(--toxic-purple) / <alpha-value>)",
        primaryDarker: "hsl(var(--darker-green) / <alpha-value>)",
        secondaryDarker: "hsl(var(--darker-purple) / <alpha-value>)",
        tertiaryDarker: "hsl(var(--darker-blue) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
