import type { Project, Media } from './payload-types'

/**
 * UI-specific type for Projects that resolves Media relationships
 * and provides direct access to thumbnail URLs
 */
export type ProjectUI = Omit<Project, 'thumbnail'> & {
  thumbnail: string // Direct URL instead of Media reference
}

/**
 * Helper function to transform a Payload Project into a ProjectUI
 * by resolving the thumbnail relationship
 */
export function toProjectUI(project: Project): ProjectUI {
  const thumbnail =
    typeof project.thumbnail === 'number'
      ? '/placeholder.jpg' // Fallback if only ID is available
      : (project.thumbnail as Media)?.url || '/placeholder.jpg'

  return {
    ...project,
    thumbnail
  }
}
