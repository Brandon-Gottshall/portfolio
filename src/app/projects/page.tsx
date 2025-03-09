import { getProjects } from '@/sanity/api/project'
import ProjectCard from '@/components/projects/ProjectCard'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-navy dark:text-cream mb-4 tracking-tight">Projects</h1>
        <p className="text-lg text-gray dark:text-tan leading-relaxed">
          Exploring the intersection of <span className="font-code">code</span> and creativity
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            title={project.title}
            shortDescription={project.shortDescription}
            technologies={project.technologies}
            projectUrl={project.projectUrl}
            githubUrl={project.githubUrl}
            thumbnail={project.thumbnail}
            status={project.status}
          />
        ))}
      </div>
    </div>
  )
} 