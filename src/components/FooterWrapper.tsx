import { getLastCommitDate } from '@/lib/git-info'
import { Footer } from './Footer'

import type { JSX } from 'react'

export async function FooterWrapper (): Promise<JSX.Element> {
  const lastUpdated = getLastCommitDate()

  return <Footer lastUpdated={lastUpdated} />
}
