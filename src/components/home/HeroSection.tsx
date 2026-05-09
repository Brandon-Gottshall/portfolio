'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'

const TextLoop = dynamic(
  () => import('react-text-loop-next').then((mod) => mod.TextLoop),
  { ssr: false }
)

export default function HeroSection() {
  return (
    <section className='pt-20 bg-cream dark:bg-navy-darkest md:py-32'>
      <div className='container px-6 mx-auto'>
        <div className='flex flex-col items-center md:flex-row'>
          <div className='z-10 mb-10 md:w-1/2 md:bm-0'>
            <div className='inline-flex items-center px-3 py-1 mb-6 text-sm rounded-full bg-navy/10 dark:bg-cream/10 text-navy dark:text-cream'>
              <span className='mr-2'>✓</span> Available for new projects
            </div>
            <h1 className='mb-2 text-5xl font-light tracking-tight leading-tight md:text-6xl text-navy dark:text-cream'>
              Brandon Gottshall
            </h1>
            <div className='mb-6'>
              <TextLoop
                interval={2000}
                springConfig={{ stiffness: 180, damping: 8 }}
                adjustingSpeed={200}
                fade={true}
                delay={0}
                mask={true}
                noWrap={false}
              >
                <span className='text-2xl font-light font-code md:text-3xl text-gray-dark dark:text-tan'>
                  Software Engineer
                </span>
                <span className='text-2xl font-light md:text-3xl text-gray-dark dark:text-tan'>
                  SE Bootcamp Instructor
                </span>
                <span className='text-2xl font-light md:text-3xl text-gray-dark dark:text-tan'>
                  Marine Corps Veteran
                </span>
                <span className='text-2xl font-light md:text-3xl text-gray-dark dark:text-tan'>
                  Lifetime Student
                </span>
                <span className='text-2xl font-light font-code md:text-3xl text-gray-dark dark:text-tan'>
                  Automation Enthusiast
                </span>
              </TextLoop>
            </div>
            <p className='mb-8 max-w-xl text-lg font-normal text-gray-dark dark:text-tan'>
              I&apos;m a specialized software engineer with experience crafting
              high-performance, scalable web applications that users love.
            </p>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <button className='flex gap-2 items-center px-6 py-3 font-medium rounded-lg transition-colors bg-blue hover:bg-blue-light text-cream'>
                View My Work <ArrowRight className='w-4 h-4' />
              </button>
              <button className='px-6 py-3 font-medium bg-transparent rounded-lg border transition-colors border-navy/20 dark:border-cream/20 text-navy dark:text-cream hover:bg-navy/5 dark:hover:bg-cream/5'>
                Contact Me
              </button>
            </div>
          </div>
          <div className='flex justify-center md:w-1/2 md:justify-end'>
            <div className='relative'>
              {/* Decorative circle behind portrait */}
              <div className='absolute w-[280px] h-[280px] md:w-[350px] md:h-[350px] rounded-full bg-gradient-to-br from-red/10 to-navy/10 dark:from-red/5 dark:to-cream/5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'></div>

              {/* Decorative elements */}
              <div className='absolute w-full h-full'>
                <div className='absolute top-0 right-0 w-20 h-20 rounded-full blur-xl bg-red/5 dark:bg-red/10'></div>
                <div className='absolute bottom-10 left-10 w-16 h-16 rounded-full blur-xl bg-navy/5 dark:bg-cream/10'></div>
              </div>

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
