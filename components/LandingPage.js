import { useState, useEffect } from 'react'
import TextLoop from 'react-text-loop'
import SubTitle from './SubTitle'
import Image from 'next/image'
import avatar from '../public/ProfileTransparent.webp'

export default function LandingPage () {
  const [windowHeight, setWindowHeight] = useState(0)
  useEffect(() => {
    setWindowHeight(window.innerHeight)
  }, [])
  return (
    <>
      <div className='z-10 flex items-center justify-center flex-grow h-64 pt-3 text-center nm-flat-white-xl'>
        <div className='h-32 '>
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
        </div>
        {/* Center the image on the screen */}
      </div>

      <div className='flex items-end justify-center flex-grow w-full h-auto -pb-56'>
        {windowHeight > 700 && windowHeight < 850 && (
          <Image src={avatar} width={400} height={400} />
        )}
        {windowHeight > 850 && windowHeight < 950 && (
          <Image src={avatar} width={600} height={600} />
        )}
        {windowHeight > 950 && <Image src={avatar} width={600} height={600} />}
      </div>
    </>
  )
}
