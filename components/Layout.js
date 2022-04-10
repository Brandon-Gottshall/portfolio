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
    <div className='flex w-auto h-screen'>
      <div className={`z-20 justify-start table w-1/2 h-screen overflow-x-scroll bg-white transform-gpu duration-1000 ${menuOpenBool ? '-translate-x-64' : ''}`}>
        <Head>
          <title>Brandon Gottshall</title>
          <link rel='icon' href='favicon.ico' />
        </Head>
        <header className='sticky top-0 z-10 items-center justify-center table-row w-screen h-24 text-gray-600 body-font nm-flat-white-sm'>
          <nav className='flex items-center justify-between w-full h-full'>
            <div className='w-1/2 my-auto'>
              <Link href='/'>
                <a className='w-full h-32 pl-4 my-auto text-lg font-bold text-red-500 transition duration-500 ease-in-out sm:text-2xl sm:whitespace-nowrap'>Brandon Gottshall</a>
              </Link>
            </div>
            <div className='w-auto my-auto mr-8'>
              <button onClick={menuOpenHelper} className='flex-col items-center justify-center h-full space-y-2'>
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
          <footer className='sticky bottom-0 flex w-screen h-24 border-t nm-flat-white-sm flex-nowrap space-between'>
            <div className='flex-col w-48 h-full pl-2 flex-nowrap'>
              <SocialIcon
                style={{ height: '100%' }}
                url='https://www.linkedin.com/in/brandon-gottshall/'
                bgColor='#1C00ff00'
                fgColor='#000000'
              />
              <SocialIcon
                style={{ height: '100%' }}
                url='https://github.com/Brandon-Gottshall'
                bgColor='#1C00ff00'
                fgColor='#000000'
              />
              <SocialIcon
                style={{ height: '100%' }}
                url='mailto:blgottshall@gmail.com'
                bgColor='#1C00ff00'
                fgColor='#000000'
              />
            </div>
            <div className='flex-grow h-full' />
            <a
              className='flex items-center w-48 mr-4 whitespace-nowrap'
              href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              Powered by{' '} <img src='/vercel.svg' alt='Vercel Logo' className='w-24 h-12 ml-2' />
            </a>
          </footer>
        </div>
      </div>
      <div className='absolute top-0 right-0 z-10 w-64 h-screen bg-red-400'>
        <div className='grid w-full grid-cols-1 grid-rows-4 place-items-center h-1/2'>
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
      className='h-14 pt-3 text-center text-white font-semibold text-xl nm-flat-black-xs w-9/12'
      href={href}
      target='_self'
      rel='noopener noreferrer'
      onClick={() => closeMenu()}
    >{text}
    </a>
  </Link>
)
export default Layout
