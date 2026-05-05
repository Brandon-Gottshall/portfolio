import React from 'react'
import type { Metadata } from 'next'
import { getAllProjects } from '@/payload/api/projects'
import ProjectCard from '@/components/projects/ProjectCard'
import type { Project } from '@/payload/payload-types'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore my portfolio of web development projects, showcasing modern technologies like Next.js, React, and TypeScript.',
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
      'Explore my portfolio of web development projects, showcasing modern technologies like Next.js, React, and TypeScript.',
    type: 'website'
  }
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <div className='container px-4 py-8 mx-auto'>
      <div className='mb-12'>
        <h1 className='mb-4 text-4xl font-light tracking-tight text-navy dark:text-cream'>
          Projects
        </h1>
        <p className='text-lg leading-relaxed text-gray dark:text-tan'>
          Exploring the intersection of <span className='font-code'>code</span>{' '}
          and creativity
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
    </div>
  )
}
