'use client'

import Link from 'next/link'
import { Linkedin, Github, Mail, Calendar } from 'lucide-react'

import type { JSX } from 'react'

export function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='w-full bg-navy-darkest'>
      <div className='container px-4 py-8 mx-auto text-cream'>
        <div className='flex flex-col gap-8 justify-center items-center md:flex-row md:justify-evenly md:items-start'>
          <div className='flex flex-col items-center text-center md:items-start md:text-left'>
            <h3 className='mb-4 text-xl font-semibold'>
              Need workflow-heavy software?
            </h3>
            <Link
              href='/contact'
              className='inline-flex gap-2 items-center px-6 py-3 font-medium rounded-lg transition-colors duration-300 bg-cream text-navy hover:bg-cream/90'
            >
              <Calendar className='w-5 h-5' />
              Start a conversation
            </Link>
          </div>

          <div className='flex flex-col items-center text-center md:items-start md:text-left'>
            <h3 className='mb-4 text-xl font-semibold'>Channels</h3>
            <p className='mb-4 text-cream/80'>Email is the fastest channel.</p>
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
                Projects
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
