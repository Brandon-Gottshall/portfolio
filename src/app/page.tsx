'use client'

import Image from 'next/image'
import {
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Github,
  Star,
  Terminal
} from 'lucide-react'
import { TextLoop } from 'react-text-loop-next'
import React from 'react'

import { GithubLanguageStats } from '@/components/github-stats'

export default function Home() {
  const projects = [
    {
      id: 1,
      title: 'Project One',
      description: 'Web App',
      image: '/placeholder.svg?height=400&width=600',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma'],
      challenge:
        'Built a high-performance dashboard with real-time data visualization'
    },
    {
      id: 2,
      title: 'Project Two',
      description: 'Mobile App',
      image: '/placeholder.svg?height=400&width=600',
      technologies: ['React Native', 'Next.js API Routes', 'MongoDB'],
      challenge:
        'Developed a cross-platform mobile app with seamless API integration'
    },
    {
      id: 3,
      title: 'Project Three',
      description: 'E-commerce',
      image: '/placeholder.svg?height=400&width=600',
      technologies: ['Next.js', 'Stripe', 'Sanity CMS', 'Vercel'],
      challenge:
        'Created a high-converting e-commerce platform with 99% Lighthouse score'
    }
  ]

  return (
    <main className='min-h-screen bg-cream dark:bg-navy-darkest'>
      {/* Hero Section */}
      <section className='pt-20 bg-cream dark:bg-navy-darkest md:py-32'>
        <div className='container px-6 mx-auto'>
          <div className='flex flex-col items-center md:flex-row'>
            <div className='z-10 mb-10 md:w-1/2 md:mb-0'>
              <div className='inline-flex items-center px-3 py-1 mb-6 text-sm rounded-full bg-navy/10 dark:bg-cream/10 text-navy dark:text-cream'>
                <span className='mr-2'>✓</span> Available for new projects
              </div>
              <h1 className='mb-2 text-5xl font-light tracking-tight leading-tight md:text-6xl text-navy dark:text-cream'>
                Brandon Gottshall
              </h1>
              <div className='mb-6'>
                <TextLoop interval={2000}>
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
                I&apos;m a specialized software engineer with experience
                crafting high-performance, scalable web applications that users
                love.
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
                following best practices. My applications are fast, secure, and
                built with scalability in mind.
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
                I specialize in Next.js, React, TypeScript and modern tools that
                enable rapid development without compromising on quality.
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
                success is my priority, and I measure my work by the results it
                generates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
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

          {/* New Implementation */}
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

      {/* Projects Grid */}
      <section className='py-16 bg-cream dark:bg-navy-darkest'>
        <div className='container px-6 mx-auto'>
          <div className='flex justify-between items-end mb-12'>
            <div>
              <h2 className='mb-4 text-3xl font-light text-navy dark:text-cream'>
                Featured Projects
              </h2>
              <p className='max-w-2xl text-gray-dark dark:text-tan'>
                A selection of my recent work building modern web applications
              </p>
            </div>
            <button className='flex gap-1 items-center transition-colors text-navy dark:text-cream hover:text-blue dark:hover:text-blue-accent'>
              View All Projects <ArrowRight className='w-4 h-4' />
            </button>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            {projects.map((project) => (
              <div
                key={project.id}
                className='overflow-hidden rounded-xl border transition-all cursor-pointer group bg-white/80 dark:bg-navy border-navy/10 dark:border-cream/10 hover:border-navy/30 dark:hover:border-cream/30 hover:shadow-lg'
              >
                <div className='overflow-hidden'>
                  <Image
                    src={project.image || '/placeholder.svg'}
                    alt={project.title}
                    width={600}
                    height={400}
                    className='object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110'
                  />
                </div>
                <div className='p-6'>
                  <h3 className='mb-2 text-xl font-light text-navy dark:text-cream'>
                    {project.title}
                  </h3>
                  <p className='mb-4 text-sm text-gray-dark dark:text-tan'>
                    {project.description}
                  </p>
                  <p className='mb-4 text-sm text-blue/90 dark:text-blue-accent/90'>
                    {project.challenge}
                  </p>

                  <div className='flex flex-wrap gap-2 mb-6'>
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className='px-2 py-1 text-xs rounded-full bg-cream dark:bg-navy-light/50 text-navy dark:text-cream'
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className='flex justify-between'>
                    <button className='flex gap-1 items-center text-sm transition-colors text-navy dark:text-cream hover:text-blue dark:hover:text-blue-accent'>
                      View Case Study <ArrowRight className='w-3 h-3' />
                    </button>
                    <button className='flex gap-1 items-center text-sm transition-colors text-gray-dark dark:text-tan hover:text-navy dark:hover:text-cream'>
                      <ExternalLink className='w-3 h-3' /> Live Demo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                <button className='flex gap-2 justify-center items-center px-8 py-4 font-medium bg-transparent rounded-lg border transition-colors border-navy/20 dark:border-cream/20 text-navy dark:text-cream hover:bg-navy/5 dark:hover:bg-cream/5'>
                  <Github className='w-5 h-5' />
                  View GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
