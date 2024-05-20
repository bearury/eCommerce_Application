/** @type {import('tailwindcss').Config} */

const colors = {
  textDark: '#403F3D',
  textLight: '#E1D4C9',
  textAccent: '#B0907A',
  bgBody: '#E1D4C9',
  bgHeader: '#413e3b',
  bgContainer: '#665F55',
  bgBackdrop: 'rgba(64, 63, 61, 0.3)',
  bgDisabled: '#5b5653',
  borderLight: '#C1B6AD',
  borderDark: '#665F55',
};

export default {
  content: ['./src/**/*.{js,ts}', './src/**/*'],
  theme: {
    extend: {
      colors: {
        current: 'currentColor',
        ...colors,
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '-5px 5px 10px 5px rgba(0, 0, 0, 0.3)',
        button: '0px 0px 10px 1px rgba(0,0,0,0.5);',
      },
      transitionTimingFunction: {
        openToast: 'cubic-bezier(0.68, -0.55, 0.265, 1.35)',
      },
      content: {
        empty: '\'\'',
      },
      animation: {
        progress: 'progress 5s linear forwards',
        loader: 'loader 1s ease infinite',
      },
      keyframes: {
        progress: {
          '100%': { right: '100%' },
        },
        loader: {
          '100%': {
            transform: 'rotate(360deg) translate(30px)',
          },
        },
      },
      animationDelay: {
        500: '0.5s',
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
  corePlugins: {
    preflight: true,
  },
};
