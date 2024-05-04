/** @type {import('tailwindcss').Config} */

const colors = {
  textDark: '#403F3D',
  textLight: '#E1D4C9',
  textAccent: '#B0907A',
  bgBody: '#E1D4C9',
  bgContainer: '#665F55',
  bgBackdrop: 'rgba(64, 63, 61, 0.3)',
  borderLight: '#C1B6AD',
  borderDark: '#665F55',
};

export default {
  content: [
    "./src/**/*.{js,ts}",
    "./src/**/*"
  ],
  theme: {
    extend: {
      colors: {
        current: 'currentColor',
        ...colors,
      },
      boxShadow: {
        card: '-5px 5px 10px 5px rgba(0, 0, 0, 0.3)',
      },
    },
    screens: {
      lg: '1280px',
      md: '768px',
      tablet: '640px',
      sm: '440px',
      min: '120px',
    },
  },
  plugins: [],
}

