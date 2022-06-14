import TextLoop from 'react-text-loop'
import SubTitle from './SubTitle'

// old props { setPageNumber, setLinkSafeguard }
export default function LandingPage (database) {
  // const openPage2 = async () => {
  //   setLinkSafeguard(false);
  //   setPageNumber(1);
  //   setTimeout(() => {
  //     setLinkSafeguard(true);
  //   }, 800);
  // };
  return (
    <main className='flex flex-col items-center justify-center w-full h-full px-20 text-center'>
      <div className='flex flex-col items-center justify-center flex-grow w-24 pt-3 xs:w-64 whitespace-nowrap'>
        <h1 className='text-lg font-bold text-red-500 xs:text-4xl sm:text-6xl'>
          Brandon Gottshall
        </h1>
        <TextLoop className='transform-gpu' interval={1000}>
          <SubTitle title='Software Engineer' />
          <SubTitle title='Cloud Engineer' />
          <SubTitle title='Former Marine' />
          <SubTitle title='Automation Enthusiast' />
          <SubTitle title='Lifetime Student' />
        </TextLoop>
      </div>
    </main>
  )
}
