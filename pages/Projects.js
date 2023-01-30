import Link from 'next/link'
import projects from '../data/projects.json'

const Projects = () => {
  return (
    <div className='flex-col items-center justify-center w-screen h-full mb-24'>
      <h1 className='text-3xl text-center'>
        My Projects
      </h1>
      {
        // Create a project selector
          // Recreate the language selection component
          // Load each project in a folding div
          // Floating div *folded* would have project name, a sentence long description, and a link to view it live.
      }
      <div className='flex flex-wrap justify-center space-x-4'>
        {
        projects.map((project, index) => {

          // Replace the spaces in the project title with -
          let projectTitle = project.title.replace(/ /g, '-')
          return (
            <Link href={`/projects/${project.title}`} key={index}>
              <div key={index} className='md:w-1/4 md:mx-0 mx-8 rounded h-64 my-12 md:bg-gradient-to-b from-black to-gray-200 w-96'>
                <img src={project.imageURI} className='z-0 object-cover w-full h-56 p-2 scale-100 rounded nm-flat-white-sm hover:scale-110 hover:z-10 hover:shadow-lg' />
                <h1 className='pt-4 text-2xl text-center text-red-500 text-bold font-ox'>{project.title}</h1>
              </div>
            </Link>
          )
        })
        }
      </div>
    </div>
  )
}

export default Projects
