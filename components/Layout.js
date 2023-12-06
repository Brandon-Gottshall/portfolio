import Head from 'next/head'
import Link from 'next/link'
import { SocialIcon } from 'react-social-icons'
import { useState } from 'react'

const Layout = ({ children }) => {
  const [menuOpenBool, setMenuOpenBool] = useState(false)
  const [pageTransitionBool, setPageTransitionBool] = useState(false)

  const menuOpenHelper = () => setMenuOpenBool(!menuOpenBool)
  // Page Transition
  const pageTransitionHelper = async () => {
    setPageTransitionBool(true)
    await new Promise(r => setTimeout(r, 500))
    setPageTransitionBool(false)
  }
  const closeMenu = async () => {
    if (menuOpenBool) {
      // wait .4 seconds
      await new Promise(r => setTimeout(r, 400))
      setMenuOpenBool(false)
    }
  }

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Head Component - For Global Meta Tags */}
      <Head>
        <title> Gott Codes </title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content="Gott Codes? I got a few, come on over and check em' out. 👨🏽‍💻"
        />
        <meta name='keywords' content='Gott Codes' />
        <meta name='author' content='Brandon Gottshall' />
      </Head>

      <div className='flex flex-1 bg-red-500 h-fit'>
        <div
          className={`z-20 flex-col justify-between w-screen bg-white transform-gpu duration-1000 ${
            menuOpenBool ? '-translate-x-64 xs:-translate-x-80' : ''
          }`}
          onTouchStart={closeMenu}
        >
          <header className='sticky top-0 z-10 h-24 text-gray-600 bg-white'>
            <div className='flex items-center justify-between w-10/12 h-full mx-4 px-auto xs:w-11/12'>
              <div className='w-32 xs:w-64'>
                <Link
                  href='/'
                  className='flex items-center justify-center w-full pl-4 -space-y-4 text-lg font-bold text-red-500 transition duration-500 ease-in-out sm:text-2xl lg:text-3xl sm:whitespace-nowrap'
                >
                  <div className='flex items-center h-auto pb-2'>
                    <h1 className='h-auto pl-1 font-bold align-middle py-auto font-ox'>
                      {' '}
                      Gott Codes{' '}
                    </h1>
                  </div>
                </Link>
              </div>
              <div className='w-10 h-10 my-auto'>
                <button
                  onClick={menuOpenHelper}
                  className='flex-col items-center justify-center w-10 h-10 space-y-2'
                >
                  <div
                    className={`w-10 h-1 bg-black transform-gpu rotate-0 duration-1000 ${
                      menuOpenBool ? 'rotate-45' : ''
                    }`}
                  />
                  <div
                    className={`w-10 h-1 bg-black transform-gpu rotate-0 duration-1000 ${
                      menuOpenBool ? '-translate-y-3 rotate-135' : ''
                    }`}
                  />
                  <div
                    className={`w-10 h-1 bg-black transition-opacity duration-500 opacity-100 ${
                      menuOpenBool ? ' opacity-0' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </header>
          <main
            className={`m-0 bg-red transition-opacity transform-gpu flex-fill duration-1000 ${
              pageTransitionBool ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {children}
          </main>

          <footer className='absolute bottom-0 flex-col w-screen h-24 bg-white shadow-neu-outset'>
            <div className='grid items-center justify-center w-full h-full grid-cols-3 grid-row-1'>
              <div className='w-full h-full text-center'>
                <SocialIcon
                  style={{ height: '100%' }}
                  url='https://www.linkedin.com/in/brandon-gottshall/'
                  bgColor='#1C00ff00'
                  fgColor='#000000'
                />
              </div>
              <div className='items-center justify-center w-full h-full text-center'>
                <SocialIcon
                  style={{ height: '100%' }}
                  url='https://github.com/Brandon-Gottshall'
                  bgColor='#1C00ff00'
                  fgColor='#000000'
                />
              </div>
              <div className='items-center justify-center w-full h-full text-center'>
                <SocialIcon
                  style={{ height: '100%' }}
                  url='https://x.com/GottCodes'
                  bgColor='#1C00ff00'
                  fgColor='#000000'
                />
              </div>
            </div>
          </footer>
        </div>
        <div
          onMouseLeave={closeMenu}
          className='absolute top-0 right-0 z-10 flex justify-center w-auto px-4 overflow-hidden bg-red-500 h-fit'
        >
          <div className='flex flex-col items-center justify-start pt-4 space-y-4'>
            <NavLink
              key='HomeKey'
              text='Home'
              href='/' 
              onClick={pageTransitionHelper}
            />
            <NavLink
              key='ProjectsKey'
              text='Projects'
              href='/Projects'
              onClick={pageTransitionHelper}
            />
            <NavLink
              key='ResumeKey'
              text='Resume'
              href='/ResumeSVG'
              onClick={pageTransitionHelper}
            />
            <NavLink
              key='ContactMeKey'
              text='Contact Me'
              href='/Contact'
              onClick={() => pageTransitionHelper()}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
function NavLink ({ href, text }) {
  return (
    <Link
      href={href}
      className='w-48 h-20 pt-6 text-xl font-bold text-center text-white rounded-sm xs:w-64 nm-flat-black-xs'
      target='_self'
      rel='noopener noreferrer'
    >
      {text}
    </Link>
  )
}
export default Layout
