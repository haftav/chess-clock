/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        cyan: colors.cyan,
      },
      spacing: {
        '1/2': '50%',
        full: '100%',
        inherit: 'inherit',
      },
      screens: {
        se: '568px',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundImage: ['disabled'],
    },
  },
  plugins: [],
};
