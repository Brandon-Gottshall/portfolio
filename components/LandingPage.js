// import TextLoop from 'react-text-loop'
import SubTitle from './SubTitle'
import Image from 'next/image'
import avatar from '../public/ProfileTransparentLut.png'

export default function LandingPage () {
  return (
    <>
      <div className='z-10 flex flex-col items-center justify-center flex-grow h-64 pt-3 text-center nm-flat-white-xl'>
        <h1 className='text-lg font-bold text-red-500 xs:text-4xl sm:text-6xl'>
          Brandon Gottshall
        </h1>
       {
        //  <TextLoop className='transform-gpu max-w-fit' interval={1000}>
        //   <SubTitle title='Software Engineer' />
        //   <SubTitle title='SE Bootcamp Instructor' />
        //   <SubTitle title='Marine Corps Veteran' />
        //   <SubTitle title='Lifetime Student' />
        //   <SubTitle title='Automation Enthusiast' />
        // </TextLoop>
      }
      </div>

      <div className='relative flex items-center justify-center flex-grow w-full h-[70vh]'>
        <Image
          src={avatar}
          alt="Brandon's Avatar"
          layout='fill'
          objectFit='contain'
          objectPosition='center'
        />
      </div>
    </>
  )
}
