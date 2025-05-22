/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#F2EDE4',
        'secondary': '#548C6C',
        'tertiary': '#D99036',
        'quaternary': '#402D15',
        'quinary': '#19373B',
      },
    },
  },
  plugins: [],
}

