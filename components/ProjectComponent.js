
import ProjectCard from './ProjectCard'
import LanguageSelectionIcon from './LanguageSelectionIcon'
import projectsData from '../data/projects.json'
import { useState, useEffect } from 'react'
import { BrowserView, MobileView } from 'react-device-detect'

export default function ProjectComponent ({ pageNumber, linkSafeguard, lockScroll, unlockScroll }) {
  const [filters, setFilters] = useState([])
  const [projects, setProjects] = useState(projectsData.filter(({ languages }) => languages.some(languages => languages.includes(filters))))

  useEffect(() => {
    console.log(`filters: ${JSON.stringify(filters, null, 1)}`)
    setProjects(projectsData.filter(({ languages }) => filters.every(language => languages.includes(language))))
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
  return (
    <>
      <BrowserView>
        <main className='flex flex-col items-center justify-start w-screen h-full text-center'>
          <div className='flex flex-col items-center justify-center w-full mt-4 sm:px-20'>
            <h3
              className='mt-10 text-2xl font-thin text-red-500 translate-x-0 transform-gpu sm:text-3xl animate-fade-in-from-left'
            >Projects
            </h3>
            <div className='flex justify-between w-full mt-4 mb-2 overflow-x-scroll scrollbar-hide sm:px-10'>
              <div className='flex items-center justify-center w-full pt-8 space-x-10 translate-x-0 transform-gpu py-auto animate-fade-in-from-right whitespace-nowrap'>
                {languagesUsedArray.map((language) => (
                  LanguageSelectionIcon({ language, modifyFilters: (language) => modifyFilters(language), filters })
                ))}
              </div>
            </div>
          </div>
          <div
            onMouseOver={lockScroll} onMouseOut={unlockScroll} className='flex flex-wrap justify-center w-full mt-2 mb-8 overflow-y-auto nm-inset-gray-100 rounded-3xl'
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
      </BrowserView>
      <MobileView>
        <main className='flex-col items-center justify-start w-auto h-full text-center'>
          <div className='flex-col items-center justify-center w-full h-full mt-4'>
            <h3
              className='text-2xl font-thin text-red-500 translate-x-0 transform-gpu sm:text-3xl animate-fade-in-from-left'
            >Projects
            </h3>
            <div className='flex items-center justify-center w-full h-full'>
              <div
                onTouchStart={lockScroll} onTouchEnd={unlockScroll} className='flex-col items-center h-full overflow-y-hide w-94'
              >
                {projects.map((project, index) => {
                  const { title, description, link, languages, imageURI } = project
                  const card = (
                    <ProjectCard
                      key={`project_${index}`}
                      title={title}
                      description={description}
                      languages={languages}
                      link={link}
                      imageURI={imageURI}
                      mobile={false}
                    />
                  )
                  return card
                })}
              </div>
            </div>
          </div>
        </main>
      </MobileView>
    </>
  )
}
