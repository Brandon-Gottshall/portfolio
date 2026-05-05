import { z } from 'zod'

export const aboutMeDocumentSchema = z.object({
  type: z.enum(['resume', 'cv', 'cover-letter']),
  url: z.string().url(),
  lastModified: z.string().datetime(),
  contentHash: z.string().min(32),
  size: z.number().positive()
})

export const aboutMeResponseSchema = z.object({
  documents: z.array(aboutMeDocumentSchema),
  lastUpdated: z.string().datetime(),
  repoCommitHash: z.string().min(7)
})

export type AboutMeDocument = z.infer<typeof aboutMeDocumentSchema>
export type AboutMeResponse = z.infer<typeof aboutMeResponseSchema>
