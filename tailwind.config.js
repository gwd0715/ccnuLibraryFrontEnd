const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./index.html","./src/**/*.{vue,ts,jsx,tsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        sourceserif: ["sourceserif"],
        fzss: ["fzss"],
      }
    },
  },
  plugins: []
}