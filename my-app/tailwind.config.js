/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        'action': '#2575fc',
        'action-hover': '#1861d9', 
        'text-primary': '#000000',
        'border-primary': '#dddddd',
        'gradient-from': '#6a11cb',
        'gradient-to': '#2575fc'
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
} 