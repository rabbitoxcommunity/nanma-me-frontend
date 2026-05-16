/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
        display: ["'Fraunces'", "serif"],
        editorial: ["'Instrument Serif'", "serif"],
      },
      colors: {
        // Clean white palette
        bone: "#ffffff",        // page background (pure white)
        cream: "#f5f5f3",       // subtle elevated surface
        pearl: "#fafaf8",       // highest elevation
        ink: "#1a1815",         // primary text
        graphite: "#2a2722",    // headings
        smoke: "#6b6356",       // secondary text
        ash: "#a39885",         // muted
        terracotta: "#F07939",  // primary accent
        clay: "#a04826",        // hover accent
        sage: "#8b9474",        // secondary accent
        line: "rgba(26, 24, 21, 0.08)",
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter2: "-0.03em",
        ultrawide: "0.32em",
      },
      fontSize: {
        "10xl": "10rem",
        "11xl": "12rem",
      },
      screens: {
        xs: "480px",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [],
};
