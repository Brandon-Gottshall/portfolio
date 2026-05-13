import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className='pt-20 bg-cream dark:bg-navy-darkest md:py-32'>
      <div className='container px-6 mx-auto'>
        <div className='flex flex-col items-center md:flex-row'>
          <div className='z-10 mb-10 md:w-1/2 md:bm-0'>
            <div className='inline-flex items-center px-3 py-1 mb-6 text-sm rounded-full bg-navy/10 dark:bg-cream/10 text-navy dark:text-cream'>
              <span className='mr-2'>·</span> Field record
            </div>
            <h1 className='mb-2 text-5xl font-light tracking-tight leading-tight md:text-6xl text-navy dark:text-cream'>
              Brandon Gottshall
            </h1>
            <p className='mb-6 text-2xl font-light md:text-3xl text-gray-dark dark:text-tan'>
              Software, research notes, tools, and visual systems.
            </p>
            <p className='mb-8 max-w-xl text-lg font-normal text-gray-dark dark:text-tan'>
              A public record of what is being built, studied, shaped, and
              revised.
            </p>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <Link
                href='#current-work'
                className='inline-flex gap-2 items-center px-6 py-3 font-medium rounded-lg transition-colors bg-navy text-cream hover:bg-navy-light dark:bg-cream dark:text-navy dark:hover:bg-cream/90'
              >
                Work <ArrowRight className='w-4 h-4' />
              </Link>
              <Link
                href='/notes'
                className='inline-flex gap-2 items-center px-6 py-3 font-medium bg-transparent rounded-lg border transition-colors border-navy/20 dark:border-cream/20 text-navy dark:text-cream hover:border-navy/40 hover:bg-navy/5 dark:hover:border-cream/40 dark:hover:bg-cream/5'
              >
                Notes
              </Link>
            </div>
          </div>
          <div className='flex justify-center md:w-1/2 md:justify-end'>
            <div className='relative'>
              {/* Portrait with frame */}
              <div className='relative z-10 p-1 bg-gradient-to-b rounded-full from-red/10 to-navy/5 dark:from-red/10 dark:to-cream/5'>
                <div className='overflow-hidden rounded-full border border-navy/10 dark:border-cream/10'>
                  <Image
                    src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ProfileTransparent-LKlc3BUBnMuebS911NlTSuJjHfqwoy.webp'
                    alt='Brandon - Software Engineer'
                    width={300}
                    height={300}
                    className='w-[280px] h-[280px] md:w-[350px] md:h-[350px] object-cover'
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
