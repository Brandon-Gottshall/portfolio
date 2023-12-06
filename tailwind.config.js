const plugin = require('tailwindcss')
const color = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    screens: {
      xs: '420px',
      tiny: '200px',
      sm: '640px'
    },
    fontFamily: {
      ox: 'Oxanium'
    },
    extend: {
      boxShadow: {
        'neu-outset':
          '10px 10px 20px rgba(204, 214, 221, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.8)', // Outset shadow
        'neu-inset': 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff' // Inset shadow
      },
      textShadow: {
        white:
          '0 0.3px 2px #ffffff, 0 -0.3px 2px #ffffff, 0.3px 0 2px #ffffff, -0.3px 0 2px #ffffff',
        black:
          '0 0.3px 2px #000000, 0 -0.3px 2px #000000, 0.3px 0 2px #000000, -0.3px 0 2px #000000'
      },
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
      },
      rotate: {
        135: '135deg'
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('@tinycreek/tailwindcss-textshadow'),
    require('tailwind-scrollbar'),
    require('./tailwind-plugins/flipCard'),
    require('./tailwind-plugins/neumorphism'),
    plugin(function ({ addBase }) {
      addBase({
        '@import':
          "url('https://fonts.googleapis.com/css2?family=Oxanium:wght@200;400&display=swap')"
      })
    })
  ]
}
