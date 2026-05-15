import { aboutMeConfig } from '@/config/aboutMe'
import type { AboutMeManifest, AboutMeResponse } from '@/types/documents'
import { aboutMeManifestSchema, aboutMeResponseSchema } from '@/types/documents'

const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000
}

const apiCache = new Map<
  string,
  { data: unknown; timestamp: number; ttl: number }
>()

function getCachedResponse<T>(key: string): T | null {
  const cached = apiCache.get(key)
  if (!cached) return null
  if (Date.now() > cached.timestamp + cached.ttl) {
    apiCache.delete(key)
    return null
  }
  return cached.data as T
}

function setCachedResponse<T>(key: string, data: T, ttlMs: number) {
  apiCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs
  })
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<Response> {
  try {
    const response = await fetch(url, options)
    if (response.status === 429 && retryCount < RETRY_CONFIG.maxRetries) {
      const retryAfter = response.headers.get('retry-after')
      const delay = retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : Math.min(
            RETRY_CONFIG.baseDelay * Math.pow(2, retryCount),
            RETRY_CONFIG.maxDelay
          )
      await sleep(delay)
      return fetchWithRetry(url, options, retryCount + 1)
    }

    if (!response.ok && retryCount < RETRY_CONFIG.maxRetries) {
      const delay = Math.min(
        RETRY_CONFIG.baseDelay * Math.pow(2, retryCount),
        RETRY_CONFIG.maxDelay
      )
      await sleep(delay)
      return fetchWithRetry(url, options, retryCount + 1)
    }

    return response
  } catch (error) {
    if (retryCount < RETRY_CONFIG.maxRetries) {
      const delay = Math.min(
        RETRY_CONFIG.baseDelay * Math.pow(2, retryCount),
        RETRY_CONFIG.maxDelay
      )
      await sleep(delay)
      return fetchWithRetry(url, options, retryCount + 1)
    }
    throw error
  }
}

function documentsBaseUrl() {
  return aboutMeConfig.documentsBaseUrl.replace(/\/+$/, '')
}

function manifestUrl() {
  const manifestPath = aboutMeConfig.manifestPath.replace(/^\/+/, '')
  return `${documentsBaseUrl()}/${manifestPath}`
}

function resolveDocumentUrl(path: string) {
  return new URL(path, `${documentsBaseUrl()}/`).toString()
}

async function fetchManifest(): Promise<AboutMeManifest> {
  const response = await fetchWithRetry(manifestUrl(), {
    headers: { Accept: 'application/json' }
  })

  if (!response.ok) {
    throw new Error(
      'Failed to fetch the About-Me documents manifest. Please check back later.'
    )
  }

  const parsed = aboutMeManifestSchema.safeParse(await response.json())
  if (!parsed.success) {
    throw new Error(
      'Invalid About-Me documents manifest. Data format may have changed.'
    )
  }

  return parsed.data
}

export async function fetchAboutMeDocuments(): Promise<AboutMeResponse> {
  const cacheKey = 'about-me-documents'
  const cached = getCachedResponse<AboutMeResponse>(cacheKey)
  if (cached) return cached

  const manifest = await fetchManifest()
  const documents = manifest.documents.map((document) => ({
    ...document,
    pdfUrl: resolveDocumentUrl(document.pdf),
    htmlUrl: resolveDocumentUrl(document.html)
  }))
  const parsed = aboutMeResponseSchema.safeParse({
    version: manifest.version,
    generatedAt: manifest.generatedAt,
    sourceUrl: manifestUrl(),
    documents
  })

  if (!parsed.success) {
    throw new Error('Invalid About-Me document links. Please check back later.')
  }

  setCachedResponse(cacheKey, parsed.data, aboutMeConfig.cacheDuration)
  return parsed.data
}

export async function validateDocumentFreshness(
  generatedAt: string
): Promise<boolean> {
  try {
    const documents = await fetchAboutMeDocuments()
    return documents.generatedAt === generatedAt
  } catch (error) {
    console.warn('Failed to validate document freshness:', error)
    return false
  }
}

export function clearDocumentCache() {
  apiCache.clear()
  console.log('Document cache cleared')
}
