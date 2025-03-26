import React, { useRef, useEffect } from 'react'
import { type DetailedBreakdownProps } from '../types/stats'
import { StatRow } from './StatRow'

export function DetailedBreakdown({
  stats,
  activeSegment,
  type,
  onSegmentHover
}: DetailedBreakdownProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  // Track the last active segment for potential restoration on re-entry
  const lastActiveSegmentRef = useRef<number | null>(null)

  // Handle mouse enter for the entire container
  const handleContainerMouseEnter = (_e: React.MouseEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // If we're returning to the container with a previously active segment
    // and nothing is currently active, restore the last active segment
    if (activeSegment === null && lastActiveSegmentRef.current !== null) {
      // Small delay to prevent flickering
      requestAnimationFrame(() => {
        onSegmentHover(lastActiveSegmentRef.current)
      })
    }
  }

  // Handle mouse leave for the entire container
  const handleContainerMouseLeave = (e: React.MouseEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Only create the timeout if we're actually leaving the container
    // and not just moving between children
    if (
      !(e.relatedTarget && e.currentTarget.contains(e.relatedTarget as Node))
    ) {
      timeoutRef.current = setTimeout(() => {
        onSegmentHover(null)
        timeoutRef.current = null
      }, 50) // Faster timeout for better responsiveness
    }
  }

  // Sync with external active segment changes
  useEffect(() => {
    // Store the last non-null active segment
    if (activeSegment !== null) {
      lastActiveSegmentRef.current = activeSegment
    }

    // Nothing else to do if there's no active segment
    if (activeSegment === null) return

    // If we have an active segment from external source (donut chart),
    // make sure any pending timeouts are cleared
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [activeSegment])

  return (
    <div className='space-y-1 w-full'>
      <h4 className='mb-4 text-sm font-medium text-navy dark:text-cream'>
        Detailed Breakdown
        <span className='ml-2 text-xs italic text-navy-light/80 dark:text-cream/60'>
          By Usage
        </span>
      </h4>

      <div
        className='space-y-1 group'
        onMouseEnter={handleContainerMouseEnter}
        onMouseLeave={handleContainerMouseLeave}
      >
        {stats.map((stat, index) => (
          <StatRow
            key={stat.name}
            stat={stat}
            index={index}
            activeSegment={activeSegment}
            _type={type}
            onSegmentHover={onSegmentHover}
          />
        ))}
      </div>
    </div>
  )
}
