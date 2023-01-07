/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.ts', './src/**/*.ejs'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
