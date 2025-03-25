import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'
import type {
  ChartData,
  ChartOptions,
  TooltipItem,
  Chart,
  ChartDataset
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { getTooltipConfig } from '../../utils/chart-config'

// Register required ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface BarChartProps {
  data: Array<{
    name: string
    percentage: number
    commits?: number
    repositories: number
    bytes?: number
  }>
  isDarkMode: boolean
  type: 'languages' | 'frameworks' | 'tools'
  activeSegment: number | null
  onSegmentHover: (index: number | null) => void
}

function getScalesConfig(isDarkMode: boolean) {
  return {
    x: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: isDarkMode
          ? 'rgba(227, 222, 200, 0.1)'
          : 'rgba(26, 35, 126, 0.1)'
      },
      ticks: {
        color: isDarkMode
          ? 'rgba(227, 222, 200, 0.7)'
          : 'rgba(26, 35, 126, 0.7)',
        callback: (_: unknown, index: number) => `${index}%`
      }
    },
    y: {
      grid: {
        display: false
      },
      ticks: {
        color: isDarkMode
          ? 'rgba(227, 222, 200, 0.9)'
          : 'rgba(26, 35, 126, 0.9)'
      }
    }
  }
}

function getChartOptions(
  isDarkMode: boolean,
  data: BarChartProps['data'],
  type: BarChartProps['type'],
  onSegmentHover: (index: number | null) => void
): ChartOptions<'bar'> {
  return {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: getScalesConfig(isDarkMode),
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        ...getTooltipConfig(isDarkMode, type),
        callbacks: {
          ...getTooltipConfig(isDarkMode, type).callbacks,
          label: (context: TooltipItem<'bar'>) =>
            getTooltipConfig(isDarkMode, type).callbacks.label(context, data)
        }
      }
    },
    onHover: (_: unknown, elements: { index: number }[]) => {
      if (elements && elements.length) {
        onSegmentHover(elements[0].index)
      } else {
        onSegmentHover(null)
      }
    }
  }
}

export function BarChart({
  data,
  isDarkMode,
  type,
  activeSegment,
  onSegmentHover
}: BarChartProps) {
  const chartRef = useRef<Chart<'bar'>>(null)

  const chartColors = [
    'rgba(30, 136, 229, 0.95)', // blue
    'rgba(100, 181, 246, 0.95)', // blue-light
    'rgba(13, 71, 161, 0.95)', // blue-dark
    'rgba(79, 195, 247, 0.95)', // blue-accent
    'rgba(3, 169, 244, 0.95)' // lighter blue
  ]

  const chartData: ChartData<'bar'> = {
    labels: data.map((item) => item.name),
    datasets: [{
      data: data.map((item) => item.percentage),
      backgroundColor: data.map((item, i) => 
        item.name === 'CSS' 
          ? chartColors[4 % chartColors.length]  // Use "Other" color for CSS
          : chartColors[i % chartColors.length]
      ),
      borderWidth: 0,
      borderRadius: 4
    } as ChartDataset<'bar', number[]>]
  }

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current
      chart.setActiveElements(
        activeSegment !== null
          ? [{ datasetIndex: 0, index: activeSegment }]
          : []
      )
      if (chart.tooltip) {
        chart.tooltip.active = activeSegment !== null
      }
      chart.update()
    }
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

  return (
    <div className='h-[300px] w-full'>
      <Bar
        ref={chartRef}
        data={chartData}
        options={getChartOptions(isDarkMode, data, type, onSegmentHover)}
      />
    </div>
  )
}
