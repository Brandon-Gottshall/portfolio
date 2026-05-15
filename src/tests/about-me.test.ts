import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearDocumentCache,
  fetchAboutMeDocuments,
  validateDocumentFreshness
} from '@/services/about-me'

describe('About-Me Integration', () => {
  const mockManifest = {
    version: 1,
    generatedAt: '2026-05-14T04:44:06.486482Z',
    documents: [
      {
        type: 'resume',
        title: 'Resume',
        summary: 'Concise professional resume for software engineering roles.',
        pdf: 'resume.pdf',
        html: 'resume.html'
      },
      {
        type: 'cv',
        title: 'CV',
        summary: 'Expanded curriculum vitae with education and credentials.',
        pdf: 'cv.pdf',
        html: 'cv.html'
      }
    ]
  }

  beforeEach(() => {
    clearDocumentCache()
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fetches public documents from the GitHub Pages manifest', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockManifest),
      headers: { get: () => null }
    } as unknown as Response)

    const result = await fetchAboutMeDocuments()

    expect(global.fetch).toHaveBeenCalledWith(
      'https://brandon-gottshall.github.io/About-Me/documents.json',
      { headers: { Accept: 'application/json' } }
    )
    expect(result).toMatchObject({
      version: 1,
      generatedAt: mockManifest.generatedAt,
      sourceUrl: 'https://brandon-gottshall.github.io/About-Me/documents.json'
    })
    expect(result.documents.map((document) => document.type)).toEqual([
      'resume',
      'cv'
    ])
    expect(result.documents[0]?.pdfUrl).toBe(
      'https://brandon-gottshall.github.io/About-Me/resume.pdf'
    )
    expect(result.documents[0]?.htmlUrl).toBe(
      'https://brandon-gottshall.github.io/About-Me/resume.html'
    )
    expect(
      result.documents.map((document) => document.type as string)
    ).not.toContain('cover-letter')
  })

  it('handles manifest fetch failures clearly', async () => {
    vi.useFakeTimers()
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 404,
      headers: { get: () => null }
    } as unknown as Response)

    const assertion = expect(fetchAboutMeDocuments()).rejects.toThrow(
      'Failed to fetch the About-Me documents manifest'
    )
    await vi.runAllTimersAsync()
    await assertion
  })

  it('validates document freshness from the manifest timestamp', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockManifest),
      headers: { get: () => null }
    } as unknown as Response)

    const isValid = await validateDocumentFreshness(mockManifest.generatedAt)
    expect(isValid).toBe(true)
  })
})
