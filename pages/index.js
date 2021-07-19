import Head from 'next/head'
import { SocialIcon } from 'react-social-icons'
import SubTitle from '../components/SubTitle'
import TextLoop from 'react-text-loop'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <Head>
        <title>Brandon Gottshall</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='flex flex-col items-center justify-center w-full h-full px-20 text-center'>
        <div className='flex flex-col items-center justify-center flex-grow w-64 pt-3 whitespace-nowrap'>
          <h1 className='text-4xl font-bold text-red-500 sm:text-6xl'>Brandon Gottshall</h1>
          <TextLoop className='transform-gpu' interval={1000}>
            <SubTitle title='Software Engineer' />
            <SubTitle title='Former Marine' />
            <SubTitle title='Entrepreneur' />
            <SubTitle title='Automation Enthusiast' />
            <SubTitle title='Second Brain Evangelist' />
          </TextLoop>
        </div>
      </main>

      <footer className='flex items-center justify-between w-full h-16 pr-24 border-t nm-convex-white-lg'>
        <div className='flex items-center justify-between h-8 pl-2 pr-16 w-52'>
          <SocialIcon style={{ width: '4rem' }} url='https://www.linkedin.com/in/brandon-gottshall/' bgColor='#1C00ff00' fgColor='#000000' />
          <SocialIcon style={{ width: '4rem' }} url='https://github.com/Brandon-Gottshall' bgColor='#1C00ff00' fgColor='#000000' />
          <SocialIcon style={{ width: '4rem' }} url='mailto:blgottshall@gmail.com' bgColor='#1C00ff00' fgColor='#000000' />
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
