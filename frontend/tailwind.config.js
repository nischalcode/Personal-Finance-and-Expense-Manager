/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // toggled by adding/removing the "dark" class on <html> (see src/contexts/ThemeContext.tsx)
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Centralized brand colors. Change these to re-theme the whole app.
        brand: {
          50: "#eefcf5",
          100: "#d6f7e6",
          200: "#aeedd0",
          300: "#7bdcb5",
          400: "#46c496",
          500: "#22a97b", // primary
          600: "#178762",
          700: "#146c50",
          800: "#135641",
          900: "#114736",
        },
      },
    },
  },
  plugins: [],
};
