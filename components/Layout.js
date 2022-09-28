import Head from 'next/head'
import Link from 'next/link'
import { SocialIcon } from 'react-social-icons'
import { useState, useEffect } from 'react'

const Layout = ({ children }) => {
  const [menuOpenBool, setMenuOpenBool] = useState(false)
  useEffect(() => {
  }, [menuOpenBool])
  const menuOpenHelper = () => setMenuOpenBool(!menuOpenBool)
  const closeMenu = () => {
    if (menuOpenBool) {
      // wait .4 seconds
      setTimeout(() => { setMenuOpenBool(false) }, 400)
    }
  }

  return (
    <div className='flex w-screen h-screen overflow-visible'>
      <div className={`z-20 justify-start table w-screen h-full bg-white transform-gpu duration-1000 ${menuOpenBool ? '-translate-x-64 xs:-translate-x-80' : ''}`} onTouchStart={closeMenu}>
        <Head>
          <title>Brandon Gottshall</title>
          <link rel='icon' href='favicon.ico' />
        </Head>
        <header className='sticky top-0 z-10 items-center justify-center table-row h-24 text-gray-600 xs:h-48 xs:justify-center body-font nm-flat-white-sm'>
          <nav className='flex items-center justify-between w-10/12 h-full mx-4 px-auto xs:w-11/12'>
            <div className='w-32 xs:w-64'>
              <Link href='/'>
                <a className='flex items-center w-full pl-4 -space-y-4 text-lg font-bold text-red-500 transition duration-500 ease-in-out justify-CENTER sm:text-2xl lg:text-3xl sm:whitespace-nowrap'>
                  <div className='flex items-center h-auto pb-2'>
                    <h1 className='h-auto pl-1 align-middle py-auto'> Brandon
                    </h1>
                    <h1 className='hidden h-auto pl-1 py-auto sm:inline'> Gottshall
                    </h1>
                  </div>
                </a>
              </Link>
            </div>
            <div className='w-10 h-10 my-auto'>
              <button onClick={menuOpenHelper} className='flex-col items-center justify-center w-10 h-10 space-y-2'>
                <div className={`w-10 h-1 bg-black transform-gpu rotate-0 duration-1000 ${menuOpenBool ? 'rotate-45' : ''}`} />
                <div className={`w-10 h-1 bg-black transform-gpu rotate-0 duration-1000 ${menuOpenBool ? '-translate-y-3 -rotate-45' : ''}`} />
                <div className={`w-10 h-1 bg-black transition-opacity duration-500 opacity-100 ${menuOpenBool ? 'opacity-0' : ''}`} />
              </button>
            </div>

          </nav>
        </header>
        <div className='table-row w-full h-full m-0 bg-red'>
          {children}
        </div>

        {/*
      // TODO Make footer static allowing it to be revealed on scroll. Like it lies underneath.
      */}
        <div className='sticky bottom-0 table-row'>
          <footer className='flex-col w-screen h-24 border-t nm-flat-white-sm'>
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
                  url='mailto:blgottshall@gmail.com'
                  bgColor='#1C00ff00'
                  fgColor='#000000'
                />
              </div>
            </div>
          </footer>
        </div>
      </div>
      <div onMouseLeave={() => closeMenu()} className='absolute top-0 right-0 z-10 flex justify-center w-auto h-screen px-4 bg-red-500'>
        <div className='flex flex-col items-center justify-start pt-4 space-y-4'>
          <NavLink key='HomeKey' text='Home' href='/' onTouchEnd={() => closeMenu()} />
          <NavLink key='ProjectsKey' text='Projects' href='/Projects' onTouchEnd={() => closeMenu()} />
          <NavLink key='ResumeKey' text='Resume' href='/Resume' onTouchEnd={() => closeMenu()} />
          <NavLink key='ContactMeKey' text='Contact Me' href='/Contact' onTouchEnd={() => closeMenu()} />
        </div>
      </div>
    </div>
  )
}
const NavLink = ({ href, text }, onTouchEnd) => (
  <Link href={href}>
    <a
      className='w-48 h-20 pt-6 text-xl font-bold text-center text-white rounded-sm xs:w-64 nm-flat-black-xs'
      href={href}
      target='_self'
      rel='noopener noreferrer'
      onClick={() => {
        onTouchEnd()
      }}
    >{text}
    </a>
  </Link>
)
export default Layout
