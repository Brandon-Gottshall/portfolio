'use client'

import { useEffect, useRef, useState } from 'react'
import { ArcElement, Chart as ChartJS, Tooltip, Legend } from 'chart.js'
import type { DoughnutChartInstance } from '@/types/chart'
import { createDoughnutChart } from '@/lib/charts/createChart'
import { useTheme } from 'next-themes'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import cachedStats from '@/data/github-stats.json' assert { type: 'json' }

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

interface GithubLanguageStatsProps {
  type: 'languages' | 'frameworks' | 'tools'
  showBoth: boolean
}

interface BaseLanguageStats {
    repositories: number
    bytes: number
    commits: number
}

interface CSSLanguageStats {
  summary: {
    repositories: number
    bytes: number
    commits: number
    percentage_of_all_commits: number
  }
  variants: {
    vanilla: {
      repositories: number
      bytes: number
      commits: number
      percentage_of_css: number
    }
    tailwind: {
      repositories: number
      bytes: number
      commits: number
      percentage_of_css: number
    }
  }
}

type LanguageStats = BaseLanguageStats | CSSLanguageStats

function isCSS(stat: any): stat is CSSLanguageStats {
  return 'summary' in stat && 'variants' in stat
}

export default function GithubLanguageStats({ type, showBoth }: GithubLanguageStatsProps) {
  const chartRef = useRef<DoughnutChartInstance | null>(null)
  const [activeSegment, setActiveSegment] = useState<number | null>(null)
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const stats = cachedStats.languages
  
  const processedStats = Object.entries(stats)
    .map(([name, stat]) => ({
        name,
      percentage: isCSS(stat) 
        ? stat.summary.percentage_of_all_commits
        : (stat.commits / cachedStats.summary.total_commits) * 100,
      color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color for now
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10) // Only show top 10

  useEffect(() => {
    if (!processedStats.length) return

    const data = {
      labels: processedStats.map((stat) => stat.name),
    datasets: [
      {
          data: processedStats.map((stat) => stat.percentage),
          backgroundColor: processedStats.map((stat) => stat.color),
          borderColor: isDarkMode ? '#1a1b1e' : '#ffffff',
          borderWidth: 2,
          hoverBorderColor: isDarkMode ? '#2c2e33' : '#f8f9fa',
        hoverBorderWidth: 4,
        },
      ],
    }

    const options = {
      cutout: '60%',
    plugins: {
      legend: {
          display: false,
      },
      tooltip: {
          enabled: false,
        },
      },
    }

    const chart = createDoughnutChart({
      data,
      options,
      eventHandlers: {
        onSegmentHover: (index: number | null) => setActiveSegment(index),
        onSegmentLeave: () => setActiveSegment(null),
      },
      isDarkMode,
    })

    chartRef.current = chart

    return () => {
      chart.destroy()
    }
  }, [processedStats, isDarkMode])

                      return (
    <div className="relative h-[300px] w-full">
      <canvas ref={(element) => {
        if (element && chartRef.current) {
          element.getContext('2d')
          chartRef.current.canvas = element
          chartRef.current.update()
        }
      }} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        {activeSegment !== null ? (
          <>
            <p className="text-2xl font-bold">{processedStats[activeSegment].percentage.toFixed(1)}%</p>
            <p className="text-sm text-gray-500">{processedStats[activeSegment].name}</p>
          </>
        ) : (
          <p className="text-sm text-gray-500">Hover over chart</p>
        )}
        </div>
      </div>
    )
  }