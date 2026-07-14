import type { Metadata } from 'next'
import { Oxanium } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { FooterWrapper } from '@/components/FooterWrapper'
import { Providers } from './providers'

// Initialize the Oxanium font
const oxanium = Oxanium({
  subsets: ['latin'],
  weight: ['200', '400'],
  variable: '--font-oxanium'
})

// Metadata (replaces Head from _app.js)
export const metadata: Metadata = {
  title: {
    template: '%s | Brandon Gottshall',
    default: 'Brandon Gottshall'
  },
  description:
    'Brandon Gottshall — software engineer and data science student. A working record of software systems, research notes, and developer tools.'
}

// Root layout (combines _app.js and Layout.js)
export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={oxanium.variable} suppressHydrationWarning>
      <body className='min-h-screen transition-colors duration-300 bg-background text-foreground'>
        <Providers attribute='class' defaultTheme='system' enableSystem>
          <div className='flex flex-col min-h-screen'>
            <a
              href='#main-content'
              className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-cream'
            >
              Skip to content
            </a>
            <header>
              <Navbar />
            </header>
            <main id='main-content' className='flex-grow'>
              {children}
            </main>
            <FooterWrapper />
          </div>
        </Providers>
      </body>
    </html>
  )
}
