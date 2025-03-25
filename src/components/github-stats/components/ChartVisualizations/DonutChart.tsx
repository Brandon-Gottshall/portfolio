import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartEvent,
  TooltipItem
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useRef, useEffect } from 'react'

// Register required ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

interface BaseChartData {
  name: string
  percentage: number
  commits?: number
  repositories?: number
  bytes?: number
}

interface ToolData {
  commits: number
}

interface ToolCategoryData extends BaseChartData {
  tools: Record<string, ToolData>
}

interface DonutChartProps {
  data: Array<BaseChartData | ToolCategoryData>
  isDarkMode: boolean
  type: 'languages' | 'frameworks' | 'tools'
  activeSegment: number | null
  onSegmentHover: (index: number | null) => void
}

function isToolCategory(stat: BaseChartData | ToolCategoryData): stat is ToolCategoryData {
  return (
    stat &&
    typeof stat === 'object' &&
    'tools' in stat &&
    typeof stat.tools === 'object' &&
    Object.keys(stat.tools).length > 0
  )
}

export function DonutChart({
  data,
  isDarkMode,
  type,
  activeSegment,
  onSegmentHover
}: DonutChartProps) {
  const chartRef = useRef<ChartJS<'doughnut'>>(null)

  const handleChartInteraction = (
    chart: ChartJS<'doughnut'>,
    index: number | null
  ) => {
    if (index === null) {
      chart.setActiveElements([])
      if (chart.tooltip) {
        chart.tooltip.setActiveElements([], { x: 0, y: 0 })
        chart.tooltip.active = false
      }
    } else {
      chart.setActiveElements([{ datasetIndex: 0, index }])
      const meta = chart.getDatasetMeta(0)
      if (meta.data[index] && chart.tooltip) {
        const arc = meta.data[index]
        chart.tooltip.setActiveElements(
          [{ datasetIndex: 0, index }],
          { x: arc.x, y: arc.y }
        )
        chart.tooltip.active = true
      }
    }
    chart.update()
  }

  useEffect(() => {
    if (!chartRef.current) return
    handleChartInteraction(chartRef.current, activeSegment)
  }, [activeSegment])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    const handleMouseLeave = () => {
      chart.setActiveElements([])
      if (chart.tooltip) {
        chart.tooltip.setActiveElements([], { x: 0, y: 0 })
        chart.tooltip.active = false
      }
      chart.update()
      onSegmentHover(null)
    }

    chart.canvas.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      chart.canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [onSegmentHover])

  // High-contrast, more distinct color palette
  const chartColors = [
    'rgba(30, 136, 229, 0.95)', // blue
    'rgba(100, 181, 246, 0.95)', // blue-light
    'rgba(13, 71, 161, 0.95)', // blue-dark
    'rgba(79, 195, 247, 0.95)', // blue-accent
    'rgba(3, 169, 244, 0.95)' // lighter blue
  ]

  const chartBorderColors = Array(5).fill(
    isDarkMode ? 'rgba(11, 14, 41, 0.7)' : 'rgba(255, 255, 255, 0.7)'
  )

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.percentage),
        backgroundColor: data.map((item, index) =>
          item.name === 'CSS'
            ? chartColors[4 % chartColors.length]
            : index === activeSegment
              ? chartColors[index % chartColors.length]
              : `${chartColors[index % chartColors.length].replace('0.95', '0.7')}`
        ),
        borderColor: chartBorderColors,
        borderWidth: 3,
        hoverOffset: 15,
        hoverBorderWidth: 4,
        hoverBorderColor: 'rgba(255, 255, 255, 1)'
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%',
    layout: {
      padding: 15
    },
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        color: '#FFFFFF',
        font: {
          weight: 'bold' as const,
          size: 13,
          family: "'Inter', system-ui, sans-serif"
        },
        textStrokeColor: 'rgba(0, 0, 0, 0.7)',
        textStrokeWidth: 3,
        formatter: (value: number) => {
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
          label: function (context: TooltipItem<'doughnut'>) {
            const stat = data[context.dataIndex]
            return generateTooltipLabel(stat, type)
          }
        }
      }
    },
    onHover: (event: ChartEvent, elements: { index: number }[]) => {
      if (elements && elements.length) {
        onSegmentHover(elements[0].index)
      } else {
        onSegmentHover(null)
      }
    }
  }

  return (
    <div className='w-48 h-48'>
      <Doughnut data={chartData} options={options} ref={chartRef} />
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function generateTooltipLabel(
  stat: BaseChartData | ToolCategoryData,
  type: DonutChartProps['type']
): string[] {
  if (isToolCategory(stat)) {
    return generateToolCategoryLabel(stat)
  }
  
  if (type === 'tools') {
    return [
      `${stat.percentage.toFixed(1)}% of repositories`,
      `Used in ${stat.repositories} repositories`,
      stat.commits ? `${stat.commits} commits total` : ''
    ].filter(Boolean)
  }

  return [
    `${stat.percentage.toFixed(1)}% of all commits`,
    `Used in ${stat.repositories} repositories`,
    stat.bytes ? `Size: ${formatBytes(stat.bytes)}` : ''
  ].filter((item): item is string => item !== '')
}

function generateToolCategoryLabel(stat: ToolCategoryData): string[] {
  const toolCount = Object.keys(stat.tools).length
  const topTools = Object.entries(stat.tools)
    .sort(([, a], [, b]) => b.commits - a.commits)
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
