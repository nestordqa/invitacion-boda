import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vinotinto: {
          DEFAULT: '#6B1D2F',
          dark: '#4A121F',
          light: '#8C273E',
        },
        beige: {
          DEFAULT: '#F5F0EB',
          light: '#FAF7F4',
          dark: '#E2D7CC',
        },
        dorado: '#C5A880',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;