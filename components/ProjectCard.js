import { LanguageIcon } from './LanguageIcon'
import Tooltip from './Tooltip'
import { Link } from 'next'
import { useState, useEffect } from 'react'
import { BrowserView, MobileView } from 'react-device-detect'

export default function ProjectCard ({
  title,
  description,
  languages,
  link,
  imageURI,
  mobile
}) {
  const iconStyle = 'w-4 h-4 ml-1'
  const imageLink = imageURI || '/portfolioScreenshot.png'
  console.log(imageURI)
  const [touched, setTouched] = useState(false)
  let flipCard
  useEffect(() => {
    flipCard = touched ? 'manual-flip' : ''
  }, [touched])
  const touchHelper = () => { setTouched(!touched) }
  return (
    <>
      <BrowserView>
        <a target='_blank' href={link} rel='noopener noreferrer' className='flex flex-col items-center justify-center w-64 h-56 m-2 bg-white shadow-lg rounded-xl sm:min-h-0 sm:overflow-y-auto sm:pt-0 lg:w-96 lg:h-72'>
          <div className='w-full h-full flip-card transform-gpu'>
            <div className='flip-card-body'>
              <div className='h-full flip-card-front'>
                <div className='flex flex-col items-center justify-start w-full h-full rounded-3xl flip-card-front'>
                  <div className='flex items-start justify-center w-full h-auto overflow-hidden rounded-sm'>
                    <img
                      className='hidden w-full h-48 p-2 lg:h-64 rounded-2xl'
                      src={imageLink}
                      alt=''
                      height='90%'
                      width='90%'
                    />
                  </div>
                  <h2 className='my-2 text-xl font-semibold text-red-800'>{title || 'Crime NY'}</h2>
                </div>
              </div>
              <div className='flex items-center justify-center flip-card-back rounded-3xl'>
                <div className='flex-col items-center justify-between w-full h-full pt-2'>
                  <div className='flex-col items-center justify-center flex-grow m-3 overflow-visible h-36 scrollbar-thin scrollbar-thumb-black scrollbar-track-white text-shadow-white'>
                    {description ||
                      <p className='w-auto h-auto'>"This is a project description. It has many words. It's a placeholder for the description to come."</p>}
                    {mobile &&
                      <div className='w-3/4 h-auto p-2 mx-auto mt-4 bg-red-500'>  <Link href={link}><a href={link}>See The Project</a></Link></div>}
                  </div>
                  <div className='flex flex-wrap self-end justify-center flex-shrink w-full py-2 mb-1'>
                    {languages
                      ? languages.map((language) => {
                          // console.log(`Project: ${title}\nIconName:${language}\nIcon: ${iconList[language]}`)
                          return (
                            <Tooltip key={`key_langTT_projectcard__${language}`} tooltipText={language} color='red-400'>
                              <LanguageIcon
                                key={`key_projectcard_${language}_icon`}
                                iconName={language}
                                iconStyle={iconStyle}
                              />
                            </Tooltip>
                          )
                        })
                      : [
                        <LanguageIcon
                          key='key_projectcard_ex1_icon'
                          iconName='Flutter'
                          iconStyle={iconStyle}
                        />,
                        <LanguageIcon
                          key='key_projectcard_ex2_icon'
                          iconName='JS'
                          iconStyle={iconStyle}
                        />
                        ]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </BrowserView>
      <MobileView>
        <div onClick={touchHelper} className='flex flex-col items-center justify-center w-64 h-56 m-2 bg-white shadow-lg rounded-xl sm:min-h-0 sm:overflow-y-auto sm:pt-0 lg:w-96 lg:h-72'>
          <div className={`w-full h-full flip-card transform-gpu ${flipCard}`}>
            <div className='flip-card-body'>
              <div className='h-full flip-card-front'>
                <div className='flex flex-col items-center justify-start w-full h-full rounded-3xl flip-card-front'>
                  <div className='flex items-start justify-center w-full h-auto overflow-hidden rounded-sm'>
                    <img
                      className='flex w-full h-48 p-2 lg:h-64 rounded-2xl'
                      src={imageLink}
                      alt=''
                    />
                  </div>
                  <h2 className='my-2 text-xl font-semibold text-red-800'>{title || 'Crime NY'}</h2>
                </div>
              </div>
              <div className='flex items-center justify-center flip-card-back rounded-3xl'>
                <div className='flex-col items-center justify-between w-full h-full pt-2'>
                  <div className='flex-col items-center justify-center flex-grow m-3 overflow-visible h-36 scrollbar-thin scrollbar-thumb-black scrollbar-track-white text-shadow-white'>
                    {description ||
                      <p className='w-auto h-auto'>"This is a project description. It has many words. It's a placeholder for the description to come."</p>}
                    {mobile &&
                      <div className='w-3/4 h-auto p-2 mx-auto mt-4 bg-red-500'>  <Link href={link}><a href={link}>See The Project</a></Link></div>}
                  </div>
                  <div className='flex flex-wrap self-end justify-center flex-shrink w-full py-2 mb-1'>
                    {languages
                      ? languages.map((language) => {
                          // console.log(`Project: ${title}\nIconName:${language}\nIcon: ${iconList[language]}`)
                          return (
                            <Tooltip key={`key_langTT_projectcard__${language}`} tooltipText={language} color='red-400'>
                              <LanguageIcon
                                key={`key_projectcard_${language}_icon`}
                                iconName={language}
                                iconStyle={iconStyle}
                              />
                            </Tooltip>
                          )
                        })
                      : [
                        <LanguageIcon
                          key='key_projectcard_ex1_icon'
                          iconName='Flutter'
                          iconStyle={iconStyle}
                        />,
                        <LanguageIcon
                          key='key_projectcard_ex2_icon'
                          iconName='JS'
                          iconStyle={iconStyle}
                        />
                        ]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MobileView>
    </>
  )
}
