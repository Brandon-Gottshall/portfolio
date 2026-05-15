import { z } from 'zod'

export const aboutMeDocumentTypeSchema = z.enum(['resume', 'cv'])

export const aboutMeManifestDocumentSchema = z.object({
  type: aboutMeDocumentTypeSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  pdf: z.string().min(1),
  html: z.string().min(1)
})

export const aboutMeManifestSchema = z.object({
  version: z.literal(1),
  generatedAt: z.string().datetime(),
  documents: z.array(aboutMeManifestDocumentSchema).min(1)
})

export const aboutMeDocumentSchema = aboutMeManifestDocumentSchema.extend({
  pdfUrl: z.string().url(),
  htmlUrl: z.string().url()
})

export const aboutMeResponseSchema = z.object({
  version: z.literal(1),
  generatedAt: z.string().datetime(),
  sourceUrl: z.string().url(),
  documents: z.array(aboutMeDocumentSchema).min(1)
})

export type AboutMeDocument = z.infer<typeof aboutMeDocumentSchema>
export type AboutMeManifest = z.infer<typeof aboutMeManifestSchema>
export type AboutMeResponse = z.infer<typeof aboutMeResponseSchema>
