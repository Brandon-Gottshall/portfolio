'use client'

import { AnimatedSection } from '@/components/AnimatedSection'
import Link from 'next/link'
import {
  FileText,
  Github,
  Linkedin,
  Mail,
  RefreshCw,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react'
import { SOCIAL_LINKS } from '@/config/social'
import { useAboutMeDocuments } from '@/hooks/useAboutMeDocuments'
import { useState } from 'react'

function getCacheAge(timestamp: string): string {
  const age = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(age / (1000 * 60))
  const hours = Math.floor(age / (1000 * 60 * 60))

  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

function getCacheStatus(data: unknown, error: unknown, isLoading: boolean) {
  if (isLoading)
    return {
      type: 'loading',
      message: 'Loading resume data...',
      icon: RefreshCw
    }

  // Enhanced error handling for different failure modes
  if (error) {
    const errorMessage = (error as Error).message || (error as Error).toString()

    // Rate limiting error
    if (errorMessage.includes('rate limit')) {
      return {
        type: 'rate-limited',
        message: (data as any)
          ? 'GitHub API temporarily unavailable, using cached data'
          : 'GitHub API rate limited, using offline data',
        icon: Clock
      }
    }

    // Network/connection error
    if (
      errorMessage.includes('network') ||
      errorMessage.includes('fetch') ||
      errorMessage.includes('connection')
    ) {
      return {
        type: 'network-error',
        message: (data as any)
          ? 'Connection issues detected, showing cached resume'
          : 'Connection issues, using offline data',
        icon: WifiOff
      }
    }

    // Complete failure
    return {
      type: 'offline',
      message: (data as any)
        ? 'Using cached resume data'
        : 'Using offline resume data',
      icon: WifiOff
    }
  }

  // Enhanced cache detection
  if (data) {
    // Check for fallback data indicators
    const isFallback =
      (data as any).repoCommitHash === 'fallback-commit' ||
      (data as any).documents?.some((doc: { url?: string }) =>
        doc.url?.includes('static-fallback')
      )

    if (isFallback) {
      return {
        type: 'fallback',
        message: 'Using backup resume data',
        icon: Clock
      }
    }

    // Check if data is from localStorage cache (enhanced SWR hook behavior)
    const cacheAge = (data as any).lastUpdated
      ? Date.now() - new Date((data as any).lastUpdated).getTime()
      : 0
    const isFromCache = cacheAge > 60000 // More than 1 minute old suggests cache

    if (isFromCache) {
      const ageMinutes = Math.floor(cacheAge / (1000 * 60))
      return {
        type: 'cached',
        message: `Data cached ${ageMinutes}m ago`,
        icon: Clock
      }
    }
  }

  return { type: 'fresh', message: 'Resume data is up to date', icon: Wifi }
}

export function ResumeContent() {
  const { data, error, isLoading, mutate } = useAboutMeDocuments()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const cacheStatus = getCacheStatus(data, error, isLoading)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await mutate()
    } finally {
      setIsRefreshing(false)
    }
  }

  if (error && !data) {
    return (
      <div className='container mx-auto px-4 py-16'>
        <h1 className='text-4xl font-light mb-8'>Resume</h1>
        <div className='p-6 rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'>
          <div className='flex items-center gap-3 mb-4'>
            <WifiOff className='w-5 h-5 text-red-600' />
            <h3 className='text-lg font-medium text-red-800 dark:text-red-200'>
              Connection Error
            </h3>
          </div>
          <p className='text-red-700 dark:text-red-300 mb-4'>
            Unable to load resume data. Please check your connection and try
            again.
          </p>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className='inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50'
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            {isRefreshing ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </div>
    )
  }

  if (!data || (data as any).documents.length === 0) {
    return (
      <div className='container mx-auto px-4 py-16'>
        <div className='mx-auto max-w-4xl rounded-3xl border border-navy/10 bg-white/70 p-8 dark:border-cream/10 dark:bg-navy-light/20 md:p-12'>
          <p className='font-code text-sm font-semibold uppercase tracking-[0.24em] text-red-500'>
            Resume pipeline
          </p>
          <h1 className='mt-3 text-4xl font-light tracking-tight text-navy dark:text-cream'>
            Resume documents are being regenerated from About-Me.
          </h1>
          <p className='mt-5 text-lg leading-8 text-gray-dark dark:text-tan'>
            The live document endpoint is not publishing downloadable artifacts
            yet. The adjacent About-Me system is the source of truth for the
            resume, CV, cover-letter, and portfolio-export pipeline while this
            portfolio integration is being cleaned up.
          </p>

          <div className='mt-8 grid gap-4 md:grid-cols-3'>
            <div className='rounded-2xl border border-navy/10 bg-cream/50 p-4 dark:border-cream/10 dark:bg-navy/40'>
              <h2 className='font-code text-sm font-semibold uppercase tracking-[0.18em] text-red-500'>
                Current signal
              </h2>
              <p className='mt-2 text-sm leading-6 text-gray-dark dark:text-tan'>
                Portfolio, project chronology, and About-Me show the active
                product/document direction.
              </p>
            </div>
            <div className='rounded-2xl border border-navy/10 bg-cream/50 p-4 dark:border-cream/10 dark:bg-navy/40'>
              <h2 className='font-code text-sm font-semibold uppercase tracking-[0.18em] text-red-500'>
                Next artifact
              </h2>
              <p className='mt-2 text-sm leading-6 text-gray-dark dark:text-tan'>
                Resume downloads will land here once the generator publishes a
                stable current version.
              </p>
            </div>
            <div className='rounded-2xl border border-navy/10 bg-cream/50 p-4 dark:border-cream/10 dark:bg-navy/40'>
              <h2 className='font-code text-sm font-semibold uppercase tracking-[0.18em] text-red-500'>
                Hiring path
              </h2>
              <p className='mt-2 text-sm leading-6 text-gray-dark dark:text-tan'>
                Use the contact page for the current resume while the automated
                document feed is staged.
              </p>
            </div>
          </div>

          <div className='mt-8 flex flex-wrap gap-3'>
            <Link
              href='/contact'
              className='rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue dark:bg-cream dark:text-navy dark:hover:bg-blue dark:hover:text-white'
            >
              Contact Brandon
            </Link>
            <a
              href='https://github.com/Brandon-Gottshall/About-Me'
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full border border-navy/10 px-5 py-3 text-sm font-semibold text-navy transition hover:border-blue hover:text-blue dark:border-cream/20 dark:text-cream dark:hover:border-blue dark:hover:text-blue'
            >
              View About-Me pipeline
            </a>
          </div>
        </div>
      </div>
    )
  }

  const StatusIcon = cacheStatus.icon

  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-4xl font-light'>Resume</h1>

        {/* Cache Status Indicator */}
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm'>
            <StatusIcon
              className={`w-4 h-4 ${
                cacheStatus.type === 'fresh'
                  ? 'text-green-600'
                  : cacheStatus.type === 'offline'
                    ? 'text-red-600'
                    : cacheStatus.type === 'network-error'
                      ? 'text-red-600'
                      : cacheStatus.type === 'rate-limited'
                        ? 'text-orange-600'
                        : cacheStatus.type === 'fallback'
                          ? 'text-yellow-600'
                          : cacheStatus.type === 'cached'
                            ? 'text-blue-600'
                            : 'text-gray-600'
              } ${isLoading ? 'animate-spin' : ''}`}
            />
            <span className='text-gray-700 dark:text-gray-300'>
              {cacheStatus.message}
            </span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors'
            title='Refresh resume data'
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-600 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>

      <AnimatedSection>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-12'>
            <h2 className='text-2xl font-light mb-4'>Professional Summary</h2>
            <p className='text-gray mb-4'>
              Experienced Software Engineer specializing in modern web
              technologies and full-stack development.
            </p>
          </div>

          <div className='mb-12'>
            <h2 className='text-2xl font-light mb-4'>Experience</h2>
            <div className='space-y-8'>
              <div className='p-6 rounded-xl border border-navy/10 transition-shadow hover:shadow-md'>
                <h3 className='text-xl mb-2'>Coming Soon</h3>
                <p className='text-gray'>
                  Professional experience details will be available shortly.
                </p>
              </div>
            </div>
          </div>

          <div className='mb-12'>
            <h2 className='text-2xl font-light mb-4'>Education</h2>
            <div className='p-6 rounded-xl border border-navy/10 transition-shadow hover:shadow-md'>
              <h3 className='text-xl mb-2'>Coming Soon</h3>
              <p className='text-gray'>
                Education details will be available shortly.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.3}>
        <div className='mb-12'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-2xl font-light'>Download Documents</h2>
            {(data as any).lastUpdated && (
              <span className='text-sm text-gray-500'>
                Updated {getCacheAge((data as any).lastUpdated)}
              </span>
            )}
          </div>
          <div className='grid gap-4 md:grid-cols-3'>
            {(data as any).documents.map(
              (doc: {
                type: string
                url: string
                lastModified: string
                size: number
              }) => (
                <a
                  key={doc.type}
                  href={doc.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='p-4 rounded-xl border border-navy/10 transition-all hover:shadow-md hover:border-navy/20 flex flex-col items-center text-center group'
                >
                  <FileText className='w-8 h-8 mb-2 text-navy group-hover:text-blue-600 transition-colors' />
                  <h3 className='text-lg font-medium capitalize mb-1'>
                    {doc.type.replace('-', ' ')}
                  </h3>
                  <p className='text-sm text-gray mb-1'>
                    Last updated:{' '}
                    {new Date(doc.lastModified).toLocaleDateString()}
                  </p>
                  <p className='text-sm text-gray'>
                    Size: {(doc.size / 1024).toFixed(1)} KB
                  </p>
                </a>
              )
            )}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.6}>
        <div className='mt-12 text-center'>
          <h2 className='text-2xl font-light mb-4'>Connect with Me</h2>
          <div className='flex justify-center gap-6'>
            <a
              href={SOCIAL_LINKS.LINKEDIN}
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray hover:text-navy transition-colors'
              aria-label='Visit my LinkedIn profile'
            >
              <Linkedin size={24} />
            </a>
            <a
              href={SOCIAL_LINKS.GITHUB}
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray hover:text-navy transition-colors'
              aria-label='View my GitHub repositories'
            >
              <Github size={24} />
            </a>
            <a
              href={SOCIAL_LINKS.EMAIL}
              className='text-gray hover:text-navy transition-colors'
              aria-label='Send me an email'
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
