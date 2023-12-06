import Link from 'next/link'
import projects from '../data/projects.json'
import Image from 'next/image'
import { useState } from 'react'

const ProjectCard = (project, index) => {

  const [isHoveredBool, setIsHoveredBool] = useState(false)
  const hoverHelper = () => setIsHoveredBool(true)
  const exitHoverHelper = () => setIsHoveredBool(false)

  return (
    <Link href={`/projects/${project.id}`} key={project.id}>
    { isHoveredBool &&
      <h1 className='absolute z-10'>Click to learn more</h1>
    }
      <div
        key={index}
        className={`flex items-center justify-center h-64 mx-8 rounded shadow-neu-inset md:w-1/4 md:mx-0 md:bg-gradient-to-b from-black to-gray-200 w-96 overflow-clip transition-blur ${isHoveredBool ? 'blur-sm' : 'blur-none' }`}
        onMouseEnter={hoverHelper}
        onMouseLeave={exitHoverHelper}
      >
        <Image
          src={project.imageURI}
          alt={`Screenshot of my ${project.title} project.`}
          width={500}
          height={400}
          className='relative w-auto scale-90 h-5/6'
        />
      </div>
      <h1 className='pt-4 mb-12 text-2xl text-center text-red-500 text-bold font-ox'>
        {project.title}
      </h1>
    </Link>
  )
}

const Projects = () => {
  return (
    <div className='flex-col items-center justify-center w-screen h-full mb-24'>
      <h1 className='text-3xl text-center'>My Projects</h1>
      <div className='flex flex-wrap justify-center mt-8 space-x-4'>
        {projects.map((project, index) => {
          return ProjectCard(project, index)
        })}
      </div>
    </div>
  )
}

export default Projects
