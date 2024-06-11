/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderWidth: {
        '1': '1px'
      },
      ringWidth: {
        '1': '1px'
      }
    },
  },
  plugins: [],
}

