import { type Image, type PortableTextBlock } from 'sanity'

export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

export interface ProjectDocument extends SanityDocument {
  title: string
  slug: string
  shortDescription: string
  description: PortableTextBlock[]
  technologies: string[]
  projectUrl?: string
  githubUrl?: string
  thumbnail: Image
  status: 'in-development' | 'completed' | 'archived'
  featured: boolean
}
