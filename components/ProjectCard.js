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
    <div className='flex flex-col items-center justify-center w-64 h-48 m-2 rounded-lg bg-slate-400 sm:min-h-0 sm:overflow-y-auto sm:pt-0 sm:h-96 sm:py-12'>
      <div className='w-4/5 h-full mb-8 sm:py-3 sm:mx-auto flip-card'>
        <div className='flip-card-body'>
          <div className='h-full flip-card-front'>
            <div className='flex flex-col items-center h-full flip-card-front sm:py-4 rounded-3xl'>
              <h2 className='my-2 text-3xl font-thin'>{title || 'Crime NY'}</h2>
              <div className='flex items-center justify-center w-4/5 h-auto overflow-visible rounded-2xl'>
                <img
                  className='w-11/12 h-full p-1 rounded-sm nm-flat-gray-400'
                  src='/portfolioScreenshot.png'
                  alt=''
                />
              </div>
            </div>
          </div>
          <div className='flex flex-col items-center flip-card-back sm:py-4 rounded-3xl'>
            <div className='flex flex-col justify-between w-4/5 h-full pt-2'>
              <p className='mt-1 overflow-y-auto max-h-32'>
                {description ||
                  "This is a project description. It has many words. It's a placeholder for the description to come."}
              </p>
              <div className='flex flex-wrap self-end justify-center w-full h-auto pb-2 mb-1'>
                {languages
                  ? languages.map((language) => {
                      // console.log(`Project: ${title}\nIconName:${language}\nIcon: ${iconList[language]}`)
                      return (
                        <LanguageIcon
                          key={`key_projectcard_${language}_icon`}
                          iconName={language}
                          iconStyle={iconStyle}
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
