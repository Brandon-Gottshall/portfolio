import React from 'react'
import { DonutChart } from './ChartVisualizations/DonutChart'
import { DetailedBreakdown } from './DetailedBreakdown'
import type { ProcessedStat } from '../types/stats'
import { formatBytes } from '../utils/formatters'

interface StatsVisualizationProps {
  stats: ProcessedStat[]
  type: 'languages' | 'frameworks' | 'tools'
  isDarkMode: boolean
  activeSegment: number | null
  onSegmentHover: (index: number | null) => void
}

export function StatsVisualization({
  stats,
  type,
  isDarkMode,
  activeSegment,
  onSegmentHover
}: StatsVisualizationProps) {
  // Split stats into top 5 and others
  const topStats = stats.slice(0, 5)
  const otherStats = stats.slice(5)

  // Calculate combined stats for "Other" category if there are more than 5 stats
  const combinedStats = [...topStats]
  if (otherStats.length > 0) {
    const totalBytes = otherStats.reduce(
      (sum: number, stat: ProcessedStat) => sum + (stat.bytes || 0),
      0
    )
    const otherTotal = {
      name: 'Other',
      commits: otherStats.reduce(
        (sum: number, stat: ProcessedStat) => sum + (stat.commits || 0),
        0
      ),
      repositories: otherStats.reduce(
        (sum: number, stat: ProcessedStat) => sum + stat.repositories,
        0
      ),
      bytes: totalBytes,
      bytesFormatted: formatBytes(totalBytes),
      percentage: otherStats.reduce(
        (sum: number, stat: ProcessedStat) => sum + stat.percentage,
        0
      )
    }
    combinedStats.push(otherTotal)
  }

  return (
    <div className='grid grid-cols-1 gap-8 w-full md:grid-cols-2'>
      <DonutChart
        data={combinedStats}
        allStats={stats}
        isDarkMode={isDarkMode}
        type={type}
        activeSegment={activeSegment}
        onSegmentHover={onSegmentHover}
      />
      <DetailedBreakdown
        stats={stats}
        type={type}
        isDarkMode={isDarkMode}
        activeSegment={activeSegment}
        onSegmentHover={onSegmentHover}
      />
    </div>
  )
}
