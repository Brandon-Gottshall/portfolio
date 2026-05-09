import { CheckCircle, Star, Terminal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import HeroSection from '@/components/home/HeroSection'
import ProjectsSection from '@/components/home/ProjectsSection'
import StatsSection from '@/components/home/StatsSection'
import { SOCIAL_LINKS } from '@/config/social'
import getPayload from '@/payload/getPayload'
import { toProjectUI } from '@/types/ui'
import type { Project } from '@/types/payload-types'

export default async function Home() {
  try {
    // Get Payload client and fetch featured projects
    const payload = await getPayload()
    const { docs: projects } = await payload.find<Project>({
      collection: 'projects',
      where: {
        featured: {
          equals: true
        }
      },
      depth: 1
    })

    // Transform projects into UI-friendly format
    const uiProjects = projects.map(toProjectUI)

    return (
      <main className='min-h-screen bg-cream dark:bg-navy-darkest'>
        <HeroSection />

        {/* Why Choose Me Section */}
        <section className='pt-10 pb-20 bg-cream dark:bg-navy-darkest'>
          <div className='container px-6 mx-auto'>
            <div className='mb-16 text-center'>
              <h2 className='mb-4 text-3xl font-light tracking-tight md:text-4xl text-navy dark:text-cream'>
                Why Work With Me?
              </h2>
              <p className='mx-auto max-w-2xl text-lg text-gray-dark dark:text-tan'>
                I bring technical expertise, business understanding, and a
                commitment to excellence to every project
              </p>
            </div>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
              <div className='p-8 rounded-xl border transition-all bg-white/80 dark:bg-navy border-navy/10 dark:border-cream/10 hover:border-navy/30 dark:hover:border-cream/30 hover:shadow-lg'>
                <div className='flex justify-center items-center mb-6 w-12 h-12 rounded-lg bg-cream dark:bg-navy-light/50'>
                  <Terminal className='w-6 h-6 text-navy dark:text-cream' />
                </div>
                <h3 className='mb-3 text-xl font-light text-navy dark:text-cream'>
                  Technical Excellence
                </h3>
                <p className='text-gray-dark dark:text-tan'>
                  I write{' '}
                  <span className='font-code'>clean, maintainable code</span>{' '}
                  following best practices. My applications are fast, secure,
                  and built with scalability in mind.
                </p>
              </div>

              <div className='p-8 rounded-xl border transition-all bg-white/80 dark:bg-navy border-navy/10 dark:border-cream/10 hover:border-navy/30 dark:hover:border-cream/30 hover:shadow-lg'>
                <div className='flex justify-center items-center mb-6 w-12 h-12 rounded-lg bg-cream dark:bg-navy-light/50'>
                  <Star className='w-6 h-6 text-navy dark:text-cream' />
                </div>
                <h3 className='mb-3 text-xl font-light text-navy dark:text-cream'>
                  Modern Stack
                </h3>
                <p className='text-gray-dark dark:text-tan'>
                  I specialize in Next.js, React, TypeScript and modern tools
                  that enable rapid development without compromising on quality.
                </p>
              </div>

              <div className='p-8 rounded-xl border transition-all bg-white/80 dark:bg-navy border-navy/10 dark:border-cream/10 hover:border-navy/30 dark:hover:border-cream/30 hover:shadow-lg'>
                <div className='flex justify-center items-center mb-6 w-12 h-12 rounded-lg bg-cream dark:bg-navy-light/50'>
                  <CheckCircle className='w-6 h-6 text-navy dark:text-cream' />
                </div>
                <h3 className='mb-3 text-xl font-light text-navy dark:text-cream'>
                  Results-Driven
                </h3>
                <p className='text-gray-dark dark:text-tan'>
                  I focus on delivering business value, not just code. Your
                  success is my priority, and I measure my work by the results
                  it generates.
                </p>
              </div>
            </div>
          </div>
        </section>

        <StatsSection />

        <ProjectsSection projects={uiProjects} />

        {/* Contact Section */}
        <section className='py-20 bg-cream dark:bg-navy-darkest'>
          <div className='container px-6 mx-auto'>
            <div className='p-8 rounded-3xl border bg-white/80 dark:bg-navy md:p-12 border-navy/10 dark:border-cream/10'>
              <div className='mx-auto max-w-3xl text-center'>
                <h2 className='mb-6 text-3xl font-light md:text-4xl text-navy dark:text-cream'>
                  Ready to Build Something Amazing?
                </h2>
                <p className='mb-8 text-lg text-gray-dark dark:text-tan'>
                  I&apos;m currently available for freelance projects, full-time
                  positions, and consulting work. Let&apos;s discuss how I can
                  help bring your ideas to life.
                </p>
                <div className='flex flex-col gap-4 justify-center sm:flex-row'>
                  <button className='flex gap-2 justify-center items-center px-8 py-4 font-medium rounded-lg transition-colors bg-blue hover:bg-blue-light text-cream'>
                    Schedule a Call
                  </button>
                  <Link
                    href={SOCIAL_LINKS.GITHUB}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex gap-2 justify-center items-center px-8 py-4 font-medium bg-transparent rounded-lg border transition-colors border-navy/20 dark:border-cream/20 text-navy dark:text-cream hover:bg-navy/5 dark:hover:bg-cream/5 focus:outline-none focus:ring-2 focus:ring-blue/50'
                    aria-label='View GitHub Profile'
                  >
                    <Image
                      src='https://simpleicons.org/icons/github.svg'
                      alt=''
                      width={20}
                      height={20}
                      aria-hidden='true'
                    />
                    View GitHub
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  } catch (error) {
    console.error('Error fetching projects:', error)
    return (
      <main className='min-h-screen bg-cream dark:bg-navy-darkest'>
        <HeroSection />

        {/* Why Choose Me Section */}
        <section className='pt-10 pb-20 bg-cream dark:bg-navy-darkest'>
          <div className='container px-6 mx-auto'>
            <div className='mb-16 text-center'>
              <h2 className='mb-4 text-3xl font-light tracking-tight md:text-4xl text-navy dark:text-cream'>
                Why Work With Me?
              </h2>
              <p className='mx-auto max-w-2xl text-lg text-gray-dark dark:text-tan'>
                I bring technical expertise, business understanding, and a
                commitment to excellence to every project
              </p>
            </div>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
              <div className='p-8 rounded-xl border transition-all bg-white/80 dark:bg-navy border-navy/10 dark:border-cream/10 hover:border-navy/30 dark:hover:border-cream/30 hover:shadow-lg'>
                <div className='flex justify-center items-center mb-6 w-12 h-12 rounded-lg bg-cream dark:bg-navy-light/50'>
                  <Terminal className='w-6 h-6 text-navy dark:text-cream' />
                </div>
                <h3 className='mb-3 text-xl font-light text-navy dark:text-cream'>
                  Technical Excellence
                </h3>
                <p className='text-gray-dark dark:text-tan'>
                  I write{' '}
                  <span className='font-code'>clean, maintainable code</span>{' '}
                  following best practices. My applications are fast, secure,
                  and built with scalability in mind.
                </p>
              </div>

              <div className='p-8 rounded-xl border transition-all bg-white/80 dark:bg-navy border-navy/10 dark:border-cream/10 hover:border-navy/30 dark:hover:border-cream/30 hover:shadow-lg'>
                <div className='flex justify-center items-center mb-6 w-12 h-12 rounded-lg bg-cream dark:bg-navy-light/50'>
                  <Star className='w-6 h-6 text-navy dark:text-cream' />
                </div>
                <h3 className='mb-3 text-xl font-light text-navy dark:text-cream'>
                  Modern Stack
                </h3>
                <p className='text-gray-dark dark:text-tan'>
                  I specialize in Next.js, React, TypeScript and modern tools
                  that enable rapid development without compromising on quality.
                </p>
              </div>

              <div className='p-8 rounded-xl border transition-all bg-white/80 dark:bg-navy border-navy/10 dark:border-cream/10 hover:border-navy/30 dark:hover:border-cream/30 hover:shadow-lg'>
                <div className='flex justify-center items-center mb-6 w-12 h-12 rounded-lg bg-cream dark:bg-navy-light/50'>
                  <CheckCircle className='w-6 h-6 text-navy dark:text-cream' />
                </div>
                <h3 className='mb-3 text-xl font-light text-navy dark:text-cream'>
                  Results-Driven
                </h3>
                <p className='text-gray-dark dark:text-tan'>
                  I focus on delivering business value, not just code. Your
                  success is my priority, and I measure my work by the results
                  it generates.
                </p>
              </div>
            </div>
          </div>
        </section>

        <StatsSection />

        <ProjectsSection projects={[]} />

        {/* Contact Section */}
        <section className='py-20 bg-cream dark:bg-navy-darkest'>
          <div className='container px-6 mx-auto'>
            <div className='p-8 rounded-3xl border bg-white/80 dark:bg-navy md:p-12 border-navy/10 dark:border-cream/10'>
              <div className='mx-auto max-w-3xl text-center'>
                <h2 className='mb-6 text-3xl font-light md:text-4xl text-navy dark:text-cream'>
                  Ready to Build Something Amazing?
                </h2>
                <p className='mb-8 text-lg text-gray-dark dark:text-tan'>
                  I&apos;m currently available for freelance projects, full-time
                  positions, and consulting work. Let&apos;s discuss how I can
                  help bring your ideas to life.
                </p>
                <div className='flex flex-col gap-4 justify-center sm:flex-row'>
                  <button className='flex gap-2 justify-center items-center px-8 py-4 font-medium rounded-lg transition-colors bg-blue hover:bg-blue-light text-cream'>
                    Schedule a Call
                  </button>
                  <Link
                    href={SOCIAL_LINKS.GITHUB}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex gap-2 justify-center items-center px-8 py-4 font-medium bg-transparent rounded-lg border transition-colors border-navy/20 dark:border-cream/20 text-navy dark:text-cream hover:bg-navy/5 dark:hover:bg-cream/5 focus:outline-none focus:ring-2 focus:ring-blue/50'
                    aria-label='View GitHub Profile'
                  >
                    <Image
                      src='https://simpleicons.org/icons/github.svg'
                      alt=''
                      width={20}
                      height={20}
                      aria-hidden='true'
                    />
                    View GitHub
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }
}
