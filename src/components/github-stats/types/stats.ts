export interface BaseStats {
  name: string
  commits: number
  repositories: number
  bytes?: number
  percentage: number
}

export interface DetailedStats extends BaseStats {
  summary?: {
    repositories: number
    commits: number
    bytes?: number
    percentage_of_all_commits?: number
  }
  variants?: {
    vanilla?: {
      repositories: number
      bytes: number
      commits: number
      percentage_of_css: number
      file_types: Record<
        string,
        { files: number; bytes: number; commits: number }
      >
    }
    tailwind?: {
      repositories: number
      bytes: number
      commits: number
      percentage_of_css: number
      file_types: Record<
        string,
        { files: number; bytes: number; commits: number }
      >
    }
  }
  tools?: Record<string, { repositories: number; commits: number }>
}

export interface CSSStats extends DetailedStats {
  summary: {
    repositories: number
    commits: number
    bytes: number
    percentage_of_all_commits: number
  }
  variants: {
    vanilla: {
      repositories: number
      bytes: number
      commits: number
      percentage_of_css: number
      file_types: Record<
        string,
        { files: number; bytes: number; commits: number }
      >
    }
    tailwind: {
      repositories: number
      bytes: number
      commits: number
      percentage_of_css: number
      file_types: Record<
        string,
        { files: number; bytes: number; commits: number }
      >
    }
  }
}

export interface CSSVariant {
  repositories: number
  bytes: number
  commits: number
  percentage_of_css: number
  file_types: Record<string, FileTypeStats>
}

export interface FileTypeStats {
  files: number
  bytes: number
  commits: number
}

export interface FrameworkStats extends BaseStats {
  tools?: Record<string, { repositories: number; commits: number }>
}

export interface StatsItem extends BaseStats {
  name: string
  percentage: number
  summary?: CSSStats['summary']
  variants?: CSSStats['variants']
  tools?: Record<string, { repositories: number; commits: number }>
}

export interface ToolStats {
  summary: {
    repositories: number
    commits: number
    percentage_of_all_commits: number
  }
  tools: Record<
    string,
    {
      repositories: number
      commits: number
    }
  >
  top_tools: Array<{
    name: string
    commits: number
    repositories: number
  }>
}

export interface CachedStats {
  lastUpdated: string
  repoCount: number
  languages: Record<string, DetailedStats | CSSStats>
  frameworks: Record<string, DetailedStats>
  tools: Record<string, DetailedStats>
  summary: {
    total_repos: number
    owned_repos: number
    contributed_repos: number
    total_commits: number
    public_repos: number
    private_repos: number
    forks: number
  }
  found_emails: string[]
}

export interface Props {
  type: 'languages' | 'frameworks' | 'tools'
  showBoth?: boolean
}

/**
 * Represents a processed statistic with normalized data structure
 * for consistent rendering across different stat types
 */
export interface ProcessedStat {
  name: string
  commits: number
  repositories: number
  bytes: number
  bytesFormatted: string
  percentage: number
  tools?: Record<string, { repositories: number; commits: number }>
  variants?: CSSStats['variants']
  summary?: {
    repositories: number
    commits: number
    bytes?: number
    percentage_of_all_commits?: number
  }
}

/**
 * Represents processed CSS statistics with specialized variant data
 * for both vanilla CSS and Tailwind usage
 */
export interface CSSProcessedStat extends ProcessedStat {
  variants: {
    vanilla: {
      repositories: number
      bytes: number
      commits: number
      percentage_of_css: number
      file_types: Record<
        string,
        { files: number; bytes: number; commits: number }
      >
    }
    tailwind: {
      repositories: number
      bytes: number
      commits: number
      percentage_of_css: number
      file_types: Record<
        string,
        { files: number; bytes: number; commits: number }
      >
    }
  }
  summary: {
    repositories: number
    commits: number
    bytes: number
    percentage_of_all_commits: number
  }
}

export type StatItem = ProcessedStat | CSSProcessedStat

// Type guard to check if a stat is the complex CSS structure
export function isCSSStats(stat: StatItem): stat is CSSProcessedStat {
  return !!(
    'summary' in stat &&
    'variants' in stat &&
    stat.summary &&
    stat.variants &&
    'vanilla' in stat.variants &&
    'tailwind' in stat.variants
  )
}

// Type guard to check if a stat has tools
export function isToolCategory(stat: StatItem): boolean {
  return (
    stat &&
    typeof stat === 'object' &&
    'tools' in stat &&
    typeof stat.tools === 'object' &&
    Object.keys(stat.tools || {}).length > 0
  )
}

// Helper function to check if a stat has detailed data
export function hasDetailedData(stat: StatItem): boolean {
  return (
    stat &&
    // Check for CSS structure with variants
    (('variants' in stat && typeof stat.variants === 'object') ||
      // Check for tools structure
      ('tools' in stat &&
        typeof stat.tools === 'object' &&
        Object.keys(stat.tools || {}).length > 0))
  )
}

// Helper functions to safely get data from stats
export function getCommits(stat: StatItem): number {
  if (isCSSStats(stat)) {
    return stat.summary.commits
  }
  return stat.commits
}

export function getRepositories(stat: StatItem): number {
  if (isCSSStats(stat)) {
    return stat.summary.repositories
  }
  return stat.repositories
}

export function getBytes(stat: StatItem): number | undefined {
  if (isCSSStats(stat)) {
    return stat.summary.bytes
  }
  return stat.bytes
}
