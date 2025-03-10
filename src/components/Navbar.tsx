'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ThemeSwitch } from './ThemeSwitch';
import { ChevronDown } from 'lucide-react';

const navLinks = [
  { title: 'About', href: '/about' },
  { title: 'Projects', href: '/projects' },
  { title: 'Blog', href: '/blog' },
  { title: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <nav className="p-4 bg-cream dark:bg-navy-darkest border-b border-navy/10 dark:border-cream/10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Name that expands */}
        <motion.div
          className="relative group"
          initial={false}
          onMouseLeave={() => !isMobile && setIsExpanded(false)}
        >
          <motion.div
            className="flex items-center gap-1 cursor-pointer pb-2 group-hover:text-navy-light dark:group-hover:text-cream/80 transition-colors duration-200"
            initial={{ width: 'auto' }}
            animate={{ width: isExpanded ? 'auto' : '2.5rem' }}
            onClick={() => setIsExpanded(!isExpanded)}
            onHoverStart={() => !isMobile && setIsExpanded(true)}
          >
            <Link href="/" className="whitespace-nowrap text-2xl font-light text-navy dark:text-cream hover:text-navy-light dark:hover:text-cream/80 transition-colors duration-200">
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
                  repeatType: "reverse",
                  duration: 1,
                  ease: "easeInOut",
                  repeatDelay: 0.5
                },
                rotate: {
                  duration: 0.2
                }
              }}
              className="opacity-50 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronDown className="h-4 w-4 text-navy dark:text-cream" />
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
                className="absolute top-full left-0 -mt-2 z-50"
              >
                <div className="py-1 min-w-[160px] bg-cream dark:bg-navy-darkest border border-navy/10 dark:border-cream/10 rounded-lg shadow-lg">
                  <div className="py-1"> {/* Extra padding container to maintain hover area */}
                    {navLinks.map((link) => (
                      <Link
                        key={link.title}
                        href={link.href}
                        onClick={() => setIsExpanded(false)}
                        className="block px-4 py-2 text-navy dark:text-cream hover:bg-navy/5 dark:hover:bg-cream/5 transition-colors duration-200"
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
        <div className="flex items-center">
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
} 