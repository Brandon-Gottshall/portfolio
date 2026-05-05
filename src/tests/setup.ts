import { vi, beforeEach } from 'vitest'

// Mock environment variables for tests
vi.stubEnv('NODE_ENV', 'test')
vi.stubEnv('NEXT_PUBLIC_DISABLE_PAYLOAD', 'true')

// Mock fetch for GitHub API calls
global.fetch = vi.fn()

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks()
})
