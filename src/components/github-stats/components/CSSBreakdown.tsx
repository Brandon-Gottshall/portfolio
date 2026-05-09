import React from 'react'
import { formatBytes } from '../utils/formatters'

import type { CSSStats } from '../types/stats'
import type { JSX } from 'react'

interface CSSBreakdownProps {
  cssStats: CSSStats
  isDarkMode: boolean
}

function calculateFileTypePercentage (fileCount: number, totalFiles: number): number {
  return (fileCount / totalFiles) * 100
}

interface FileTypeBarProps {
  fileTypes: CSSStats['variants']['tailwind']['file_types'] & CSSStats['variants']['vanilla']['file_types']
  cssColors: Record<string, string>
}

function FileTypeBar ({ fileTypes, cssColors }: FileTypeBarProps): JSX.Element {
  const totalFiles = Object.values(fileTypes).reduce((sum, type) => sum + type.files, 0)

  return (
    <div className='overflow-hidden h-6 rounded-md bg-cream-dark/50 dark:bg-navy-light/40'>
      {Object.entries(fileTypes).map(([type, data]) => (
        data.files > 0 && (
          <div
            key={type}
            className='float-left h-3'
            style={{
              width: `${calculateFileTypePercentage(data.files, totalFiles)}%`,
              backgroundColor: cssColors[type.includes('tailwind') ? 'tailwind' : 'vanilla'],
              opacity: type.includes('jsx_tsx') ? 0.8 : type.includes('html') ? 0.6 : 1
            }}
          />
        )
      ))}
    </div>
  )
}

interface LegendItemProps {
  type: string
  data: { files: number }
  cssColors: Record<string, string>
}

function getFileTypeLabel (type: string): string {
  if (type.includes('jsx_tsx')) return 'in JSX/TSX'
  if (type.includes('html')) return 'in HTML'
  return 'CSS'
}

function getOpacity (type: string): number {
  if (type.includes('jsx_tsx')) return 0.8
  if (type.includes('html')) return 0.6
  return 1
}

function LegendItem ({ type, data, cssColors }: LegendItemProps): JSX.Element | null {
  if (data.files === 0) return null

  const isTailwind = type.includes('tailwind')
  const variant = isTailwind ? 'Tailwind' : 'Vanilla'

  return (
    <div className='flex items-center'>
      <div
        className='mr-1 w-2 h-2 rounded-sm'
        style={{
          backgroundColor: cssColors[isTailwind ? 'tailwind' : 'vanilla'],
          opacity: getOpacity(type)
        }}
      />
      <span className='text-xs text-navy/80 dark:text-cream/80'>
        {variant} {getFileTypeLabel(type)}: {data.files} files
      </span>
    </div>
  )
}

export function CSSBreakdown ({
  cssStats
}: CSSBreakdownProps): JSX.Element {
  const { variants } = cssStats
  const { vanilla, tailwind } = variants

  const cssColors = {
    vanilla: 'rgba(13, 71, 161, 0.95)',
    tailwind: 'rgba(79, 195, 247, 0.95)'
  }

  const allFileTypes = {
    ...tailwind.file_types,
    ...vanilla.file_types
  }

  return (
    <div className='pt-2 mt-4 border-t border-navy/10 dark:border-cream/10'>
      <h5 className='mb-2 text-sm font-medium text-navy dark:text-cream'>
        CSS Usage Breakdown
      </h5>

      <div className='grid grid-cols-2 gap-3 mb-3'>
        {/* Vanilla CSS card */}
        <div className='p-2 rounded-lg border bg-cream/30 dark:bg-navy-light/30 border-navy/10 dark:border-cream/10'>
          <div className='flex items-center mb-1.5'>
            <div
              className='w-3 h-3 rounded-full mr-1.5'
              style={{ backgroundColor: cssColors.vanilla }}
            />
            <span className='text-xs font-medium text-navy dark:text-cream'>
              Vanilla CSS
            </span>
          </div>
          <div className='space-y-1'>
            <div className='flex justify-between text-xs'>
              <span className='text-navy/70 dark:text-cream/70'>Commits:</span>
              <span className='font-medium'>
                {vanilla.commits.toLocaleString()} (
                {vanilla.percentage_of_css.toFixed(1)}%)
              </span>
            </div>
            <div className='flex justify-between text-xs'>
              <span className='text-navy/70 dark:text-cream/70'>Repos:</span>
              <span className='font-medium'>{vanilla.repositories}</span>
            </div>
            <div className='flex justify-between text-xs'>
              <span className='text-navy/70 dark:text-cream/70'>Size:</span>
              <span className='font-medium'>{formatBytes(vanilla.bytes)}</span>
            </div>
          </div>
        </div>

        {/* Tailwind CSS card */}
        <div className='p-2 rounded-lg border bg-cream/30 dark:bg-navy-light/30 border-navy/10 dark:border-cream/10'>
          <div className='flex items-center mb-1.5'>
            <div
              className='w-3 h-3 rounded-full mr-1.5'
              style={{ backgroundColor: cssColors.tailwind }}
            />
            <span className='text-xs font-medium text-navy dark:text-cream'>
              Tailwind CSS
            </span>
          </div>
          <div className='space-y-1'>
            <div className='flex justify-between text-xs'>
              <span className='text-navy/70 dark:text-cream/70'>Commits:</span>
              <span className='font-medium'>
                {tailwind.commits.toLocaleString()} (
                {tailwind.percentage_of_css.toFixed(1)}%)
              </span>
            </div>
            <div className='flex justify-between text-xs'>
              <span className='text-navy/70 dark:text-cream/70'>Repos:</span>
              <span className='font-medium'>{tailwind.repositories}</span>
            </div>
            <div className='flex justify-between text-xs'>
              <span className='text-navy/70 dark:text-cream/70'>Size:</span>
              <span className='font-medium'>{formatBytes(tailwind.bytes)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* File type breakdown */}
      <div className='mb-3'>
        <h6 className='text-xs font-medium mb-1.5 text-navy/80 dark:text-cream/80'>
          File Type Distribution
        </h6>
        <FileTypeBar fileTypes={allFileTypes} cssColors={cssColors} />

        {/* Legend for file types */}
        <div className='flex flex-wrap gap-y-1 gap-x-4 mt-2'>
          {Object.entries(allFileTypes).map(([type, data]) => (
            <LegendItem key={type} type={type} data={data} cssColors={cssColors} />
          ))}
        </div>
      </div>

      {/* Key metrics in a condensed format */}
      <div className='grid grid-cols-2 gap-2 text-xs text-navy/70 dark:text-cream/70'>
        <div className='flex justify-between'>
          <span>Component files:</span>
          <span className='font-medium'>
            {tailwind.file_types.jsx_tsx.files + tailwind.file_types.html.files}
          </span>
        </div>
        <div className='flex justify-between'>
          <span>Total CSS files:</span>
          <span className='font-medium'>
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
