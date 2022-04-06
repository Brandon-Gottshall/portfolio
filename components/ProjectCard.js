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
  const imageLink = imageURI || '/portfolioScreenshot.png'
  console.log(imageURI)

  return (
    <div className='flex flex-col items-center justify-center w-64 h-56 m-2 bg-red-700 rounded-lg sm:min-h-0 sm:overflow-y-auto sm:pt-0'>
      <div className='w-full h-full flip-card'>
        <div className='flip-card-body'>
          <div className='h-full flip-card-front'>
            <div className='flex flex-col items-center justify-start w-full h-full rounded-3xl flip-card-front'>
              <div className='flex items-start justify-center w-full h-auto overflow-hidden rounded-sm'>
                <img
                  className='flex w-full p-2 rounded-xl'
                  style={{ height: '11.2em' }}
                  src={imageLink}
                  alt=''
                />
              </div>
              <h2 className='my-2 text-xl text-white'>{title || 'Crime NY'}</h2>
            </div>
          </div>
          <div className='flex flex-col items-center flip-card-back rounded-3xl'>
            <div className='flex flex-col justify-between w-full h-full pt-2'>
              <p className='flex-grow mt-1 overflow-visible scrollbar-thin scrollbar-thumb-black scrollbar-track-white text-shadow-white'>
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
