import Head from 'next/head'
import Link from 'next/link'
import { SocialIcon } from 'react-social-icons'

const Layout = ({ children }) => {
  return (
    <div className='justify-start table w-screen h-screen'>
      <Head>
        <title>Brandon Gottshall</title>
        <link rel='icon' href='favicon.ico' />
      </Head>
      <header className='sticky top-0 z-10 items-center justify-center table-row w-screen h-24 text-gray-600 body-font nm-flat-white-sm'>
        <nav className='flex items-center justify-between w-full h-full text-base md:ml-auto'>
          <Link href='/'>
            <a className='w-1/3 pl-4 text-2xl font-bold text-red-500 transition duration-500 ease-in-out whitespace-nowrap'>Brandon Gottshall</a>
          </Link>
          <div className='flex items-center justify-end w-1/3 mr-8'>
            <Link href='/Projects'><a className='flex items-center h-12 py-1 mr-5 hover:text-red-500'>Projects</a></Link>
            <Link href='/Resume'><a className='flex items-center h-12 py-1 mr-5 hover:text-red-500'>Resume</a></Link>
            <Link href='/Contact'>
              <button className='inline-flex items-center w-32 h-12 px-6 py-1 text-base text-center text-white transition duration-500 ease-in-out bg-red-500 border-0 rounded whitespace-nowrap focus:outline-none hover:bg-black'>
                Contact Me
                <svg
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  className='w-4 h-4 ml-1'
                  viewBox='0 0 24 24'
                >
                  <path d='M5 12h14M12 5l7 7-7 7' />
                </svg>
              </button>
            </Link>
          </div>
        </nav>
      </header>
      <div className='items-center justify-center table-row w-screen h-full m-0 bg-red'>
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
