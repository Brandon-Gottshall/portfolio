import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { Project } from '@/sanity/api/project'

export default function ProjectCard({
  title,
  shortDescription,
  technologies,
  projectUrl,
  githubUrl,
  thumbnail,
  status
}: Omit<Project, '_id' | 'slug' | 'description' | 'featured'>) {
  const statusColors = {
    'in-development': 'bg-navy/10 text-navy dark:bg-tan/10 dark:text-tan border border-navy/20 dark:border-tan/20',
    'completed': 'bg-red/10 text-red dark:bg-red/10 dark:text-red border border-red/20',
    'archived': 'bg-gray/10 text-gray dark:bg-gray/10 dark:text-gray border border-gray/20',
    'planned-update': 'bg-cream/20 text-navy dark:bg-cream/10 dark:text-tan border border-cream/30'
  }

  return (
    <div className="group relative bg-navy-light dark:bg-navy-light/90 rounded-xl overflow-hidden border border-navy/10 dark:border-tan/10 shadow-lg shadow-navy/5">
      {/* Image Container */}
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={urlFor(thumbnail).url()}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent dark:from-navy/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Container */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <h2 className="text-xl font-semibold text-cream dark:text-cream">{title}</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            status === 'completed' 
              ? 'bg-red-bright/20 text-red-bright border border-red-bright/30'
              : statusColors[status]
          } whitespace-nowrap`}>
            {status === 'planned-update' ? 'Update Planned' : status.replace('-', ' ')}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray dark:text-gray mb-6 line-clamp-2">
          {shortDescription}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          {technologies.map((tech) => (
            <span 
              key={tech} 
              className="px-3 py-1 rounded-full text-xs font-medium 
                       bg-cream/10 dark:bg-tan/10 
                       text-cream dark:text-cream 
                       border border-cream/20 dark:border-tan/20"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 text-center rounded-lg 
                     bg-red-bright hover:bg-red-bright/90 
                     text-cream font-medium 
                     transition-colors duration-200"
          >
            View Project
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 text-center rounded-lg 
                     border border-cream/20 
                     text-cream hover:bg-cream/10 
                     transition-colors duration-200"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  )
} 