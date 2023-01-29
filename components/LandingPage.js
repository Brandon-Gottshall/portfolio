import TextLoop from 'react-text-loop'
import SubTitle from './SubTitle'
import Image from 'next/image'
import avatar from '../public/ProfileTransparent.png'

export default function LandingPage () {
  return (
    <div className='z-10 flex-col items-center justify-center pt-3 text-center align-middle h-[80vh] whitespace-nowrap overflow-show'>
      <div className='flex-grow h-1/3' />
      <h1 className='text-lg font-bold text-red-500 xs:text-4xl sm:text-6xl overflow-x-clip'>
        Brandon Gottshall
      </h1>
      <TextLoop className='transform-gpu max-w-fit' interval={1000}>
        <SubTitle title='Software Engineer' />
        <SubTitle title='SE Bootcamp Instructor' />
        <SubTitle title='Former Marine' />
        <SubTitle title='Lifetime Student' />
        <SubTitle title='Automation Enthusiast' />
      </TextLoop>
      {/* Center the image on the screen */}
      <div className='absolute bottom-0 w-full'>
        <Image className='' src={avatar} width={500} height={500} />
      </div>
    </div>
  )
}
