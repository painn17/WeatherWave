const withMT = require("@material-tailwind/html/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/style.css"],
  theme: {
    extend: {
      fontFamily: {
        sans:["Inter","sans-serif"]
      }
    },
  },
  plugins: [],
}

