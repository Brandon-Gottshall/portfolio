import React from 'react'

export default function Tooltip ({ children, tooltipText }) {
  // const bottomTipRef = React.createRef(null)
  const topTipRef = React.createRef(null)
  function handleMouseEnter () {
    // bottomTipRef.current.style.opacity = 1
    // bottomTipRef.current.style.marginTop = '20px'
    topTipRef.current.style.opacity = 1
    topTipRef.current.style.marginBottom = '20px'
  }
  function handleMouseLeave () {
    // bottomTipRef.current.style.opacity = 0
    // bottomTipRef.current.style.marginTop = '10px'
    topTipRef.current.style.opacity = 0
    topTipRef.current.style.marginBottom = '10px'
  }
  return (
    <div
      className='relative flex items-center justify-center'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className='absolute flex flex-col items-center w-auto h-auto px-4 py-2 text-black transition-all duration-150 rounded-sm'
        style={{ marginLeft: 0, bottom: '50%', opacity: 0 }}
        ref={topTipRef}
      >
        <p className='w-full text-lg font-thin text-center text-black whitespace-nowrap'>
          {tooltipText}
        </p>
      </div>
      {children}
    </div>
  )
}

// <div
//   className='absolute flex flex-col items-center w-auto h-auto px-4 py-2 text-black transition-all duration-150 rounded-sm'
//   style={{ marginLeft: 0, top: '100%', opacity: 0 }}
//   ref={topTipRef}
// >
//   <p className='w-full text-xs text-center text-black whitespace-nowrap'>
//     Click to filter projects
//   </p>
// </div>
