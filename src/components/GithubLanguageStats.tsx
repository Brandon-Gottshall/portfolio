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
  repositories: number  
  bytes?: number        // Optional byte count for languages
  commits: number       // Commit count for all types
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