/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '16-important': '4rem !important', // 4rem is the equivalent of `w-16`
      },
      height: {
        '28-important': '7rem !important', // 7rem is the equivalent of `h-28`
      },
      colors: {
        // Primary colors
        'moderate-blue': 'hsl(238, 40%, 52%)',
        'soft-red': 'hsl(358, 79%, 66%)',
        'light-grayish-blue': 'hsl(239, 57%, 85%)',
        'pale-red': 'hsl(357, 100%, 86%)',

        // Neutral colors
        'dark-blue': 'hsl(212, 24%, 26%)',
        'grayish-blue': 'hsl(211, 10%, 45%)',
        'light-gray': 'hsl(223, 19%, 93%)',
        'very-light-gray': 'hsl(228, 33%, 97%)',
        'white': 'hsl(0, 0%, 100%)',
      },
    },
  },
  plugins: [],
}
