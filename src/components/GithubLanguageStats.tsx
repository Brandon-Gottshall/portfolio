'use client'

import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import cachedStats from '@/data/github-stats.json'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js'
import type { ChartEvent, LegendElement, LegendItem } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

// Add datalabels plugin for direct labels on chart
import ChartDataLabels from 'chartjs-plugin-datalabels'

// Register ChartJS components
ChartJS.register(ArcElement, ChartTooltip, Legend, ChartDataLabels)

interface DetailedStats {
  repositories: number
  bytes?: number // Optional byte count for languages
  commits: number // Commit count for all types
}

// New interface for CSS complex structure
interface CSSStats {
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
      file_types: {
        css: { files: number; bytes: number; commits: number }
        scss: { files: number; bytes: number; commits: number }
        jsx_tsx: { files: number; bytes: number; commits: number }
        html: { files: number; bytes: number; commits: number }
      }
    }
  }
}

interface FrameworkStats {
  repositories: number
  commits: number
}

interface ToolCategory {
  repositories: number
  commits: number
  tools: Record<string, { repositories: number; commits: number }>
}

interface StatsItem extends DetailedStats {
  name: string
  percentage: number
  // Add optional CSS properties
  summary?: {
    repositories: number
    bytes: number
    commits: number
    percentage_of_all_commits: number
  }
  variants?: {
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
  // Add optional properties for tools categories
  tools?: Record<string, { repositories: number; commits: number }>
}

interface Props {
  type: 'languages' | 'frameworks' | 'tools'
  showBoth?: boolean
}

interface CachedStats {
  lastUpdated: string
  repoCount: number
  languages: Record<string, DetailedStats | CSSStats>
  frameworks: Record<string, DetailedStats>
  tools: Record<string, DetailedStats>
}

// Type guard to check if a stat is the complex CSS structure
const isCSSStats = (stat: DetailedStats | CSSStats): stat is CSSStats => {
  return 'summary' in stat && 'variants' in stat
}

// Add this function to correctly check for tool categories
const isToolCategory = (stat: any): boolean => {
  // Check if it's one of the known tool categories with the correct structure
  return (
    stat &&
    typeof stat === 'object' &&
    'tools' in stat &&
    typeof stat.tools === 'object' &&
    Object.keys(stat.tools).length > 0
  )
}

// Update the hasDetailedTools function to better handle the tools structure
const hasDetailedTools = (stat: any): boolean => {
  // First, check if it's one of the specific tool categories we know exists in the data
  const isToolCategory = [
    'Markup & Configuration',
    'Linting & Formatting',
    'Hosting & Deployment',
    'Infrastructure',
    'Testing',
    'CSS Frameworks',
    'Database Tools'
  ].includes(stat.name)

  // Then check if the object actually has a tools property
  const hasToolsProperty =
    stat &&
    'tools' in stat &&
    typeof stat.tools === 'object' &&
    Object.keys(stat.tools).length > 0

  return isToolCategory || hasToolsProperty
}

// Add this function after isCSSStats and before the components

// Helper function to check if a stat has detailed data (either CSS variants or tools)
const hasDetailedData = (stat: any): boolean => {
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

// Add this as a new component just before the GithubLanguageStats component definition
interface CSSBreakdownProps {
  cssStats: CSSStats
  isDarkMode: boolean
}

const CSSBreakdown = ({ cssStats, isDarkMode }: CSSBreakdownProps) => {
  const { summary, variants } = cssStats
  const { vanilla, tailwind } = variants

  // Colors that match the main chart but specific for CSS variants
  const cssColors = {
    vanilla: 'rgba(13, 71, 161, 0.95)', // blue-dark
    tailwind: 'rgba(79, 195, 247, 0.95)' // blue-accent
  }

  return (
    <div className="pt-2 mt-4 border-t border-navy/10 dark:border-cream/10">
      <h5 className="mb-2 text-sm font-medium text-navy dark:text-cream">
        CSS Usage Breakdown
      </h5>

      {/* Variant distribution */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Vanilla CSS card */}
        <div className="p-2 rounded-lg border bg-cream/30 dark:bg-navy-light/30 border-navy/10 dark:border-cream/10">
          <div className="flex items-center mb-1.5">
            <div
              className="w-3 h-3 rounded-full mr-1.5"
              style={{ backgroundColor: cssColors.vanilla }}
            ></div>
            <span className="text-xs font-medium text-navy dark:text-cream">
              Vanilla CSS
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-navy/70 dark:text-cream/70">Commits:</span>
              <span className="font-medium">
                {vanilla.commits.toLocaleString()} (
                {vanilla.percentage_of_css.toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-navy/70 dark:text-cream/70">Repos:</span>
              <span className="font-medium">{vanilla.repositories}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-navy/70 dark:text-cream/70">Size:</span>
              <span className="font-medium">{formatBytes(vanilla.bytes)}</span>
            </div>
          </div>
        </div>

        {/* Tailwind CSS card */}
        <div className="p-2 rounded-lg border bg-cream/30 dark:bg-navy-light/30 border-navy/10 dark:border-cream/10">
          <div className="flex items-center mb-1.5">
            <div
              className="w-3 h-3 rounded-full mr-1.5"
              style={{ backgroundColor: cssColors.tailwind }}
            ></div>
            <span className="text-xs font-medium text-navy dark:text-cream">
              Tailwind CSS
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-navy/70 dark:text-cream/70">Commits:</span>
              <span className="font-medium">
                {tailwind.commits.toLocaleString()} (
                {tailwind.percentage_of_css.toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-navy/70 dark:text-cream/70">Repos:</span>
              <span className="font-medium">{tailwind.repositories}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-navy/70 dark:text-cream/70">Size:</span>
              <span className="font-medium">{formatBytes(tailwind.bytes)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* File type breakdown */}
      <div className="mb-3">
        <h6 className="text-xs font-medium mb-1.5 text-navy/80 dark:text-cream/80">
          File Type Distribution
        </h6>
        <div className="overflow-hidden h-6 rounded-md bg-cream-dark/50 dark:bg-navy-light/40">
          {/* CSS files */}
          {tailwind.file_types.css.files > 0 && (
            <div
              className="float-left h-3"
              style={{
                width: `${
                  (tailwind.file_types.css.files /
                    (tailwind.file_types.css.files +
                      tailwind.file_types.scss.files +
                      tailwind.file_types.jsx_tsx.files +
                      tailwind.file_types.html.files +
                      vanilla.file_types.css.files +
                      vanilla.file_types.scss.files +
                      vanilla.file_types.sass.files +
                      vanilla.file_types.less.files)) *
                  100
                }%`,
                backgroundColor: cssColors.tailwind
              }}
            ></div>
          )}
          {/* Tailwind in JSX/TSX */}
          {tailwind.file_types.jsx_tsx.files > 0 && (
            <div
              className="float-left h-3"
              style={{
                width: `${
                  (tailwind.file_types.jsx_tsx.files /
                    (tailwind.file_types.css.files +
                      tailwind.file_types.scss.files +
                      tailwind.file_types.jsx_tsx.files +
                      tailwind.file_types.html.files +
                      vanilla.file_types.css.files +
                      vanilla.file_types.scss.files +
                      vanilla.file_types.sass.files +
                      vanilla.file_types.less.files)) *
                  100
                }%`,
                backgroundColor: cssColors.tailwind,
                opacity: 0.8
              }}
            ></div>
          )}
          {/* Tailwind in HTML */}
          {tailwind.file_types.html.files > 0 && (
            <div
              className="float-left h-3"
              style={{
                width: `${
                  (tailwind.file_types.html.files /
                    (tailwind.file_types.css.files +
                      tailwind.file_types.scss.files +
                      tailwind.file_types.jsx_tsx.files +
                      tailwind.file_types.html.files +
                      vanilla.file_types.css.files +
                      vanilla.file_types.scss.files +
                      vanilla.file_types.sass.files +
                      vanilla.file_types.less.files)) *
                  100
                }%`,
                backgroundColor: cssColors.tailwind,
                opacity: 0.6
              }}
            ></div>
          )}
          {/* Vanilla CSS files */}
          {vanilla.file_types.css.files > 0 && (
            <div
              className="float-left h-3"
              style={{
                width: `${
                  (vanilla.file_types.css.files /
                    (tailwind.file_types.css.files +
                      tailwind.file_types.scss.files +
                      tailwind.file_types.jsx_tsx.files +
                      tailwind.file_types.html.files +
                      vanilla.file_types.css.files +
                      vanilla.file_types.scss.files +
                      vanilla.file_types.sass.files +
                      vanilla.file_types.less.files)) *
                  100
                }%`,
                backgroundColor: cssColors.vanilla
              }}
            ></div>
          )}
        </div>

        {/* Legend for file types */}
        <div className="flex flex-wrap gap-y-1 gap-x-4 mt-2">
          {tailwind.file_types.css.files > 0 && (
            <div className="flex items-center">
              <div
                className="mr-1 w-2 h-2 rounded-sm"
                style={{ backgroundColor: cssColors.tailwind }}
              ></div>
              <span className="text-xs text-navy/80 dark:text-cream/80">
                Tailwind CSS: {tailwind.file_types.css.files} files
              </span>
            </div>
          )}
          {tailwind.file_types.jsx_tsx.files > 0 && (
            <div className="flex items-center">
              <div
                className="mr-1 w-2 h-2 rounded-sm"
                style={{ backgroundColor: cssColors.tailwind, opacity: 0.8 }}
              ></div>
              <span className="text-xs text-navy/80 dark:text-cream/80">
                In JSX/TSX: {tailwind.file_types.jsx_tsx.files} files
              </span>
            </div>
          )}
          {tailwind.file_types.html.files > 0 && (
            <div className="flex items-center">
              <div
                className="mr-1 w-2 h-2 rounded-sm"
                style={{ backgroundColor: cssColors.tailwind, opacity: 0.6 }}
              ></div>
              <span className="text-xs text-navy/80 dark:text-cream/80">
                In HTML: {tailwind.file_types.html.files} files
              </span>
            </div>
          )}
          {vanilla.file_types.css.files > 0 && (
            <div className="flex items-center">
              <div
                className="mr-1 w-2 h-2 rounded-sm"
                style={{ backgroundColor: cssColors.vanilla }}
              ></div>
              <span className="text-xs text-navy/80 dark:text-cream/80">
                Vanilla CSS: {vanilla.file_types.css.files} files
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Key metrics in a condensed format */}
      <div className="grid grid-cols-2 gap-2 text-xs text-navy/70 dark:text-cream/70">
        <div className="flex justify-between">
          <span>Component files:</span>
          <span className="font-medium">
            {tailwind.file_types.jsx_tsx.files + tailwind.file_types.html.files}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Total CSS files:</span>
          <span className="font-medium">
            {vanilla.file_types.css.files +
              vanilla.file_types.scss.files +
              vanilla.file_types.sass.files +
              vanilla.file_types.less.files +
              tailwind.file_types.css.files +
              tailwind.file_types.scss.files}
          </span>
        </div>
      </div>
    </div>
  )
}

// Add this new component for framework breakdowns
interface FrameworkBreakdownProps {
  name: string
  stats: FrameworkStats
  isDarkMode: boolean
}

const FrameworkBreakdown = ({
  name,
  stats,
  isDarkMode
}: FrameworkBreakdownProps) => {
  // Framework-specific colors that complement the main chart colors
  const frameworkColor = 'rgba(13, 71, 161, 0.95)' // blue-dark

  return (
    <div className="pt-2 mt-4 border-t border-navy/10 dark:border-cream/10">
      <h5 className="mb-2 text-sm font-medium text-navy dark:text-cream">
        {name} Usage Details
      </h5>

      <div className="p-2 rounded-lg border bg-cream/30 dark:bg-navy-light/30 border-navy/10 dark:border-cream/10">
        <div className="flex items-center mb-1.5">
          <div
            className="w-3 h-3 rounded-full mr-1.5"
            style={{ backgroundColor: frameworkColor }}
          ></div>
          <span className="text-xs font-medium text-navy dark:text-cream">
            {name} Projects
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-navy/70 dark:text-cream/70">Commits:</span>
            <span className="font-medium">
              {stats.commits.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-navy/70 dark:text-cream/70">Repos:</span>
            <span className="font-medium">{stats.repositories}</span>
          </div>
        </div>
      </div>

      {/* Project metrics in a condensed format */}
      <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-navy/70 dark:text-cream/70">
        <div className="flex justify-between">
          <span>Avg commits per repo:</span>
          <span className="font-medium">
            {(stats.commits / Math.max(stats.repositories, 1)).toFixed(1)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Contribution %:</span>
          <span className="font-medium">
            {((stats.repositories / Math.max(stats.commits, 1)) * 100).toFixed(
              1
            )}
            %
          </span>
        </div>
      </div>
    </div>
  )
}

// Add this new component for tool category breakdown only when needed
interface ToolCategoryBreakdownProps {
  name: string
  stats: {
    repositories: number
    commits: number
    tools: Record<string, { repositories: number; commits: number }>
  }
  isDarkMode: boolean
}

const ToolCategoryBreakdown = ({
  name,
  stats,
  isDarkMode
}: ToolCategoryBreakdownProps) => {
  // Tool category colors
  const toolColors = {
    primary: 'rgba(30, 136, 229, 0.95)', // blue
    secondary: 'rgba(79, 195, 247, 0.85)', // blue-accent
    accent: 'rgba(13, 71, 161, 0.95)' // blue-dark
  }

  // Get the tools from the nested structure
  const toolsObject = stats.tools || {}

  // Sort tools by commits (descending)
  const sortedTools = Object.entries(toolsObject).sort(([, a], [, b]) => {
    // First by commits, then by repositories if commits are equal
    if (b.commits !== a.commits) return b.commits - a.commits
    return b.repositories - a.repositories
  })

  const totalCommits =
    sortedTools.reduce((sum, [, tool]) => sum + (tool.commits || 0), 0) || 1
  const topTools = sortedTools.slice(0, 4) // Limit to top 4 tools

  const totalTools = sortedTools.length
  const hasMoreTools = totalTools > 4

  return (
    <div className="pt-2 mt-4 border-t border-navy/10 dark:border-cream/10">
      <h5 className="mb-2 text-sm font-medium text-navy dark:text-cream">
        {name} Breakdown
        {hasMoreTools && (
          <span className="ml-2 text-xs italic text-navy-light/80 dark:text-cream/60">
            Showing top 4 of {totalTools}
          </span>
        )}
      </h5>

      {/* Summary card */}
      <div className="p-2 mb-3 rounded-lg border bg-cream/30 dark:bg-navy-light/30 border-navy/10 dark:border-cream/10">
        <div className="flex items-center mb-1.5">
          <div
            className="w-3 h-3 rounded-full mr-1.5"
            style={{ backgroundColor: toolColors.primary }}
          ></div>
          <span className="text-xs font-medium text-navy dark:text-cream">
            {name} Summary
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-navy/70 dark:text-cream/70">
              Total Tools:
            </span>
            <span className="font-medium">{totalTools}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-navy/70 dark:text-cream/70">
              Repositories:
            </span>
            <span className="font-medium">{stats.repositories}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-navy/70 dark:text-cream/70">Commits:</span>
            <span className="font-medium">
              {stats.commits.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Individual tools grid */}
      <div className="grid grid-cols-2 gap-2">
        {topTools.map(([toolName, toolStats], index) => (
          <div
            key={toolName}
            className="p-2 rounded-lg border bg-cream/20 dark:bg-navy-light/20 border-navy/10 dark:border-cream/10"
          >
            <div className="flex items-center mb-1">
              <div
                className="mr-1 w-2 h-2 rounded-full"
                style={{
                  backgroundColor: toolColors.secondary,
                  opacity: 0.9 - index * 0.15
                }}
              ></div>
              <span className="text-xs font-medium truncate text-navy dark:text-cream">
                {toolName}
              </span>
              <span className="ml-auto text-2xs font-medium bg-cream/40 dark:bg-navy-light/40 px-1.5 py-0.5 rounded">
                {getSafePercentage(toolStats.commits, totalCommits).toFixed(0)}%
              </span>
            </div>

            {/* Tool usage bar */}
            <div className="mt-1 mb-1.5 w-full h-1.5 rounded-full bg-cream-dark/30 dark:bg-navy-dark/30 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${getSafePercentage(toolStats.commits, totalCommits)}%`,
                  backgroundColor: toolColors.accent,
                  opacity: 0.7 + 0.3 * (index === 0 ? 1 : 0) // First item is more prominent
                }}
              />
            </div>

            <div className="flex justify-between text-xs text-navy/70 dark:text-cream/70">
              <div>
                {toolStats.repositories === 0 && toolStats.commits > 0 ? (
                  <TinyRepoWarning />
                ) : (
                  <span className="font-medium">
                    {toolStats.repositories} repos
                  </span>
                )}
              </div>
              {toolStats.commits > 0 && (
                <div>
                  <span className="font-medium">
                    {toolStats.commits.toLocaleString()}
                  </span>{' '}
                  commits
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* If there are more tools, show a summary row */}
      {hasMoreTools && (
        <div className="p-2 mt-2 text-xs rounded border text-navy/70 dark:text-cream/70 bg-cream/10 dark:bg-navy-light/10 border-navy/5 dark:border-cream/5">
          <span className="font-medium">{totalTools - 4}</span> more tools
          account for
          <span className="ml-1 font-medium">
            {getSafePercentage(
              sortedTools
                .slice(4)
                .reduce((sum, [, tool]) => sum + tool.commits, 0),
              totalCommits
            ).toFixed(0)}
            %
          </span>{' '}
          of commits in this category
        </div>
      )}
    </div>
  )
}

// Update the ZeroCommitWarning to be more compact for inline display
const ZeroCommitWarning = () => (
  <span className="inline-flex items-center ml-2 text-xs text-amber-600 dark:text-amber-400">
    <svg
      className="w-3.5 h-3.5 mr-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    No commits found
  </span>
)

// The TinyRepoWarning remains the same
const TinyRepoWarning = () => (
  <span className="inline-flex items-center text-red-600 dark:text-red-400">
    <svg
      className="w-3 h-3 mr-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    Repo issue
  </span>
)

// Enhanced function to check for both error conditions
const getItemWarning = (commits: number, repositories: number) => {
  if (commits === 0 && repositories > 0) {
    return <ZeroCommitWarning />
  } else if (repositories === 0 && commits > 0) {
    return <TinyRepoWarning />
  }
  return null
}

// Add this new component after TinyRepoWarning
const RepositoryError = () => (
  <div className="p-2 mt-2 bg-red-50 rounded-md border border-red-200 dark:bg-red-900/20 dark:border-red-700/30">
    <div className="flex items-center">
      <svg
        className="w-4 h-4 mr-1.5 text-red-600 dark:text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span className="text-sm font-medium text-red-700 dark:text-red-400">
        Repository Issue Detected
      </span>
    </div>
    <p className="mt-1 text-xs text-red-600/90 dark:text-red-300/90">
      Commits were detected but couldn&apos;t be associated with any repository. This
      usually happens with generated code or when repository detection fails.
    </p>
  </div>
)

// Add a helper function to fix percentage calculation
// This ensures percentages never exceed 100% and fixes double-counting issues
const calculateSafePercentage = (
  commits: number,
  totalCommits: number
): number => {
  if (!totalCommits || totalCommits <= 0) return 0

  // Calculate raw percentage
  let percentage = (commits / totalCommits) * 100

  // Cap at 100% to prevent invalid display
  return Math.min(percentage, 100)
}

// Add a specialized percentage calculation for different category types
const calculateCategoryPercentage = (
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
  return totalCommits > 0
    ? Math.min((stat.commits / totalCommits) * 100, 100)
    : 0
}

// Add the shouldShowZeroCommitWarning helper function
const shouldShowZeroCommitWarning = (commits: number, repositories: number) => {
  return commits === 0 && repositories > 0
}

// The existing repo warning check
const shouldShowRepoWarning = (repoCount: number, commitCount: number) => {
  return repoCount === 0 && commitCount > 0
}

const GithubLanguageStats = ({ type, showBoth = false }: Props) => {
  const [stats, setStats] = useState<Record<string, DetailedStats | CSSStats>>(
    {}
  )
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

  // Calculate total commits ONCE outside the map function
  const totalCommitCount = Object.values(stats).reduce((sum, s) => {
    // For category items with subcategories, avoid double-counting
    // by using only the top-level commit count
    return sum + (s.summary?.commits || s.commits || 0)
  }, 0)

  // Process stats and group small slices into "Other"
  const processedStats = Object.entries(stats)
    .map(([name, stat]) => {
      // Use a consistent approach to get commits/repos whether from summary or direct
      const commits = stat.summary?.commits || stat.commits || 0
      const repositories = stat.summary?.repositories || stat.repositories || 0
      const bytes = stat.summary?.bytes || stat.bytes || 0

      // Base stats item that all types will have
      const baseStatsItem = {
        name,
        commits,
        repositories,
        bytes,
        // Use different percentage calculation based on type
        percentage: calculateCategoryPercentage(
          type,
          { name, commits, repositories, bytes, percentage: 0 },
          totalCommitCount,
          totalCommitCount
        )
      }

      // Pass through the detailed structure if it exists
      if (stat.summary) {
        return {
          ...baseStatsItem,
          summary: stat.summary,
          ...(stat.variants && { variants: stat.variants }),
          ...(stat.tools && { tools: stat.tools })
        }
      }

      return baseStatsItem
    })
    .sort((a, b) => b.percentage - a.percentage)

  // Only show top 4 for donut chart, group the rest into "Other"
  const topItems = processedStats.slice(0, 4)
  const smallItems = processedStats.slice(4)

  // Ensure CSS is always visible and not in "Other"
  const cssIndex = processedStats.findIndex((item) => item.name === 'CSS')
  if (cssIndex > -1) {
    // If CSS is found but would be grouped in "Other"
    if (cssIndex >= 4) {
      // Remove CSS from its current position
      const cssItem = processedStats.splice(cssIndex, 1)[0]
      // Add it to position 4 (it will be visible in the detailed list)
      processedStats.splice(3, 0, cssItem)

      // Recreate topItems and smallItems with CSS now in top items
      const topItems = processedStats.slice(0, 4)
      const smallItems = processedStats.slice(4)
    }
  }

  // Add "Other" category if there are small items
  const othersPercentage = smallItems.reduce(
    (sum, item) => sum + item.percentage,
    0
  )
  const othersCommits = smallItems.reduce((sum, item) => sum + item.commits, 0)
  const othersRepos = new Set(
    smallItems.flatMap((item) => Array(item.repositories).fill(0))
  ).size

  // Create final donut data with "Other" if needed
  const finalDonutStats: StatsItem[] =
    othersPercentage > 0
      ? [
          ...topItems,
          {
            name: 'Other',
            percentage: othersPercentage,
            commits: othersCommits,
            repositories: othersRepos,
            bytes: smallItems.reduce((sum, item) => sum + (item.bytes || 0), 0)
          }
        ]
      : topItems

  // For bar chart, show top 4 plus next 5 items individually
  const nextFiveItems = smallItems.slice(0, 5)
  const barStats = [...topItems, ...nextFiveItems]

  // Calculate total commits once for percentage calculations
  const totalCommits = processedStats.reduce(
    (sum, item) => sum + item.commits,
    0
  )

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
    'rgba(30, 136, 229, 0.95)', // blue (#1E88E5)
    'rgba(100, 181, 246, 0.95)', // blue-light (#64B5F6)
    'rgba(13, 71, 161, 0.95)', // blue-dark (#0D47A1)
    'rgba(79, 195, 247, 0.95)', // blue-accent (#4FC3F7)
    'rgba(3, 169, 244, 0.95)' // lighter blue (#03A9F4)
  ]

  const chartBorderColors = Array(5).fill(
    isDarkMode ? 'rgba(11, 14, 41, 0.7)' : 'rgba(255, 255, 255, 0.7)'
  ) // dark/light borders for better separation

  const chartData = {
    labels: finalDonutStats.map((stat) => stat.name),
    datasets: [
      {
        data: finalDonutStats.map((stat) => stat.percentage),
        backgroundColor: chartColors,
        borderColor: chartBorderColors,
        borderWidth: 3,
        hoverOffset: 15,
        hoverBorderWidth: 4,
        hoverBorderColor: 'rgba(255, 255, 255, 1)'
      }
    ]
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
        display: false
      },
      datalabels: {
        color: '#FFFFFF',
        font: {
          weight: 'bold' as 'bold',
          size: 13,
          family: "'Inter', system-ui, sans-serif"
        },
        textStrokeColor: 'rgba(0, 0, 0, 0.7)',
        textStrokeWidth: 3,
        formatter: (value: number) => {
          // Only show percentage for larger slices (>10%)
          return value > 10 ? `${value.toFixed(0)}%` : ''
        },
        align: 'center' as const,
        anchor: 'center' as const
      },
      tooltip: {
        backgroundColor: isDarkMode
          ? 'rgba(227, 222, 200, 0.95)'
          : 'rgba(26, 35, 126, 0.95)',
        titleColor: isDarkMode
          ? 'rgba(26, 35, 126, 0.9)'
          : 'rgba(227, 222, 200, 0.9)',
        bodyColor: isDarkMode
          ? 'rgba(26, 35, 126, 0.9)'
          : 'rgba(227, 222, 200, 0.9)',
        padding: 10,
        cornerRadius: 6,
        boxPadding: 5,
        titleFont: {
          family: "'Inter', system-ui, sans-serif",
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          family: "'Inter', system-ui, sans-serif",
          size: 13
        },
        callbacks: {
          label: function (context: any) {
            const stat = finalDonutStats[context.dataIndex]

            // Add different descriptions based on category type
            if (type === 'tools') {
              return [
                `${stat.percentage.toFixed(1)}% of repositories`,
                `Used in ${stat.repositories} repositories`,
                `${stat.commits} commits total`
              ]
            }

            // Original label functions for other types
            // For CSS, show the vanilla vs tailwind breakdown
            if (stat.name === 'CSS' && 'variants' in stat && stat.variants) {
              const { variants } = stat
              const vanillaCommits = variants.vanilla?.commits || 0
              const tailwindCommits = variants.tailwind?.commits || 0
              const vanillaPercentage =
                (vanillaCommits / (vanillaCommits + tailwindCommits)) * 100
              const tailwindPercentage =
                (tailwindCommits / (vanillaCommits + tailwindCommits)) * 100

              return [
                `${stat.percentage.toFixed(1)}% of all commits`,
                `Used in ${stat.repositories} repositories`,
                ``,
                `Vanilla: ${vanillaPercentage.toFixed(1)}% (${vanillaCommits} commits)`,
                `Tailwind: ${tailwindPercentage.toFixed(1)}% (${tailwindCommits} commits)`
              ]
            }

            // For tool categories, show summary of tools
            if (isToolCategory(stat)) {
              const toolCount = Object.keys(stat.tools || {}).length
              const topTools = Object.entries(stat.tools || {})
                .sort(
                  ([, a], [, b]) =>
                    b.commits - a.commits || b.repositories - a.repositories
                )
                .slice(0, 3)
                .map(([name, data]) => `${name}: ${data.commits} commits`)

              return [
                `${stat.percentage.toFixed(1)}% of all commits`,
                `Contains ${toolCount} tools across ${stat.repositories} repos`,
                ``,
                ...topTools,
                toolCount > 3 ? `+ ${toolCount - 3} more tools` : ''
              ].filter(Boolean)
            }

            // Default tooltip for other items
            return [
              `${stat.percentage.toFixed(1)}% of all commits`,
              `Used in ${stat.repositories} repositories`
            ]
          }
        }
      },
      // Add bidirectional event handling to sync donut and bars
      hover: {
        onHover: function (event: any, elements: any[]) {
          if (elements && elements.length) {
            const index = elements[0].index
            setActiveSegment(index)
          } else {
            setActiveSegment(null)
          }
        }
      }
    }
  }

  // Update for improved layout and visual hierarchy
  if (showBoth) {
    return (
      <div className="p-6 rounded-xl border shadow-sm bg-white/95 dark:bg-navy-darkest/95 border-navy/10 dark:border-cream/10">
        <h4 className="mb-6 text-lg font-medium text-center text-navy-dark dark:text-cream-dark">
          {type.charAt(0).toUpperCase() + type.slice(1)} Distribution
        </h4>

        <div className="flex flex-col gap-8">
          {/* Visual summary section - now full width at the top */}
          <div className="flex flex-col items-center">
            <h4 className="mb-3 text-sm font-medium text-center text-navy dark:text-cream">
              Visual Overview
              <span className="ml-2 text-xs italic text-navy-light/80 dark:text-cream/60">
                Top {topItems.length} + Other
              </span>
            </h4>

            {/* Center the donut in the available space */}
            <div className="w-48 h-48">
              <Doughnut
                data={chartData}
                options={donutOptions}
                ref={chartRef}
              />
            </div>

            {/* Legend below chart */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {finalDonutStats.map((stat, index) => (
                <div
                  key={stat.name}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md cursor-pointer transition-colors
                    ${
                      activeSegment === index
                        ? 'bg-cream/50 dark:bg-navy-light/50 shadow-sm'
                        : 'hover:bg-cream/40 dark:hover:bg-navy-light/30'
                    }`}
                  onMouseEnter={() => {
                    // For additional items, highlight the "Other" slice in the donut
                    const targetIndex =
                      stat.name === 'Other'
                        ? finalDonutStats.findIndex(
                            (item) => item.name === 'Other'
                          )
                        : index
                    setActiveSegment(targetIndex)

                    // Update the donut chart to highlight the segment AND show tooltip
                    if (chartRef.current) {
                      const chart = chartRef.current

                      // Manually trigger hover effect on the appropriate segment
                      chart.setActiveElements([
                        {
                          datasetIndex: 0,
                          index: targetIndex
                        }
                      ])

                      // Access the native chart object to simulate a mouse event at the segment position
                      const meta = chart.getDatasetMeta(0)
                      if (meta.data[targetIndex]) {
                        const arc = meta.data[targetIndex]

                        // Get the position of the arc to place the tooltip
                        const centerX = arc.x
                        const centerY = arc.y

                        // Show the tooltip by manually updating its position and active elements
                        chart.tooltip.setActiveElements(
                          [
                            {
                              datasetIndex: 0,
                              index: targetIndex
                            }
                          ],
                          {
                            x: centerX,
                            y: centerY
                          }
                        )
                      }

                      chart.update()
                    }
                  }}
                  onMouseLeave={() => {
                    setActiveSegment(null)

                    // Remove highlighting AND tooltip from the chart
                    if (chartRef.current) {
                      const chart = chartRef.current
                      chart.setActiveElements([])

                      // Also hide the tooltip
                      chart.tooltip.setActiveElements([], {})
                      chart.tooltip.active = false

                      chart.update()
                    }
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: chartColors[index % chartColors.length]
                    }}
                  ></span>
                  <span className="text-xs font-medium text-navy dark:text-cream">
                    {stat.name}
                  </span>
                  {stat.name === 'Other' && (
                    <span className="text-xs text-navy-light/80 dark:text-cream/60">
                      {stat.percentage.toFixed(1)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detailed breakdown section wrapped in accordion */}
          <Accordion
            type="single"
            collapsible
            defaultValue="details"
            className="dark:border-cream/10"
          >
            <AccordionItem
              value="details"
              className="border-navy/10 dark:border-cream/10"
            >
              <AccordionTrigger className="text-sm font-medium text-navy dark:text-cream py-2 [&>svg]:text-navy dark:[&>svg]:text-cream">
                Detailed Breakdown
                <span className="ml-2 text-xs italic text-navy-light/80 dark:text-cream/60">
                  Top {barStats.length} Categories
                </span>
              </AccordionTrigger>
              <AccordionContent className="dark:text-cream">
                <TooltipProvider delayDuration={100}>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mt-2">
                    {barStats.map((stat, index) => {
                      // First, let's safely get the commit and repo counts
                      const commitCount =
                        stat && stat.summary
                          ? stat.summary.commits
                          : stat.commits || 0
                      const repoCount =
                        stat && stat.summary
                          ? stat.summary.repositories
                          : stat.repositories || 0

                      // Determine if this has details and what type
                      const hasDetails = hasDetailedData(stat)
                      const isCSS = stat.name === 'CSS' && 'variants' in stat
                      const hasTool =
                        'tools' in stat &&
                        Object.keys(stat.tools || {}).length > 0

                      return (
                        <div
                          key={stat.name}
                          className={`group p-2.5 rounded-lg transition-all duration-200 
                            ${
                              activeSegment === index
                                ? 'bg-cream/50 dark:bg-navy-light/50 shadow-sm transform scale-[1.01]'
                                : 'hover:bg-cream/40 dark:hover:bg-navy-light/30 hover:shadow-sm'
                            }`}
                          onMouseEnter={() => {
                            setActiveSegment(index)
                          }}
                          onMouseLeave={() => {
                            setActiveSegment(null)
                          }}
                        >
                          <div className="flex justify-between mb-1.5 items-center">
                            {/* Category name with icon color matching the donut slice */}
                            <div className="flex items-center">
                              <span
                                className={`rounded-full mr-2 transition-all duration-200
                                  ${activeSegment === index ? 'w-3.5 h-3.5' : 'w-3 h-3'}`}
                                style={{
                                  backgroundColor:
                                    chartColors[index % chartColors.length]
                                }}
                              ></span>
                              <span
                                className={`font-code text-navy font-medium dark:text-cream ${index >= topItems.length ? 'text-sm' : ''}`}
                              >
                                {stat.name}
                                {index >= topItems.length && (
                                  <span className="ml-1.5 text-xs text-navy-light/70 dark:text-cream/60 italic normal-font">
                                    (in Other)
                                  </span>
                                )}
                              </span>
                            </div>

                            {/* Percentage with type-specific descriptor */}
                            <span
                              className={`font-semibold px-2 py-0.5 rounded text-sm ${
                                activeSegment === index
                                  ? 'bg-cream/50 dark:bg-navy-light/50 text-navy dark:text-cream'
                                  : 'text-navy-light dark:text-cream'
                              }`}
                            >
                              {`${Math.round(stat.percentage)}%`}
                              {type === 'tools' && (
                                <span className="ml-1 opacity-70 text-2xs">
                                  of repos
                                </span>
                              )}
                            </span>
                          </div>

                          {/* Bar with tooltip - enhanced for active state */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="overflow-hidden relative h-3 rounded-full transition-colors cursor-help bg-cream-dark/50 dark:bg-navy-light/40 group-hover:bg-cream-dark/70 dark:group-hover:bg-navy-light/60">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    activeSegment === index ? 'h-4 -mt-0.5' : ''
                                  }`}
                                  style={{
                                    width: `${stat.percentage}%`,
                                    backgroundColor: isCSS
                                      ? `${chartColors[4 % chartColors.length].toString()}` // Use "Other" color with opacity
                                      : chartColors[
                                          index % chartColors.length
                                        ].toString()
                                  }}
                                />
                                {/* Invisible larger hit area */}
                                <div className="absolute inset-0 -my-3" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-sm bg-navy dark:bg-cream border-navy/10 dark:border-cream/10"
                            >
                              <p className="font-medium text-cream dark:text-navy">
                                {isCSS
                                  ? `${commitCount} commits contain ${stat.name} code across ${repoCount} repos, ${formatBytes(stat.summary?.bytes || 0)} total`
                                  : hasTool
                                    ? `${commitCount} commits across ${Object.keys(stat.tools || {}).length} tools in ${repoCount} repos`
                                    : `${commitCount} commits use ${stat.name} across ${repoCount} repos`}
                              </p>
                            </TooltipContent>
                          </Tooltip>

                          {/* Add the repository error when appropriate */}
                          <div className="flex justify-between mt-1.5 text-xs text-navy/80 dark:text-cream/80">
                            <div className="flex items-center">
                              <span>{commitCount} commits</span>
                              {shouldShowZeroCommitWarning(
                                commitCount,
                                repoCount
                              ) && <ZeroCommitWarning />}
                            </div>
                            {repoCount === 0 ? (
                              <TinyRepoWarning />
                            ) : (
                              <span>{repoCount} repositories</span>
                            )}
                          </div>

                          {/* Unified approach to showing detailed breakdowns */}
                          {isCSS && 'variants' in stat && (
                            <CSSBreakdown
                              cssStats={stat as CSSStats}
                              isDarkMode={isDarkMode}
                            />
                          )}

                          {hasTool && (
                            <ToolCategoryBreakdown
                              name={stat.name}
                              stats={{
                                repositories: repoCount,
                                commits: commitCount,
                                tools: stat.tools
                              }}
                              isDarkMode={isDarkMode}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </TooltipProvider>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    )
  }

  // Add this conditional rendering for tool-specific visualization
  if (type === 'tools' && showBoth) {
    return (
      <div className="p-6 rounded-xl border shadow-sm bg-white/95 dark:bg-navy-darkest/95 border-navy/10 dark:border-cream/10">
        <h4 className="mb-6 text-lg font-medium text-center text-navy-dark dark:text-cream-dark">
          Tool Usage by Repository
        </h4>

        <div className="flex flex-col gap-8">
          {/* Tool category adoption section */}
          <div className="flex flex-col">
            <h4 className="mb-3 text-sm font-medium text-center text-navy dark:text-cream">
              Repository Adoption
              <span className="ml-2 text-xs italic text-navy-light/80 dark:text-cream/60">
                Top {topItems.length} Tools
              </span>
            </h4>

            {/* Horizontal bar chart better represents adoption rates */}
            <div className="mt-2 space-y-3">
              {topItems.map((stat, index) => (
                <div key={stat.name} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-navy dark:text-cream">
                      {stat.name}
                    </span>
                    <span className="text-xs font-medium text-navy-light dark:text-cream-light">
                      {stat.repositories} repos ({Math.round(stat.percentage)}%)
                    </span>
                  </div>

                  <div className="overflow-hidden relative h-7 rounded-md bg-cream-dark/30 dark:bg-navy-light/30 group-hover:bg-cream-dark/40 dark:group-hover:bg-navy-light/40">
                    <div
                      className="flex absolute inset-y-0 left-0 items-center px-2 text-xs font-medium text-white"
                      style={{
                        width: `${Math.max(stat.percentage, 0)}%`,
                        backgroundColor:
                          chartColors[index % chartColors.length],
                        minWidth: stat.percentage > 0 ? '40px' : '0'
                      }}
                    >
                      {stat.percentage > 15 && stat.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed breakdown section in accordion - keep this from original */}
          <Accordion
            type="single"
            collapsible
            defaultValue="details"
            className="dark:border-cream/10"
          >
            <AccordionItem
              value="details"
              className="border-navy/10 dark:border-cream/10"
            >
              <AccordionTrigger className="text-sm font-medium text-navy dark:text-cream py-2 [&>svg]:text-navy dark:[&>svg]:text-cream">
                Detailed Breakdown
                <span className="ml-2 text-xs italic text-navy-light/80 dark:text-cream/60">
                  Top {barStats.length} Categories
                </span>
              </AccordionTrigger>
              <AccordionContent className="dark:text-cream">
                <TooltipProvider delayDuration={100}>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mt-2">
                    {barStats.map((stat, index) => {
                      // First, let's safely get the commit and repo counts
                      const commitCount =
                        stat && stat.summary
                          ? stat.summary.commits
                          : stat.commits || 0
                      const repoCount =
                        stat && stat.summary
                          ? stat.summary.repositories
                          : stat.repositories || 0

                      // Determine if this has details and what type
                      const hasDetails = hasDetailedData(stat)
                      const isCSS = stat.name === 'CSS' && 'variants' in stat
                      const hasTool =
                        'tools' in stat &&
                        Object.keys(stat.tools || {}).length > 0

                      return (
                        <div
                          key={stat.name}
                          className={`group p-2.5 rounded-lg transition-all duration-200 
                            ${
                              activeSegment === index
                                ? 'bg-cream/50 dark:bg-navy-light/50 shadow-sm transform scale-[1.01]'
                                : 'hover:bg-cream/40 dark:hover:bg-navy-light/30 hover:shadow-sm'
                            }`}
                          onMouseEnter={() => {
                            setActiveSegment(index)
                          }}
                          onMouseLeave={() => {
                            setActiveSegment(null)
                          }}
                        >
                          <div className="flex justify-between mb-1.5 items-center">
                            {/* Category name with icon color matching the donut slice */}
                            <div className="flex items-center">
                              <span
                                className={`rounded-full mr-2 transition-all duration-200
                                  ${activeSegment === index ? 'w-3.5 h-3.5' : 'w-3 h-3'}`}
                                style={{
                                  backgroundColor:
                                    chartColors[index % chartColors.length]
                                }}
                              ></span>
                              <span
                                className={`font-code text-navy font-medium dark:text-cream ${index >= topItems.length ? 'text-sm' : ''}`}
                              >
                                {stat.name}
                                {index >= topItems.length && (
                                  <span className="ml-1.5 text-xs text-navy-light/70 dark:text-cream/60 italic normal-font">
                                    (in Other)
                                  </span>
                                )}
                              </span>
                            </div>

                            {/* Percentage with type-specific descriptor */}
                            <span
                              className={`font-semibold px-2 py-0.5 rounded text-sm ${
                                activeSegment === index
                                  ? 'bg-cream/50 dark:bg-navy-light/50 text-navy dark:text-cream'
                                  : 'text-navy-light dark:text-cream'
                              }`}
                            >
                              {`${Math.round(stat.percentage)}%`}
                              {type === 'tools' && (
                                <span className="ml-1 opacity-70 text-2xs">
                                  of repos
                                </span>
                              )}
                            </span>
                          </div>

                          {/* Bar with tooltip - enhanced for active state */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="overflow-hidden relative h-3 rounded-full transition-colors cursor-help bg-cream-dark/50 dark:bg-navy-light/40 group-hover:bg-cream-dark/70 dark:group-hover:bg-navy-light/60">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    activeSegment === index ? 'h-4 -mt-0.5' : ''
                                  }`}
                                  style={{
                                    width: `${stat.percentage}%`,
                                    backgroundColor: isCSS
                                      ? `${chartColors[4 % chartColors.length].toString()}` // Use "Other" color with opacity
                                      : chartColors[
                                          index % chartColors.length
                                        ].toString()
                                  }}
                                />
                                {/* Invisible larger hit area */}
                                <div className="absolute inset-0 -my-3" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-sm bg-navy dark:bg-cream border-navy/10 dark:border-cream/10"
                            >
                              <p className="font-medium text-cream dark:text-navy">
                                {isCSS
                                  ? `${commitCount} commits contain ${stat.name} code across ${repoCount} repos, ${formatBytes(stat.summary?.bytes || 0)} total`
                                  : hasTool
                                    ? `${commitCount} commits across ${Object.keys(stat.tools || {}).length} tools in ${repoCount} repos`
                                    : `${commitCount} commits use ${stat.name} across ${repoCount} repos`}
                              </p>
                            </TooltipContent>
                          </Tooltip>

                          {/* Add the repository error when appropriate */}
                          {shouldShowZeroCommitWarning(
                            commitCount,
                            repoCount
                          ) && <ZeroCommitWarning />}

                          {/* Existing additional stats section */}
                          <div className="flex justify-between mt-1 text-xs font-medium text-navy/80 dark:text-cream/80">
                            <span>{commitCount.toLocaleString()} commits</span>
                            {shouldShowRepoWarning(repoCount, commitCount) && (
                              <TinyRepoWarning />
                            )}
                          </div>

                          {/* Unified approach to showing detailed breakdowns */}
                          {isCSS && 'variants' in stat && (
                            <CSSBreakdown
                              cssStats={stat as CSSStats}
                              isDarkMode={isDarkMode}
                            />
                          )}

                          {hasTool && (
                            <ToolCategoryBreakdown
                              name={stat.name}
                              stats={{
                                repositories: repoCount,
                                commits: commitCount,
                                tools: stat.tools
                              }}
                              isDarkMode={isDarkMode}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </TooltipProvider>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
              <span className="font-code text-navy dark:text-cream">
                {stat.name}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="px-2 py-1 -my-1 rounded transition-colors cursor-help hover:bg-cream/50 dark:hover:bg-navy-light/30">
                    <span className="text-gray-dark dark:text-tan">
                      {stat.percentage.toFixed(1)}%
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="left"
                  className="bg-navy dark:bg-cream border-navy/10 dark:border-cream/10"
                >
                  <p className="font-medium text-cream dark:text-navy">
                    {`${stat.commits || 0} commits containing ${stat.name}`}
                    {stat.percentage > 100
                      ? ' (percentage exceeds 100% due to shared commits)'
                      : ` (${stat.percentage.toFixed(1)}% of total)`}
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
              <TooltipContent
                side="top"
                className="max-w-sm bg-navy dark:bg-cream border-navy/10 dark:border-cream/10"
              >
                <p className="font-medium text-cream dark:text-navy">
                  {type === 'languages'
                    ? `${stat.commits || 0} commits contain ${stat.name} code ${
                        stat.repositories === 0 && stat.commits > 0
                          ? 'with no recognized repositories'
                          : `across ${stat.repositories} repos`
                      }, ${formatBytes(stat.bytes || 0)} total`
                    : `${stat.commits || 0} commits use ${stat.name} ${
                        stat.repositories === 0 && stat.commits > 0
                          ? 'with no recognized repositories'
                          : `across ${stat.repositories} repos`
                      }`}
                  {stat.repositories === 0 &&
                    stat.commits > 0 &&
                    ' (repository detection issue)'}
                </p>
              </TooltipContent>
            </Tooltip>

            {/* Display commits and repository information */}
            <div className="flex justify-between mt-1.5 text-xs text-navy/80 dark:text-cream/80">
              <span>{stat.commits || 0} commits</span>
              {shouldShowRepoWarning(stat.repositories, stat.commits) && (
                <TinyRepoWarning />
              )}
            </div>
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

// Add this helper function in your component
const getSafePercentage = (value: number, total: number): number => {
  if (!total || isNaN(total) || total === 0) return 0
  if (!value || isNaN(value)) return 0
  return (value / total) * 100
}

export default GithubLanguageStats
