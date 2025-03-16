"use client"

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import cachedStats from '@/data/github-stats.json'
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(ArcElement, ChartTooltip, Legend)

interface DetailedStats {
  repositories: number  
  bytes?: number        // Optional byte count for languages
  commits: number       // Commit count for all types
}

interface Props {
  type: 'languages' | 'frameworks' | 'tools'
  showBoth?: boolean
}

interface CachedStats {
  lastUpdated: string
  repoCount: number
  languages: Record<string, DetailedStats>
  frameworks: Record<string, DetailedStats>
  tools: Record<string, DetailedStats>
}

export default function GithubLanguageStats({ type, showBoth = false }: Props) {
  const [stats, setStats] = useState<Record<string, DetailedStats>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const data = cachedStats as CachedStats
      
      switch (type) {
        case 'languages':
          setStats(data.languages)
          break
        case 'frameworks':
          setStats(data.frameworks)
          break
        case 'tools':
          setStats(data.tools)
          break
      }
    } catch (error) {
      console.error('Error loading cached stats:', error)
      setError('Failed to load GitHub statistics')
    } finally {
      setLoading(false)
    }
  }, [type])

  const sortedStats = Object.entries(stats)
    .map(([name, stat]) => ({
      name,
      ...stat,
      // Use commits for percentages in all cases
      percentage: (stat.commits / Object.values(stats).reduce((sum, s) => sum + (s.commits || 0), 0)) * 100
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 8)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 text-navy dark:text-cream">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48 text-red dark:text-red-bright">
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  // Colors that match the project's theme
  const chartColors = [
    '#974951', // red
    '#B25D65', // red-bright
    '#7A3A41', // red-dark
    '#1A237E', // navy
    '#303F9F', // navy-light
    '#0B0E29', // navy-darkest
    '#D7CBA9', // tan
    '#C5B797', // tan-muted
  ]

  const chartData = {
    labels: sortedStats.map(stat => stat.name),
    datasets: [
      {
        data: sortedStats.map(stat => stat.percentage),
        backgroundColor: chartColors,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        hoverOffset: 5,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            family: "'Fira Code', monospace",
            size: 11
          },
          color: '#1A237E',
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: {dataIndex: number}) {
            const stat = sortedStats[context.dataIndex];
            return `${stat.name}: ${stat.percentage.toFixed(1)}% (${stat.commits} commits)`;
          }
        }
      }
    },
    cutout: '70%',
  }

  // Render both visualizations when showBoth is true
  if (showBoth) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar chart visualization */}
        <div>
          <h4 className="text-sm font-light mb-4 text-navy dark:text-cream font-code flex items-center">
            <span className="w-3 h-3 rounded-full bg-red mr-2"></span> 
            Bar Chart
          </h4>
          <TooltipProvider delayDuration={100}>
            <div className="space-y-6">
              {sortedStats.map((stat) => (
                <div key={stat.name} className="group">
                  <div className="flex justify-between mb-2">
                    <span className="font-code text-navy dark:text-cream">{stat.name}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="px-2 py-1 -my-1 rounded transition-colors cursor-help hover:bg-cream/50 dark:hover:bg-navy-light/30">
                          <span className="text-gray-dark dark:text-tan">
                            {stat.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="bg-navy dark:bg-cream border-navy/10 dark:border-cream/10">
                        <p className="font-medium text-cream dark:text-navy">
                          {`${stat.commits || 0} commits containing ${stat.name} (${stat.percentage.toFixed(1)}% of total)`}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="overflow-hidden relative h-2 rounded-full transition-colors cursor-help bg-cream/50 dark:bg-navy-light/30 group-hover:bg-cream/70 dark:group-hover:bg-navy-light/50">
                        <div 
                          className="h-full rounded-full transition-all duration-500 bg-red/80 dark:bg-red-bright/80 group-hover:bg-red dark:group-hover:bg-red-bright" 
                          style={{ width: `${stat.percentage}%` }}
                        />
                        {/* Invisible larger hit area */}
                        <div className="absolute inset-0 -my-3" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-navy dark:bg-cream border-navy/10 dark:border-cream/10">
                      <p className="font-medium text-cream dark:text-navy">
                        {type === 'languages'
                          ? `${stat.commits || 0} commits contain ${stat.name} code across ${stat.repositories} repos, ${formatBytes(stat.bytes || 0)} total`
                          : `${stat.commits || 0} commits use ${stat.name} across ${stat.repositories} repos`
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>

        {/* Donut chart visualization */}
        <div>
          <h4 className="text-sm font-light mb-4 text-navy dark:text-cream font-code flex items-center">
            <span className="w-3 h-3 rounded-full bg-navy dark:bg-cream mr-2"></span>
            Donut Chart
          </h4>
          <div className="flex flex-col items-center justify-center h-64">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    )
  }

  // Original bar visualization as default
  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-6">
        {sortedStats.map((stat) => (
          <div key={stat.name} className="group">
            <div className="flex justify-between mb-2">
              <span className="font-code text-navy dark:text-cream">{stat.name}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="px-2 py-1 -my-1 rounded transition-colors cursor-help hover:bg-cream/50 dark:hover:bg-navy-light/30">
                    <span className="text-gray-dark dark:text-tan">
                      {stat.percentage.toFixed(1)}%
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-navy dark:bg-cream border-navy/10 dark:border-cream/10">
                  <p className="font-medium text-cream dark:text-navy">
                    {`${stat.commits || 0} commits containing ${stat.name} (${stat.percentage.toFixed(1)}% of total)`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="overflow-hidden relative h-2 rounded-full transition-colors cursor-help bg-cream/50 dark:bg-navy-light/30 group-hover:bg-cream/70 dark:group-hover:bg-navy-light/50">
                  <div 
                    className="h-full rounded-full transition-all duration-500 bg-red/80 dark:bg-red-bright/80 group-hover:bg-red dark:group-hover:bg-red-bright" 
                    style={{ width: `${stat.percentage}%` }}
                  />
                  {/* Invisible larger hit area */}
                  <div className="absolute inset-0 -my-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-navy dark:bg-cream border-navy/10 dark:border-cream/10">
                <p className="font-medium text-cream dark:text-navy">
                  {type === 'languages'
                    ? `${stat.commits || 0} commits contain ${stat.name} code across ${stat.repositories} repos, ${formatBytes(stat.bytes || 0)} total`
                    : `${stat.commits || 0} commits use ${stat.name} across ${stat.repositories} repos`
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
} 