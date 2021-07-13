module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-60px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'fade-in-from-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(300px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          },
        }
      },
      animation: {
        'bounce-quick': 'bounce .75s infinite',
        'fade-in-down': 'fade-in-down .5s ease-in',
        'fade-in-from-right': 'fade-in-from-right .5s ease-in'
      }
    },
  },
  variants: {},
  plugins: [],
}
