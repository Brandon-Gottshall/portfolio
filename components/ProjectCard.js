import { LanguageIcon } from './LanguageIcon'
import { useState } from 'react'

export default function ProjectCard () {
  const iconStyle = 'w-4 h-4 ml-1'
  const [buttonStyle, setButtonStyle] = useState('flex transition-shadow flex-col items-center h-auto sm:rounded-3xl nm-concave-gray-100-lg')
  const onClickHelper = () => {
    setButtonStyle('flex transition-shadow flex-col items-center h-auto sm:rounded-3xl nm-inset-gray-100-lg')
  }
  return (
    <div className='flex flex-col justify-center w-1/4 h-auto pb-6 overflow-y-auto sm:py-12 '>
      <div className='w-4/5 py-3 sm:mx-auto'>
        <div className={buttonStyle} onClick={onClickHelper}>
          <h2 className='my-2 text-3xl font-thin'>Crime NY</h2>
          <div className='flex items-center justify-center w-4/5 h-auto overflow-visible rounded-2xl'>
            <img className='w-11/12 h-full p-1 rounded-sm nm-flat-gray-400' src='/portfolioScreenshot.png' alt='' />
          </div>
          <div className='flex flex-col w-4/5 pt-2 space-y-4'>
            <p className='overflow-y-hidden text-gray-400 max-h-40'>This is a project description. It has many words. It's a placeholder for the description to come.</p>
            <div className='flex flex-col items-center justify-center 3xl:justify-between 3xl:flex-row'>
              <div className='flex flex-wrap items-center justify-center w-1/3 pb-4 3xl:justify-end sm:flex-nowrap'>
                <LanguageIcon iconName='Flutter' iconStyle={iconStyle} />
                <LanguageIcon iconName='JS' iconStyle={iconStyle} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
