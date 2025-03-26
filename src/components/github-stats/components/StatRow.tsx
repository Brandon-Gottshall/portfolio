import React, { useRef, useEffect } from 'react'
import { type StatRowProps } from '../types/stats'

export function StatRow({
  stat,
  index,
  activeSegment,
  _type,
  onSegmentHover
}: StatRowProps) {
  // Check if this row is active based on the complex activeSegment
  const isActive =
    activeSegment === index ||
    (activeSegment !== null &&
      typeof activeSegment === 'object' &&
      activeSegment.otherIndex === index)

  const percentage = stat.percentage
  const lastHoveredRef = useRef<boolean>(false)

  // Keep track of when this row was last active
  useEffect(() => {
    if (isActive) {
      lastHoveredRef.current = true
    }
  }, [isActive])

  // Handle mouse enter on the stat row
  const handleMouseEnter = () => {
    lastHoveredRef.current = true
    onSegmentHover(index)
  }

  return (
    <div className='flex flex-col w-full'>
      <div
        className={`flex items-center space-x-3 py-2 transition-colors duration-200 px-3
        ${isActive ? 'rounded-lg bg-cream/10 dark:bg-navy-light/10' : 'rounded-lg hover:bg-cream/5 dark:hover:bg-navy-light/5 group-hover:opacity-90'}
      `}
        onMouseEnter={handleMouseEnter}
      >
        <div className='w-24 text-sm font-medium text-navy dark:text-cream'>
          {stat.name}
        </div>

        <div className='overflow-hidden relative flex-1 h-2 rounded-full bg-cream/30 dark:bg-navy-light/30'>
          <div
            className={`absolute left-0 h-full transition-all duration-200 rounded-full
              ${isActive ? 'bg-blue-500' : 'bg-blue-400 hover:bg-blue-500 group-hover:bg-blue-400/90'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className='w-20 text-right'>
          <span
            className={`text-sm ${isActive ? 'text-navy dark:text-cream' : 'text-navy/70 dark:text-cream/70'}`}
          >
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}
