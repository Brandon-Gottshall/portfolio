import {
  Chart as ChartJS,
  ChartType,
  ChartData,
  ChartOptions,
  Point
} from 'chart.js'

declare module 'chart.js' {
  interface ChartConstructor {
    new (
      ctx: string | CanvasRenderingContext2D | HTMLCanvasElement,
      config: {
        type: ChartType
        data: ChartData
        options?: ChartOptions
      }
    ): ChartInstance
  }

  const Chart: ChartConstructor & {
    register: (...items: unknown[]) => void
    [key: string]: unknown
  }

  interface TooltipModel<TType extends ChartType = ChartType> {
    setActiveElements(
      elements: Array<{ datasetIndex: number; index: number }>,
      eventPosition: { x: number; y: number }
    ): void
    active: boolean
  }

  interface ChartMeta<TType extends ChartType = ChartType> {
    data: Array<{
      x?: number
      y?: number
    }>
  }

  interface ChartEventHandlers {
    onSegmentHover?: (index: number | null) => void
    onSegmentLeave?: () => void
    onLegendHover?: (index: number) => void
    onLegendLeave?: () => void
  }

  interface ChartConfig<TType extends ChartType = ChartType> {
    data: ChartData<TType>
    options: ChartOptions<TType>
    eventHandlers?: ChartEventHandlers
    isDarkMode?: boolean
  }

  interface ChartInstance<TType extends ChartType = ChartType>
    extends ChartJS<TType> {
    tooltip?: TooltipModel<TType>
    getDatasetMeta(index: number): ChartMeta<TType>
    setActiveElements(
      elements: Array<{ datasetIndex: number; index: number }>
    ): void
    update(
      mode?:
        | 'none'
        | 'normal'
        | 'reset'
        | 'resize'
        | 'show'
        | 'hide'
        | 'active'
        | 'inactive'
    ): void
  }
}

// Export specific types for Doughnut charts
export type DoughnutChartInstance = ChartInstance<'doughnut'>
export type DoughnutChartConfig = ChartConfig<'doughnut'>
export type DoughnutEventHandlers = ChartEventHandlers
