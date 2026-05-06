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
          'gray-line': '#E5E7EB',
          cream: '#EBE8E0',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        // 'display' se define como utility custom en index.css (font-display
        // colisiona con la propiedad CSS @font-face).
        // Heading + body per CLAUDE.md
        heading: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        // Mono: para specs tecnicos, KPIs, eyebrows numerados
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        '7xl': '80rem',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};
