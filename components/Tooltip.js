import React from 'react'

export default function Tooltip ({ children, tooltipText, color }) {
  console.log(color)
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
      className='relative flex items-center justify-center w-auto'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`absolute flex flex-col items-center w-auto h-auto px-4 py-2 transition-all duration-150 rounded-sm text-${color || 'black'} ${color ? 'bg-white' : ''}`}
        style={{ marginLeft: 0, bottom: '50%', opacity: 0 }}
        ref={topTipRef}
      >
        <p className='w-full text-lg font-thin text-center whitespace-nowrap'>
          {tooltipText}
        </p>
      </div>
      {children}
    </div>
  )
}
