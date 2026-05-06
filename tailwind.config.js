/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        toro: {
          black: '#0A0A0A',
          blue: '#2B4FBF',
          'blue-light': '#3D63D6',
          'blue-dark': '#1E3A8A',
          'gray-cold': '#F4F4F6',
          'gray-mid': '#6B7280',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        heading: ['Inter', 'Manrope', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        '7xl': '80rem',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
