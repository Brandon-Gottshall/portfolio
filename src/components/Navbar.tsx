'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeSwitch } from './ThemeSwitch';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="p-4 bg-cream dark:bg-navy-darkest border-b border-navy/10 dark:border-cream/10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-light text-navy dark:text-cream">
          BG
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            <Link 
              href="/about" 
              className="text-navy dark:text-cream hover:text-navy-light dark:hover:text-cream/80 transition-colors duration-200"
            >
              About
            </Link>
            <Link 
              href="/projects" 
              className="text-navy dark:text-cream hover:text-navy-light dark:hover:text-cream/80 transition-colors duration-200"
            >
              Projects
            </Link>
            <Link 
              href="/blog" 
              className="text-navy dark:text-cream hover:text-navy-light dark:hover:text-cream/80 transition-colors duration-200"
            >
              Blog
            </Link>
            <Link 
              href="/contact" 
              className="text-navy dark:text-cream hover:text-navy-light dark:hover:text-cream/80 transition-colors duration-200"
            >
              Contact
            </Link>
          </div>

          <ThemeSwitch />
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <div className="space-y-2">
              <span className={`block w-8 h-0.5 bg-navy dark:bg-cream transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
              <span className={`block w-8 h-0.5 bg-navy dark:bg-cream transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-8 h-0.5 bg-navy dark:bg-cream transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? 'flex' : 'hidden'} absolute top-16 left-0 right-0 flex-col items-center space-y-4 py-4 bg-cream dark:bg-navy-darkest border-b border-navy/10 dark:border-cream/10 md:hidden`}>
          <Link 
            href="/about" 
            className="text-navy dark:text-cream hover:text-navy-light dark:hover:text-cream/80 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/projects" 
            className="text-navy dark:text-cream hover:text-navy-light dark:hover:text-cream/80 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
          <Link 
            href="/blog" 
            className="text-navy dark:text-cream hover:text-navy-light dark:hover:text-cream/80 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Blog
          </Link>
          <Link 
            href="/contact" 
            className="text-navy dark:text-cream hover:text-navy-light dark:hover:text-cream/80 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
} 