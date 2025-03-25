'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ThemeSwitch } from './ThemeSwitch'
import { ChevronDown } from 'lucide-react'

const navLinks = [
  { title: 'About', href: '/about' },
  { title: 'Projects', href: '/projects' },
  { title: 'Blog', href: '/blog' },
  { title: 'Contact', href: '/contact' }
]

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isStudioPage, setIsStudioPage] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const checkStudioPage = () => {
      setIsStudioPage(window.location.pathname.startsWith('/studio'))
    }

    checkMobile()
    checkStudioPage()

    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const navZIndex = isStudioPage ? 'z-[9999]' : 'z-20'

  return (
    <nav
      className={`p-4 border-b ${navZIndex} bg-cream dark:bg-navy-darkest border-navy/10 dark:border-cream/10`}
    >
      <div className='container flex justify-between items-center mx-auto'>
        {/* Logo/Name that expands */}
        <motion.div
          className='relative group'
          initial={false}
          onMouseLeave={() => !isMobile && setIsExpanded(false)}
        >
          <motion.div
            className='flex gap-1 items-center pb-2 transition-colors duration-200 cursor-pointer group-hover:text-navy-light dark:group-hover:text-cream/80'
            initial={{ width: 'auto' }}
            animate={{ width: isExpanded ? 'auto' : '2.5rem' }}
            onClick={() => setIsExpanded(!isExpanded)}
            onHoverStart={() => !isMobile && setIsExpanded(true)}
          >
            <Link
              href='/'
              className='text-2xl font-light whitespace-nowrap transition-colors duration-200 text-navy dark:text-cream hover:text-navy-light dark:hover:text-cream/80'
            >
              {isExpanded ? 'Brandon Gottshall' : 'BG'}
            </Link>
            <motion.div
              initial={{ y: 0 }}
              animate={{
                y: [0, -2, 0],
                rotate: isExpanded ? 180 : 0
              }}
              transition={{
                y: {
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 1,
                  ease: 'easeInOut',
                  repeatDelay: 0.5
                },
                rotate: {
                  duration: 0.2
                }
              }}
              className='opacity-50 transition-opacity duration-200 group-hover:opacity-100'
            >
              <ChevronDown className='w-4 h-4 text-navy dark:text-cream' />
            </motion.div>
          </motion.div>

          {/* Accordion menu */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`absolute left-0 top-full ${isStudioPage ? 'z-[9999]' : 'z-50'} -mt-2`}
              >
                <div className='py-1 min-w-[160px] bg-cream dark:bg-navy-darkest border border-navy/10 dark:border-cream/10 rounded-lg shadow-lg'>
                  <div className='py-1'>
                    {' '}
                    {navLinks.map((link) => (
                      <Link
                        key={link.title}
                        href={link.href}
                        onClick={() => setIsExpanded(false)}
                        className='block px-4 py-2 transition-colors duration-200 text-navy dark:text-cream hover:bg-navy/5 dark:hover:bg-cream/5'
                      >
                        {link.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Theme Switch */}
        <div className='flex items-center'>
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  )
}
