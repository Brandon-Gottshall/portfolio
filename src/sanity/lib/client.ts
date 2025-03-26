import { createClient } from '@sanity/client'
import type { SanityClient } from '@sanity/client'

import { apiVersion, dataset, projectId } from '../env'

// Configure the client with proper typing
export const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true // Set to false if statically generating pages, using ISR or tag-based revalidation
})
