import { client } from '../lib/client'
import { type Image, type PortableTextBlock } from 'sanity'

export interface Project {
  _id: string
  title: string
  slug: string
  shortDescription: string
  description: PortableTextBlock[] // Portable Text
  technologies: string[]
  projectUrl?: string
  githubUrl?: string
  thumbnail: Image
  status: 'in-development' | 'completed' | 'archived' | 'planned-update'
  featured: boolean
}

export async function getProjects(): Promise<Project[]> {
  return await client.fetch(`
    *[_type == "project"] | order(featured desc) {
      _id,
      title,
      slug,
      shortDescription,
      description,
      technologies,
      projectUrl,
      githubUrl,
      thumbnail,
      status,
      featured
    }
  `)
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return await client.fetch(`
    *[_type == "project" && featured == true] | order(_createdAt desc) {
      _id,
      title,
      slug,
      shortDescription,
      technologies,
      projectUrl,
      githubUrl,
      thumbnail,
      status
    }
  `)
}
