"use client"

import { useEffect, useState, useRef } from 'react'
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
  // Add state for tracking active segment
  const [activeSegment, setActiveSegment] = useState<number | null>(null)
  
  // Reference to hold the chart instance
  const chartRef = useRef<any>(null)

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

  // Only show top 4 for donut chart, group the rest into "Other"
  const topItems = processedStats.slice(0, 4)
  const smallItems = processedStats.slice(4)

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

  // For bar chart, show top 4 plus next 5 items individually
  const nextFiveItems = smallItems.slice(0, 5)
  const barStats = [...topItems, ...nextFiveItems]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 text-navy dark:text-cream">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48 text-blue dark:text-blue-accent">
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  // High-contrast, more distinct color palette
  const chartColors = [
    'rgba(30, 136, 229, 0.95)',   // blue (#1E88E5)
    'rgba(100, 181, 246, 0.95)',  // blue-light (#64B5F6)
    'rgba(13, 71, 161, 0.95)',    // blue-dark (#0D47A1)
    'rgba(79, 195, 247, 0.95)',   // blue-accent (#4FC3F7)
    'rgba(3, 169, 244, 0.95)',    // lighter blue (#03A9F4)
  ]

  const chartBorderColors = Array(5).fill(isDarkMode ? 'rgba(11, 14, 41, 0.7)' : 'rgba(255, 255, 255, 0.7)')  // dark/light borders for better separation

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

  // Update the donut options for better clarity and labeling
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%', // Less cutout (vs. 70%) for more visible slices
    layout: {
      padding: 15 // More breathing room
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: '#FFFFFF',
        font: {
          weight: 'bold' as 'bold',
          size: 13,
          family: "'Inter', system-ui, sans-serif",
        },
        textStrokeColor: 'rgba(0, 0, 0, 0.7)',
        textStrokeWidth: 3,
        formatter: (value: number) => {
          // Only show percentage for larger slices (>10%)
          return value > 10 ? `${value.toFixed(0)}%` : '';
        },
        align: 'center' as const,
        anchor: 'center' as const
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(227, 222, 200, 0.95)' : 'rgba(26, 35, 126, 0.95)',
        titleColor: isDarkMode ? 'rgba(26, 35, 126, 0.9)' : 'rgba(227, 222, 200, 0.9)',
        bodyColor: isDarkMode ? 'rgba(26, 35, 126, 0.9)' : 'rgba(227, 222, 200, 0.9)',
        padding: 10,
        cornerRadius: 6,
        boxPadding: 5,
        titleFont: {
          family: "'Inter', system-ui, sans-serif",
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          family: "'Inter', system-ui, sans-serif",
          size: 13,
        },
        callbacks: {
          // Streamlined tooltip content
          label: function(context: any) {
            const stat = finalDonutStats[context.dataIndex];
            return [
              `${stat.percentage.toFixed(1)}% of all commits`,
              `Used in ${stat.repositories} repositories`
            ];
          }
        }
      },
      // Add bidirectional event handling to sync donut and bars
      hover: {
        onHover: function(event: any, elements: any[]) {
          if (elements && elements.length) {
            const index = elements[0].index;
            setActiveSegment(index);
          } else {
            setActiveSegment(null);
          }
        }
      }
    },
  };

  // Update for improved layout and visual hierarchy
  if (showBoth) {
    return (
      <div className="p-6 rounded-xl border shadow-sm bg-white/95 dark:bg-navy-darkest/95 border-navy/10 dark:border-cream/10">
        <h4 className="mb-6 text-lg font-medium text-center text-navy-dark dark:text-cream-dark">
          {type.charAt(0).toUpperCase() + type.slice(1)} Distribution
        </h4>
        
        <div className="grid grid-cols-1 gap-8 items-start md:grid-cols-5">
          {/* Visual summary section */}
          <div className="flex flex-col h-full md:col-span-2">
            <h4 className="mb-3 text-sm font-medium text-center text-navy dark:text-cream">
              Visual Overview
              <span className="ml-2 text-xs italic text-navy-light/80 dark:text-cream/60">Top {topItems.length} + Other</span>
            </h4>
            
            {/* Center the donut and legend in the available space */}
            <div className="flex flex-col flex-1 justify-center items-center">
              {/* Fixed height container for the donut */}
              <div className="flex justify-center items-center mb-2 w-full h-64">
                <Doughnut 
                  data={chartData} 
                  options={donutOptions} 
                  ref={chartRef}
                />
              </div>
              
              {/* Compact legend with better typography */}
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {finalDonutStats.map((stat, index) => (
                  <div 
                    key={stat.name} 
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md cursor-pointer transition-colors
                      ${activeSegment === index
                        ? 'bg-cream/50 dark:bg-navy-light/50 shadow-sm'
                        : 'hover:bg-cream/40 dark:hover:bg-navy-light/30'}`}
                    onMouseEnter={() => {
                      // For additional items, highlight the "Other" slice in the donut
                      const targetIndex = stat.name === "Other" ? finalDonutStats.findIndex(item => item.name === "Other") : index;
                      setActiveSegment(targetIndex);
                      
                      // Update the donut chart to highlight the segment AND show tooltip
                      if (chartRef.current) {
                        const chart = chartRef.current;
                        
                        // Manually trigger hover effect on the appropriate segment
                        chart.setActiveElements([{
                          datasetIndex: 0,
                          index: targetIndex
                        }]);
                        
                        // Access the native chart object to simulate a mouse event at the segment position
                        const meta = chart.getDatasetMeta(0);
                        if (meta.data[targetIndex]) {
                          const arc = meta.data[targetIndex];
                          
                          // Get the position of the arc to place the tooltip
                          const centerX = arc.x;
                          const centerY = arc.y;
                          
                          // Show the tooltip by manually updating its position and active elements
                          chart.tooltip.setActiveElements([{
                            datasetIndex: 0,
                            index: targetIndex
                          }], {
                            x: centerX,
                            y: centerY
                          });
                        }
                        
                        chart.update();
                      }
                    }}
                    onMouseLeave={() => {
                      setActiveSegment(null);
                      
                      // Remove highlighting AND tooltip from the chart
                      if (chartRef.current) {
                        const chart = chartRef.current;
                        chart.setActiveElements([]);
                        
                        // Also hide the tooltip
                        chart.tooltip.setActiveElements([], {});
                        chart.tooltip.active = false;
                        
                        chart.update();
                      }
                    }}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{backgroundColor: chartColors[index % chartColors.length]}}
                    ></span>
                    <span className="text-xs font-medium text-navy dark:text-cream">
                      {stat.name}
                    </span>
                    {stat.name === "Other" && (
                      <span className="text-xs text-navy-light/80 dark:text-cream/60">
                        {stat.percentage.toFixed(1)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Detailed breakdown section */}
          <div className="md:col-span-3">
            <h4 className="mb-3 text-sm font-medium text-center text-navy dark:text-cream">
              Detailed Breakdown
              <span className="ml-2 text-xs italic text-navy-light/80 dark:text-cream/60">Top {barStats.length} Categories</span>
            </h4>
            <TooltipProvider delayDuration={100}>
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                {barStats.map((stat, index) => {
                  // Check if this is one of the additional items (beyond the top 4)
                  const isAdditionalItem = index >= topItems.length;
                  // For additional items, we need to find the index of "Other" in finalDonutStats
                  const otherIndex = finalDonutStats.findIndex(item => item.name === "Other");
                  
                  return (
                    <div 
                      key={stat.name} 
                      className={`group p-2.5 rounded-lg transition-all duration-200 
                        ${activeSegment === (isAdditionalItem ? otherIndex : index) 
                          ? 'bg-cream/50 dark:bg-navy-light/50 shadow-sm transform scale-[1.01]' 
                          : 'hover:bg-cream/40 dark:hover:bg-navy-light/30 hover:shadow-sm'}`}
                      onMouseEnter={() => {
                        // For additional items, highlight the "Other" slice in the donut
                        const targetIndex = isAdditionalItem ? otherIndex : index;
                        setActiveSegment(targetIndex);
                        
                        // Update the donut chart to highlight the segment AND show tooltip
                        if (chartRef.current) {
                          const chart = chartRef.current;
                          
                          // Manually trigger hover effect on the appropriate segment
                          chart.setActiveElements([{
                            datasetIndex: 0,
                            index: targetIndex
                          }]);
                          
                          // Access the native chart object to simulate a mouse event at the segment position
                          const meta = chart.getDatasetMeta(0);
                          if (meta.data[targetIndex]) {
                            const arc = meta.data[targetIndex];
                            
                            // Get the position of the arc to place the tooltip
                            const centerX = arc.x;
                            const centerY = arc.y;
                            
                            // Show the tooltip by manually updating its position and active elements
                            chart.tooltip.setActiveElements([{
                              datasetIndex: 0,
                              index: targetIndex
                            }], {
                              x: centerX,
                              y: centerY
                            });
                          }
                          
                          chart.update();
                        }
                      }}
                      onMouseLeave={() => {
                        setActiveSegment(null);
                        
                        // Remove highlighting AND tooltip from the chart
                        if (chartRef.current) {
                          const chart = chartRef.current;
                          chart.setActiveElements([]);
                          
                          // Also hide the tooltip
                          chart.tooltip.setActiveElements([], {});
                          chart.tooltip.active = false;
                          
                          chart.update();
                        }
                      }}
                    >
                      <div className="flex justify-between mb-1.5 items-center">
                        {/* Category name with icon color matching the donut slice */}
                        <div className="flex items-center">
                          <span 
                            className={`rounded-full mr-2 transition-all duration-200
                              ${activeSegment === (isAdditionalItem ? otherIndex : index) ? 'w-3.5 h-3.5' : 'w-3 h-3'}`}
                            style={{backgroundColor: chartColors[index % chartColors.length]}}
                          ></span>
                          <span className={`font-code text-navy font-medium dark:text-cream ${isAdditionalItem ? 'text-sm' : ''}`}>
                            {stat.name}
                            {isAdditionalItem && (
                              <span className="ml-1.5 text-xs text-navy-light/70 dark:text-cream/60 italic normal-font">
                                (in Other)
                              </span>
                            )}
                          </span>
                        </div>
                        
                        {/* Percentage with cleaner display */}
                        <span className={`font-semibold px-2 py-0.5 rounded text-sm ${
                          activeSegment === (isAdditionalItem ? otherIndex : index)
                            ? 'bg-cream/50 dark:bg-navy-light/50 text-navy dark:text-cream' 
                            : 'text-navy-light dark:text-cream'
                        }`}>
                          {stat.percentage.toFixed(1)}%
                        </span>
                      </div>
                      
                      {/* Bar with tooltip - enhanced for active state */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="overflow-hidden relative h-3 rounded-full transition-colors cursor-help bg-cream-dark/50 dark:bg-navy-light/40 group-hover:bg-cream-dark/70 dark:group-hover:bg-navy-light/60">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                activeSegment === (isAdditionalItem ? otherIndex : index) ? 'h-4 -mt-0.5' : ''
                              }`}
                              style={{ 
                                width: `${stat.percentage}%`,
                                backgroundColor: isAdditionalItem 
                                  ? `${chartColors[4 % chartColors.length].toString()}` // Use "Other" color with opacity
                                  : chartColors[index % chartColors.length].toString()
                              }}
                            />
                            {/* Invisible larger hit area */}
                            <div className="absolute inset-0 -my-3" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-sm bg-navy dark:bg-cream border-navy/10 dark:border-cream/10">
                          <p className="font-medium text-cream dark:text-navy">
                            {type === 'languages'
                              ? `${stat.commits || 0} commits contain ${stat.name} code across ${stat.repositories} repos, ${formatBytes(stat.bytes || 0)} total`
                              : `${stat.commits || 0} commits use ${stat.name} across ${stat.repositories} repos`
                            }
                            {isAdditionalItem && (
                              <span className="block mt-1 text-xs italic">Part of the "Other" category in the donut chart</span>
                            )}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Additional stats with improved contrast */}
                      <div className="flex justify-between mt-1 text-xs font-medium text-navy/80 dark:text-cream/80">
                        <span>{stat.commits.toLocaleString()} commits</span>
                        <span>{stat.repositories} repositories</span>
                      </div>
                    </div>
                  );
                })}
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
                    className="h-full rounded-full transition-all duration-500 bg-blue/80 dark:bg-blue-accent/80 group-hover:bg-blue dark:group-hover:bg-blue-accent" 
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