const plugin = require('tailwindcss/plugin')

// Rotate X utilities
const flipCard = plugin(function ({ addUtilities }) {
  addUtilities({
    '.smooth-flip > *': {
      transition: 'transform 0.8s',
      transformStyle: 'preserve-3d',
      perspective: '1000px'
    },
    '.flip-card': {
      perspective: '1000px',
      /* Do an horizontal flip when you move the mouse over the flip box container */
      '&:hover': {
        transform: 'rotateY(180deg)'
      }
    },
    '.flipped-card': {
      perspective: '1000px',
      transform: 'rotateY(180deg)'
    },
    /* This container is needed to position the front and back side */
    '.flip-card-inner': {
      position: 'relative',
      width: '100%',
      height: '100%',
      textAlign: 'center',
      transform: 'rotateY(0deg)',
      /* Do an horizontal flip when you move the mouse over the flip box container */
      '&:hover': {
        transform: 'rotateY(180deg)'
      }
    },
    '.flip-card-inner-mobile': {
      position: 'relative',
      width: '100%',
      height: '100%',
      textAlign: 'center'
    },
    '.flipped-card-inner': {
      position: 'relative',
      width: '100%',
      height: '100%',
      textAlign: 'center',
      transform: 'rotateY(180deg)'
      // webkitBackfaceVisibility: 'hidden', /* Safari */
      // backfaceVisibility: 'hidden'
    },

    /* Style the front side (fallback if image is missing) */
    '.flip-card-front': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      transform: 'rotateY(0deg)'
    },
    '.flipped-card-front': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      transform: 'rotateY(180deg)'
    },

    /* Style the back side */
    '.flip-card-back': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      transform: 'rotateY(180deg)'
    },
    '.flipped-card-back': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      transform: 'rotateY(0deg)'
    }
  })
})

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
  plugins: [require('tailwindcss-neumorphism'), require('tailwind-scrollbar-hide'), flipCard]
}
