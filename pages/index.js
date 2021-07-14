import Head from 'next/head'
import { useState, useEffect } from 'react'
import { SocialIcon } from 'react-social-icons'
import ReactPageScroller from 'react-page-scroller'
import LandingPage from '../components/LandingPage'
import Projects from '../components/Projects'
import Resume from '../components/Resume'

const Home = () => {
  const [pageNumber, setPageNumber] = useState(null)
  const [linkSafeguard, setLinkSafeguard] = useState(true)
  const [scrollSafeguardUp, setScrollSafeguardUp] = useState(false)
  const [scrollSafeguardDown, setScrollSafeguardDown] = useState(false)

  const lockScroll = () => {
    setScrollSafeguardDown(true)
    setScrollSafeguardUp(true)
  }
  const unlockScroll = () => {
    setScrollSafeguardDown(false)
    setScrollSafeguardUp(false)
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen py-2'>
      <Head>
        <title>Brandon Gottshall</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <ReactPageScroller customPageNumber={pageNumber} pageOnChange={setPageNumber} className='flex-grow' blockScrollUp={scrollSafeguardUp} blockScrollDown={scrollSafeguardDown} renderAllPagesOnFirstRender>
        <LandingPage setPageNumber={setPageNumber} setLinkSafeguard={setLinkSafeguard} />
        <Projects pageNumber={pageNumber} linkSafeguard={linkSafeguard} setPageNumber={setPageNumber} setLinkSafeguard={setLinkSafeguard} unlockScroll={unlockScroll} lockScroll={lockScroll} />
        <Resume pageNumber={pageNumber} linkSafeguard={linkSafeguard} setPageNumber={setPageNumber} setLinkSafeguard={setLinkSafeguard} lockScroll={lockScroll} />
      </ReactPageScroller>

      <footer className='flex items-center justify-between w-full h-16 pr-24 border-t'>
        <div className='flex items-center justify-between h-8 pl-2 pr-16 w-52'>
          <SocialIcon style={{ width: '4rem' }} url='https://www.linkedin.com/in/brandon-gottshall/' bgColor='#ffffff' fgColor='#000000' />
          <SocialIcon style={{ width: '4rem' }} url='https://github.com/Brandon-Gottshall' bgColor='#ffffff' fgColor='#000000' />
          <SocialIcon style={{ width: '4rem' }} url='mailto:blgottshall@gmail.com' bgColor='#ffffff' fgColor='#000000' />
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

export default Home
