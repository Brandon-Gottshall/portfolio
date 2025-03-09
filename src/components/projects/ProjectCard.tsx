import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { Project } from '@/sanity/api/project'
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { GithubIcon } from "lucide-react"

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
    'in-development': 'bg-navy/5 text-navy dark:bg-cream/5 dark:text-cream',
    'completed': 'bg-red/5 text-red dark:bg-red/5 dark:text-red',
    'archived': 'bg-gray/5 text-gray dark:bg-gray/5 dark:text-gray',
    'planned-update': 'bg-navy/5 text-navy dark:bg-cream/5 dark:text-cream'
  }

  return (
    <Card className="group relative overflow-hidden bg-white dark:bg-navy-light/30 transition-all duration-300 
      border border-navy/5 dark:border-[#4A9DFF]/40
      dark:shadow-[0_0_1px_#4A9DFF,inset_0_0_1px_#4A9DFF] 
      dark:hover:shadow-[0_0_2px_#4A9DFF,inset_0_0_2px_#4A9DFF] 
      dark:hover:border-[#4A9DFF]/70
      hover:scale-[1.02]
      w-[280px]">
      {/* Image Container */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-50 dark:bg-navy/40">
        <Image
          src={urlFor(thumbnail).url()}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content Container */}
      <CardContent className="p-5 flex flex-col gap-3">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-navy dark:text-cream/90">{title}</h2>
          <Badge variant="outline" className={`${statusColors[status]} text-[10px] font-medium`}>
            {status === 'planned-update' ? 'Update Planned' : status.replace('-', ' ')}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-navy/70 dark:text-cream/60 text-sm leading-relaxed line-clamp-2">
          {shortDescription}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5">
          {technologies.map((tech) => (
            <Badge 
              key={tech}
              variant="outline"
              className="bg-transparent text-[10px] font-medium text-navy/60 dark:text-cream/50 border-navy/20 dark:border-cream/20"
            >
              {tech}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          {projectUrl && (
            <Button 
              asChild
              size="sm"
              className="flex-1 bg-red-bright hover:bg-red-bright/90 text-cream"
            >
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Project
              </a>
            </Button>
          )}
          {githubUrl && (
            <Button 
              asChild
              size="sm"
              variant="outline"
              className="flex-1 bg-transparent border-cream text-cream hover:bg-cream/10"
            >
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="mr-2 h-3.5 w-3.5" />
                GitHub
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 