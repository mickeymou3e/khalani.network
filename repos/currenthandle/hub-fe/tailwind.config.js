/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // utilities: {
      //   ".file-hidden": {
      //     "&::-webkit-file-upload-button, &::file-selector-button": {
      //       display: "none",
      //     },
      //   },
      // },
      keyframes: {
        slideParent: {
          // "0%": {
          // borderRadius: "100%",
          // },
          "40%": {
            width: "2rem",
            // borderRadius: "100%",
            // display: "flex",
            justifyContent: "flex-start",
          },
          "41%": {
            // borderRadius: "100%",
            display: "flex",
            justifyContent: "left",
          },
          "100%": { width: "3.6rem", borderRadius: "2.5rem" },
        },
        slideIn: {
          "0%": {
            display: "none",
            marginLeft: 0,
          },
          "60%": {
            display: "none",
            transform: "translateX(200%)",
          },
          "61%": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            transform: "translateX(100%)",
          },
          "100%": {
            transform: "translateX(0)",
            marginLeft: "auto",
          },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        slideIn: "slideIn 1s forwards",
        slideParent: "slideParent 1s forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
