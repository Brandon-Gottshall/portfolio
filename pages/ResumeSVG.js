import resume from '../public/resume.svg'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function ResumeSVG () {
  // Get window width
  const [windowWidth, setWindowWidth] = useState(0)
  useEffect(() => {
    setWindowWidth(window.innerWidth)
  }, [])

  return (
    <div className='flex-col items-center justify-center w-full pt-8 overflow-y-scroll border-b-8 border-b-red-500'>
      <Image src={resume} width={windowWidth} height={windowWidth * 1.3} />
      <div className='flex justify-center'>
        <button className='h-12 px-8 m-4 font-semibold text-white rounded nm-convex-red-500-sm font-ox'>Download PDF</button>
      </div>
    </div>
  )
}
