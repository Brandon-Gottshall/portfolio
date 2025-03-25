import { formatBytes } from './formatters'

interface StatItem {
  name: string
  percentage: number
  commits?: number
  repositories: number
  bytes?: number
  tools?: Record<string, { commits: number; repositories: number }>
}

function generateToolCategoryLabels(stat: StatItem): string[] {
  const toolCount = Object.keys(stat.tools || {}).length
  const topTools = Object.entries(stat.tools || {})
    .sort(([, a], [, b]) => b.commits - a.commits || b.repositories - a.repositories)
    .slice(0, 3)
    .map(([name, data]) => `${name}: ${data.commits} commits`)

  return [
    `${stat.percentage.toFixed(1)}% of all commits`,
    `Contains ${toolCount} tools across ${stat.repositories} repos`,
    '',
    ...topTools,
    toolCount > 3 ? `+ ${toolCount - 3} more tools` : ''
  ].filter(Boolean)
}

function generateToolLabels(stat: StatItem): string[] {
  return [
    `${stat.percentage.toFixed(1)}% of repositories`,
    `Used in ${stat.repositories} repositories`,
    stat.commits ? `${stat.commits} commits total` : ''
  ].filter(Boolean)
}

function generateDefaultLabels(stat: StatItem): string[] {
  return [
    `${stat.percentage.toFixed(1)}% of all commits`,
    `Used in ${stat.repositories} repositories`,
    stat.bytes ? `Size: ${formatBytes(stat.bytes)}` : ''
  ].filter(Boolean)
}

export function getTooltipConfig(
  isDarkMode: boolean,
  type: 'languages' | 'frameworks' | 'tools'
) {
  return {
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
      label: function (context: { dataIndex: number }, data: StatItem[]) {
        const stat = data[context.dataIndex]
        if (isToolCategory(stat)) return generateToolCategoryLabels(stat)
        if (type === 'tools') return generateToolLabels(stat)
        return generateDefaultLabels(stat)
      }
    }
  }
}

function isToolCategory(stat: StatItem): stat is StatItem & { tools: NonNullable<StatItem['tools']> } {
  return !!stat.tools
}
