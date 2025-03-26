'use client'

import React from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import type { Project } from '@/sanity/api/project'

interface FeaturedProjectsProps {
  projects: Project[]
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects.length) {
    return (
      <div className='py-10 text-center'>
        <p className='text-navy dark:text-cream'>No featured projects found.</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
      {projects.map((project) => (
        <div
          key={project._id}
          className='overflow-hidden rounded-xl border transition-all cursor-pointer group bg-white/80 dark:bg-navy border-navy/10 dark:border-cream/10 hover:border-navy/30 dark:hover:border-cream/30 hover:shadow-lg'
        >
          <div className='overflow-hidden'>
            <Image
              src={urlFor(project.thumbnail).url()}
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
              <Link
                href={`/projects/${project.slug.current}`}
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
