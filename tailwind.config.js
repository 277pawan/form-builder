/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-gradient": {
          start: "#3c153c",
          middle: "#030712",
          end: "#030712",
        },
      },
    },
  },
  plugins: [],
};
