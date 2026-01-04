/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#191970',
        sunset: '#FD5E53',
        emerald: '#50C878',
      }
    },
  },
  plugins: [],
}

