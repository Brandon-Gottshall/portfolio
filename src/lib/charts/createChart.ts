import type { DoughnutChartConfig, DoughnutChartInstance, DoughnutEventHandlers } from '@/types/chart'
import { Chart as ChartJS } from 'chart.js'
import type { ChartEvent, Element, ArcElement } from 'chart.js'

function bindChartEvents(
  chart: DoughnutChartInstance,
  handlers: DoughnutEventHandlers
): void {
  const {
    onSegmentHover,
    onSegmentLeave,
    onLegendHover,
    onLegendLeave
  } = handlers

  if (onSegmentHover || onSegmentLeave) {
    chart.canvas.addEventListener('mousemove', (event: ChartEvent) => {
      const elements = chart.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        false
      )
      
      if (elements.length > 0) {
        const firstElement = elements[0]
        onSegmentHover?.(firstElement.index)
      } else {
        onSegmentLeave?.()
      }
    })

    chart.canvas.addEventListener('mouseleave', () => {
      onSegmentLeave?.()
    })
  }

  // Handle legend interactions if handlers are provided
  if (onLegendHover || onLegendLeave) {
    const meta = chart.getDatasetMeta(0)
    if (meta?.data) {
      meta.data.forEach((arc: Element<ArcElement>, index: number) => {
        const arcElement = arc as unknown as { addEventListener: (type: string, handler: () => void) => void }
        arcElement.addEventListener('mouseenter', () => {
          onLegendHover?.(index)
        })
        arcElement.addEventListener('mouseleave', () => {
          onLegendLeave?.()
        })
      })
    }
  }
}

export function createDoughnutChart(config: DoughnutChartConfig): DoughnutChartInstance {
  const { data, options, eventHandlers } = config
  
  // Create chart instance
  const chart = new ChartJS(document.createElement('canvas'), {
    type: 'doughnut',
    data,
    options: {
      ...options,
      // Ensure responsive behavior
      responsive: true,
      maintainAspectRatio: false,
      // Add any default options here
      plugins: {
        ...options.plugins,
        tooltip: {
          enabled: true,
          ...options.plugins?.tooltip
        }
      }
    }
  }) as DoughnutChartInstance

  // Bind event handlers if provided
  if (eventHandlers) {
    bindChartEvents(chart, eventHandlers)
  }

  return chart
} 