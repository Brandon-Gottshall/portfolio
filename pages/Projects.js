import { useAppContext } from '../context/AppContext'
import ProjectComponent from '../components/ProjectComponent'

const Projects = ({ sharedState }) => {
  // sharedState.showTitleBool = true
  const { setShowTitleBool } = useAppContext()
  setShowTitleBool(true)
  return (
    <div className='container flex items-center justify-center w-full h-full'>
      <ProjectComponent />
    </div>
  )
}

export default Projects
