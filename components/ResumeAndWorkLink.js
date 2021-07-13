
export default function ResumeAndWorkLink ({ openPage2 }) {
  return (
    <div className='flex justify-center mt-auto mb-10 transition transform -translate-y-2 duration-1500 transform-gpu group animate-bounce justify-self-end hover:animate-none' onClick={openPage2}>
      <svg className='w-6 h-6 mt-2 transition transform -translate-y-2 fill-current duration-1500 transform-gpu animate-pulse text-amber-900 group-hover:text-red-500 animate-none' fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' stroke='currentColor'>
        <path d='M19 14l-7 7m0 0l-7-7m7 7V3' />
      </svg>
      <h3 className='w-64 text-3xl font-thin transition transform -translate-y-2 duration-1500 transform-gpu group-hover:text-red-500 animate-none'>Resume & Work</h3>
      <svg className='w-6 h-6 mt-2 transition transform -translate-y-2 fill-current duration-1500 transform-gpu animate-pulse text-amber-900 group-hover:text-red-500 animate-none' fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' stroke='currentColor'>
        <path d='M19 14l-7 7m0 0l-7-7m7 7V3' />
      </svg>
    </div>
  )
}
