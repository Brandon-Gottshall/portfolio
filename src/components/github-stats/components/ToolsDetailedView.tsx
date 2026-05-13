import React from 'react'
import { AlertTriangle } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { WarningAccordion } from './WarningAccordion'
import type { ProcessedStat, SegmentHoverState } from '../types/stats'
import {
  shouldShowZeroCommitWarning,
  shouldShowRepoWarning
} from '../utils/calculations'
import { ToolCategoryBreakdown } from './ToolCategoryBreakdown'

interface ToolsDetailedViewProps {
  processedStats: ProcessedStat[]
  isDarkMode: boolean
  activeSegment: SegmentHoverState
  setActiveSegment: (index: SegmentHoverState) => void
  lastUpdated: string | null
}

interface StatItemProps {
  stat: ProcessedStat
  index: number
  activeSegment: SegmentHoverState
  setActiveSegment: (index: SegmentHoverState) => void
  isDarkMode: boolean
  topItemsLength: number
  chartColors: string[]
}

interface StatHeaderProps {
  stat: ProcessedStat
  index: number
  activeSegment: SegmentHoverState
  topItemsLength: number
  chartColors: string[]
}

function StatHeader({
  stat,
  index,
  activeSegment,
  topItemsLength,
  chartColors
}: StatHeaderProps) {
  return (
    <div className='flex justify-between mb-1.5 items-center'>
      <div className='flex items-center'>
        <span
          className={`rounded-full mr-2 transition-all duration-200
            ${activeSegment === index ? 'w-3.5 h-3.5' : 'w-3 h-3'}`}
          style={{
            backgroundColor: chartColors[index % chartColors.length]
          }}
        />
        <span
          className={`font-code text-navy font-medium dark:text-cream ${index >= topItemsLength ? 'text-sm' : ''}`}
        >
          {stat.name}
          {index >= topItemsLength && (
            <span className='ml-1.5 text-xs text-navy-light/70 dark:text-cream/60 italic normal-font'>
              (in Other)
            </span>
          )}
        </span>
      </div>

      <span
        className={`font-semibold px-2 py-0.5 rounded text-sm ${
          activeSegment === index
            ? 'bg-cream/50 dark:bg-navy-light/50 text-navy dark:text-cream'
            : 'text-navy-light dark:text-cream'
        }`}
      >
        {`${Math.round(stat.percentage)}%`}
        <span className='ml-1 opacity-70 text-2xs'>of repos</span>
      </span>
    </div>
  )
}

interface StatProgressProps {
  stat: ProcessedStat
  index: number
  activeSegment: SegmentHoverState
  chartColors: string[]
}

function StatProgress({
  stat,
  index,
  activeSegment,
  chartColors
}: StatProgressProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className='overflow-hidden relative h-3 rounded-full transition-colors cursor-help bg-cream-dark/50 dark:bg-navy-light/40 group-hover:bg-cream-dark/70 dark:group-hover:bg-navy-light/60'>
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              activeSegment === index ? 'h-4 -mt-0.5' : ''
            }`}
            style={{
              width: `${stat.percentage}%`,
              backgroundColor: chartColors[index % chartColors.length]
            }}
          />
          <div className='absolute inset-0 -my-3' />
        </div>
      </TooltipTrigger>
      <TooltipContent
        side='top'
        className='max-w-sm bg-navy dark:bg-cream border-navy/10 dark:border-cream/10'
      >
        <p className='font-medium text-cream dark:text-navy'>
          {`${stat.commits} commits across ${stat.repositories} repos`}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

function StatItem({
  stat,
  index,
  activeSegment,
  setActiveSegment,
  isDarkMode,
  topItemsLength,
  chartColors
}: StatItemProps) {
  return (
    <div
      className={`group p-2.5 rounded-lg transition-all duration-200 
        ${
          activeSegment === index
            ? 'bg-cream/50 dark:bg-navy-light/50 shadow-sm transform scale-[1.01]'
            : 'hover:bg-cream/40 dark:hover:bg-navy-light/30 hover:shadow-sm'
        }`}
      onMouseEnter={() => setActiveSegment(index)}
      onMouseLeave={() => setActiveSegment(null)}
    >
      <StatHeader
        stat={stat}
        index={index}
        activeSegment={activeSegment}
        topItemsLength={topItemsLength}
        chartColors={chartColors}
      />
      <StatProgress
        stat={stat}
        index={index}
        activeSegment={activeSegment}
        chartColors={chartColors}
      />

      <div className='flex justify-between mt-1.5 text-xs text-navy/80 dark:text-cream/80'>
        <div className='flex items-center'>
          <span>{stat.commits} commits</span>
          {shouldShowZeroCommitWarning(stat.commits, stat.repositories) && (
            <span className='inline-flex items-center ml-2 text-amber-600 dark:text-amber-400'>
              <AlertTriangle className='w-3.5 h-3.5 mr-1' />
              No commits found
            </span>
          )}
        </div>
        {shouldShowRepoWarning(stat.repositories, stat.commits) ? (
          <span className='inline-flex items-center text-red'>
            <AlertTriangle className='w-3 h-3 mr-0.5' />
            Repository issue
          </span>
        ) : (
          <span>{stat.repositories} repositories</span>
        )}
      </div>

      {stat.tools && (
        <ToolCategoryBreakdown
          name={stat.name}
          stats={{
            repositories: stat.repositories,
            commits: stat.commits,
            tools: stat.tools
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  )
}

export function ToolsDetailedView({
  processedStats,
  isDarkMode,
  activeSegment,
  setActiveSegment,
  lastUpdated
}: ToolsDetailedViewProps) {
  // Extract top items and prepare data
  const topItems = processedStats.slice(0, 4)
  const smallItems = processedStats.slice(4)
  const barStats = [...topItems, ...smallItems.slice(0, 5)]

  // Chart colors array matching the original
  const chartColors = [
    'rgba(30, 136, 229, 0.95)',
    'rgba(100, 181, 246, 0.95)',
    'rgba(13, 71, 161, 0.95)',
    'rgba(79, 195, 247, 0.95)',
    'rgba(3, 169, 244, 0.95)'
  ]

  const warningStats = processedStats.filter(
    (stat) =>
      shouldShowZeroCommitWarning(stat.commits, stat.repositories) ||
      shouldShowRepoWarning(stat.repositories, stat.commits)
  )

  return (
    <div>
      <div className='mb-4'>
        <WarningAccordion stats={warningStats} lastUpdated={lastUpdated} />
      </div>
      <div>
        <h4 className='mb-6 text-lg font-medium text-center text-navy-dark dark:text-cream-dark'>
          Tool Usage by Repository
        </h4>

        <div className='flex flex-col gap-8'>
          {/* Tool category adoption section */}
          <div className='flex flex-col'>
            <h4 className='mb-3 text-sm font-medium text-center text-navy dark:text-cream'>
              Repository Adoption
              <span className='ml-2 text-xs italic text-navy-light/80 dark:text-cream/60'>
                Top {topItems.length} Tools
              </span>
            </h4>

            {/* Horizontal bar chart better represents adoption rates */}
            <div className='mt-2 space-y-3'>
              {topItems.map((stat, index) => (
                <div key={stat.name} className='group'>
                  <div className='flex justify-between items-center mb-1'>
                    <span className='text-sm font-medium text-navy dark:text-cream'>
                      {stat.name}
                    </span>
                    <span className='text-xs font-medium text-navy-light dark:text-cream-light'>
                      {stat.repositories} repos ({Math.round(stat.percentage)}%)
                    </span>
                  </div>

                  <div className='overflow-hidden relative h-7 rounded-md bg-cream-dark/30 dark:bg-navy-light/30 group-hover:bg-cream-dark/40 dark:group-hover:bg-navy-light/40'>
                    <div
                      className='flex absolute inset-y-0 left-0 items-center px-2 text-xs font-medium text-white'
                      style={{
                        width: `${Math.max(stat.percentage, 0)}%`,
                        backgroundColor:
                          chartColors[index % chartColors.length],
                        minWidth: stat.percentage > 0 ? '40px' : '0'
                      }}
                    >
                      {stat.percentage > 15 && stat.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed breakdown section */}
          <Accordion
            type='single'
            collapsible
            defaultValue='details'
            className='dark:border-cream/10'
          >
            <AccordionItem
              value='details'
              className='border-navy/10 dark:border-cream/10'
            >
              <AccordionTrigger className='text-sm font-medium text-navy dark:text-cream py-2 [&>svg]:text-navy dark:[&>svg]:text-cream'>
                Detailed Breakdown
                <span className='ml-2 text-xs italic text-navy-light/80 dark:text-cream/60'>
                  Top {barStats.length} Categories
                </span>
              </AccordionTrigger>
              <AccordionContent className='dark:text-cream'>
                <TooltipProvider delayDuration={100}>
                  <div className='space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mt-2'>
                    {barStats.map((stat, index) => (
                      <StatItem
                        key={stat.name}
                        stat={stat}
                        index={index}
                        activeSegment={activeSegment}
                        setActiveSegment={setActiveSegment}
                        isDarkMode={isDarkMode}
                        topItemsLength={topItems.length}
                        chartColors={chartColors}
                      />
                    ))}
                  </div>
                </TooltipProvider>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
