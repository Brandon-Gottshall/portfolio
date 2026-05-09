'use client'

import useSWR from 'swr'
import type { AboutMeResponse } from '@/types/documents'
import { fetchAboutMeDocuments } from '@/services/about-me'

const CACHE_KEY = 'about-me-documents'
const REVALIDATION_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours
const LOCAL_STORAGE_KEY = 'portfolio-about-me-cache'

function getCachedDocuments(): AboutMeResponse | undefined {
  if (typeof window === 'undefined') return undefined

  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!cached) return undefined

    const parsed = JSON.parse(cached)
    const age = Date.now() - parsed.timestamp

    // Use cached data if less than 1 hour old
    if (age < 60 * 60 * 1000) {
      return parsed.data
    }

    // Clean up expired cache
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    return undefined
  } catch (error) {
    console.warn('Failed to read cached documents:', error)
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    return undefined
  }
}

function setCachedDocuments(data: AboutMeResponse) {
  if (typeof window === 'undefined') return

  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cacheData))
  } catch (error) {
    console.warn('Failed to cache documents:', error)
  }
}

function getStaticFallback(): AboutMeResponse {
  return {
    documents: [
      {
        type: 'resume',
        url: 'https://raw.githubusercontent.com/Brandon-Gottshall/About-Me/main/output/resume.pdf',
        lastModified: new Date().toISOString(),
        contentHash: 'fallback-hash-resume',
        size: 50000 // Approximate size
      },
      {
        type: 'cv',
        url: 'https://raw.githubusercontent.com/Brandon-Gottshall/About-Me/main/output/cv.pdf',
        lastModified: new Date().toISOString(),
        contentHash: 'fallback-hash-cv',
        size: 75000 // Approximate size
      },
      {
        type: 'cover-letter',
        url: 'https://raw.githubusercontent.com/Brandon-Gottshall/About-Me/main/output/cover-letter.pdf',
        lastModified: new Date().toISOString(),
        contentHash: 'fallback-hash-cover-letter',
        size: 25000 // Approximate size
      }
    ],
    lastUpdated: new Date().toISOString(),
    repoCommitHash: 'fallback-commit'
  }
}

export function useAboutMeDocuments() {
  return useSWR<AboutMeResponse>(
    CACHE_KEY,
    async () => {
      try {
        const data = await fetchAboutMeDocuments()
        setCachedDocuments(data) // Cache successful fetches
        return data
      } catch (error) {
        console.warn('About-Me repo unavailable, using fallback:', error)
        // Try to use cached data first, then static fallback
        const cached = getCachedDocuments()
        return cached || getStaticFallback()
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: REVALIDATION_INTERVAL,
      fallbackData: getCachedDocuments(),
      onError: (error: Error) => {
        console.warn('SWR error, using fallback:', error)
        return getStaticFallback()
      }
    }
  )
}
