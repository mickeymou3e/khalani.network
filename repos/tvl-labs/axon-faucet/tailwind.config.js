/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "axon-theme": "#619bbe",
        "axon-background": "#F7F3ED",
      },
      fontFamily: {
        "alfarn-2": ["alfarn-2", "serif"],
        courier: ["Courier Std Bold", "monospace"],
      },
    },
  },
  plugins: [],
};
