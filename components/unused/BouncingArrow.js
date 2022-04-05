
export default function BouncingArrow ({ helper, linkText, direction, contClassName, svgClassName }) {
  const directionToggle = {
    down: '',
    up: 'rotate-180'
  }
  // const svgClassNameConcat = `w-10 h-10 mt-2 transition transform -translate-y-2 fill-current duration-1500 transform-gpu animate-pulse text-amber-900 group-hover:text-red-500 animate-none ${directionToggle[direction]} ${svgClassName}`
  const svgClassNameConcat = `transition transform fill-current transform-gpu animate-pulse text-black group-hover:text-red-500 animate-none ${directionToggle[direction]} ${svgClassName || 'w-10 h-10'}`
  return (
    <div className={'flex justify-center transition transform cursor-pointer duration-1500 transform-gpu group animate-bounce hover:animate-none ' + contClassName} onClick={helper}>
      <svg className={svgClassNameConcat} fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' stroke='currentColor'>
        <path d='M19 14l-7 7m0 0l-7-7m7 7V3' />
      </svg>
    </div>
  )
}
