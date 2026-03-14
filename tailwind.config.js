/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Naye theme colors
        mirage: {
          deep: "#141E30",    // Darkest Navy
          light: "#35577D",   // Lighter Steel Blue
          
      },
      backgroundImage: {
        'mirage-gradient': "linear-gradient(to right, #141E30, #35577D)",
      }
    },
  },
  plugins: [],
}