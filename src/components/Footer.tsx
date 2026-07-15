'use client'

import Link from 'next/link'
import { Linkedin, Github, Mail } from 'lucide-react'

import type { JSX } from 'react'

export function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='w-full bg-navy-darkest'>
      <div className='container px-4 py-8 mx-auto text-cream'>
        <div className='flex flex-col gap-8 justify-center items-center md:flex-row md:justify-evenly md:items-start'>
          <div className='flex flex-col items-center text-center md:items-start md:text-left'>
            <h3 className='mb-4 text-xl font-semibold'>Field record</h3>
            <p className='max-w-xs text-sm leading-6 text-cream/70'>
              Software, notes, objects, and older traces from Brandon Gottshall.
            </p>
          </div>

          <div className='flex flex-col items-center text-center md:items-start md:text-left'>
            <h3 className='mb-4 text-xl font-semibold'>Channels</h3>
            <div className='flex gap-4'>
              <a
                href='https://linkedin.com/in/brandon-gottshall'
                target='_blank'
                rel='noopener noreferrer'
                className='transition-colors duration-300 hover:text-blue-accent'
                aria-label='LinkedIn Profile'
              >
                <Linkedin className='w-6 h-6' />
              </a>
              <a
                href='https://github.com/Brandon-Gottshall'
                target='_blank'
                rel='noopener noreferrer'
                className='transition-colors duration-300 hover:text-blue-accent'
                aria-label='GitHub Profile'
              >
                <Github className='w-6 h-6' />
              </a>
              <a
                href='mailto:blgottshall@gmail.com'
                className='transition-colors duration-300 hover:text-blue-accent'
                aria-label='Email Contact'
              >
                <Mail className='w-6 h-6' />
              </a>
            </div>
          </div>

          <div className='flex flex-col items-center text-center md:items-start md:text-left'>
            <h3 className='mb-4 text-xl font-semibold'>Pages</h3>
            <nav className='flex flex-col space-y-2'>
              <Link
                href='/'
                className='transition-colors duration-300 hover:text-blue-accent'
              >
                Home
              </Link>
              <Link
                href='/projects'
                className='transition-colors duration-300 hover:text-blue-accent'
              >
                Work
              </Link>
              <Link
                href='/notes'
                className='transition-colors duration-300 hover:text-blue-accent'
              >
                Notes
              </Link>
              <Link
                href='/objects'
                className='transition-colors duration-300 hover:text-blue-accent'
              >
                Objects
              </Link>
              <Link
                href='/about'
                className='transition-colors duration-300 hover:text-blue-accent'
              >
                About
              </Link>
              <Link
                href='/contact'
                className='transition-colors duration-300 hover:text-blue-accent'
              >
                Contact
              </Link>
              <Link
                href='/about#documents'
                className='transition-colors duration-300 hover:text-blue-accent'
              >
                Resume / CV
              </Link>
            </nav>
          </div>
        </div>

        <div className='pt-4 mt-8 border-t border-cream/20'>
          <p className='text-sm text-center text-cream/60'>
            © {currentYear} Brandon Gottshall
          </p>
        </div>
      </div>
    </footer>
  )
}
