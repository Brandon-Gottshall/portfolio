const plugin = require('tailwindcss/plugin')

// Rotate X utilities
const flipCard = plugin(function ({ addUtilities }) {
  addUtilities({
    '.flip-card': {
      /* Do an horizontal flip when you move the mouse over the flip box container */
      perspective: '40rem',
      transition: 'transform 0.8s',
      transformStyle: 'preserve-3d',
      /* Do an horizontal flip when you move the mouse over the flip box container */
      '&:hover': {
        transform: 'rotateX(180deg)'
      }
    },
    '.manual-flip': {
      transform: 'rotateX(180deg)'
    },
    /* This container is needed to position the front and back side */
    '.flip-card-body': {
      textAlign: 'left'
    },
    /* Style the front side (fallback if image is missing) */
    '.flip-card-front': {
      backfaceVisibility: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    },
    /* Style the back side */
    '.flip-card-back': {
      backfaceVisibility: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      transform: 'rotateX(-180deg)'
    }
  })
})

module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '420px',
      tiny: '200px',
      sm: '640px'
    },
    extend: {
      textShadow: {
        white: '0 0.3px 2px #ffffff, 0 -0.3px 2px #ffffff, 0.3px 0 2px #ffffff, -0.3px 0 2px #ffffff',
        black: '0 0.3px 2px #000000, 0 -0.3px 2px #000000, 0.3px 0 2px #000000, -0.3px 0 2px #000000'
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
      }
    }
  },
  plugins: [require('tailwindcss-neumorphism'), require('tailwind-scrollbar-hide'), require('tailwind-scrollbar'), require('tailwindcss-textshadow'), flipCard]
}
