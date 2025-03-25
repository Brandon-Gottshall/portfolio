export interface BaseStats {
  repositories: number
  commits: number
  bytes?: number
}

export interface DetailedStats extends BaseStats {
  summary?: {
    repositories: number
    bytes: number
    commits: number
    percentage_of_all_commits: number
  }
  variants?: CSSStats['variants']
  tools?: Record<string, { repositories: number, commits: number }>
}

export interface CSSStats {
  summary: {
    repositories: number
    bytes: number
    commits: number
    percentage_of_all_commits: number
  }
  variants: {
    vanilla: CSSVariant
    tailwind: CSSVariant & { usage: Record<string, number> }
  }
  timeline: {
    first_used: string
    first_tailwind: string | null
    recent_activity: unknown[]
  }
  top_repos: Array<{
    name: string
    commits: number
    bytes: number
    has_tailwind: boolean
    tailwind_commits: number
    vanilla_commits: number
  }>
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
  tools?: Record<string, { repositories: number, commits: number }>
}

export interface StatsItem extends BaseStats {
  name: string
  percentage: number
  summary?: CSSStats['summary']
  variants?: CSSStats['variants']
  tools?: Record<string, { repositories: number, commits: number }>
}

export interface ToolStats {
  summary: {
    repositories: number
    commits: number
    percentage_of_all_commits: number
  }
  tools: Record<string, {
    repositories: number
    commits: number
  }>
  top_tools: Array<{
    name: string
    commits: number
    repositories: number
  }>
}

export interface CachedStats {
  lastUpdated: string
  summary: {
    total_repos: number
    owned_repos: number
    contributed_repos: number
    total_commits: number
    public_repos: number
    private_repos: number
    forks: number
  }
  repoCount: number
  languages: Record<string, DetailedStats | CSSStats>
  frameworks: Record<string, DetailedStats>
  tools: Record<string, ToolStats>
  found_emails: string[]
}

export interface Props {
  type: 'languages' | 'frameworks' | 'tools'
  showBoth?: boolean
}

export interface ProcessedStat {
  name: string
  commits: number
  repositories: number
  bytes: number
  bytesFormatted: string
  percentage: number
  tools?: Record<string, { repositories: number; commits: number }>
  variants?: CSSStats['variants']
}
