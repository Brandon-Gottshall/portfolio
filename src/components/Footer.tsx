'use client'

import Link from 'next/link'
import { Linkedin, Github, Mail, Calendar } from 'lucide-react'

import type { JSX } from 'react'

interface FooterProps {
  lastUpdated: string
}

export function Footer ({ lastUpdated }: FooterProps): JSX.Element {
  console.log('Footer component is rendering')
  const currentYear = new Date().getFullYear()

  return (
    <footer className='w-full bg-navy-darkest'>
      <div className='container px-4 py-8 mx-auto text-cream'>
        {/* Top row: 3 columns, centered as a group */}
        <div className='flex flex-col gap-8 justify-center items-center md:flex-row md:justify-evenly md:items-start'>
          {/* CTA Section */}
          <div className='flex flex-col items-center text-center md:items-start md:text-left'>
            <h3 className='mb-4 text-xl font-semibold'>
              Let&apos;s Create Something Amazing
            </h3>
            <Link
              href='/contact'
              className='inline-flex gap-2 items-center px-6 py-3 font-medium rounded-lg transition-colors duration-300 bg-cream text-navy hover:bg-cream/90'
            >
              <Calendar className='w-5 h-5' />
              Schedule a Call
            </Link>
          </div>

          {/* Contact Section */}
          <div className='flex flex-col items-center text-center md:items-start md:text-left'>
            <h3 className='mb-4 text-xl font-semibold'>Get in Touch</h3>
            <p className='mb-4 text-cream/80'>
              Reach out to discuss opportunities
            </p>
            <div className='flex gap-4'>
              <a
                href='https://linkedin.com/in/brandon-gottshall'
                target='_blank'
                rel='noopener noreferrer'
                className='transition-colors duration-300 hover:text-accent'
                aria-label='LinkedIn Profile'
              >
                <Linkedin className='w-6 h-6' />
              </a>
              <a
                href='https://github.com/Brandon-Gottshall'
                target='_blank'
                rel='noopener noreferrer'
                className='transition-colors duration-300 hover:text-accent'
                aria-label='GitHub Profile'
              >
                <Github className='w-6 h-6' />
              </a>
              <a
                href='mailto:Brandon.Gottshall@gmail.com'
                className='transition-colors duration-300 hover:text-accent'
                aria-label='Email Contact'
              >
                <Mail className='w-6 h-6' />
              </a>
            </div>
          </div>

          {/* Navigation Section */}
          <div className='flex flex-col items-center text-center md:items-start md:text-left'>
            <h3 className='mb-4 text-xl font-semibold'>Quick Links</h3>
            <nav className='flex flex-col space-y-2'>
              <Link
                href='/'
                className='transition-colors duration-300 hover:text-accent'
              >
                Home
              </Link>
              <Link
                href='/projects'
                className='transition-colors duration-300 hover:text-accent'
              >
                Projects
              </Link>
              <Link
                href='/resume'
                className='transition-colors duration-300 hover:text-accent'
              >
                Resume
              </Link>
              <Link
                href='/contact'
                className='transition-colors duration-300 hover:text-accent'
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='pt-4 mt-8 border-t border-cream/20'>
          <div className='flex flex-col gap-2 justify-center items-center text-sm md:flex-row md:justify-between text-cream/60'>
            <p>© {currentYear} Brandon Gottshall. All rights reserved.</p>
            <p>Last Updated: {lastUpdated}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
