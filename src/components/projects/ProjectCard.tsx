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
    <div className="group relative bg-white dark:bg-navy/20 rounded-xl overflow-hidden border border-navy/10 dark:border-tan/10">
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
          <h2 className="text-xl font-semibold text-navy dark:text-tan">{title}</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]} whitespace-nowrap`}>
            {status === 'planned-update' ? 'Update Planned' : status.replace('-', ' ')}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray dark:text-tan/80 mb-6 line-clamp-2">
          {shortDescription}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          {technologies.map((tech) => (
            <span 
              key={tech} 
              className="px-3 py-1 rounded-full text-xs font-medium 
                       bg-cream/20 dark:bg-tan/10 
                       text-navy dark:text-tan 
                       border border-cream/30 dark:border-tan/20"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {projectUrl && (
            <a 
              href={projectUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-red/10 hover:bg-red/20 
                       text-red hover:text-red/80 dark:hover:text-red/90
                       text-sm font-medium transition-colors duration-200"
            >
              <span>View Project</span>
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
              </svg>
            </a>
          )}
          {githubUrl && (
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-navy/5 hover:bg-navy/10 dark:bg-tan/5 dark:hover:bg-tan/10
                       text-navy hover:text-navy/80 dark:text-tan dark:hover:text-tan/80
                       text-sm font-medium transition-colors duration-200"
            >
              <span>GitHub</span>
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
} 