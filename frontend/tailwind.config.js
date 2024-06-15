/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
      fontFamily: { 
        body: ["DM Sans"],
        rome: ["Playfair Display"]
      }
    }
  },
  plugins: [],
}