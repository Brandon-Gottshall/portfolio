import React from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import type { Project, Media } from '@/payload/payload-types'

type ProjectCardProps = Pick<
  Project,
  'title' | 'shortDescription' | 'projectUrl' | 'githubUrl' | 'status'
> & {
  technologies: NonNullable<Project['technologies']>
  thumbnail: {
    url: string
    alt: string
    width: number
    height: number
  }
}

export default function ProjectCard({
  title,
  shortDescription,
  technologies,
  projectUrl,
  githubUrl,
  thumbnail,
  status
}: ProjectCardProps) {
  const statusColors = {
    'in-development': 'bg-navy/5 text-navy dark:bg-cream/5 dark:text-cream',
    completed: 'bg-blue/5 text-blue dark:bg-blue/5 dark:text-blue-accent',
    archived: 'bg-gray/5 text-gray dark:bg-gray/5 dark:text-gray'
  }

  return (
    <Card
      className='group relative overflow-hidden bg-white dark:bg-navy-light/30 transition-all duration-300 
      border border-navy/5 dark:border-[#4A9DFF]/40
      dark:shadow-[0_0_1px_#4A9DFF,inset_0_0_1px_#4A9DFF] 
      dark:hover:shadow-[0_0_2px_#4A9DFF,inset_0_0_2px_#4A9DFF] 
      dark:hover:border-[#4A9DFF]/70
      hover:scale-[1.02]
      w-[280px]'
    >
      {/* Image Container */}
      <div className='overflow-hidden relative w-full h-40 bg-gray-50 dark:bg-navy/40'>
        {thumbnail?.url ? (
          <Image
            src={thumbnail.url}
            alt={thumbnail.alt}
            fill
            className='object-cover'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <span className='text-navy/40 dark:text-cream/40'>No Image</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <CardContent className='flex flex-col gap-3 p-5'>
        {/* Header */}
        <div className='space-y-1'>
          <h2 className='text-lg font-light tracking-tight text-navy dark:text-cream/90'>
            {title}
          </h2>
          <Badge
            variant='outline'
            className={`font-medium tracking-wider uppercase ${statusColors[status]} text-[10px]`}
          >
            {status.replace('-', ' ')}
          </Badge>
        </div>

        {/* Description */}
        <p className='text-sm leading-relaxed text-navy/70 dark:text-cream/60 line-clamp-2'>
          {shortDescription}
        </p>

        {/* Technologies */}
        <div className='flex flex-wrap gap-1.5'>
          {technologies.map((tech) => (
            <Badge
              key={tech.technology}
              variant='outline'
              className='font-code bg-transparent text-[10px] text-navy/60 dark:text-cream/50 border-navy/20 dark:border-cream/20'
            >
              {tech.technology}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className='flex gap-2 mt-1'>
          {projectUrl && (
            <Button
              asChild
              size='sm'
              className='flex-1 font-medium tracking-wide bg-blue hover:bg-blue/90 text-cream'
            >
              <a href={projectUrl} target='_blank' rel='noopener noreferrer'>
                View Project
              </a>
            </Button>
          )}
          {githubUrl && (
            <Button
              asChild
              size='sm'
              variant='outline'
              className='flex-1 tracking-tight bg-transparent border-cream text-cream hover:bg-cream/10 font-code'
            >
              <a href={githubUrl} target='_blank' rel='noopener noreferrer'>
                <GitHubLogoIcon className='w-5 h-5' />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
