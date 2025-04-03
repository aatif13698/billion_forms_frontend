/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

const conf = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#ffc001",
        secondary: "#ff9c01",
        dark: '#2c2c2d',
        light: "#f8f9fb",
        mediumDark: "rgb(57 57 57)",
        lightButton: "rgb(23 53 81)",
        darkButton: "rgb(23 53 81)",
        cardBgDark: "rgb(59 64 65)",
        cardBgLight: "#ffffff",

        formLabelLight : "rgb(0 0 0)",
        formLabelDark : "rgb(255 255 255)",

        formHeadingLight : "rgb(0 0 0)",
        formHeadingDark : "rgb(255 255 255)",

        white : "#ffffff",
        hambergerLight : "#b3ecf0",
        hambergerDark : "rgb(110 169 173 / 60%)"
        // sidebarHoverBgLight: ""
      },
      backgroundImage: {
        'custom-gradient-sidebar': "linear-gradient(to bottom, #9bf7ff, #077588, #00404b)",
        'custom-gradient-button-light' : "linear-gradient(to bottom, #2b3839, #52adbc, #2b3839)",
        'custom-gradient-button-dark' : "linear-gradient(to bottom, #8bf6ff, #000000, #8bf6ff)",
        'custom-gradient-header-light' : "radial-gradient(circle, rgb(14 243 214) 0%, rgb(124 255 243) 23%, rgb(159 234 255) 100%)",
        'custom-gradient-bottom-light' : "linear-gradient(to bottom, #025d64, #077588, #0c4853)"
      }
    },
  },
  plugins: [],
});

export default conf;
