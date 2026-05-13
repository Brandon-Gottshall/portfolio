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
  description: 'Software Engineer & Web Developer'
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
            <Navbar />
            <main className='flex-grow'>{children}</main>
            <FooterWrapper />
          </div>
        </Providers>
      </body>
    </html>
  )
}
