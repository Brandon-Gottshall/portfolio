'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { ProjectUI } from '@/types/ui'

const FeaturedProjects = dynamic(
  () => import('@/components/projects/FeaturedProjects'),
  { ssr: false }
)

interface ProjectsSectionProps {
  projects: ProjectUI[]
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section className='py-16 bg-cream dark:bg-navy-darkest'>
      <div className='container px-6 mx-auto'>
        <div className='flex flex-col gap-4 mb-12 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red'>
              Project records
            </p>
            <h2 className='mt-3 text-3xl font-light tracking-tight text-navy dark:text-cream md:text-4xl'>
              More structured project entries.
            </h2>
          </div>
          <Link
            href='/projects'
            className='inline-flex gap-1 items-center text-sm font-semibold transition-colors text-navy hover:text-navy-light dark:text-cream dark:hover:text-cream/80'
          >
            Open project records <ArrowRight className='w-4 h-4' />
          </Link>
        </div>

        <FeaturedProjects projects={projects} />
      </div>
    </section>
  )
}
