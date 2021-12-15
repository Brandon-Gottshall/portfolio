
export default function BouncingLink ({ helper, linkText, direction }) {
  const directionToggle = {
    down: '',
    up: 'rotate-180'
  }
  const svgClassName = `w-6 h-6 mt-2 transition transform -translate-y-2 fill-current duration-1500 transform-gpu animate-pulse transform-gpu text-amber-900 group-hover:text-red-500 animate-none ${directionToggle[direction]}`
  return (
    <div className='flex justify-center pt-8 pb-3 sm:pb-0 sm:transition sm:transform sm:-translate-y-2 sm:h-auto sm:pt-0 sm:mt-auto sm:mb-10 duration-1500 transform-gpu group animate-bounce justify-self-end hover:animate-none' onClick={helper}>
      <svg className={svgClassName} fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
        <path d='M19 14l-7 7m0 0l-7-7m7 7V3' />
      </svg>
      <h3 className='w-64 text-3xl font-thin transition transform -translate-y-2 cursor-pointer select-none duration-1500 transform-gpu group-hover:text-red-500 animate-none'>{linkText}</h3>
      <svg className={svgClassName} fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
        <path d='M19 14l-7 7m0 0l-7-7m7 7V3' />
      </svg>
    </div>
  )
}
