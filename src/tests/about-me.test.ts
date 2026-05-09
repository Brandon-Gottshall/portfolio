import {
  afterEach,
  beforeEach,
  describe,
  it,
  expect,
  vi,
  type Mock
} from 'vitest'
import {
  clearDocumentCache,
  fetchAboutMeDocuments,
  validateDocumentFreshness
} from '@/services/about-me'

describe('About-Me Integration', () => {
  const fetchMock = () => global.fetch as unknown as Mock

  const mockCommitResponse = {
    sha: 'abc123def456',
    commit: {
      committer: {
        date: '2024-03-29T12:00:00Z'
      }
    }
  }

  const mockHeadResponse = {
    ok: true,
    headers: new Map([
      ['content-length', '1024'],
      ['last-modified', 'Wed, 29 Mar 2024 12:00:00 GMT'],
      ['etag', '"abc123"']
    ])
  }

  beforeEach(() => {
    clearDocumentCache()
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should fetch documents successfully', async () => {
    // Mock GitHub API responses
    fetchMock()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCommitResponse)
      })
      .mockResolvedValue({
        ...mockHeadResponse,
        headers: {
          get: (key: string) => {
            const headers: Record<string, string> = {
              'content-length': '1024',
              'last-modified': 'Wed, 29 Mar 2024 12:00:00 GMT',
              etag: '"abc123"'
            }
            return headers[key] || null
          }
        }
      })

    const result = await fetchAboutMeDocuments()

    expect(result).toMatchObject({
      documents: expect.arrayContaining([
        expect.objectContaining({
          type: 'resume',
          url: expect.stringContaining('resume.pdf'),
          size: 1024
        }),
        expect.objectContaining({
          type: 'cv',
          url: expect.stringContaining('cv.pdf'),
          size: 1024
        }),
        expect.objectContaining({
          type: 'cover-letter',
          url: expect.stringContaining('cover-letter.pdf'),
          size: 1024
        })
      ]),
      lastUpdated: '2024-03-29T12:00:00Z',
      repoCommitHash: 'abc123def456'
    })
  })

  it('should handle GitHub API errors gracefully', async () => {
    vi.useFakeTimers()
    fetchMock().mockResolvedValue({
      ok: false,
      status: 404,
      headers: {
        get: () => null
      }
    })

    const assertion = expect(fetchAboutMeDocuments()).rejects.toThrow(
      'Failed to fetch latest commit from About-Me repository'
    )
    await vi.runAllTimersAsync()
    await assertion
  })

  it('should validate document freshness correctly', async () => {
    const mockUrl = 'https://example.com/test.pdf'

    fetchMock().mockResolvedValueOnce({
      ok: true,
      headers: {
        get: (key: string) => {
          const headers: Record<string, string> = {
            'last-modified': 'Wed, 29 Mar 2024 12:00:00 GMT',
            etag: '"abc123"'
          }
          return headers[key] || null
        }
      }
    })

    // Generate expected hash for comparison
    const expectedHash = btoa('Wed, 29 Mar 2024 12:00:00 GMT"abc123"').slice(
      0,
      32
    )

    const isValid = await validateDocumentFreshness(expectedHash, mockUrl)
    expect(isValid).toBe(true)
  })
})
