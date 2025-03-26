import React from 'react'
import { AlertTriangle, Clock } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import type { ProcessedStat } from '../types/stats'
import {
  shouldShowZeroCommitWarning,
  shouldShowRepoWarning
} from '../utils/calculations'

interface WarningAccordionProps {
  stats: ProcessedStat[]
  lastUpdated: string | null
}

export function WarningAccordion({
  stats,
  lastUpdated
}: WarningAccordionProps) {
  const isStale =
    lastUpdated &&
    new Date().getTime() - new Date(lastUpdated).getTime() > 24 * 60 * 60 * 1000

  const hasWarnings = stats.length > 0
  if (!hasWarnings && !isStale) return null

  return (
    <Accordion type='single' collapsible className='w-full'>
      <AccordionItem value='warnings'>
        <AccordionTrigger className='flex items-center text-amber-700 dark:text-amber-400'>
          {isStale ? (
            <Clock className='mr-2 w-4 h-4' />
          ) : (
            <AlertTriangle className='mr-2 w-4 h-4' />
          )}
          <span className='text-sm font-medium'>
            {isStale ? 'Data May Be Outdated' : 'Attention Required'}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className='pt-2 space-y-2'>
            {isStale && (
              <div className='flex items-center pb-2 text-xs text-amber-600 border-b dark:text-amber-400 border-amber-200/20'>
                <Clock className='w-3.5 h-3.5 mr-1' />
                <span>
                  Data last updated on{' '}
                  {new Date(lastUpdated!).toLocaleDateString()}
                </span>
              </div>
            )}
            {stats.length > 0 && (
              <div className='space-y-2'>
                {stats.map((stat) => (
                  <div
                    key={stat.name}
                    className='flex justify-between items-center text-xs text-navy/80 dark:text-cream/80 py-1.5 border-t border-amber-200/20'
                  >
                    <div className='flex items-center'>
                      <span className='font-medium'>{stat.name}</span>
                      {shouldShowZeroCommitWarning(
                        stat.commits,
                        stat.repositories
                      ) && (
                        <span className='inline-flex items-center ml-2 text-amber-600 dark:text-amber-400'>
                          <AlertTriangle className='w-3.5 h-3.5 mr-1' />
                          No commits found
                        </span>
                      )}
                    </div>
                    <div className='flex items-center'>
                      {shouldShowRepoWarning(
                        stat.repositories,
                        stat.commits
                      ) ? (
                        <span className='inline-flex items-center text-red-600 dark:text-red-400'>
                          <AlertTriangle className='w-3 h-3 mr-0.5' />
                          Repository issue
                        </span>
                      ) : (
                        <span>{stat.repositories} repositories</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
