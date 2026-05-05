import type { Payload } from 'payload'
import type { Project } from '@/types/payload-types'

// When this env var is set, we skip connecting to Payload / Postgres and return stubbed data
const DISABLE_PAYLOAD = process.env.NEXT_PUBLIC_DISABLE_PAYLOAD === 'true'

/* -------------------------------------------------------------------------
 * Stub implementation
 * -----------------------------------------------------------------------*/

// Minimal stub list for featured projects (reflecting user's real projects)
const stubProjects: Project[] = [
  {
    id: 1,
    title: 'My Portfolio',
    slug: 'my-portfolio',
    shortDescription: 'Personal site showcasing projects, resume, and contact.',
    description: {
      root: {
        type: 'root',
        children: [],
        direction: null,
        format: '',
        indent: 0,
        version: 1
      }
    } as unknown as Project['description'],
    technologies: [
      { technology: 'Next.js', id: 'next' },
      { technology: 'TypeScript', id: 'ts' },
      { technology: 'Tailwind', id: 'tw' }
    ],
    thumbnail: 0,
    featured: true,
    projectUrl: 'https://www.brandongottshall.com/Projects',
    githubUrl: null,
    status: 'completed',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Crime NY',
    slug: 'crime-ny',
    shortDescription:
      'Data exploration and visualization of New York crime trends.',
    description: {
      root: {
        type: 'root',
        children: [],
        direction: null,
        format: '',
        indent: 0,
        version: 1
      }
    } as unknown as Project['description'],
    technologies: [
      { technology: 'React', id: 'react' },
      { technology: 'D3', id: 'd3' }
    ],
    thumbnail: 0,
    featured: true,
    projectUrl: 'https://www.brandongottshall.com/Projects',
    githubUrl: null,
    status: 'completed',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Dog Park',
    slug: 'dog-park',
    shortDescription:
      'Community dog park finder with location-based discovery.',
    description: {
      root: {
        type: 'root',
        children: [],
        direction: null,
        format: '',
        indent: 0,
        version: 1
      }
    } as unknown as Project['description'],
    technologies: [
      { technology: 'Next.js', id: 'next' },
      { technology: 'Maps', id: 'maps' }
    ],
    thumbnail: 0,
    featured: true,
    projectUrl: 'https://www.brandongottshall.com/Projects',
    githubUrl: null,
    status: 'completed',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: 'IPIX COVID Tracker',
    slug: 'ipix-covid-tracker',
    shortDescription: 'COVID-19 dashboard with real-time data and insights.',
    description: {
      root: {
        type: 'root',
        children: [],
        direction: null,
        format: '',
        indent: 0,
        version: 1
      }
    } as unknown as Project['description'],
    technologies: [
      { technology: 'React', id: 'react' },
      { technology: 'Charts', id: 'charts' }
    ],
    thumbnail: 0,
    featured: true,
    projectUrl: 'https://www.brandongottshall.com/Projects',
    githubUrl: null,
    status: 'completed',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    title: 'Strategy HR',
    slug: 'strategy-hr',
    shortDescription: 'HR strategy platform with content and tooling.',
    description: {
      root: {
        type: 'root',
        children: [],
        direction: null,
        format: '',
        indent: 0,
        version: 1
      }
    } as unknown as Project['description'],
    technologies: [
      { technology: 'Next.js', id: 'next' },
      { technology: 'CMS', id: 'cms' }
    ],
    thumbnail: 0,
    featured: true,
    projectUrl: 'https://www.brandongottshall.com/Projects',
    githubUrl: null,
    status: 'completed',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    title: 'Moons Out Media (Agency)',
    slug: 'moons-out-media-agency',
    shortDescription:
      'Digital agency site and brand presence for Moons Out Media.',
    description: {
      root: {
        type: 'root',
        children: [],
        direction: null,
        format: '',
        indent: 0,
        version: 1
      }
    } as unknown as Project['description'],
    technologies: [
      { technology: 'Next.js', id: 'next' },
      { technology: 'Branding', id: 'brand' }
    ],
    thumbnail: 0,
    featured: true,
    projectUrl: 'https://moonsoutmedia.com',
    githubUrl: null,
    status: 'completed',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
]

// Very light stub of the Payload Local API used by our home page
const stubPayload = {
  async find<T = unknown>({
    collection
  }: {
    collection: string
  }): Promise<{ docs: T[] }> {
    if (collection === 'projects') {
      return { docs: stubProjects as unknown as T[] }
    }
    return { docs: [] as T[] }
  }
} as unknown as Payload

/* -------------------------------------------------------------------------
 * Real implementation (lazy-loaded) with caching
 * -----------------------------------------------------------------------*/

let cachedClient: Payload | null = null
let cachedPromise: Promise<Payload> | null = null

interface Args {
  initOptions?: Record<string, unknown>
}

export default async function getPayloadClient({
  initOptions
}: Args = {}): Promise<Payload> {
  if (DISABLE_PAYLOAD) return stubPayload

  // Dynamically import to avoid initializing when stubbed
  const [{ default: payload }, { default: configPromise }] = await Promise.all([
    import('payload'),
    import('@payload-config')
  ])

  if (cachedClient) return cachedClient

  if (!cachedPromise) {
    if (!process.env.PAYLOAD_SECRET) {
      throw new Error('PAYLOAD_SECRET environment variable is missing')
    }

    cachedPromise = payload.init({
      config: await configPromise,
      local: true,
      ...initOptions,
      secret: process.env.PAYLOAD_SECRET
    })
  }

  cachedClient = await cachedPromise
  return cachedClient
}
