const plugin = require('tailwindcss/plugin')

const flipCard = plugin(function ({ addUtilities }) {
  addUtilities({
    '.flip-card': {
      perspective: '40rem',
      transition: 'transform 0.8s',
      transformStyle: 'preserve-3d',
      '&:hover': {
        transform: 'rotateX(180deg)'
      }
    },
    '.manual-flip': {
      transform: 'rotateX(180deg)'
    },
    '.flip-card-body': {
      textAlign: 'left'
    },
    '.flip-card-front': {
      backfaceVisibility: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    },
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

module.exports = flipCard
