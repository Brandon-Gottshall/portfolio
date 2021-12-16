import { LanguageIcon } from './LanguageIcon'

export default function ProjectCard ({
  title,
  description,
  languages,
  link,
  imageURI,
  mobile
}) {
  const iconStyle = 'w-4 h-4 ml-1'

  return (
    <div className='flex flex-col items-center justify-center w-64 h-56 m-2 bg-red-700 rounded-lg sm:min-h-0 sm:overflow-y-auto sm:pt-0'>
      <div className='w-11/12 h-full sm:mx-auto flip-card'>
        <div className='flip-card-body'>
          <div className='h-full flip-card-front'>
            <div className='flex flex-col items-center justify-between h-full py-1 flip-card-front rounded-3xl'>
              <div className='flex items-center justify-center w-full h-auto overflow-visible rounded-2xl'>
                <img
                  className='w-full h-full p-1 rounded-sm'
                  src='/portfolioScreenshot.png'
                  alt=''
                />
              </div>
              <h2 className='my-2 text-2xl font-thin'>{title || 'Crime NY'}</h2>
            </div>
          </div>
          <div className='flex flex-col items-center flip-card-back rounded-3xl'>
            <div className='flex flex-col justify-between w-full h-full pt-2'>
              <p className='flex-grow mt-1 overflow-visible scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-white hover:scrollbar-thumb-black'>
                {description ||
                  "This is a project description. It has many words. It's a placeholder for the description to come."}
              </p>
              <div className='flex flex-wrap self-end justify-center flex-shrink w-full py-2 mb-1'>
                {languages
                  ? languages.map((language) => {
                      // console.log(`Project: ${title}\nIconName:${language}\nIcon: ${iconList[language]}`)
                      return (
                        <LanguageIcon
                          key={`key_projectcard_${language}_icon`}
                          iconName={language}
                          iconStyle={iconStyle}
                          color='white'
                        />
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
  )
}
