import Head from 'next/head'
import TextLoop from "react-text-loop"
import { SocialIcon } from 'react-social-icons'
import DeviceIcon from '../components/DeviceIcon'

export default function Home() {
  const deviceIconStyle = "bg-red-400"
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 w-full px-20 text-center">
      <div className="flex flex-col items-center justify-center flex-grow w-64 pt-3 whitespace-nowrap">
        <h1 className="text-6xl font-bold text-red-500">Brandon Gottshall</h1>
        <TextLoop className="transform-gpu" interval={3000} delay={1500}>
          <h3 className="w-64 text-3xl font-thin">Freelance Developer</h3>
          <TextLoop className="transform-gpu" interval={1500}>
            <h3 className="w-64 text-3xl font-thin">Former Marine</h3>
            <h3 className="w-64 text-3xl font-thin">Entrepreneur</h3>
          </TextLoop>
        </TextLoop>
      </div>
      <div className="flex justify-center mt-auto mb-10 transition transform -translate-y-2 duration-1500 transform-gpu group animate-bounce-quick justify-self-end hover:animate-none">
        <svg className="w-6 h-6 mt-2 transition transform -translate-y-2 fill-current duration-1500 transform-gpu animate-pulse text-amber-900 group-hover:text-red-500 animate-none" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
        <h3 className="w-64 text-3xl font-thin transition transform -translate-y-2 duration-1500 transform-gpu group-hover:text-red-500 animate-none">Resume & Work</h3>
        <svg className="w-6 h-6 mt-2 transition transform -translate-y-2 fill-current duration-1500 transform-gpu animate-pulse text-amber-900 group-hover:text-red-500 animate-none" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
      </main>

      <footer className="flex items-center justify-between w-full h-16 pr-24 border-t">
      <div className="flex items-center justify-between h-24 pl-2 pr-16 w-52">
          <SocialIcon style={{ width: '4rem', overflow: 'visible'}} url="https://www.linkedin.com/in/brandon-gottshall/" bgColor="#000000"/>
          <SocialIcon style={{ width: '4rem'}} url="https://github.com/Brandon-Gottshall" bgColor="#000000"/>
          <SocialIcon style={{ width: '4rem'}} url="mailto:blgottshall@gmail.com" bgColor="#000000"/>
      </div>
        <a
          className="flex w-32 whitespace-nowrap"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-6 ml-2" />
        </a>
      </footer>
    </div>
  )
}



// <div className="flex items-center justify-between w-64 pt-3">
//         <DeviceIcon deviceIconStyle deviceName="web" altText="I develop for web." tooltipText="Web Development"></DeviceIcon>
//         <DeviceIcon deviceIconStyle deviceName="desktop-mobile" altText="I develop for Desktop, tablets, and mobile." tooltipText="Flutter Development (Desktop, Mobile, Tablet, Web, etc.)"></DeviceIcon>
//         <DeviceIcon deviceIconStyle deviceName="cloud" altText="I develop for cloud. GCP and Firebase Primarily" tooltipText="Cloud Development (GCP, Firebase)"></DeviceIcon>
//       </div>