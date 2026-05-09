import React from 'react'
import type { Metadata } from 'next'
import { getAllProjects } from '@/payload/api/projects'
import ChronologicalFeed from '@/components/projects/ChronologicalFeed'
import ProjectCard from '@/components/projects/ProjectCard'
import type { Project } from '@/payload/payload-types'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Read Brandon Gottshall’s projects as a chronological portfolio: current systems first, historical work with context.',
  keywords: [
    'projects',
    'portfolio',
    'web development',
    'Next.js',
    'React',
    'TypeScript'
  ],
  openGraph: {
    title: 'Projects | Brandon Gottshall',
    description:
      'Read Brandon Gottshall’s projects as a chronological portfolio: current systems first, historical work with context.',
    type: 'website'
  }
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <div className='container mx-auto space-y-16 px-4 py-8'>
      <ChronologicalFeed />

      <section>
        <div className='mb-10'>
          <p className='mb-3 font-code text-sm font-semibold uppercase tracking-[0.28em] text-red-500'>
            Project gallery
          </p>
          <h2 className='mb-4 text-3xl font-light tracking-tight text-navy dark:text-cream'>
            CMS-backed project cards
          </h2>
          <p className='max-w-3xl text-lg leading-relaxed text-gray-dark dark:text-tan'>
            The chronology above gives the reading order. This gallery remains
            the structured project-card surface as the Payload content model
            fills in.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 justify-items-center md:grid-cols-2 lg:grid-cols-3'>
          {projects.map((project: Project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              shortDescription={project.shortDescription}
              technologies={project.technologies ?? []}
              projectUrl={project.projectUrl}
              githubUrl={project.githubUrl}
              thumbnail={
                typeof project.thumbnail === 'object' &&
                project.thumbnail !== null
                  ? {
                      url: project.thumbnail.url || '/placeholder.svg',
                      alt: project.thumbnail.alt || project.title,
                      width: project.thumbnail.width || 300,
                      height: project.thumbnail.height || 200
                    }
                  : {
                      url: '/placeholder.svg',
                      alt: project.title,
                      width: 300,
                      height: 200
                    }
              }
              status={project.status}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
