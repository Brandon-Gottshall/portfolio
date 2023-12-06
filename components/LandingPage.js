import { Typewriter } from 'typewriting-react';
import Image from "next/image";
import avatar from "../public/ProfileTransparentLut.webp";


export default function LandingPage() {
  return (
    <div className="inset-0 flex flex-col items-center justify-center h-full overflow-hidden">
      <div className="z-10 flex flex-col items-center justify-center flex-grow w-full h-24 text-center shadow-neu-outset">
        <h1 className="text-lg font-bold text-red-500 xs:text-4xl sm:text-6xl">
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

        <Typewriter 
          words={[
            "Software Engineer",
            "Marine Corps Veteran",
            "Wizard'n up the place",
            "Software Engineering Bootcamp Instructor",
            "Lifetime Student",
            "Secretly a Robot 🤖",
          ]}
          nextWordDelay={1000}
          // cursorStyle={
          //   "bg-red-500"
          // }
        cursorClassName='animate-ping w-[0.5px] h-[15px] bg-red-500'
          />
      </div>

      <Image
        src={avatar}
        alt="Brandon's Avatar"
        className="relative w-auto mt-[10vh] h-[60vh] min-w-fit justify-self-end"
      />
    </div>
  );
}

