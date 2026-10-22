/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#11100E",
        champagne: "#D4AF72",
        antique: "#A98245",
        ivory: "#F8F3EA",
        pearl: "#FFFCF7",
        taupe: "#A79A87",
        emerald: "#153D32",
      },
      fontFamily: {
        serif: ["Cormorant Garamond","Playfair Display","serif"],
        sans: ["Manrope","Inter","sans-serif"],
      },
      borderRadius: { xl: "1.2rem", "2xl":"1.8rem" },
      boxShadow: { luxury: "0 20px 60px rgba(17,16,14,0.12)" }
    }
  },
  plugins: [],
}
