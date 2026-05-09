'use client'

import React from 'react'
import { GithubLanguageStats } from '@/components/github-stats'

export default function StatsSection() {
  return (
    <section className='py-16 bg-cream-dark/50 dark:bg-navy'>
      <div className='container px-6 mx-auto'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-light tracking-tight text-navy dark:text-cream'>
            Technical Expertise
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-dark dark:text-tan'>
            Analysis of my GitHub repositories, showing the percentage of
            projects using each technology. Hover over items to see detailed
            usage information.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 mb-16 md:grid-cols-3 md:gap-8'>
          <div>
            <h3 className='flex gap-2 justify-center items-center mb-6 text-xl font-light text-navy dark:text-cream'>
              Language Distribution
              <span
                className='text-sm font-normal text-gray-dark dark:text-tan'
                title='Shows percentage of my commits containing each programming language'
              >
                ⓘ
              </span>
            </h3>
            <div className='h-full'>
              <GithubLanguageStats type='languages' showBoth={true} />
            </div>
          </div>

          <div>
            <h3 className='flex gap-2 justify-center items-center mb-6 text-xl font-light text-navy dark:text-cream'>
              Framework Distribution
              <span
                className='text-sm font-normal text-gray-dark dark:text-tan'
                title='Shows percentage of my commits that use each framework'
              >
                ⓘ
              </span>
            </h3>
            <div className='h-full'>
              <GithubLanguageStats type='frameworks' showBoth={true} />
            </div>
          </div>

          <div>
            <h3 className='flex gap-2 justify-center items-center mb-6 text-xl font-light text-navy dark:text-cream'>
              Development Tools
              <span
                className='text-sm font-normal text-gray-dark dark:text-tan'
                title='Shows percentage of my commits that use each development tool'
              >
                ⓘ
              </span>
            </h3>
            <div className='h-full'>
              <GithubLanguageStats type='tools' showBoth={true} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
