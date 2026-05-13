import type { Config } from 'tailwindcss'

/**
 * Color values live in src/app/globals.css as CSS custom properties
 * (--color-* for the brand palette, semantic aliases like --primary
 * point to those). Edit the palette there, not here.
 *
 * Channel format ("<r> <g> <b>") makes Tailwind's <alpha-value>
 * placeholder work, so utilities like bg-navy/40 compose cleanly.
 */
const channel = (token: string) => `rgb(var(--${token}) / <alpha-value>)`

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand palette
        navy: {
          darkest: channel('color-navy-darkest'),
          dark: channel('color-navy-dark'),
          DEFAULT: channel('color-navy'),
          light: channel('color-navy-light')
        },
        cream: {
          light: channel('color-cream-light'),
          DEFAULT: channel('color-cream'),
          dark: channel('color-cream-dark')
        },
        tan: {
          DEFAULT: channel('color-tan'),
          muted: channel('color-tan-muted')
        },
        gray: {
          DEFAULT: channel('color-gray'),
          dark: channel('color-gray-dark')
        },
        red: {
          DEFAULT: channel('color-red'),
          dark: channel('color-red-dark')
        },
        blue: {
          DEFAULT: channel('color-blue'),
          light: channel('color-blue-light'),
          dark: channel('color-blue-dark'),
          accent: channel('color-blue-accent')
        },

        // Semantic aliases (shadcn/ui primitives consume these)
        background: channel('background'),
        foreground: channel('foreground'),
        border: channel('border'),
        input: channel('input'),
        ring: channel('ring'),
        card: {
          DEFAULT: channel('card'),
          foreground: channel('card-foreground')
        },
        popover: {
          DEFAULT: channel('popover'),
          foreground: channel('popover-foreground')
        },
        primary: {
          DEFAULT: channel('primary'),
          foreground: channel('primary-foreground')
        },
        secondary: {
          DEFAULT: channel('secondary'),
          foreground: channel('secondary-foreground')
        },
        muted: {
          DEFAULT: channel('muted'),
          foreground: channel('muted-foreground')
        },
        accent: {
          DEFAULT: channel('accent'),
          foreground: channel('accent-foreground')
        },
        destructive: {
          DEFAULT: channel('destructive'),
          foreground: channel('destructive-foreground')
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        code: ['Fira Code', 'monospace']
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: []
} satisfies Config
