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
        cardBgDark: "rgb(14 66 80)",
        cardBgLight: "#ffffff",

        subscriptionCardBgLightFrom : "#03cac3",
        subscriptionCardBgLightTo : "#008883",

        subscriptionCardBgDarkFrom : "#1b5e5c",
        subscriptionCardBgDarkTo : "#202e2d",

        textGradientLightFrom : "#00ff85",
        textGradientLightkTo : "#6aff2c",


        textGradientDarktFrom : "#2eff00",
        textGradientDarkTo : "#ffffff",


        textLight : "#00768a",
        textDark : "#ffffff",

        sessionTableBgLight : "#16414ca3",
        sessionTableBgDark : "#16414ca3",


        formLabelLight : "rgb(0 0 0)",
        formLabelDark : "rgb(255 255 255)",

        formHeadingLight : "rgb(0 0 0)",
        formHeadingDark : "rgb(255 255 255)",

        white : "#ffffff",
        hambergerLight : "#b3ecf0",
        hambergerDark : "rgb(0 92 110 / 60%)",
        // sidebarHoverBgLight: ""
      },
      backgroundImage: {
        'custom-gradient-sidebar': "linear-gradient(to bottom, #9bf7ff, #077588, #00404b)",
        'custom-gradient-sidebar-dark' : "linear-gradient(to bottom, #0e1516, #08798d, #0a1112)",
        'custom-gradient-button-light' : "linear-gradient(to bottom, #2b3839, #52adbc, #2b3839)",
        'custom-gradient-button-dark' : "linear-gradient(to bottom, #8bf6ff, #000000, #8bf6ff)",
        'custom-gradient-header-light' : "radial-gradient(circle, rgb(14 243 214) 0%, rgb(124 255 243) 23%, rgb(159 234 255) 100%)",
        'custom-gradient-header-dark' : "radial-gradient(circle, rgb(11 131 136) 0%, rgb(52 71 70) 23%, rgb(33 37 38) 100%)",
        'custom-gradient-bottom-light' : "linear-gradient(to bottom, #025d64, #077588, #0c4853)",
        'custom-gradient-session-light' : "linear-gradient(to bottom, #508087, #00b0cc, #4e7b82)",
        'custom-gradient-session-dark' : "linear-gradient(to bottom, #4b6f74, #292b2d, #2d484b)",
      }
    },
  },
  plugins: [],
});

export default conf;
