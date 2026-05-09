import React, { useRef, useEffect } from 'react'
import {
  type DetailedBreakdownProps,
  type SegmentHoverState
} from '../types/stats'
import { StatRow } from './StatRow'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

export function DetailedBreakdown({
  stats,
  activeSegment,
  type,
  onSegmentHover
}: DetailedBreakdownProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastActiveSegmentRef = useRef<SegmentHoverState>(null)

  // Split stats into top 5 and others
  const topStats = stats.slice(0, 5)
  const otherStats = stats.slice(5)

  // Calculate combined statistics for "Other" category
  const otherPercentage = otherStats.reduce(
    (sum, stat) => sum + stat.percentage,
    0
  )
  const otherCommits = otherStats.reduce((sum, stat) => sum + stat.commits, 0)
  const otherRepos = otherStats.reduce(
    (sum, stat) => sum + stat.repositories,
    0
  )

  // Create a function to handle hover on items in the "Other" section
  const handleOtherItemHover = (index: SegmentHoverState) => {
    // If we're getting null, just pass it through
    if (index === null) {
      onSegmentHover(null)
      return
    }

    // If we already have a complex object, pass it through
    if (typeof index === 'object') {
      onSegmentHover(index)
      return
    }

    // If we have a number, convert it to a complex object
    // Pass both the "Other" segment index (topStats.length) and the specific language index
    onSegmentHover({
      mainIndex: topStats.length,
      otherIndex: index
    })
  }

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
        {/* Top 5 languages */}
        {topStats.map((stat, index) => (
          <StatRow
            key={stat.name}
            stat={stat}
            index={index}
            activeSegment={activeSegment}
            _type={type}
            onSegmentHover={onSegmentHover}
          />
        ))}

        {/* Other languages in accordion */}
        {otherStats.length > 0 && (
          <Accordion type='single' collapsible className='mt-4'>
            <AccordionItem value='other-languages'>
              <AccordionTrigger className='text-navy dark:text-cream hover:no-underline'>
                <div className='w-full'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium'>
                      Other ({otherStats.length})
                    </span>
                    <span className='text-xs font-medium text-navy-light dark:text-cream-light'>
                      {otherPercentage.toFixed(1)}% •{' '}
                      {otherCommits.toLocaleString()} commits • {otherRepos}{' '}
                      repos
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className='space-y-1 pt-2'>
                  {otherStats.map((stat, index) => (
                    <StatRow
                      key={stat.name}
                      stat={stat}
                      index={index + topStats.length}
                      activeSegment={activeSegment}
                      _type={type}
                      onSegmentHover={handleOtherItemHover}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  )
}
