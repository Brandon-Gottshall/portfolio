'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { Project } from '@/sanity/api/project'

const FeaturedProjects = dynamic(
  () => import('@/components/projects/FeaturedProjects'),
  { ssr: false }
)

interface ProjectsSectionProps {
  projects: Project[]
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
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
          <Link
            href='/projects'
            className='flex gap-1 items-center transition-colors text-navy dark:text-cream hover:text-blue dark:hover:text-blue-accent'
          >
            View All Projects <ArrowRight className='w-4 h-4' />
          </Link>
        </div>

        <FeaturedProjects projects={projects} />
      </div>
    </section>
  )
}
