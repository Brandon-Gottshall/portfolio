'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ThemeSwitch } from './ThemeSwitch'
import { ChevronDown } from 'lucide-react'

const navLinks = [
  { title: 'Work', href: '/projects' },
  { title: 'Notes', href: '/notes' },
  { title: 'Objects', href: '/objects' },
  { title: 'Documents', href: '/documents' },
  { title: 'About', href: '/about' }
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isStudioPage, setIsStudioPage] = useState(false)

  useEffect(() => {
    const checkStudioPage = () => {
      setIsStudioPage(
        window.location.pathname.startsWith('/studio') ||
          window.location.pathname.startsWith('/admin')
      )
    }

    checkStudioPage()
  }, [])

  const navZIndex = isStudioPage ? 'z-[9999]' : 'z-20'

  return (
    <nav
      className={`p-4 border-b ${navZIndex} bg-cream dark:bg-navy-darkest border-navy/10 dark:border-cream/10`}
    >
      <div className='container flex justify-between items-center mx-auto'>
        <Link
          href='/'
          className='flex items-baseline gap-3 text-navy transition-colors duration-200 hover:text-navy-light dark:text-cream dark:hover:text-cream/80'
          onClick={() => setIsMenuOpen(false)}
        >
          <span className='font-code text-sm font-semibold tracking-[0.35em]'>
            BG
          </span>
          <span className='hidden text-2xl font-light whitespace-nowrap sm:inline'>
            Brandon Gottshall
          </span>
        </Link>

        <div className='hidden items-center gap-6 md:flex'>
          {navLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className='text-sm font-medium transition-colors text-navy/80 hover:text-blue dark:text-cream/80 dark:hover:text-blue-accent'
            >
              {link.title}
            </Link>
          ))}
        </div>

        <div className='flex items-center gap-3'>
          <button
            type='button'
            className='inline-flex items-center gap-1 rounded-full border border-navy/10 px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-navy/5 dark:border-cream/10 dark:text-cream dark:hover:bg-cream/5 md:hidden'
            aria-expanded={isMenuOpen}
            aria-controls='mobile-navigation'
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            Menu
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>
          <ThemeSwitch />
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id='mobile-navigation'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='container mx-auto overflow-hidden md:hidden'
          >
            <div className='mt-4 grid gap-2 rounded-2xl border border-navy/10 bg-white/70 p-2 shadow-sm dark:border-cream/10 dark:bg-navy/80'>
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className='rounded-xl px-4 py-3 text-navy transition-colors hover:bg-navy/5 dark:text-cream dark:hover:bg-cream/5'
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
