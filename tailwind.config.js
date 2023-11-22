/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '400px',
        // => @media (min-width: 640px) { ... }
  
        'md': '500px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '768px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1024px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      }
    },
  },
  plugins: [],
}

