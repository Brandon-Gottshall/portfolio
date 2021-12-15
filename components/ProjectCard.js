import { LanguageIcon, iconList } from './LanguageIcon'
import { useState } from 'react'

export default function ProjectCard ({ title, description, languages, link, imageURI, mobile }) {
  const iconStyle = 'w-4 h-4 ml-1'
  const iconStyleMobile = 'w-10 h-10 ml-1 mb-2'
  const [buttonStyle, setButtonStyle] = useState('nm-convex-gray-100-sm sm:nm-convex-gray-100-lg')
  const [flipped, setFlipped] = useState(false)
  const toggleButtonStyle = () => {
    setButtonStyle(' nm-inset-gray-100-sm sm:nm-inset-gray-100-lg')
    setTimeout(() => {
      setButtonStyle('sm:rounded-3xl nm-convex-gray-100-sm m:nm-convex-gray-100-lg')
    }, 100)
  }
  const cardFlipper = () => {
    setFlipped(!flipped)
  }
  // console.dir({ title, description, languages, link, imageURI })

  return mobile
    ? (
      <div className='flex flex-col items-end justify-center flex-grow w-full min-h-full sm:min-h-0 sm:overflow-y-auto sm:pt-0 sm:mb-0 sm:mt-1 sm:h-96 sm:w-1/4 sm:py-12 -start'>
        <div className={`w-10/12 mb-8 mr-6 h-5/6 sm:py-3 sm:mx-auto smooth-flip ${flipped ? 'flipped-card' : ''}`} onClick={cardFlipper}>
          <div className={flipped ? 'flipped-card-inner' : 'flip-card-inner-mobile'}>
            <div className={`flex flex-col items-center h-full transition-shadow nm-convex-gray-400-sm rounded-3xl ${flipped ? 'flipped-card-front' : 'flip-card-front'} sm:py-4`}>
              <h2 className='my-2 text-3xl font-thin'>{title || 'Crime NY'}</h2>
              <div className='flex items-center justify-center w-full h-auto overflow-visible rounded-2xl'>
                <img className='w-11/12 h-full p-1 rounded-sm' src='/portfolioScreenshot.png' alt='' />
              </div>
            </div>
            <div className={`flex flex-col items-center transition-shadow nm-convex-gray-400-sm rounded-3xl ${flipped ? 'flipped-card-back' : 'flip-card-back'} sm:py-4 rounded-3xl`}>
              <div className='flex flex-col justify-between w-11/12 h-full pt-2'>
                <p className='mt-4 overflow-y-auto text-left text-white max-h-32'>{description || 'This is a project description. It has many words. It\'s a placeholder for the description to come.'}</p>
                <div className='flex flex-wrap self-end justify-center w-full h-auto pb-2 mb-1'>
                  {languages
                    ? languages.map((language) => {
                        console.log(`Project: ${title}\nIconName:${language}\nIcon: ${iconList[language]}`)
                        return (<LanguageIcon key={`key_projectcard_${language}_icon`} iconName={language} iconStyle={iconStyleMobile} />
                        )
                      })
                    : ([<LanguageIcon key='key_projectcard_ex1_icon' iconName='Flutter' iconStyle={iconStyle} />,
                      <LanguageIcon key='key_projectcard_ex2_icon' iconName='JS' iconStyle={iconStyle} />])}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
    : (
      <div className='flex flex-col items-center justify-center flex-grow w-full min-h-full sm:min-h-0 sm:overflow-y-auto sm:pt-0 sm:mb-0 sm:mt-1 sm:h-96 sm:w-1/4 sm:py-12 -start'>
        <div className='w-4/5 mb-8 h-5/6 sm:py-3 sm:mx-auto smooth-flip flip-card'>
          <div className={'flip-card-inner ' + buttonStyle} onClick={toggleButtonStyle}>
            <div className='flex flex-col items-center h-full transition-shadow flip-card-front sm:py-4 rounded-3xl'>
              <h2 className='my-2 text-3xl font-thin'>{title || 'Crime NY'}</h2>
              <div className='flex items-center justify-center w-4/5 h-auto overflow-visible rounded-2xl'>
                <img className='w-11/12 h-full p-1 rounded-sm nm-flat-gray-400' src='/portfolioScreenshot.png' alt='' />
              </div>
            </div>
            <div className='flex flex-col items-center transition-shadow flip-card-back sm:py-4 rounded-3xl'>
              <div className='flex flex-col justify-between w-4/5 h-full pt-2'>
                <p className='mt-1 overflow-y-auto text-gray-400 max-h-32'>{description || 'This is a project description. It has many words. It\'s a placeholder for the description to come.'}</p>
                <div className='flex flex-wrap self-end justify-center w-full h-auto pb-2 mb-1'>
                  {languages
                    ? languages.map((language) => {
                        // console.log(`Project: ${title}\nIconName:${language}\nIcon: ${iconList[language]}`)
                        return (<LanguageIcon key={`key_projectcard_${language}_icon`} iconName={language} iconStyle={iconStyle} />
                        )
                      })
                    : ([<LanguageIcon key='key_projectcard_ex1_icon' iconName='Flutter' iconStyle={iconStyle} />,
                      <LanguageIcon key='key_projectcard_ex2_icon' iconName='JS' iconStyle={iconStyle} />])}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
}
