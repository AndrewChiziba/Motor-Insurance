// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Blue
        success: "#10B981", // Green
        failure: "#EF4444", // Red
        neutral: "#F9FAFB", // White/Off-white
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"], // Industry-standard font
      },
    },
  },
  plugins: [],
};

