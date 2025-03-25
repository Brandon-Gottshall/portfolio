import type {
  ReactNode,
  ReactElement,
  ForwardRefExoticComponent,
  RefAttributes,
  ComponentPropsWithoutRef,
  ElementRef,
  HTMLAttributes,
  ButtonHTMLAttributes,
  MouseEvent,
  RefCallback,
  RefObject,
  Ref,
  SetStateAction,
  Dispatch,
  ForwardRefRenderFunction
} from 'react'

/**
 * Type declarations for external modules without proper TypeScript support
 * These declarations provide minimal but type-safe interfaces
 */

// Sanity related modules
declare module 'sanity/cli' {
  export interface SanityCliConfig {
    api?: {
      projectId?: string
      dataset?: string
    }
    basePath?: string
    projectId?: string
    dataset?: string
    [key: string]: unknown
  }
  
  export function defineCliConfig(config: SanityCliConfig): SanityCliConfig
}

declare module 'sanity' {
  export interface Image {
    asset: {
      _ref: string
      _type: string
    }
    [key: string]: unknown
  }
  
  export interface PortableTextBlock {
    _type: string
    children: Array<{
      _type: string
      text: string
      marks?: string[]
      [key: string]: unknown
    }>
    markDefs?: Array<{
      _key: string
      _type: string
      [key: string]: unknown
    }>
    style?: string
    [key: string]: unknown
  }
  
  export interface SchemaTypeOptions {
    name: string
    title?: string
    type: string
    [key: string]: unknown
  }
  
  export function defineConfig(config: Record<string, unknown>): unknown
  export function defineField(config: SchemaTypeOptions): SchemaTypeOptions
  export function defineType(config: SchemaTypeOptions): SchemaTypeOptions
  export function defineArrayMember(config: SchemaTypeOptions): SchemaTypeOptions
  export type SchemaTypeDefinition = SchemaTypeOptions
}

declare module 'sanity/structure' {
  export interface StructureBuilderContext {
    documentId?: string
    schemaType?: string
    [key: string]: unknown
  }
  
  export type StructureResolver = (S: {
    list: () => { title: (title: string) => { items: (items: unknown[]) => unknown } }
    documentTypeListItem: (type: string) => { title: (title: string) => unknown }
    divider: () => unknown
    documentTypeListItems: () => Array<{ getId: () => string | undefined }>
  }) => unknown
  
  export function structureTool(options: { structure?: StructureResolver }): unknown
}

declare module '@sanity/vision' {
  export interface VisionToolOptions {
    defaultApiVersion?: string
    [key: string]: unknown
  }
  
  export function visionTool(options?: VisionToolOptions): unknown
}

// Next.js related modules
declare module 'next-sanity/studio' {
  export interface StudioProps {
    config: Record<string, unknown>
    [key: string]: unknown
  }
  
  export const NextStudio: (props: StudioProps) => ReactElement
  export const metadata: Record<string, unknown>
  export const viewport: Record<string, unknown>
}

declare module 'next-sanity' {
  export interface SanityClientConfig {
    projectId: string
    dataset: string
    apiVersion: string
    useCdn?: boolean
    [key: string]: unknown
  }
  
  export function createClient(config: SanityClientConfig): {
    fetch: <T = unknown>(query: string, params?: Record<string, unknown>) => Promise<T>
    [key: string]: unknown
  }
  
  export function defineLive<T>(config: Record<string, unknown>): T
}

declare module 'next-themes/dist/types' {
  import { ReactNode } from 'react'
  
  export type Attribute = string | 'class' | 'data-theme' | 'data-color-scheme'
  
  export interface ThemeProviderProps {
    attribute?: Attribute | Attribute[]
    defaultTheme?: string
    children?: ReactNode
    [key: string]: unknown
  }
}

// Fix for chart.js type imports with verbatimModuleSyntax
declare module 'chart.js' {
  export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter'
  
  export interface ChartTypeRegistry {
    bar: {
      data: unknown[]
      options: unknown
    }
    doughnut: {
      data: unknown[]
      options: unknown
    }
    [key: string]: {
      data: unknown[]
      options: unknown
    }
  }
  
  export type ChartData<T extends ChartType = ChartType> = {
    labels?: unknown[]
    datasets: {
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string | string[]
      borderWidth?: number
      hoverBackgroundColor?: string | string[]
      label?: string
      [key: string]: unknown
    }[]
    [key: string]: unknown
  }
  
  export type ChartOptions<T extends ChartType = ChartType> = {
    responsive?: boolean
    maintainAspectRatio?: boolean
    plugins?: {
      legend?: {
        display?: boolean
        position?: 'top' | 'left' | 'right' | 'bottom'
        [key: string]: unknown
      }
      tooltip?: {
        callbacks?: {
          label?: (context: TooltipItem<T>) => string | string[]
          [key: string]: unknown
        }
        [key: string]: unknown
      }
      [key: string]: unknown
    }
    [key: string]: unknown
  }
  
  export interface TooltipItem<T extends ChartType = ChartType> {
    datasetIndex: number
    index: number
    raw: unknown
    formattedValue: string
    dataset: {
      data: number[]
      label?: string
      [key: string]: unknown
    }
    [key: string]: unknown
  }
  
  export interface ChartEvent {
    type: string
    native?: Event
    x: number
    y: number
    [key: string]: unknown
  }
  
  export interface LegendElement {
    text: string
    fillStyle: string
    hidden: boolean
    index: number
    strokeStyle: string
    [key: string]: unknown
  }
  
  export interface LegendItem {
    text: string
    fillStyle: string
    hidden: boolean
    index: number
    [key: string]: unknown
  }
  
  // Chart components and plugins
  export const Chart: {
    register: (...items: unknown[]) => void
    [key: string]: unknown
  }
  export const CategoryScale: unknown
  export const LinearScale: unknown
  export const BarElement: unknown
  export const Tooltip: unknown
  export const Legend: unknown
  export const ArcElement: unknown
}

// Fix for React type imports with verbatimModuleSyntax
declare module 'react' {
  import type {
    ReactNode,
    ReactElement,
    ForwardRefExoticComponent,
    RefAttributes,
    ComponentPropsWithoutRef,
    ElementRef,
    HTMLAttributes,
    ButtonHTMLAttributes,
    MouseEvent,
    RefCallback,
    RefObject,
    Ref,
    SetStateAction,
    Dispatch,
    ForwardRefRenderFunction
  } from 'react'

  // Extend ForwardRefExoticComponent to include displayName
  interface ForwardRefExoticComponent<P> extends React.FunctionComponent<P> {
    displayName?: string
    defaultProps?: Partial<P>
    propTypes?: unknown
  }

  // Ensure ReactElement is properly typed
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T
    props: P
    key: string | null
  }

  // Update JSX namespace
  namespace JSX {
    interface Element extends ReactElement<any, any> { }
    
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode
    }

    interface ElementAttributesProperty {
      props: {}
    }

    interface ElementChildrenAttribute {
      children: {}
    }

    interface IntrinsicAttributes {
      key?: string | number
    }

    interface IntrinsicElements {
      [elemName: string]: any
    }
  }

  // Ensure forwardRef is properly typed
  export function forwardRef<T, P = {}>(
    render: ForwardRefRenderFunction<T, P>
  ): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>

  // React 19 hooks and types
  export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>]
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void
  export function useRef<T>(initialValue: T | null): { current: T | null }
  export function useMemo<T>(factory: () => T, deps: unknown[]): T
  
  export type ForwardedRef<T> = Ref<T>
  
  export type RefCallback<T> = (instance: T | null) => void
  export type RefObject<T> = { current: T | null }
  export type Ref<T> = RefCallback<T> | RefObject<T> | null
  
  export type SetStateAction<S> = S | ((prevState: S) => S)
  export type Dispatch<A> = (value: A) => void
  
  export type ForwardedRef<T> = Ref<T>
  
  export type ElementRef<T> = T extends React.ForwardRefExoticComponent<infer P> ? P extends { ref?: infer R } ? R : never : never
  export type ComponentPropsWithoutRef<T> = T extends React.ComponentType<infer P> ? P : Record<string, unknown>
  
  export interface HTMLAttributes<T> {
    className?: string
    style?: Record<string, unknown>
    [key: string]: unknown
  }
  
  export interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    [key: string]: unknown
  }
  
  export interface MouseEvent<T> {
    target: T
    currentTarget: T
    preventDefault(): void
    stopPropagation(): void
    [key: string]: unknown
  }
}

// UI component paths
declare module '../../../components/ui/card' {
  export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode
  }
  
  export const Card: ForwardRefExoticComponent<CardProps & RefAttributes<HTMLDivElement>>
  export const CardContent: ForwardRefExoticComponent<CardProps & RefAttributes<HTMLDivElement>>
  export const CardHeader: ForwardRefExoticComponent<CardProps & RefAttributes<HTMLDivElement>>
  export const CardFooter: ForwardRefExoticComponent<CardProps & RefAttributes<HTMLDivElement>>
  export const CardTitle: ForwardRefExoticComponent<CardProps & RefAttributes<HTMLDivElement>>
  export const CardDescription: ForwardRefExoticComponent<CardProps & RefAttributes<HTMLDivElement>>
}

declare module '../../../components/ui/badge' {
  export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
    children?: ReactNode
  }
  
  export const Badge: ForwardRefExoticComponent<BadgeProps & RefAttributes<HTMLDivElement>>
  export function badgeVariants(options: { variant?: BadgeProps['variant'] }): string
}

declare module '../../../components/ui/button' {
  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    asChild?: boolean
    children?: ReactNode
  }
  
  export const Button: ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>>
}

// GitHub stats types
declare module '../types/stats' {
  export interface ProcessedStat {
    name: string
    percentage: number
    commits?: number
    repositories: number
    bytes?: number
    tools?: Record<string, { repositories: number; commits: number }>
    variants?: Record<string, unknown>
    summary?: {
      repositories?: number
      commits?: number
      bytes?: number
    }
    [key: string]: unknown
  }
}

// Additional GitHub stats interfaces for type checking
interface DetailedStats {
  repositories?: number
  commits?: number
  bytes?: number
  tools?: Record<string, { repositories: number; commits: number }>
  variants?: Record<string, unknown>
  summary?: {
    repositories?: number
    commits?: number
    bytes?: number
  }
}

interface CSSStats {
  repositories?: number
  commits?: number
  bytes?: number
  tools?: Record<string, { repositories: number; commits: number }>
  variants?: Record<string, {
    file_types?: Record<string, {
      repositories: number
      commits: number
      bytes: number
    }>
    [key: string]: unknown
  }>
  summary?: {
    repositories?: number
    commits?: number
    bytes?: number
  }
}

interface CachedStats {
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
  tools: Record<string, DetailedStats>
  found_emails: string[]
} 