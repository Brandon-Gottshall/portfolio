'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [position, setPosition] = React.useState<'left' | 'center' | 'right'>(
    'center'
  )

  React.useEffect(() => {
    setMounted(true)
    setPosition(
      theme === 'dark' ? 'left' : theme === 'system' ? 'center' : 'right'
    )
  }, [theme])

  if (!mounted) {
    return (
      <button
        className="relative w-[120px] h-9 rounded-full transition-colors duration-300 bg-cream dark:bg-black shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_0_1px_rgba(215,203,169,0.1)]"
        aria-label="Toggle theme"
      >
        <div className="grid grid-cols-[40px_40px_40px] h-full">
          <div className="flex justify-center items-center">
            <Moon className="w-4 h-4 opacity-50 text-navy dark:text-tan" />
          </div>
          <div className="flex justify-center items-center">
            <Monitor className="w-4 h-4 opacity-50 text-navy dark:text-tan" />
          </div>
          <div className="flex justify-center items-center">
            <Sun className="w-4 h-4 opacity-50 text-navy dark:text-tan" />
          </div>
        </div>
      </button>
    )
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    if (x < width / 3) {
      setPosition('left')
      setTheme('dark')
    } else if (x < (width * 2) / 3) {
      setPosition('center')
      setTheme('system')
    } else {
      setPosition('right')
      setTheme('light')
    }
  }

  return (
    <button
      onClick={handleClick}
      className="group relative w-[120px] h-9 rounded-full transition-colors duration-300 bg-cream dark:bg-black shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_0_1px_rgba(215,203,169,0.1)]"
      aria-label="Toggle theme"
    >
      <div className="grid grid-cols-[40px_40px_40px] h-full">
        <div className="flex justify-center items-center">
          <Moon
            className={`w-4 h-4 text-navy dark:text-tan transition-opacity duration-300 ${position === 'left' ? 'opacity-100' : 'opacity-50'}`}
          />
        </div>
        <div className="flex justify-center items-center">
          <Monitor
            className={`w-4 h-4 text-navy dark:text-tan transition-opacity duration-300 ${position === 'center' ? 'opacity-100' : 'opacity-50'}`}
          />
        </div>
        <div className="flex justify-center items-center">
          <Sun
            className={`w-4 h-4 text-navy dark:text-tan transition-opacity duration-300 ${position === 'right' ? 'opacity-100' : 'opacity-50'}`}
          />
        </div>
      </div>
      <div
        className={`absolute top-1 h-7 w-7 rounded-full border-2 border-navy dark:border-tan transition-all duration-300 shadow-sm
          ${
            position === 'left'
              ? 'left-[6.5px]'
              : position === 'center'
                ? 'left-[46.5px]'
                : 'left-[86.5px]'
          }`}
      />
    </button>
  )
}
