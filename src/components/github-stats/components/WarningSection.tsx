import React from 'react'
import { WarningAccordion } from './WarningAccordion'
import {
  shouldShowZeroCommitWarning,
  shouldShowRepoWarning
} from '../utils/calculations'
import type { ProcessedStat } from '../types/stats'

interface WarningSectionProps {
  stats: ProcessedStat[]
  lastUpdated: string | null
}

export function WarningSection({ stats, lastUpdated }: WarningSectionProps) {
  const warningStats = stats.filter(
    (stat) =>
      shouldShowZeroCommitWarning(stat.commits, stat.repositories) ||
      shouldShowRepoWarning(stat.repositories, stat.commits)
  )

  const isStale =
    lastUpdated &&
    new Date().getTime() - new Date(lastUpdated).getTime() > 24 * 60 * 60 * 1000

  if (warningStats.length === 0 && !isStale) return null

  return (
    <div className='mb-4'>
      <WarningAccordion stats={warningStats} lastUpdated={lastUpdated} />
    </div>
  )
}
