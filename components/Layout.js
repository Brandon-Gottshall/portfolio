import Head from 'next/head'
import Link from 'next/link'
import { SocialIcon } from 'react-social-icons'
import { useState, useEffect } from 'react'

const Layout = ({ children }) => {
  const [menuOpenBool, setMenuOpenBool] = useState(false)
  useEffect(() => {
  }, [menuOpenBool])
  const menuOpenHelper = () => setMenuOpenBool(!menuOpenBool)
  const closeMenu = () => setMenuOpenBool(false)
  return (
    <div className='flex w-screen h-screen'>
      <div className={`z-20 justify-start table w-sceen h-screen overflow-x-hidden bg-white transform-gpu duration-1000 ${menuOpenBool ? '-translate-x-64' : ''}`}>
        <Head>
          <title>Brandon Gottshall</title>
          <link rel='icon' href='favicon.ico' />
        </Head>
        <header className='sticky top-0 z-10 items-center justify-start table-row h-12 text-gray-600 xs:justify-center body-font nm-flat-white-sm'>
          <nav className='flex items-center justify-between w-10/12 h-full mx-4 px-auto xs:w-11/12'>
            <div className='w-32 my-auto xs:w-64'>
              <Link href='/'>
                <a className='flex items-center justify-start w-full pl-4 -space-y-4 text-lg font-bold text-red-500 transition duration-500 ease-in-out sm:text-2xl sm:whitespace-nowrap'>
                  <h1 className='h-24 pt-8'>Brandon
                    <h1 className='hidden h-24 pt-8 xs:inline'> Gottshall
                    </h1>
                  </h1>
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
        <div className='table-row'>
          <footer className='sticky bottom-0 flex-col w-screen h-24 border-t sm:flex nm-flat-white-sm'>
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
            <a
              className='items-center hidden w-full mr-4 sm:flex whitespace-nowrap'
              href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              Powered by{' '} <img src='/vercel.svg' alt='Vercel Logo' className='w-24 h-12 ml-2' />
            </a>
          </footer>
        </div>
      </div>
      <div className='absolute top-0 right-0 z-10 flex justify-center w-64 h-screen bg-red-500'>
        <div className='grid w-full grid-cols-1 grid-rows-4 h-3/4 place-items-center'>
          <NavLink key='HomeKey' text='Home' href='/' />
          <NavLink key='ProjectsKey' text='Projects' href='/Projects' />
          <NavLink key='ResumeKey' text='Resume' href='/Resume' />
          <NavLink key='ContactMeKey' text='Contact Me' href='/Contact' />
        </div>
      </div>
    </div>
  )
}
const NavLink = ({ href, text }, closeMenu) => (
  <Link href={href}>
    <a
      className='w-9/12 h-20 pt-6 text-xl font-bold text-center text-white rounded-sm nm-flat-black-xs'
      href={href}
      target='_self'
      rel='noopener noreferrer'
      onClick={() => closeMenu()}
    >{text}
    </a>
  </Link>
)
export default Layout
