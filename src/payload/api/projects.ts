import type { Project } from '@/types/payload-types'

const PAYLOAD_API_URL =
  process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
const PROJECT_FETCH_TIMEOUT_MS = 5000

// Share same flag used by getPayload
const DISABLE_PAYLOAD = process.env.NEXT_PUBLIC_DISABLE_PAYLOAD === 'true'

// Keep stub list in sync with getPayload stub
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

export async function getAllProjects(): Promise<Project[]> {
  if (DISABLE_PAYLOAD) return stubProjects
  try {
    const response = await fetch(
      `${PAYLOAD_API_URL}/api/projects?limit=100&depth=1`,
      {
        next: { tags: ['projects'] },
        signal: AbortSignal.timeout(PROJECT_FETCH_TIMEOUT_MS)
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`)
    }

    const data = await response.json()
    return data.docs as Project[]
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (DISABLE_PAYLOAD) {
    return stubProjects.find((p) => p.slug === slug) || null
  }
  try {
    const response = await fetch(
      `${PAYLOAD_API_URL}/api/projects?where[slug][equals]=${slug}&limit=1&depth=2`,
      {
        next: { tags: [`project_${slug}`] },
        signal: AbortSignal.timeout(PROJECT_FETCH_TIMEOUT_MS)
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch project ${slug}: ${response.statusText}`)
    }

    const data = await response.json()
    return (data.docs?.[0] as Project) || null
  } catch (error) {
    console.error(`Error fetching project ${slug}:`, error)
    return null
  }
}
