'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import cachedStats from '@/data/github-stats.json' assert { type: 'json' }

import { formatBytes, getSafePercentage } from './utils/formatters'
import { NoDataWarning } from './utils/warnings'
import { calculateCategoryPercentage } from './utils/calculations'
import { DonutChart } from './components/ChartVisualizations/DonutChart'
import { ToolsDetailedView } from './components/ToolsDetailedView'
import { DetailedBreakdown } from './components/DetailedBreakdown'
import { WarningSection } from './components/WarningSection'

import type {
  CachedStats,
  Props,
  DetailedStats,
  CSSStats,
  CachedStatsInput,
  SegmentHoverState
} from './types/stats'

// Create an adapter function to properly map the JSON data to the expected types
function adaptCachedStats(rawData: CachedStatsInput): CachedStats {
  // Map languages to the correct interface structure
  const languages: Record<string, DetailedStats | CSSStats> = {}

  if (rawData.languages) {
    Object.entries(rawData.languages).forEach(([lang, data]) => {
      if (lang === 'CSS' && data.summary && data.variants) {
        // Handle CSS with its special structure
        languages[lang] = {
          name: lang,
          commits: data.summary.commits || 0,
          repositories: data.summary.repositories || 0,
          percentage: data.summary.percentage_of_all_commits || 0,
          summary: {
            repositories: data.summary.repositories || 0,
            commits: data.summary.commits || 0,
            bytes: data.summary.bytes || 0,
            percentage_of_all_commits:
              data.summary.percentage_of_all_commits || 0
          },
          variants: {
            vanilla: data.variants.vanilla || {
              repositories: 0,
              bytes: 0,
              commits: 0,
              percentage_of_css: 0,
              file_types: {}
            },
            tailwind: data.variants.tailwind || {
              repositories: 0,
              bytes: 0,
              commits: 0,
              percentage_of_css: 0,
              file_types: {}
            }
          }
        }
      } else {
        // Handle regular languages
        languages[lang] = {
          name: lang,
          commits: data.commits || 0,
          repositories: data.repositories || 0,
          bytes: data.bytes || 0,
          percentage: 0,
          summary: {
            repositories: data.repositories || 0,
            commits: data.commits || 0,
            bytes: data.bytes || 0
          }
        }
      }
    })
  }

  // Process frameworks data
  const frameworks: Record<string, DetailedStats> = {}
  if (rawData.frameworks) {
    // Calculate total commits for percentage calculation
    const totalCommits = Object.values(rawData.frameworks).reduce(
      (sum, framework) => sum + (framework.commits || 0),
      0
    )

    Object.entries(rawData.frameworks).forEach(([name, data]) => {
      const commits = data.commits || 0
      const repositories = data.repositories || 0
      const percentage = totalCommits > 0 ? (commits / totalCommits) * 100 : 0

      frameworks[name] = {
        name,
        commits,
        repositories,
        percentage,
        summary: {
          repositories,
          commits,
          bytes: 0,
          percentage_of_all_commits: percentage
        }
      }
    })
  }

  return {
    lastUpdated: rawData.lastUpdated || new Date().toISOString(),
    repoCount: rawData.repoCount || 0,
    languages,
    frameworks,
    tools: rawData.tools || {},
    summary: rawData.summary || {
      total_repos: 0,
      owned_repos: 0,
      contributed_repos: 0,
      total_commits: 0,
      public_repos: 0,
      private_repos: 0,
      forks: 0
    },
    found_emails: rawData.found_emails || []
  } as CachedStats
}

const typedCachedStats = adaptCachedStats(cachedStats)

interface ProcessedStat {
  name: string
  commits: number
  repositories: number
  bytes: number
  bytesFormatted: string
  percentage: number
  tools?: Record<string, { repositories: number; commits: number }>
  variants?: CSSStats['variants']
}

interface StatsVisualizationProps {
  stats: ProcessedStat[]
  isDarkMode: boolean
  type: Props['type']
  activeSegment: SegmentHoverState
  onSegmentHover: (index: SegmentHoverState) => void
  showBoth?: boolean
}

function getSummaryStats(stat: DetailedStats | CSSStats, bytes: number) {
  return {
    commits: stat.summary?.commits || 0,
    repositories: stat.summary?.repositories || 0,
    bytes,
    bytesFormatted: formatBytes(bytes)
  }
}

function createBaseStat(
  name: string,
  stat: DetailedStats | CSSStats,
  type: Props['type'],
  totalCommits: number,
  totalBytes: number
): ProcessedStat {
  const bytes = stat.summary?.bytes || 0
  const summaryStats = getSummaryStats(stat, bytes)

  return {
    name,
    ...summaryStats,
    percentage: calculateCategoryPercentage(
      type,
      { name, ...summaryStats, percentage: 0 },
      totalCommits,
      totalBytes
    )
  }
}

function processStatEntry(
  name: string,
  stat: DetailedStats | CSSStats,
  totalCommits: number,
  totalBytes: number,
  type: Props['type']
): ProcessedStat {
  const processed = createBaseStat(name, stat, type, totalCommits, totalBytes)

  if ('tools' in stat && stat.tools) processed.tools = stat.tools

  // Add a type guard to properly handle CSS stats variants
  if (
    'variants' in stat &&
    stat.variants &&
    'vanilla' in stat.variants &&
    'tailwind' in stat.variants &&
    stat.variants.vanilla &&
    stat.variants.tailwind
  ) {
    // Only assign if it's a complete CSS variants object
    processed.variants = {
      vanilla: stat.variants.vanilla,
      tailwind: stat.variants.tailwind
    }
  }

  return processed
}

function useStatsProcessing(
  stats: Record<string, DetailedStats | CSSStats>,
  type: Props['type']
) {
  return useMemo(() => {
    if (!stats || Object.keys(stats).length === 0) return null

    const totalCommits = Object.values(stats).reduce(
      (sum, stat) => sum + (stat.summary?.commits || 0),
      0
    )

    const totalBytes = Object.values(stats).reduce(
      (sum, stat) =>
        sum + getSafePercentage(stat.summary?.bytes || 0, totalCommits),
      0
    )

    const processedStats = Object.entries(stats)
      .map(([name, stat]) =>
        processStatEntry(name, stat, totalCommits, totalBytes, type)
      )
      .sort((a, b) => b.percentage - a.percentage)

    // Add CSS handling logic
    const cssIndex = processedStats.findIndex((item) => item.name === 'CSS')
    if (cssIndex > -1 && cssIndex >= 4) {
      // Remove CSS from its current position
      const cssItem = processedStats.splice(cssIndex, 1)[0]
      // Add it to position 3 (it will be visible in the top items)
      processedStats.splice(3, 0, cssItem)
    }

    return processedStats
  }, [stats, type])
}

function StatsVisualization({
  stats,
  isDarkMode,
  type,
  activeSegment,
  onSegmentHover
}: Omit<StatsVisualizationProps, 'showBoth'>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const processedStats = [...stats]
  const cssIndex = processedStats.findIndex((item) => item.name === 'CSS')
  if (cssIndex > -1 && cssIndex >= 4) {
    const cssItem = processedStats.splice(cssIndex, 1)[0]
    processedStats.splice(3, 0, cssItem)
  }

  const topItems = processedStats.slice(0, 4)
  const smallItems = processedStats.slice(4)

  const otherPercentage = smallItems.reduce(
    (sum, item) => sum + item.percentage,
    0
  )
  const otherCommits = smallItems.reduce((sum, item) => sum + item.commits, 0)
  const otherRepos = new Set(
    smallItems.flatMap((item) => Array(item.repositories).fill(0))
  ).size

  const finalDonutStats = [
    ...topItems,
    {
      name: 'Other',
      percentage: otherPercentage,
      commits: otherCommits,
      repositories: otherRepos,
      bytes: smallItems.reduce((sum, item) => sum + (item.bytes || 0), 0),
      bytesFormatted: formatBytes(
        smallItems.reduce((sum, item) => sum + (item.bytes || 0), 0)
      )
    }
  ]

  // Map donut indices to detailed breakdown indices for hover sync
  const handleDonutHover = (state: SegmentHoverState) => {
    // If the index is null (no segment hovered) or if it's the "Other" category
    if (state === null) {
      onSegmentHover(null)
      return
    }

    // If it's a complex object (from detailed breakdown), pass it directly
    if (typeof state === 'object') {
      onSegmentHover(state)
      return
    }

    // If it's a valid top item, pass the index directly
    if (state < topItems.length) {
      onSegmentHover(state)
      return
    }

    // Handle "Other" category (last donut segment)
    if (state === topItems.length) {
      onSegmentHover(state)
      return
    }
  }

  // Map detailed breakdown indices to donut indices for hover sync
  const handleDetailedHover = (state: SegmentHoverState) => {
    if (state === null) {
      onSegmentHover(null)
      return
    }

    // If it's an object with mainIndex and otherIndex, pass it through
    if (typeof state === 'object') {
      onSegmentHover(state)
      return
    }

    // If it's in the top items, highlight corresponding donut segment
    if (state < topItems.length) {
      onSegmentHover(state)
    } else {
      // If it's in "Other", highlight the Other segment with specific language info
      onSegmentHover({
        mainIndex: topItems.length,
        otherIndex: state as number // Type assertion since we know it's a number at this point
      })
    }
  }

  // Handle mouse leave for the whole component
  const handleContainerMouseLeave = (e: React.MouseEvent) => {
    // Only trigger if we're actually leaving the entire container
    // and not just moving between children
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Use a shorter timeout when leaving the entire container
      timeoutRef.current = setTimeout(() => {
        onSegmentHover(null)
        timeoutRef.current = null
      }, 50) // Shorter timeout for better responsiveness
    }
  }

  // Handle mouse enter for the entire container
  const handleContainerMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  return (
    <div
      className='flex flex-col space-y-8 w-full'
      ref={containerRef}
      onMouseLeave={handleContainerMouseLeave}
      onMouseEnter={handleContainerMouseEnter}
    >
      {/* Donut Chart Section */}
      <section className='flex flex-col w-full h-auto md:h-auto'>
        <h4 className='mb-3 text-sm font-medium text-center text-navy dark:text-cream'>
          Visual Overview
          <span className='ml-2 text-xs italic text-navy-light/80 dark:text-cream/60'>
            Top {topItems.length} + Other
          </span>
        </h4>

        <DonutChart
          data={finalDonutStats}
          allStats={processedStats}
          isDarkMode={isDarkMode}
          type={type}
          activeSegment={activeSegment}
          onSegmentHover={handleDonutHover}
        />
      </section>

      {/* Details Section */}
      <section className='w-full'>
        <DetailedBreakdown
          stats={processedStats}
          activeSegment={activeSegment}
          type={type}
          isDarkMode={isDarkMode}
          onSegmentHover={handleDetailedHover}
        />
      </section>
    </div>
  )
}

function useGithubStats(type: Props['type']) {
  const [stats, setStats] = useState<Record<string, DetailedStats | CSSStats>>(
    {}
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    try {
      if (type === 'tools') {
        // Convert ToolStats to DetailedStats for the tools type
        const toolStats: Record<string, DetailedStats> = {}
        Object.entries(typedCachedStats.tools).forEach(([key, value]) => {
          if (value.summary) {
            toolStats[key] = {
              name: key,
              commits: value.summary?.commits || 0,
              repositories: value.summary?.repositories || 0,
              percentage: value.summary?.percentage_of_all_commits || 0,
              summary: {
                repositories: value.summary?.repositories || 0,
                commits: value.summary?.commits || 0,
                bytes: 0,
                percentage_of_all_commits:
                  value.summary?.percentage_of_all_commits || 0
              },
              tools: value.tools
            }
          }
        })
        setStats(toolStats)
      } else if (type === 'frameworks') {
        // Convert frameworks data to DetailedStats
        const frameworkStats: Record<string, DetailedStats> = {}

        // Get total commits for percentage calculation
        const totalCommits = Object.values(typedCachedStats.frameworks).reduce(
          (sum, framework) => sum + (framework.commits || 0),
          0
        )

        Object.entries(typedCachedStats.frameworks).forEach(([name, data]) => {
          const commits = data.commits || 0
          const repositories = data.repositories || 0
          const percentage =
            totalCommits > 0 ? (commits / totalCommits) * 100 : 0

          frameworkStats[name] = {
            name,
            commits,
            repositories,
            percentage,
            summary: {
              repositories,
              commits,
              bytes: 0,
              percentage_of_all_commits: percentage
            }
          }
        })

        setStats(frameworkStats)
      } else {
        setStats(typedCachedStats[type])
      }
      setLastUpdated(typedCachedStats.lastUpdated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [type])

  return { stats, loading, error, lastUpdated }
}

function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'))

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'))
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  return isDarkMode
}

function StatsContent({
  processedStats,
  isDarkMode,
  type,
  activeSegment,
  setActiveSegment,
  lastUpdated,
  showBoth
}: {
  processedStats: ProcessedStat[]
  isDarkMode: boolean
  type: Props['type']
  activeSegment: SegmentHoverState
  setActiveSegment: (index: SegmentHoverState) => void
  lastUpdated: string | null
  showBoth: boolean
}) {
  if (type === 'tools' && showBoth) {
    return (
      <ToolsDetailedView
        processedStats={processedStats}
        isDarkMode={isDarkMode}
        activeSegment={activeSegment}
        setActiveSegment={setActiveSegment}
        lastUpdated={lastUpdated}
      />
    )
  }

  return (
    <div>
      <WarningSection stats={processedStats} lastUpdated={lastUpdated} />
      <div className='p-6 rounded-xl border shadow-sm bg-white/95 dark:bg-navy-darkest/95 border-navy/10 dark:border-cream/10'>
        <h4 className='mb-6 text-lg font-medium text-center text-navy-dark dark:text-cream-dark'>
          {type.charAt(0).toUpperCase() + type.slice(1)} Distribution
        </h4>
        <StatsVisualization
          stats={processedStats}
          isDarkMode={isDarkMode}
          type={type}
          activeSegment={activeSegment}
          onSegmentHover={setActiveSegment}
        />
      </div>
    </div>
  )
}

export function GithubLanguageStats({ type, showBoth = false }: Props) {
  const { stats, loading, error, lastUpdated } = useGithubStats(type)
  const isDarkMode = useDarkMode()
  const [activeSegment, setActiveSegment] = useState<SegmentHoverState>(null)

  // Add debug logging
  console.log(`[${type}] Raw stats:`, stats)

  const processedStats = useStatsProcessing(stats, type)

  // Add debug logging
  console.log(`[${type}] Processed stats:`, processedStats)

  if (loading)
    return (
      <div className='flex justify-center items-center h-48 text-navy dark:text-cream'>
        <Loader2 className='w-6 h-6 animate-spin' />
      </div>
    )
  if (error)
    return (
      <div className='flex justify-center items-center h-48 text-blue dark:text-blue-accent'>
        <p className='text-sm'>{error}</p>
      </div>
    )
  if (!processedStats) return <NoDataWarning />

  return (
    <StatsContent
      processedStats={processedStats}
      isDarkMode={isDarkMode}
      type={type}
      activeSegment={activeSegment}
      setActiveSegment={setActiveSegment}
      lastUpdated={lastUpdated}
      showBoth={showBoth}
    />
  )
}
