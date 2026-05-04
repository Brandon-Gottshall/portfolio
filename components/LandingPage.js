import { useState, useEffect } from 'react'
import TextLoop from 'react-text-loop'
import SubTitle from './SubTitle'
import Image from 'next/image'
import avatar from '../public/ProfileTransparent.webp'
import Link from 'next/link'

export default function LandingPage () {
  const [windowHeight, setWindowHeight] = useState(0)
  useEffect(() => {
    setWindowHeight(window.innerHeight)
  }, [])
  return (
    <>
      <div className='z-10 flex items-center justify-center flex-grow h-64 pt-3 text-center nm-flat-white-xl'>
        <div className='h-44 '>
          <h1 className='text-lg font-bold text-red-500 xs:text-4xl sm:text-6xl'>
            Brandon Gottshall
          </h1>
          <TextLoop className='transform-gpu max-w-fit' interval={1000}>
            <SubTitle title='Software Engineer' />
            <SubTitle title='SE Bootcamp Instructor' />
            <SubTitle title='Marine Corps Veteran' />
            <SubTitle title='Lifetime Student' />
            <SubTitle title='Automation Enthusiast' />
          </TextLoop>
          <p className='max-w-xl px-6 pt-4 mx-auto text-sm leading-6 text-gray-700 xs:text-base'>
            Current systems, historical artifacts, and the rebuilds that connect them.
          </p>
          <Link
            href='/Projects'
            className='inline-block px-6 py-3 mt-5 text-sm font-bold text-white transition duration-300 rounded shadow-lg nm-convex-red-500-sm bg-red-500 font-ox hover:bg-black'
          >
            View chronological portfolio
          </Link>
        </div>
        {/* Center the image on the screen */}
      </div>

      <div className='flex items-end justify-center flex-grow w-full h-auto -pb-56'>
        {windowHeight > 700 && windowHeight < 850 && (
          <Image src={avatar} width={400} height={400} alt='Illustrated portrait of Brandon Gottshall' />
        )}
        {windowHeight > 850 && windowHeight < 950 && (
          <Image src={avatar} width={600} height={600} alt='Illustrated portrait of Brandon Gottshall' />
        )}
        {windowHeight > 950 && <Image src={avatar} width={600} height={600} alt='Illustrated portrait of Brandon Gottshall' />}
      </div>
    </>
  )
}
