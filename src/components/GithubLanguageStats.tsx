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

interface DetailedStats {
  repositories: number  // Number of repos using this tech
  usage: number        // Total usage count (e.g., bytes for languages)
}

interface Props {
  type: 'languages' | 'frameworks' | 'tools'
}

interface CachedStats {
  lastUpdated: string
  repoCount: number
  languages: Record<string, DetailedStats>
  frameworks: Record<string, DetailedStats>
  tools: Record<string, DetailedStats>
}

export default function GithubLanguageStats({ type }: Props) {
  const [stats, setStats] = useState<Record<string, DetailedStats>>({})
  const [repoCount, setRepoCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const data = cachedStats as CachedStats
      setRepoCount(data.repoCount)
      
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
      percentage: type === 'languages' 
        ? (stat.usage / Object.values(stats).reduce((sum, s) => sum + s.usage, 0)) * 100
        : (stat.repositories / repoCount) * 100
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 8)

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center text-navy dark:text-cream">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-48 flex items-center justify-center text-red dark:text-red-bright">
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-6">
        {sortedStats.map((stat) => (
          <div key={stat.name} className="group">
            <div className="flex justify-between mb-2">
              <span className="font-code text-navy dark:text-cream">{stat.name}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="px-2 py-1 -my-1 rounded hover:bg-cream/50 dark:hover:bg-navy-light/30 cursor-help transition-colors">
                    <span className="text-gray-dark dark:text-tan">
                      {stat.percentage.toFixed(1)}%
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-navy dark:bg-cream border-navy/10 dark:border-cream/10">
                  <p className="text-cream dark:text-navy font-medium">
                    {type === 'languages' 
                      ? `${stat.repositories} ${stat.repositories === 1 ? 'repository' : 'repositories'}, ${formatBytes(stat.usage)} of code`
                      : `Used in ${stat.repositories} ${stat.repositories === 1 ? 'repository' : 'repositories'}`
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative h-2 bg-cream/50 dark:bg-navy-light/30 rounded-full overflow-hidden cursor-help group-hover:bg-cream/70 dark:group-hover:bg-navy-light/50 transition-colors">
                  <div 
                    className="h-full bg-red/80 dark:bg-red-bright/80 rounded-full transition-all duration-500 group-hover:bg-red dark:group-hover:bg-red-bright" 
                    style={{ width: `${stat.percentage}%` }}
                  />
                  {/* Invisible larger hit area */}
                  <div className="absolute inset-0 -my-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-navy dark:bg-cream border-navy/10 dark:border-cream/10">
                <p className="text-cream dark:text-navy font-medium">
                  {type === 'languages'
                    ? `${stat.name} is used in ${stat.repositories} repositories with ${formatBytes(stat.usage)} of code`
                    : `${stat.name} is used in ${stat.repositories} out of ${repoCount} repositories`
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