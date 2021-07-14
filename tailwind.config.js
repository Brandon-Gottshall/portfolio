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
          }
        },
        'fade-in-from-right': {
          '0%': {
            opacity: '1',
            transform: 'translateX(75vw)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'fade-in-from-left': {
          '0%': {
            opacity: '1',
            transform: 'translateX(-75vw)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'fade-out-to-left': {
          '0%': {
            opacity: '1',
            transform: 'translateX(0px)'
          },
          '100%': {
            opacity: '0',
            transform: 'translateX(300px)'
          }
        }
      },
      flex: {
        fill: '0 0 100%'
      },
      animation: {
        'bounce-quick': 'bounce .75s infinite',
        'fade-in-down': 'fade-in-down .5s ease-in',
        'fade-in-from-left': 'fade-in-from-left .3s ease-in',
        'fade-in-from-right': 'fade-in-from-right .3s ease-in',
        'fade-out-to-left': 'fade-out-to-left .3s ease-out'
      },
      translate: {
        'off-screen-right': '75vw',
        'off-screen-left': '-75vw'
      }
    }
  },
  variants: {},
  plugins: [require('tailwindcss-neumorphism'), require('tailwind-scrollbar-hide')]
}
