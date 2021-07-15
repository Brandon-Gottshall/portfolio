import { LanguageIcon, iconList } from './LanguageIcon'
import { useState } from 'react'

export default function ProjectCard ({ title, description, languages, link, imageURI }) {
  const iconStyle = 'w-4 h-4 ml-1'
  const [buttonStyle, setButtonStyle] = useState('flex transition-shadow flex-col items-center h-96 sm:rounded-3xl nm-concave-gray-100-lg')
  const onClickHelper = () => {
    setButtonStyle('flex transition-shadow flex-col items-center h-auto sm:rounded-3xl nm-inset-gray-100-lg')
  }
  console.dir({ title, description, languages, link, imageURI })

  return (
    <div className='flex flex-col justify-center w-1/4 h-auto pb-6 overflow-y-auto sm:py-12 '>
      <div className='w-4/5 py-3 sm:mx-auto'>
        <div className={buttonStyle} onClick={onClickHelper}>
          <h2 className='my-2 text-3xl font-thin'>{title || 'Crime NY'}</h2>
          <div className='flex items-center justify-center w-4/5 h-auto overflow-visible rounded-2xl'>
            <img className='w-11/12 h-full p-1 rounded-sm nm-flat-gray-400' src='/portfolioScreenshot.png' alt='' />
          </div>
          <div className='flex flex-col justify-between w-4/5 h-full pt-2'>
            <p className='mt-1 overflow-y-auto text-gray-400 max-h-32'>{description || 'This is a project description. It has many words. It\'s a placeholder for the description to come.'}</p>
            <div className='flex flex-wrap self-end justify-center w-full pb-2 mb-1'>
              {languages
                ? languages.map((language) => {
                  console.log(`Project: ${title}\nIconName:${language}\nIcon: ${iconList[language]}`)
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
  )
}
