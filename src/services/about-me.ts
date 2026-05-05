import type { AboutMeDocument, AboutMeResponse } from '@/types/documents'
import { aboutMeResponseSchema } from '@/types/documents'

const GITHUB_API_BASE =
  'https://api.github.com/repos/Brandon-Gottshall/About-Me'
const RAW_BASE =
  'https://raw.githubusercontent.com/Brandon-Gottshall/About-Me/main'
const DOCUMENTS = {
  resume: 'output/resume.pdf',
  cv: 'output/cv.pdf',
  'cover-letter': 'output/cover-letter.pdf'
} as const

type DocumentType = keyof typeof DOCUMENTS

// Rate limiting and retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000 // 10 seconds
}

// Simple in-memory cache for API responses
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

function setCachedResponse<T>(key: string, data: T, ttlMs: number = 300000) {
  // 5 min default
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

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after')
      const delay = retryAfter
        ? parseInt(retryAfter) * 1000
        : Math.min(
            RETRY_CONFIG.baseDelay * Math.pow(2, retryCount),
            RETRY_CONFIG.maxDelay
          )

      if (retryCount < RETRY_CONFIG.maxRetries) {
        console.warn(
          `Rate limited. Retrying after ${delay}ms (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})`
        )
        await sleep(delay)
        return fetchWithRetry(url, options, retryCount + 1)
      }
      throw new Error('GitHub API rate limit exceeded. Please try again later.')
    }

    // Handle other errors with exponential backoff
    if (!response.ok && retryCount < RETRY_CONFIG.maxRetries) {
      const delay = Math.min(
        RETRY_CONFIG.baseDelay * Math.pow(2, retryCount),
        RETRY_CONFIG.maxDelay
      )
      console.warn(
        `Request failed (${response.status}). Retrying after ${delay}ms (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})`
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
      console.warn(
        `Network error. Retrying after ${delay}ms (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})`
      )
      await sleep(delay)
      return fetchWithRetry(url, options, retryCount + 1)
    }
    throw error
  }
}

async function getLatestCommit() {
  const cacheKey = 'latest-commit'
  const cached = getCachedResponse<Record<string, any>>(cacheKey)
  if (cached) return cached

  const response = await fetchWithRetry(`${GITHUB_API_BASE}/commits/main`)
  if (!response.ok) {
    throw new Error(
      'Failed to fetch latest commit from About-Me repository. Please check back later.'
    )
  }
  const data = await response.json()
  setCachedResponse(cacheKey, data, 300000) // Cache for 5 minutes
  return data
}

async function generateDocumentHash(url: string) {
  const response = await fetchWithRetry(url, { method: 'HEAD' })
  if (!response.ok) {
    throw new Error(
      'Failed to fetch document metadata. The document may be temporarily unavailable.'
    )
  }
  const lastModified = response.headers.get('last-modified') ?? ''
  const etag = response.headers.get('etag') ?? ''
  return btoa(lastModified + etag).slice(0, 32)
}

function toIsoDate(value: string) {
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp)
    ? new Date().toISOString()
    : new Date(timestamp).toISOString()
}

async function getDocumentMetadata(
  type: DocumentType
): Promise<AboutMeDocument> {
  const cacheKey = `document-metadata-${type}`
  const cached = getCachedResponse<AboutMeDocument>(cacheKey)
  if (cached) return cached

  const url = `${RAW_BASE}/${DOCUMENTS[type]}`
  const response = await fetchWithRetry(url, { method: 'HEAD' })
  if (!response.ok) {
    throw new Error(
      `Failed to fetch metadata for ${type}. Please try again later.`
    )
  }
  const size = parseInt(response.headers.get('content-length') ?? '0', 10)
  const lastModifiedHeader = response.headers.get('last-modified')
  const lastModified = lastModifiedHeader
    ? toIsoDate(lastModifiedHeader)
    : new Date().toISOString()
  const contentHash = await generateDocumentHash(url)

  const metadata: AboutMeDocument = {
    type,
    url,
    lastModified,
    contentHash,
    size
  }
  setCachedResponse<AboutMeDocument>(cacheKey, metadata, 600000) // Cache for 10 minutes
  return metadata
}

export async function fetchAboutMeDocuments(): Promise<AboutMeResponse> {
  const cacheKey = 'about-me-documents'
  const cached = getCachedResponse<AboutMeResponse>(cacheKey)
  if (cached) return cached

  const commit = await getLatestCommit()
  const lastUpdated = commit.commit.committer.date
  const repoCommitHash = commit.sha
  const documents = await Promise.all(
    Object.keys(DOCUMENTS).map((type) =>
      getDocumentMetadata(type as DocumentType)
    )
  )
  const parsed = aboutMeResponseSchema.safeParse({
    documents,
    lastUpdated,
    repoCommitHash
  })
  if (!parsed.success) {
    throw new Error(
      'Invalid response from About-Me repository. Data format may have changed.'
    )
  }

  setCachedResponse<AboutMeResponse>(cacheKey, parsed.data, 1800000) // Cache for 30 minutes
  return parsed.data
}

export async function validateDocumentFreshness(
  hash: string,
  url: string
): Promise<boolean> {
  try {
    const currentHash = await generateDocumentHash(url)
    return currentHash === hash
  } catch (error) {
    console.warn('Failed to validate document freshness:', error)
    return false // Assume stale on error
  }
}

// Clear cache utility for webhook invalidation
export function clearDocumentCache() {
  apiCache.clear()
  console.log('Document cache cleared')
}
