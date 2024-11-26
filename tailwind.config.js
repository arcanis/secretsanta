/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        'cherry-swash': ['Cherry Swash', 'serif'],
        'dancing-script': ['Dancing Script', 'cursive'],
      },
    },
  },
}

