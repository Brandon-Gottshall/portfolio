
import ProjectCard from './ProjectCard'
import LanguageSelectionIcon from './LanguageSelectionIcon'
import projectsData from '../data/projects.json'
import useWindowSize from '../util/useWindowSize'
import { useState, useEffect } from 'react'

export default function ProjectComponent ({ pageNumber, linkSafeguard, lockScroll, unlockScroll }) {
  const [filters, setFilters] = useState([])
  const [projects, setProjects] = useState(projectsData.filter(({ languages }) => languages.some(languages => languages.includes(filters))))
  const windowSize = useWindowSize()

  useEffect(() => {
    console.log(`filters: ${JSON.stringify(filters, null, 1)}`)
    setProjects(projectsData.filter(({ languages }) => languages.some(languages => languages.includes(filters))))
  }, [filters])

  const languagesUsed = new Set(projectsData.map(({ languages }) => languages.map(language => language)).flat())
  const languagesUsedArray = Array.from(languagesUsed)
  const modifyFilters = (language) => {
    console.log(`modifyFilters: ${language}`)
    let activeLanguageFilterSet
    if (filters.includes(language)) {
      activeLanguageFilterSet = new Set(filters.filter(filter => filter !== language))
    } else {
      activeLanguageFilterSet = new Set(filters).add(language)
    }
    setFilters(Array.from(activeLanguageFilterSet))
  }
  useEffect(() => {}, [windowSize])
  if (windowSize.width >= 640) {
    return (
      <main className='flex flex-col items-center justify-start w-screen h-full text-center'>
        <div className='flex flex-col items-center justify-center w-full mt-4 sm:px-20'>
          <h3
            className='text-2xl font-thin text-red-500 transform translate-x-0 transform-gpu sm:text-3xl animate-fade-in-from-left'
          >Projects
          </h3>
          <div className='flex justify-between w-full mt-4 mb-2 overflow-x-scroll scrollbar-hide sm:px-10'>
            <div className='flex items-center justify-center w-full pt-8 space-x-10 transform translate-x-0 transform-gpu py-auto animate-fade-in-from-right whitespace-nowrap'>
              {languagesUsedArray.map((language) => (
                LanguageSelectionIcon({ language, modifyFilters: (language) => modifyFilters(language), filters })
              ))}
            </div>
          </div>
        </div>
        <div
          onMouseOver={lockScroll} onMouseOut={unlockScroll} className='flex flex-wrap justify-center mt-2 mb-8 overflow-y-auto nm-inset-gray-100 rounded-3xl'
        >
          {projects.map(({ title, description, languages, link, imageURI }) => {
            // console.log(JSON.stringify(
            //   {
            //     title: title,
            //     description: description,
            //     languages: languages,
            //     link: link,
            //     imageURI: imageURI,
            //     mobile: false
            //   }
            // ))

            return (<ProjectCard key={`key_${title}_projectCard`} title={title} description={description} languages={languages} link={link} imageURI={imageURI} mobile={false} />)
          }
          )}
        </div>
      </main>
    )
  } else {
    return (
      <main className='flex flex-col items-center justify-start w-screen h-full text-center'>
        <div className='flex flex-col items-center justify-between w-screen h-full mt-4'>
          <h3
            className='text-2xl font-thin text-red-500 transform translate-x-0 transform-gpu sm:text-3xl animate-fade-in-from-left'
          >Projects
          </h3>
          <div className='flex justify-center w-full h-full'>
            <div
              onTouchStart={lockScroll} onTouchEnd={unlockScroll} className='flex flex-col w-full h-full overflow-y-scroll '
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
                  />
                )
                return card
              })}
            </div>
          </div>
        </div>
      </main>
    )
  }
}
