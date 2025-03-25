import React, { useState, useEffect, useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import cachedStats from '@/data/github-stats.json' assert { type: 'json' }

import { CSSBreakdown } from './components/CSSBreakdown'

import { formatBytes, getSafePercentage } from './utils/formatters'
import {
  NoDataWarning,
  StaleDataWarning,
  ZeroCommitWarning,
  TinyRepoWarning,
  RepositoryError
} from './utils/warnings'
import {
  isCSSStats,
  hasDetailedData,
  calculateCategoryPercentage,
  shouldShowZeroCommitWarning,
  shouldShowRepoWarning
} from './utils/calculations'
import { ToolCategoryBreakdown } from './components/ToolCategoryBreakdown'
import { DonutChart } from './components/ChartVisualizations/DonutChart'
import { BarChart } from './components/ChartVisualizations/BarChart'
import { ToolsDetailedView } from './components/ToolsDetailedView'

import type { CachedStats, Props, DetailedStats, CSSStats } from './types/stats'

// Create an adapter function to properly map the JSON data to the expected types
function adaptCachedStats(rawData: any): CachedStats {
  // Map languages to the correct interface structure
  const languages: Record<string, DetailedStats | CSSStats> = {}

  if (rawData.languages) {
    Object.entries(rawData.languages).forEach(([lang, data]: [string, any]) => {
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

  return {
    lastUpdated: rawData.lastUpdated || new Date().toISOString(),
    repoCount: rawData.repoCount || 0,
    languages,
    frameworks: rawData.frameworks || {},
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
  }
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
  activeSegment: number | null
  onSegmentHover: (index: number | null) => void
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

function renderToolBreakdown(stat: ProcessedStat, isDarkMode: boolean) {
  if (!hasDetailedData(stat) || !('tools' in stat)) return null
  return (
    <ToolCategoryBreakdown
      name={stat.name}
      stats={{
        repositories: stat.repositories,
        commits: stat.commits,
        tools: stat.tools || {}
      }}
      isDarkMode={isDarkMode}
    />
  )
}

function renderWarnings(stat: ProcessedStat) {
  const hasZeroCommitWarning = shouldShowZeroCommitWarning(
    stat.commits,
    stat.repositories
  )
  const hasRepoWarning = shouldShowRepoWarning(stat.repositories, stat.commits)

  return (
    <div className='flex justify-between mt-1.5 text-xs text-navy/80 dark:text-cream/80'>
      <div className='flex items-center'>
        <span>{stat.commits} commits</span>
        {hasZeroCommitWarning && <ZeroCommitWarning />}
      </div>
      {hasRepoWarning ? (
        <TinyRepoWarning />
      ) : (
        <span>{stat.repositories} repositories</span>
      )}
    </div>
  )
}

function renderBreakdowns(stat: ProcessedStat, isDarkMode: boolean) {
  const isCSS = stat.name === 'CSS' && isCSSStats(stat)
  const hasRepoWarning = shouldShowRepoWarning(stat.repositories, stat.commits)

  return (
    <>
      {isCSS && <CSSBreakdown cssStats={stat} isDarkMode={isDarkMode} />}
      {renderToolBreakdown(stat, isDarkMode)}
      {hasRepoWarning && stat.commits > 10 && <RepositoryError />}
    </>
  )
}

function isCSSStat(stat: ProcessedStat) {
  return stat.name === 'CSS' && isCSSStats(stat)
}

function hasToolData(stat: ProcessedStat) {
  return hasDetailedData(stat) && 'tools' in stat
}

function shouldRenderBreakdown(stat: ProcessedStat) {
  return (
    isCSSStat(stat) ||
    hasToolData(stat) ||
    shouldShowZeroCommitWarning(stat.commits, stat.repositories) ||
    shouldShowRepoWarning(stat.repositories, stat.commits)
  )
}

function StatBreakdown({
  stat,
  isDarkMode
}: {
  stat: ProcessedStat
  isDarkMode: boolean
}) {
  if (!shouldRenderBreakdown(stat)) return null

  return (
    <div>
      {renderWarnings(stat)}
      {renderBreakdowns(stat, isDarkMode)}
    </div>
  )
}

function StatsVisualization({
  stats,
  isDarkMode,
  type,
  activeSegment,
  onSegmentHover
}: Omit<StatsVisualizationProps, 'showBoth'>) {
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

  const nextFiveItems = smallItems.slice(0, 5)
  const barStats = [...topItems, ...nextFiveItems]

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col items-center'>
        <h4 className='mb-3 text-sm font-medium text-center text-navy dark:text-cream'>
          Visual Overview
          <span className='ml-2 text-xs italic text-navy-light/80 dark:text-cream/60'>
            Top {topItems.length} + Other
          </span>
        </h4>

        <DonutChart
          data={finalDonutStats}
          isDarkMode={isDarkMode}
          type={type}
          activeSegment={activeSegment}
          onSegmentHover={onSegmentHover}
        />

        <div className='flex flex-wrap gap-2 justify-center mt-4'>
          {finalDonutStats.map((stat, index) => (
            <div
              key={stat.name}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md cursor-pointer transition-colors
                ${
                  activeSegment === index
                    ? 'bg-cream/50 dark:bg-navy-light/50 shadow-sm'
                    : 'hover:bg-cream/40 dark:hover:bg-navy-light/30'
                }`}
              onMouseEnter={() => onSegmentHover(index)}
              onMouseLeave={() => onSegmentHover(null)}
            >
              <span
                className='w-2.5 h-2.5 rounded-full'
                style={{
                  backgroundColor: `rgba(30, 136, 229, ${0.95 - index * 0.15})`
                }}
              />
              <span className='text-xs font-medium text-navy dark:text-cream'>
                {stat.name}
              </span>
              {stat.name === 'Other' && (
                <span className='text-xs text-navy-light/80 dark:text-cream/60'>
                  {stat.percentage.toFixed(1)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

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
            <BarChart
              data={barStats}
              isDarkMode={isDarkMode}
              type={type}
              activeSegment={activeSegment}
              onSegmentHover={onSegmentHover}
            />

            {barStats.map((stat) => (
              <StatBreakdown
                key={stat.name}
                stat={stat}
                isDarkMode={isDarkMode}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
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
  activeSegment: number | null
  setActiveSegment: (index: number | null) => void
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
      {lastUpdated && <StaleDataWarning lastUpdated={lastUpdated} />}
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
  const [activeSegment, setActiveSegment] = useState<number | null>(null)

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
