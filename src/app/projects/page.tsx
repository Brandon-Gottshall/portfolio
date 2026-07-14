import React from 'react'
import type { Metadata } from 'next'
import ChronologicalFeed from '@/components/projects/ChronologicalFeed'
import ProjectCard from '@/components/projects/ProjectCard'
import getPayload from '@/payload/getPayload'
import type { Project } from '@/payload/payload-types'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Working systems, tools, rebuilt artifacts, and archive traces from Brandon Gottshall.',
  keywords: [
    'projects',
    'workflow tools',
    'learning systems',
    'document automation',
    'internal software',
    'TypeScript',
    'Python'
  ],
  openGraph: {
    title: 'Projects | Brandon Gottshall',
    description:
      'Working systems, tools, rebuilt artifacts, and archive traces from Brandon Gottshall.',
    type: 'website'
  }
}

export default async function ProjectsPage() {
  let projects: Project[] = []

  try {
    const payload = await getPayload()
    const result = await payload.find<Project>({
      collection: 'projects',
      depth: 1,
      limit: 100
    })
    projects = result.docs
  } catch (error) {
    console.error('Error fetching projects:', error)
  }

  return (
    <div className='container mx-auto space-y-16 px-4 py-8'>
      <ChronologicalFeed />

      {projects.length > 0 && (
        <section>
          <div className='mb-10'>
            <p className='mb-3 font-code text-sm font-semibold uppercase tracking-[0.28em] text-red-deep dark:text-red-soft'>
              CMS project records
            </p>
            <h2 className='mb-4 text-3xl font-light tracking-tight text-navy dark:text-cream'>
              Additional structured entries.
            </h2>
            <p className='max-w-3xl text-lg leading-relaxed text-gray-dark dark:text-tan'>
              These cards come from the project content model. The hand-curated
              record above remains the stable surface while the CMS entries are
              filled in.
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
      )}
    </div>
  )
}
