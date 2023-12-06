const plugin = require('tailwindcss/plugin')
const Color = require('tailwindcss/colors')

const neumorphismPlugin = plugin(
  function ({ addUtilities, theme, variants }) {
    const colors = theme('colors')
    const neumorphismSize = theme('neumorphismSize', {})
    const defaultVariants = variants('neumorphism', [])

    const generateNeumorphism = (colorName, value) => {
      let color
      try {
        color = Color(value)
      } catch (e) {
        // Ignore invalid colors
        return null
      }

      const shadowColorLight = color.lighten(0.1).alpha(0.5).string()
      const shadowColorDark = color.darken(0.3).alpha(0.5).string()

      const utilities = Object.entries(neumorphismSize).map(([key, size]) => {
        const className = `.neumorphism-${colorName}-${key}`
        return {
          [className]: {
            boxShadow: `inset ${size} ${size} ${size} ${shadowColorDark}, inset -${size} -${size} ${size} ${shadowColorLight}`
          }
        }
      })

      return utilities
    }

    const neumorphismUtilities = Object.keys(colors)
      .flatMap(color => {
        const colorValue = colors[color]
        if (typeof colorValue === 'string' && !colorValue.startsWith('var(')) {
          return generateNeumorphism(color, colorValue)
        }

        if (typeof colorValue === 'object') {
          return Object.keys(colorValue).flatMap(shade => {
            const shadeValue = colorValue[shade]
            return generateNeumorphism(`${color}-${shade}`, shadeValue)
          })
        }

        return []
      })
      .filter(Boolean)

    addUtilities(neumorphismUtilities, defaultVariants)
  },
  {
    theme: {
      neumorphismSize: {
        xs: '0.125rem',
        sm: '0.25rem',
        default: '0.5rem',
        lg: '1rem',
        xl: '2rem'
      }
    },
    variants: {
      neumorphism: ['responsive', 'hover']
    }
  }
)

module.exports = neumorphismPlugin
