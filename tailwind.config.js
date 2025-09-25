/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#3B82F6',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
      backdropBlur: {
        'sm': '4px',
        'md': '8px',
        'lg': '10px',
      }
    },
  },
  plugins: [],
}
