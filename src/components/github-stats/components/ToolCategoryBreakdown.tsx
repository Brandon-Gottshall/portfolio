import { getSafePercentage } from '../utils/formatters'

import { JSX } from 'react'

interface ToolCategoryBreakdownProps {
  name: string
  stats: {
    repositories: number
    commits: number
    tools: Record<string, { repositories: number; commits: number }>
  }
  isDarkMode: boolean
}

export function ToolCategoryBreakdown ({
  name,
  stats
}: ToolCategoryBreakdownProps): JSX.Element {
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
    <div className='pt-2 mt-4 border-t border-navy/10 dark:border-cream/10'>
      <h5 className='mb-2 text-sm font-medium text-navy dark:text-cream'>
        {name} Breakdown
        {hasMoreTools && (
          <span className='ml-2 text-xs italic text-navy-light/80 dark:text-cream/60'>
            Showing top 4 of {totalTools}
          </span>
        )}
      </h5>

      {/* Grid of tool cards */}
      <div className='grid grid-cols-2 gap-2'>
        {topTools.map(([toolName, toolStats], index) => (
          <div
            key={toolName}
            className='p-2 rounded-lg border bg-cream/20 dark:bg-navy-light/20 border-navy/10 dark:border-cream/10'
          >
            <div className='flex items-center mb-1'>
              <div
                className='mr-1 w-2 h-2 rounded-full'
                style={{
                  backgroundColor: toolColors.secondary,
                  opacity: 0.9 - index * 0.15
                }}
              />
              <span className='text-xs font-medium truncate text-navy dark:text-cream'>
                {toolName}
              </span>
              <span className='ml-auto text-2xs font-medium bg-cream/40 dark:bg-navy-light/40 px-1.5 py-0.5 rounded'>
                {getSafePercentage(toolStats.commits, totalCommits).toFixed(0)}%
              </span>
            </div>

            {/* Tool usage bar */}
            <div className='mt-1 mb-1.5 w-full h-1.5 rounded-full bg-cream-dark/30 dark:bg-navy-dark/30 overflow-hidden'>
              <div
                className='h-full rounded-full'
                style={{
                  width: `${getSafePercentage(toolStats.commits, totalCommits)}%`,
                  backgroundColor: toolColors.accent,
                  opacity: 0.7 + 0.3 * (index === 0 ? 1 : 0)
                }}
              />
            </div>

            <div className='flex justify-between text-xs text-navy/70 dark:text-cream/70'>
              <span className='font-medium'>
                {toolStats.repositories} repos
              </span>
              <span>{toolStats.commits.toLocaleString()} commits</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary for remaining tools */}
      {hasMoreTools && (
        <div className='p-2 mt-2 text-xs rounded border text-navy/70 dark:text-cream/70 bg-cream/10 dark:bg-navy-light/10 border-navy/5 dark:border-cream/5'>
          <span className='font-medium'>{totalTools - 4}</span> more tools
          account for
          <span className='ml-1 font-medium'>
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
