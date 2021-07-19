import { useState, useEffect } from 'react'
import BouncingLink from './BouncingLink'
import BouncingArrow from './BouncingArrow'
import ProjectCard from './ProjectCard'
import { LanguageIcon } from './LanguageIcon'
import Tooltip from './Tooltip'
import projectsData from '../data/projects.json'
import useWindowSize from '../util/useWindowSize'
import ScrollIntoViewIfNeeded from 'react-scroll-into-view-if-needed'

export default function Projects ({ pageNumber, linkSafeguard, setPageNumber, setLinkSafeguard, lockScroll, unlockScroll }) {
  const openPage1 = async () => {
    unlockScroll()
    setLinkSafeguard(false)
    setPageNumber(0)
    setTimeout(() => {
      setLinkSafeguard(true)
    }, 800)
  }
  const openPage3 = async () => {
    unlockScroll()
    setLinkSafeguard(false)
    setPageNumber(2)
    setTimeout(() => {
      setLinkSafeguard(true)
    }, 800)
  }

  const [filters, setFilters] = useState([])
  const [projects, setProjects] = useState(projectsData.filter(({ languages }) => languages.some(languages => languages.includes(filters))))
  const [projectPageNumber, setProjectPageNumber] = useState(0)
  const windowSize = useWindowSize()

  useEffect(() => {
    console.log(`filters: ${JSON.stringify(filters, null, 1)}`)
    setProjects(projectsData.filter(({ languages }) => languages.some(languages => languages.includes(filters))))
  }, [filters])

  useEffect(() => {

  }, [projectPageNumber])

  const languagesUsed = new Set(projectsData.map(({ languages }) => languages.map(language => language)).flat())
  const languagesUsedArray = Array.from(languagesUsed)
  console.log('projectsData:')
  console.dir(projectsData)
  console.log(`languagesUsed: ${JSON.stringify(languagesUsed, null, 1)}`)
  console.log(`languagesUsedArray: ${JSON.stringify(languagesUsedArray, null, 1)}`)
  const addFilter = (language) => {
    const filterSet = new Set([...filters, language])
    console.log(`filterSet: ${JSON.stringify(filterSet, null, 1)}`)
    console.log(`filterSetArray: ${JSON.stringify(Array.from(filterSet), null, 1)}`)
    setFilters(Array.from(filterSet))
  }
  useEffect(() => {}, [windowSize])
  if (windowSize.width >= 640) {
    return (
      <main className='flex flex-col items-center justify-start w-screen h-full text-center'>
        <div className='flex flex-col items-center justify-center w-full mt-4 sm:px-20'>
          <BouncingArrow helper={openPage1} direction='up' />
          <h3
            className={`transform-gpu text-2xl sm:text-3xl font-thin text-red-500 transform 
        ${(linkSafeguard && pageNumber === 1)
        ? 'translate-x-0 animate-fade-in-from-left'
        : 'translate-x-off-screen-left duration-500'}`}
          >Projects
          </h3>
          <div className='flex justify-between w-full mt-4 mb-2 overflow-x-scroll scrollbar-hide sm:px-10'>
            <div className={`flex w-full sm:w-auto transform-gpu items-center justify-center space-x-10 py-auto transform ${(linkSafeguard && pageNumber === 1) ? 'translate-x-0 animate-fade-in-from-right' : 'translate-x-off-screen-right duration-500'} w-auto whitespace-nowrap`}>
              {languagesUsedArray.map((language) => (
                <Tooltip key={`key_langTT_${language}`} tooltipText={language}>
                  <div onClick={() => addFilter(language)}>
                    <LanguageIcon
                      key={`key_langIcon_${language}`} iconName={language} iconStyle='w-10 h-10 transform-gpu hover:animate-bounce' setFilters={setFilters}
                    />
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
        <div
          onMouseOver={lockScroll} onMouseOut={unlockScroll} className='flex flex-wrap mt-2 mb-8 overflow-y-auto nm-inset-gray-100 rounded-3xl'
        >
          {projects.map(({ title, description, languages, link, imageURI }) => <ProjectCard key={`key_${title}_projectCard`} title={title} description={description} languages={languages} link={link} imageURI={imageURI} mobile={false} />)}
        </div>
        <BouncingLink helper={openPage3} linkText='My Resume' direction='down' />
      </main>
    )
  } else {
    return (
      <main className='flex flex-col items-center justify-start w-screen h-full text-center'>
        <div className='flex flex-col items-center justify-between w-screen h-full mt-4'>
          <BouncingArrow helper={openPage1} direction='up' />
          <h3
            className={`transform-gpu text-2xl sm:text-3xl font-thin text-red-500 transform 
        ${(linkSafeguard && pageNumber === 1)
        ? 'translate-x-0 animate-fade-in-from-left'
        : 'translate-x-off-screen-left duration-500'}`}
          >Projects
          </h3>
          <div className='flex justify-between w-full mt-4 mb-2 sm:px-10'>
            <div className={`flex w-full sm:w-auto transform-gpu items-center justify-center space-x-10 py-auto transform ${(linkSafeguard && pageNumber === 1) ? 'translate-x-0 animate-fade-in-from-right' : 'translate-x-off-screen-right duration-500'} w-auto whitespace-nowrap`}>
              {languagesUsedArray.map((language) => (
                <Tooltip key={`key_langTT_${language}`} tooltipText={language}>
                  <div onClick={() => addFilter(language)}>
                    <LanguageIcon
                      key={`key_langIcon_${language}`} iconName={language} iconStyle='w-10 h-10 transform-gpu hover:animate-bounce' setFilters={setFilters}
                    />
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
          <div className='flex justify-center w-full h-full'>
            <DotIndicator projects={projects} projectPageNumber={projectPageNumber} setProjectPageNumber={setProjectPageNumber} />
            <div
              onTouchStart={lockScroll} onTouchEnd={unlockScroll} className='flex flex-col flex-grow w-full h-full overflow-y-scroll snap snap-y snap-mandatory'
            >
              {projects.map((project, index) => {
                const { name, description, url, languages } = project
                const { width, height } = windowSize
                const card = (
                  <ProjectCard
                    key={`project_${index}`}
                    name={name}
                    description={description}
                    url={url}
                    languages={languages}
                    width={width}
                    height={height}
                    active={(index === projectPageNumber)}
                  />
                )
                return card
              })}
            </div>
          </div>
          <BouncingLink helper={openPage3} linkText='My Resume' direction='down' />
        </div>
      </main>
    )
  }
}

function DotIndicator ({ projects, projectPageNumber, setProjectPageNumber }) {
  const indicators = projects.map((project, index) => (<li key={`proj_dotIndicator_${index}`} className={`w-4 h-4 rounded-full cursor-pointer ${(projectPageNumber === index) ? 'nm-inset-red-500-sm' : 'nm-inset-gray-800-sm'}`} onClick={() => setProjectPageNumber(index)} />))

  return (
    <ul class='flex flex-col ml-3 justify-center space-y-3'>
      {indicators}
    </ul>
  )
}
// <div className={`flex w-1/4 items-center justify-center space-x-1 transform ${(linkSafeguard && pageNumber === 1) ? 'translate-x-0 animate-fade-in-from-left' : 'translate-x-off-screen-left duration-500'}  w-96 whitespace-nowrap`}>
// <DeviceIcon deviceIconStyle linkSafeguard deviceName='web' altText='I develop for web.' tooltipText='Web Development' />
// <DeviceIcon deviceIconStyle linkSafeguard deviceName='desktop-mobile' altText='I develop for Desktop, tablets, and mobile.' tooltipText='Standalone Software (Desktop, Mobile, Tablet etc.)' />
// <DeviceIcon deviceIconStyle linkSafeguard deviceName='cloud' altText='I develop for cloud Solutions. GCP and Firebase Primarily' tooltipText='Cloud Development (GCP, Firebase)' />
// </div>

// {projectsData.filter(({ languages }) => languages.some(languages => languages.includes(filters))).map(({ title, description, languages, link, imageURI }, index) => {
//   return (<ProjectCard key={`key_${title}_projectCard`} title={title} description={description} languages={languages} link={link} imageURI={imageURI} mobile />)
// })}
