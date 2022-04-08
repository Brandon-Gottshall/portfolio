import Head from 'next/head'
import Link from 'next/link'
import { SocialIcon } from 'react-social-icons'
import { useState, useEffect } from 'react'

const Layout = ({ children }) => {
  const [menuOpenBool, setMenuOpenBool] = useState(false)
  useEffect(() => {
  }, [menuOpenBool])
  const menuOpenHelper = () => setMenuOpenBool(!menuOpenBool)
  return (
    <div className='justify-start table w-1/2 h-screen overflow-x-scroll'>
      <Head>
        <title>Brandon Gottshall</title>
        <link rel='icon' href='favicon.ico' />
      </Head>
      <header className='sticky top-0 z-10 items-center justify-center table-row w-screen h-24 text-gray-600 body-font nm-flat-white-sm'>
        <nav className='flex items-center justify-between w-full h-full'>
          <div className='w-1/4 my-auto'>
            <Link href='/'>
              <a className='w-full h-24 pl-4 my-auto text-2xl font-bold text-red-500 transition duration-500 ease-in-out whitespace-nowrap'>Brandon Gottshall</a>
            </Link>
          </div>
          <div className='w-1/4 my-auto'>
            <button onClick={menuOpenHelper} className='flex-col items-center justify-center w-1/3 h-full space-y-1 sm:space-y-2'>
              <div className='w-10 h-1 bg-black' />
              <div className='w-10 h-1 bg-black' />
              <div className='w-10 h-1 bg-black' />
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
  )
}

export default Layout
