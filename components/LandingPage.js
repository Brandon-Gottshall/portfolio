import TextLoop from 'react-text-loop';
import BouncingLink from './BouncingLink';
import SubTitle from './SubTitle';

// old props { setPageNumber, setLinkSafeguard }
export default function LandingPage () {
  // const openPage2 = async () => {
  //   setLinkSafeguard(false);
  //   setPageNumber(1);
  //   setTimeout(() => {
  //     setLinkSafeguard(true);
  //   }, 800);
  // };
  return (
    <main className='flex flex-col items-center justify-center w-full px-20 text-center'>
      <div className='flex flex-col items-center justify-center flex-grow w-64 pt-3 whitespace-nowrap'>
        <h1 className='text-4xl font-bold text-red-500 sm:text-6xl'>
          Brandon Gottshall
        </h1>
        <TextLoop className='transform-gpu' interval={1000}>
          <SubTitle title='Software Engineer' />
          <SubTitle title='Former Marine' />
          <SubTitle title='Entrepreneur' />
          <SubTitle title='Automation Enthusiast' />
          <SubTitle title='Second Brain Evangelist' />
        </TextLoop>
      </div>
    </main>
  )
}
