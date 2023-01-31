import Link from 'next/link'
import useNextBlurhash from 'use-next-blurhash'
import projects from '../data/projects.json'
import Image from 'next/image'

const ProjectCard = (project, index) => {
  const [blurDataUrl] = useNextBlurhash(project.imageHash)
  return (
    <Link href={`/projects/${project.id}`} key={index}>
      <div key={index} className='md:w-1/4 md:mx-0 mx-8 rounded h-64 my-12 md:bg-gradient-to-b from-black to-gray-200 w-96 scale-100 hover:scale-110'>
        <Image src={project.imageURI} blurDataURL={blurDataUrl} alt={`Screenshot of my ${project.title} project.`} height={197} width={350} className='z-0 p-2 scale-90 rounded nm-flat-white-sm hover:scale-100 hover:z-10 hover:shadow-lg' />
        <h1 className='pt-4 text-2xl text-center text-red-500 text-bold font-ox'>{project.title}</h1>
      </div>
    </Link>
  )
}
// 314 x 202 image; ratio is 1.55. 16:9 would be 1.78; Keeping the same width (314) the correct height would be 177.72
const Projects = () => {
  return (
    <div className='flex-col items-center justify-center w-screen h-full mb-24'>
      <h1 className='text-3xl text-center'>
        My Projects
      </h1>
      <div className='flex flex-wrap justify-center space-x-4'>
        {
        projects.map((project, index) => {
          return (
            ProjectCard(project, index)
          )
        })
        }
      </div>
    </div>
  )
}

export default Projects
