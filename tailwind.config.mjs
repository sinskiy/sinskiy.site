import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,mdx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "red-rose": ["Red Rose", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
