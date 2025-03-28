import type { Project } from '@/payload/payload-types'

const PAYLOAD_API_URL =
  process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function getAllProjects(): Promise<Project[]> {
  try {
    const response = await fetch(
      `${PAYLOAD_API_URL}/api/projects?limit=100&depth=1`,
      {
        next: { tags: ['projects'] }
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
  try {
    const response = await fetch(
      `${PAYLOAD_API_URL}/api/projects?where[slug][equals]=${slug}&limit=1&depth=2`,
      {
        next: { tags: [`project_${slug}`] }
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
