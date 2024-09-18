/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,cs}"],
  theme: {
    extend: {
      backgroundImage: {
        "home": "url('/assets/images/bg.png')"
      }
    },
  },
  plugins: [],
}

