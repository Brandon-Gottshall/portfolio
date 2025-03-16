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
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, ChartEvent, LegendElement, LegendItem } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

// Add datalabels plugin for direct labels on chart
import ChartDataLabels from 'chartjs-plugin-datalabels'

// Register ChartJS components
ChartJS.register(ArcElement, ChartTooltip, Legend, ChartDataLabels)

interface DetailedStats {
  repositories: number  
  bytes?: number        // Optional byte count for languages
  commits: number       // Commit count for all types
}

interface StatsItem extends DetailedStats {
  name: string
  percentage: number
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
  const [isDarkMode, setIsDarkMode] = useState(false)

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

    // Check if dark mode is active
    setIsDarkMode(document.documentElement.classList.contains('dark'))

    // Listen for theme changes
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
  }, [type])

  // Process stats and group small slices into "Other"
  const processedStats = Object.entries(stats)
    .map(([name, stat]) => ({
      name,
      ...stat,
      percentage: (stat.commits / Object.values(stats).reduce((sum, s) => sum + (s.commits || 0), 0)) * 100
    }))
    .sort((a, b) => b.percentage - a.percentage)

  // Only show top 5 for donut chart, group the rest into "Other"
  const donutStats = [...processedStats]
  
  // Group small slices
  const topItems = donutStats.slice(0, 5)
  const smallItems = donutStats.slice(5)
  
  // Add "Other" category if there are small items
  const othersPercentage = smallItems.reduce((sum, item) => sum + item.percentage, 0)
  const othersCommits = smallItems.reduce((sum, item) => sum + item.commits, 0)
  const othersRepos = new Set(smallItems.flatMap(item => Array(item.repositories).fill(0))).size

  // Create final donut data with "Other" if needed
  const finalDonutStats: StatsItem[] = othersPercentage > 0 
    ? [...topItems, {
        name: "Other",
        percentage: othersPercentage,
        commits: othersCommits,
        repositories: othersRepos,
        bytes: smallItems.reduce((sum, item) => sum + (item.bytes || 0), 0)
      }]
    : topItems

  // For bar chart, show top 8 items
  const barStats = processedStats.slice(0, 8)

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

  // High-contrast, more distinct color palette
  const chartColors = [
    'rgba(151, 73, 81, 0.95)',    // red
    'rgba(26, 35, 126, 0.95)',    // navy
    'rgba(215, 203, 169, 0.95)',  // tan
    'rgba(48, 63, 159, 0.95)',    // navy-light
    'rgba(178, 93, 101, 0.95)',   // red-bright
    'rgba(100, 100, 100, 0.95)',  // gray for "Other"
  ]

  const chartBorderColors = [
    'rgba(255, 255, 255, 1)',   // white border for all segments
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)',
  ]

  const chartData = {
    labels: finalDonutStats.map(stat => stat.name),
    datasets: [
      {
        data: finalDonutStats.map(stat => stat.percentage),
        backgroundColor: chartColors,
        borderColor: chartBorderColors,
        borderWidth: 3,
        hoverOffset: 15,
        hoverBorderWidth: 4,
        hoverBorderColor: 'rgba(255, 255, 255, 1)',
      },
    ],
  }

  // Custom label generator function with proper typing
  const generateCustomLabels = (chart: any) => {
    const data = chart.data;
    return data.labels.map((label: string, i: number) => {
      const meta = chart.getDatasetMeta(0);
      const style = meta.controller.getStyle(i);
      const value = chart.data.datasets[0].data[i].toFixed(1);
      
      return {
        text: `${label} (${value}%)`,
        fillStyle: style.backgroundColor,
        strokeStyle: style.borderColor,
        lineWidth: style.borderWidth,
        pointStyle: 'circle',
        hidden: false,
        index: i
      };
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20, // Add padding for labels
    },
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            family: "'Fira Code', monospace",
            size: 13
          },
          color: isDarkMode ? 'rgba(227, 222, 200, 1)' : 'rgba(26, 35, 126, 1)',
          usePointStyle: true,
          padding: 15,
          boxWidth: 12,
          boxHeight: 12,
          generateLabels: generateCustomLabels
        },
        // Disable toggling legend items in a type-safe way
        onClick: function() { return undefined; }
      },
      // Add direct labels on chart segments
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 12,
          family: "'Fira Sans', sans-serif",
        },
        formatter: (value: number) => {
          return value > 8 ? `${value.toFixed(0)}%` : '';
        },
        textAlign: 'center',
        textStrokeColor: 'rgba(0, 0, 0, 0.5)',
        textStrokeWidth: 2,
        textShadowBlur: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(227, 222, 200, 0.95)' : 'rgba(26, 35, 126, 0.95)',
        titleColor: isDarkMode ? 'rgba(26, 35, 126, 0.9)' : 'rgba(227, 222, 200, 0.9)',
        bodyColor: isDarkMode ? 'rgba(26, 35, 126, 0.9)' : 'rgba(227, 222, 200, 0.9)',
        padding: 12,
        cornerRadius: 6,
        boxPadding: 5,
        callbacks: {
          label: function(context: {dataIndex: number}) {
            const stat = finalDonutStats[context.dataIndex];
            const percentage = stat.percentage.toFixed(1);
            const commits = stat.commits;
            const repos = stat.repositories;
            
            return [
              `${percentage}% of all commits`,
              `${commits} total commits`,
              `Used in ${repos} repositories`
            ];
          }
        }
      }
    },
    cutout: '50%', // Less cutout for better visibility
    elements: {
      arc: {
        borderWidth: 3
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    }
  }

  // Render combined visualization with tooltips and improved contrast
  if (showBoth) {
    const donutOptions = {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        legend: {
          display: false, // Remove the built-in legend
        },
        datalabels: {
          color: '#FFFFFF', // Pure white for maximum contrast
          font: {
            weight: 'bold',
            size: 14,
            family: "'Fira Sans', sans-serif",
          },
          textStrokeColor: 'rgba(0, 0, 0, 0.7)', // Darker stroke for better readability
          textStrokeWidth: 3,
          textShadowBlur: 6,
          textShadowColor: 'rgba(0, 0, 0, 0.8)',
          formatter: (value: number) => {
            return value > 8 ? `${value.toFixed(0)}%` : '';
          },
        }
      }
    };

    return (
      <div className="bg-white/95 dark:bg-navy-darkest/95 rounded-xl border border-navy/10 dark:border-cream/10 shadow-sm p-6">
        <h4 className="text-sm font-medium mb-4 text-navy dark:text-cream font-code flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-navy dark:bg-cream mr-2"></span>
            {type.charAt(0).toUpperCase() + type.slice(1)} Distribution
          </div>
          <span className="text-xs text-navy-light dark:text-cream italic">Top categories by usage</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          {/* Donut chart on the left */}
          <div className="md:col-span-2 flex flex-col items-center justify-center h-64">
            <Doughnut data={chartData} options={donutOptions} />
          </div>
          
          {/* Bar chart serving as the legend */}
          <div className="md:col-span-3">
            <TooltipProvider delayDuration={100}>
              <div className="space-y-4">
                {finalDonutStats.map((stat, index) => (
                  <div 
                    key={stat.name} 
                    className="group p-2 rounded-md hover:bg-cream/40 dark:hover:bg-navy-light/30"
                  >
                    <div className="flex justify-between mb-1">
                      {/* Higher contrast for category names */}
                      <span className="font-code text-navy font-medium dark:text-cream flex items-center">
                        <span 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{backgroundColor: chartColors[index].toString()}}
                        ></span>
                        {stat.name}
                      </span>
                      
                      {/* Percentage with tooltip */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="px-2 py-1 -my-1 rounded transition-colors cursor-help hover:bg-cream/50 dark:hover:bg-navy-light/30">
                            <span className="text-navy-light font-semibold dark:text-cream">
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
                    
                    {/* Bar with tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="overflow-hidden relative h-3 rounded-full transition-colors cursor-help bg-cream-dark/50 dark:bg-navy-light/40 group-hover:bg-cream-dark/70 dark:group-hover:bg-navy-light/60">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${stat.percentage}%`,
                              backgroundColor: chartColors[index].toString()
                            }}
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
                    
                    {/* Additional stats with improved contrast */}
                    <div className="text-xs text-navy dark:text-cream mt-1 flex justify-between font-medium">
                      <span>{stat.commits} commits</span>
                      <span>{stat.repositories} repositories</span>
                    </div>
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    )
  }

  // Original bar visualization as default
  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-6">
        {barStats.map((stat) => (
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