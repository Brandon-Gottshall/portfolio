'use client'

import React from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ProjectUI } from '@/types/ui'

interface FeaturedProjectsProps {
  projects: ProjectUI[]
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects.length) {
    return (
      <div className='rounded-2xl border border-navy/10 bg-white/70 p-8 text-center dark:border-cream/10 dark:bg-navy/60'>
        <p className='font-code text-sm font-semibold uppercase tracking-[0.24em] text-red-500'>
          Project chronology is live
        </p>
        <h3 className='mt-3 text-2xl font-light text-navy dark:text-cream'>
          The curated portfolio feed is ready.
        </h3>
        <p className='mx-auto mt-3 max-w-2xl text-gray-dark dark:text-tan'>
          Featured CMS cards are still being populated, but the Projects page
          already separates active systems, shipped rebuilds, focused utilities,
          and historical artifacts.
        </p>
        <Link
          href='/projects'
          className='mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue dark:bg-cream dark:text-navy dark:hover:bg-blue dark:hover:text-white'
        >
          Open chronological portfolio <ArrowRight className='h-4 w-4' />
        </Link>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
      {projects.map((project) => (
        <div
          key={project.id}
          className='overflow-hidden rounded-xl border transition-all cursor-pointer group bg-white/80 dark:bg-navy border-navy/10 dark:border-cream/10 hover:border-navy/30 dark:hover:border-cream/30 hover:shadow-lg'
        >
          <div className='overflow-hidden'>
            <Image
              src={project.thumbnail}
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
              {project.shortDescription}
            </p>

            <div className='flex flex-wrap gap-2 mb-6'>
              {project.technologies?.map((tech) => (
                <span
                  key={tech.id || tech.technology}
                  className='px-2 py-1 text-xs rounded-full bg-cream dark:bg-navy-light/50 text-navy dark:text-cream'
                >
                  {tech.technology}
                </span>
              ))}
            </div>

            <div className='flex justify-between'>
              <Link
                href={`/projects/${project.slug}`}
                className='flex gap-1 items-center text-sm transition-colors text-navy dark:text-cream hover:text-blue dark:hover:text-blue-accent'
              >
                View Case Study <ArrowRight className='w-3 h-3' />
              </Link>
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex gap-1 items-center text-sm transition-colors text-gray-dark dark:text-tan hover:text-navy dark:hover:text-cream'
                >
                  <ExternalLink className='w-3 h-3' /> Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
