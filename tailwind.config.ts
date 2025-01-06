import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'], // Enables dark mode with the "class" strategy
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // Specify directories to scan for class names
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          1: '#1C1F2E',
          2: '#161925',
        },
        blue: {
          1: '#0E78F9',
        },
        sky:{
          1:'#C9DDFF',
          2:"#ECF0FF",
          3:"#F5FCFF",
        },
        orange:{
          1:"#FF742E",
        },
        purple:{
          1:"#830EF9"
        },
        yellow:{
          1:"#E9A905"
        }
      },
      backgroundImage: {
        hero: "url('/images/back-4.jpg')", // Path to the hero background image
      },
    },
  },
  plugins: [require('tailwindcss-animate')], // Tailwind plugin for animations
} satisfies Config;
