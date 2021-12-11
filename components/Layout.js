import Head from 'next/head'
import Link from 'next/link'
import { SocialIcon } from 'react-social-icons'
import { useAppContext } from '../context/AppContext'

const Layout = ({ children }) => {
  const { showTitleBool } = useAppContext()
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <Head>
        <title>Brandon Gottshall</title>
        <link rel='icon' href='favicon.ico' />
      </Head>
      <header className='absolute top-0 flex flex-row justify-end w-screen p-12 text-gray-600 body-font'>
        <h1 className={'text-2xl font-bold text-red-500 transition duration-500 ease-in-out' + (showTitleBool ? '' : ' hidden')}>Brandon Gottshall</h1>
        <nav className='flex items-center justify-center text-base md:ml-auto'>
          <Link href='/Projects'><a className='mr-5 hover:text-red-500'>Projects</a></Link>
          <Link href='/Resume'><a className='mr-5 hover:text-red-500'>Resume</a></Link>
        </nav>
        <button className='inline-flex items-center px-6 py-1 mt-4 text-base text-center text-white transition duration-500 ease-in-out bg-red-500 border-0 rounded focus:outline-none hover:bg-black md:mt-0'>
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
      </header>

      {children}

      <footer className='absolute bottom-0 flex items-center justify-between w-full h-16 pr-24 border-t nm-convex-white-lg'>
        <div className='flex items-center justify-between h-8 pl-2 pr-16 w-52'>
          <SocialIcon
            style={{ width: '4rem' }}
            url='https://www.linkedin.com/in/brandon-gottshall/'
            bgColor='#1C00ff00'
            fgColor='#000000'
          />
          <SocialIcon
            style={{ width: '4rem' }}
            url='https://github.com/Brandon-Gottshall'
            bgColor='#1C00ff00'
            fgColor='#000000'
          />
          <SocialIcon
            style={{ width: '4rem' }}
            url='mailto:blgottshall@gmail.com'
            bgColor='#1C00ff00'
            fgColor='#000000'
          />
        </div>
        <a
          className='flex w-32 whitespace-nowrap'
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by{' '}
          <img src='/vercel.svg' alt='Vercel Logo' className='h-6 ml-2' />
        </a>
      </footer>
    </div>
  )
}

export default Layout
