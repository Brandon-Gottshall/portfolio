import DeviceIcon from './DeviceIcon'
import CodeWarsBoard from './CodeWarsBoard'

export default function ResumeAndProjects ({ pageNumber, linkSafeguard }) {
  return (
    <main className='flex flex-col items-center justify-start w-full h-full px-20 text-center'>
      <div className='flex flex-col items-start justify-center w-screen mt-3 border-t-2 border-black'>
        <div className='flex items-center w-screen pr-8 mt-3 justify-evenly h-96'>
          <h3 className='text-3xl font-thin text-red-500'>Skills</h3>
          {(linkSafeguard && pageNumber === 1) &&
            <div className='flex items-center justify-between pt-3 ml-32 animate-fade-in-from-right w-96'>
              <CodeWarsBoard />
            </div>}
        </div>
        <div className='flex items-center w-screen pt-3 pr-8 border-t-2 border-black justify-evenly'>
          <h3 className='text-3xl font-thin text-red-500'>Projects</h3>
          {(linkSafeguard && pageNumber === 1) &&
            <div className='flex items-center justify-between pt-3 ml-32 animate-fade-in-from-right w-96'>
              <DeviceIcon deviceIconStyle linkSafeguard deviceName='web' altText='I develop for web.' tooltipText='Web Development' />
              <DeviceIcon deviceIconStyle linkSafeguard deviceName='desktop-mobile' altText='I develop for Desktop, tablets, and mobile.' tooltipText='Flutter Development (Desktop, Mobile, Tablet, Web, etc.)' />
              <DeviceIcon deviceIconStyle linkSafeguard deviceName='cloud' altText='I develop for cloud. GCP and Firebase Primarily' tooltipText='Cloud Development (GCP, Firebase)' />
            </div>}
        </div>
      </div>
    </main>
  )
}
