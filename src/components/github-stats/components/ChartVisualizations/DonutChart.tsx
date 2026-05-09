import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { ChartOptions, ChartEvent, ActiveElement } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import type { DoughnutChartInstance } from '@/types/chart'
import type {
  DonutChartProps,
  ProcessedStat,
  SegmentHoverState
} from '../../types/stats'

// Register required ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

interface BaseChartData {
  name: string
  percentage: number
  commits?: number
  repositories?: number
  bytes?: number
}

interface ToolData {
  commits: number
}

interface ToolCategoryData extends BaseChartData {
  tools: Record<string, ToolData>
}

function isToolCategory(
  stat: BaseChartData | ToolCategoryData
): stat is ToolCategoryData {
  return (
    stat &&
    typeof stat === 'object' &&
    'tools' in stat &&
    typeof stat.tools === 'object' &&
    Object.keys(stat.tools).length > 0
  )
}

export function DonutChart({
  data,
  allStats,
  isDarkMode,
  type,
  activeSegment,
  onSegmentHover
}: DonutChartProps) {
  const chartRef = useRef<DoughnutChartInstance>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const chartIsReady = useRef<boolean>(false)
  const [localActiveSegment, setLocalActiveSegment] =
    useState<SegmentHoverState>(activeSegment)

  // Track last active segment to restore when mouse returns to chart
  const lastActiveSegmentRef = useRef<SegmentHoverState>(null)

  // Safe chart update function
  const safeChartUpdate = useCallback((chart: DoughnutChartInstance) => {
    if (!chart || !chartIsReady.current) return

    try {
      requestAnimationFrame(() => {
        if (chart.update) {
          chart.update('none')
        }
      })
    } catch (error) {
      console.error('Error updating chart:', error)
    }
  }, [])

  // Update local state when external state changes
  useEffect(() => {
    setLocalActiveSegment(activeSegment)

    // Store the last non-null active segment for potential restoration
    if (activeSegment !== null) {
      lastActiveSegmentRef.current = activeSegment
    }

    // Clear any pending timeout when external state changes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [activeSegment])

  // Updated handleHover to match Chart.js expected signature with safety checks
  const handleHover = useCallback(
    (event: ChartEvent, elements: ActiveElement[]) => {
      if (!chartIsReady.current) return

      if (elements && elements.length > 0) {
        const index = elements[0].index
        setLocalActiveSegment(index)
        onSegmentHover(index)
        lastActiveSegmentRef.current = index
      }
    },
    [onSegmentHover]
  )

  // Safe element activation function
  const safeSetActiveElements = useCallback(
    (
      chart: DoughnutChartInstance,
      elements: Array<{ datasetIndex: number; index: number }>
    ) => {
      if (!chart || !chartIsReady.current) return

      try {
        if (typeof chart.setActiveElements === 'function') {
          chart.setActiveElements(elements)

          if (chart.tooltip) {
            if (elements.length === 0) {
              chart.tooltip.setActiveElements([], { x: 0, y: 0 })
              if ('active' in chart.tooltip) {
                chart.tooltip.active = false
              }
            } else {
              const meta = chart.getDatasetMeta(0)
              const element = elements[0]
              if (meta?.data?.[element.index]) {
                const arc = meta.data[element.index]
                if ('x' in arc && 'y' in arc) {
                  chart.tooltip.setActiveElements(elements, {
                    x: arc.x,
                    y: arc.y
                  })
                  if ('active' in chart.tooltip) {
                    chart.tooltip.active = true
                  }
                }
              }
            }
          }

          safeChartUpdate(chart)
        }
      } catch (error) {
        console.error('Error setting active elements:', error)
      }
    },
    [safeChartUpdate]
  )

  // Effect for handling active segment changes
  useEffect(() => {
    const chart = chartRef.current
    if (!chart || !chartIsReady.current) return

    try {
      if (localActiveSegment === null) {
        safeSetActiveElements(chart, [])
        return
      }

      const segmentIndex =
        typeof localActiveSegment === 'number'
          ? localActiveSegment
          : typeof localActiveSegment === 'object' &&
              localActiveSegment !== null
            ? localActiveSegment.mainIndex
            : null

      if (segmentIndex === null) {
        safeSetActiveElements(chart, [])
        return
      }

      safeSetActiveElements(chart, [{ datasetIndex: 0, index: segmentIndex }])
    } catch (error) {
      console.error('Error updating active segment:', error)
    }
  }, [localActiveSegment, safeSetActiveElements])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    // Clear any timeouts when component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Handle mouse movement over the chart container (not just segments)
  const handleChartContainerMouseEnter = (_e: React.MouseEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // When returning to the chart area, restore the last active segment if none is currently active
    if (localActiveSegment === null && lastActiveSegmentRef.current !== null) {
      // Small delay to prevent flickering
      requestAnimationFrame(() => {
        setLocalActiveSegment(lastActiveSegmentRef.current)
        onSegmentHover(lastActiveSegmentRef.current)
      })
    }
  }

  const handleContainerMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setLocalActiveSegment(null)
      onSegmentHover(null)
      timeoutRef.current = null
    }, 50) // Shorter timeout for better responsiveness
  }

  const handleContainerMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  // High-contrast, more distinct color palette
  const chartColors = [
    'rgba(30, 136, 229, 0.95)', // blue
    'rgba(100, 181, 246, 0.95)', // blue-light
    'rgba(13, 71, 161, 0.95)', // blue-dark
    'rgba(79, 195, 247, 0.95)', // blue-accent
    'rgba(3, 169, 244, 0.95)' // lighter blue
  ]

  const chartBorderColors = Array(5).fill(
    isDarkMode ? 'rgba(11, 14, 41, 0.7)' : 'rgba(255, 255, 255, 0.7)'
  )

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.percentage),
        backgroundColor: data.map((item, index) =>
          item.name === 'CSS'
            ? chartColors[4 % chartColors.length]
            : index === localActiveSegment
              ? chartColors[index % chartColors.length]
              : `${chartColors[index % chartColors.length].replace('0.95', '0.7')}`
        ),
        borderColor: chartBorderColors,
        borderWidth: 3,
        hoverOffset: 15,
        hoverBorderWidth: 4,
        hoverBorderColor: 'rgba(255, 255, 255, 1)'
      }
    ]
  }

  // Updated chart options with better hover handling and proper typing
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%',
    layout: {
      padding: 15
    },
    events: ['mousemove', 'mouseout', 'touchstart', 'touchmove'],
    hover: {
      mode: 'nearest' as const,
      intersect: true
    },
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        color: '#FFFFFF',
        font: {
          weight: 'bold' as const,
          size: 13,
          family: "'Inter', system-ui, sans-serif"
        },
        textStrokeColor: 'rgba(0, 0, 0, 0.7)',
        textStrokeWidth: 3,
        formatter: (value: number) => {
          return value > 10 ? `${value.toFixed(0)}%` : ''
        },
        align: 'center' as const,
        anchor: 'center' as const
      },
      tooltip: {
        enabled: false // Disable the default tooltip
      }
    },
    onHover: handleHover
  } as const

  // Updated detail box logic to handle all stats
  const getActiveStatDetails = () => {
    // Handle null localActiveSegment
    if (localActiveSegment === null) return null

    // Handle object localActiveSegment for specific language in "Other"
    if (typeof localActiveSegment === 'object' && localActiveSegment !== null) {
      if (!allStats) return null

      const otherStats = allStats.filter(
        (stat: ProcessedStat) =>
          !data.slice(0, -1).find((d: ProcessedStat) => d.name === stat.name)
      )

      // Calculate which "other" language is being hovered
      const specificIndex = localActiveSegment.otherIndex - data.length + 1
      if (specificIndex >= 0 && specificIndex < otherStats.length) {
        const specificStat = otherStats[specificIndex]
        return {
          name: `${specificStat.name} (Other)`,
          details: generateDetailsContent(specificStat, type)
        }
      }
    }

    // Handle numeric localActiveSegment for main segments (not "Other")
    if (typeof localActiveSegment === 'number') {
      if (localActiveSegment < data.length - 1) {
        return {
          name: data[localActiveSegment].name,
          details: generateDetailsContent(data[localActiveSegment], type)
        }
      }

      // Handle numeric localActiveSegment for "Other" segment without specific language
      if (localActiveSegment === data.length - 1) {
        if (!allStats) {
          return {
            name: 'Other Languages',
            details: [
              `${data[localActiveSegment].percentage.toFixed(1)}% of all commits`,
              'Details unavailable'
            ]
          }
        }

        const otherStats = allStats.filter(
          (stat: ProcessedStat) =>
            !data.slice(0, -1).find((d: ProcessedStat) => d.name === stat.name)
        )
        const totalCommits = otherStats.reduce(
          (sum: number, stat: ProcessedStat) => sum + (stat.commits || 0),
          0
        )
        const totalRepos = otherStats.reduce(
          (sum: number, stat: ProcessedStat) => sum + stat.repositories,
          0
        )
        const totalBytes = otherStats.reduce(
          (sum: number, stat: ProcessedStat) => sum + (stat.bytes || 0),
          0
        )

        return {
          name: 'Other Languages',
          details: [
            `${data[localActiveSegment].percentage.toFixed(1)}% of all commits`,
            `${otherStats.length} languages`,
            `${totalCommits.toLocaleString()} total commits`,
            `${totalRepos} repositories`,
            `Total size: ${formatBytes(totalBytes)}`
          ]
        }
      }
    }

    return null
  }

  const activeDetails = getActiveStatDetails()

  return (
    <div
      className='grid grid-cols-1 gap-4 w-full transition-all duration-300 ease-in-out md:grid-cols-2 md:h-48'
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
    >
      <div
        className='flex justify-center items-center h-48 transition-all duration-300 ease-out md:justify-start'
        onMouseEnter={handleChartContainerMouseEnter}
      >
        <div className='relative w-48 h-48 md:w-full'>
          <Doughnut
            data={chartData}
            options={options}
            ref={chartRef}
            onLoad={() => {
              chartIsReady.current = true
            }}
          />
        </div>
      </div>

      <div className='transition-all duration-300 ease-in-out md:h-48'>
        {activeDetails ? (
          <div className='flex flex-col justify-center p-5 h-full rounded-lg border shadow-sm border-navy/10 dark:border-cream/10 bg-cream/10 dark:bg-navy-light/10 animate-in fade-in-75 slide-in-from-right-5 zoom-in-95'>
            <h3 className='mb-2 text-lg font-medium text-navy dark:text-cream'>
              {activeDetails.name}
            </h3>
            <div className='space-y-1 md:space-y-2 overflow-y-auto max-h-[calc(100%-2rem)] md:max-h-none'>
              {activeDetails.details.map((detail, index) => (
                <p
                  key={index}
                  className='text-sm text-navy-dark/90 dark:text-cream-dark/90'
                >
                  {detail}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className='hidden justify-center p-5 h-full rounded-lg border shadow-sm md:flex md:flex-col border-navy/10 dark:border-cream/10 bg-cream/10 dark:bg-navy-light/10'>
            <h3 className='mb-2 text-lg font-medium text-navy dark:text-cream'>
              Chart Details
            </h3>
            <p className='text-sm text-navy-dark/90 dark:text-cream-dark/90'>
              Mouse over chart section to learn more about usage statistics.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// Create a more detailed content generator function
function generateDetailsContent(
  stat: BaseChartData | ToolCategoryData,
  type: DonutChartProps['type']
): string[] {
  if (isToolCategory(stat)) {
    return generateToolCategoryDetails(stat)
  }

  if (type === 'languages') {
    return [
      `${stat.percentage.toFixed(1)}% of all commits`,
      `Used in ${stat.repositories} repositories`,
      stat.bytes ? `Total size: ${formatBytes(stat.bytes)}` : '',
      stat.commits ? `Total commits: ${stat.commits}` : ''
    ].filter(Boolean)
  }

  if (type === 'frameworks') {
    return [
      `${stat.percentage.toFixed(1)}% of all commits`,
      `Used in ${stat.repositories} repositories`,
      stat.commits ? `Total commits: ${stat.commits}` : '',
      stat.bytes ? `Total size: ${formatBytes(stat.bytes)}` : ''
    ].filter(Boolean)
  }

  if (type === 'tools') {
    return [
      `${stat.percentage.toFixed(1)}% of repositories`,
      `Used in ${stat.repositories} repositories`,
      stat.commits ? `Total commits: ${stat.commits}` : ''
    ].filter(Boolean)
  }

  return generateTooltipLabel(stat, type)
}

function generateToolCategoryDetails(stat: ToolCategoryData): string[] {
  const toolCount = Object.keys(stat.tools).length
  const topTools = Object.entries(stat.tools)
    .sort(([, a], [, b]) => b.commits - a.commits)
    .slice(0, 5)
    .map(([name, data]) => `${name}: ${data.commits} commits`)

  return [
    `${stat.percentage.toFixed(1)}% of all commits`,
    `Contains ${toolCount} tools across ${stat.repositories} repos`,
    '',
    ...topTools,
    toolCount > 5 ? `+ ${toolCount - 5} more tools` : ''
  ].filter(Boolean)
}

// Keeping the original tooltip functions for reference/backward compatibility
function generateTooltipLabel(
  stat: BaseChartData | ToolCategoryData,
  type: DonutChartProps['type']
): string[] {
  if (isToolCategory(stat)) {
    return generateToolCategoryLabel(stat)
  }

  if (type === 'tools') {
    return [
      `${stat.percentage.toFixed(1)}% of repositories`,
      `Used in ${stat.repositories} repositories`,
      stat.commits ? `${stat.commits} commits total` : ''
    ].filter(Boolean)
  }

  return [
    `${stat.percentage.toFixed(1)}% of all commits`,
    `Used in ${stat.repositories} repositories`,
    stat.bytes ? `Size: ${formatBytes(stat.bytes)}` : ''
  ].filter((item): item is string => item !== '')
}

function generateToolCategoryLabel(stat: ToolCategoryData): string[] {
  const toolCount = Object.keys(stat.tools).length
  const topTools = Object.entries(stat.tools)
    .sort(([, a], [, b]) => b.commits - a.commits)
    .slice(0, 3)
    .map(([name, data]) => `${name}: ${data.commits} commits`)

  return [
    `${stat.percentage.toFixed(1)}% of all commits`,
    `Contains ${toolCount} tools across ${stat.repositories} repos`,
    '',
    ...topTools,
    toolCount > 3 ? `+ ${toolCount - 3} more tools` : ''
  ].filter(Boolean)
}
