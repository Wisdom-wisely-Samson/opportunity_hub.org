/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#01596D',
          50: '#e6f4f7',
          100: '#b3dce4',
          200: '#80c4d1',
          300: '#4dacbe',
          400: '#2a9eb3',
          500: '#01596D',
          600: '#014e60',
          700: '#014253',
          800: '#003746',
          900: '#002b39',
        },
        accent: {
          DEFAULT: '#F3D646',
          50: '#fef9e7',
          100: '#fdf0b4',
          200: '#fbe881',
          300: '#f9df4e',
          400: '#F3D646',
          500: '#edc91a',
          600: '#c9a913',
          700: '#a5890d',
          800: '#816907',
          900: '#5d4902',
        },
      },
      fontFamily: {
        sans: ['Trebuchet MS', 'system-ui', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { '0%': { transform: 'translateY(-10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
