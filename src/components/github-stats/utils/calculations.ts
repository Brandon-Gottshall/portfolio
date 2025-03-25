import type { DetailedStats, CSSStats, StatsItem } from '../types/stats'

export const isCSSStats = (stat: DetailedStats | CSSStats): stat is CSSStats => {
  return 'summary' in stat && 'variants' in stat
}

interface HasVariants {
  variants: Record<string, unknown>
}

interface HasTools {
  tools: Record<string, unknown>
}

const hasVariants = (stat: unknown): stat is HasVariants => 
  !!stat && typeof stat === 'object' && 'variants' in stat && typeof (stat as HasVariants).variants === 'object'

const hasTools = (stat: unknown): stat is HasTools => 
  !!stat && typeof stat === 'object' && 'tools' in stat && typeof (stat as HasTools).tools === 'object' && Object.keys((stat as HasTools).tools).length > 0

export const hasDetailedData = (stat: unknown): boolean => 
  hasVariants(stat) || hasTools(stat)

export const calculateCategoryPercentage = (
  type: 'languages' | 'frameworks' | 'tools',
  stat: StatsItem,
  totalCommits: number,
  totalRepos: number
): number => {
  // For tools, base percentage on repository count rather than commits
  if (type === 'tools') {
    return totalRepos > 0 ? (stat.repositories / totalRepos) * 100 : 0
  }

  // For languages and frameworks, continue using commit-based percentage
  return totalCommits > 0 ? Math.min((stat.commits / totalCommits) * 100, 100) : 0
}

const isValidDivision = (value: number, total: number): boolean =>
  value !== 0 && !isNaN(value) && total !== 0 && !isNaN(total)

export const calculateSafePercentage = (
  value: number,
  total: number
): number =>
  isValidDivision(value, total) ? Math.min((value / total) * 100, 100) : 0

// Helper functions to check when warnings should be displayed
export function shouldShowZeroCommitWarning(commits: number, repositories: number): boolean {
  return commits === 0 && repositories > 0
}

export function shouldShowRepoWarning(repoCount: number, commitCount: number): boolean {
  return repoCount === 0 && commitCount > 0
} 