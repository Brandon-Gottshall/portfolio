import Link from 'next/link'
import {
  Download,
  ExternalLink,
  FileText,
  RefreshCw,
  ShieldCheck
} from 'lucide-react'
import { fetchAboutMeDocuments } from '@/services/about-me'
import type { AboutMeResponse } from '@/types/documents'

export const metadata = {
  title: 'Documents',
  description: 'Public resume and CV documents for Brandon Gottshall.'
}

export const revalidate = 1800

function formatGeneratedAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(date)
}

async function getDocuments(): Promise<AboutMeResponse | null> {
  try {
    return await fetchAboutMeDocuments()
  } catch (error) {
    console.error('Unable to load About-Me documents:', error)
    return null
  }
}

export default async function DocumentsPage() {
  const documents = await getDocuments()

  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='mx-auto max-w-5xl'>
        <section className='border-b border-navy/10 pb-10 dark:border-cream/10'>
          <p className='font-code text-sm font-semibold uppercase text-red-deep dark:text-red-soft'>
            Documents
          </p>
          <div className='mt-4 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end'>
            <div>
              <h1 className='text-4xl font-light leading-tight tracking-tight text-navy dark:text-cream sm:text-5xl'>
                Resume and CV.
              </h1>
              <p className='mt-5 max-w-2xl text-lg leading-8 text-gray-dark dark:text-tan'>
                Public career documents generated from the About-Me repository
                and published as versioned artifacts.
              </p>
            </div>
            <div className='rounded-2xl border border-navy/10 bg-white/70 p-5 dark:border-cream/10 dark:bg-navy/40'>
              <div className='flex items-center gap-3 text-navy dark:text-cream'>
                <ShieldCheck className='h-5 w-5 text-red-deep dark:text-red-soft' />
                <p className='font-code text-xs font-semibold uppercase'>
                  Public set
                </p>
              </div>
              <p className='mt-3 text-sm leading-6 text-gray-dark dark:text-tan'>
                Resume and CV are exposed here. Cover letters and specialty
                variants stay out of the public manifest.
              </p>
            </div>
          </div>
        </section>

        {documents ? (
          <>
            <section className='mt-10 grid gap-5 md:grid-cols-2'>
              {documents.documents.map((document) => (
                <article
                  key={document.type}
                  className='rounded-2xl border border-navy/10 bg-white/75 p-6 shadow-sm dark:border-cream/10 dark:bg-navy/40'
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div className='rounded-xl border border-navy/10 bg-cream/70 p-3 text-red dark:border-cream/10 dark:bg-navy-light/40'>
                      <FileText className='h-5 w-5' />
                    </div>
                    <span className='font-code text-xs font-semibold uppercase text-navy/55 dark:text-cream/55'>
                      {document.type}
                    </span>
                  </div>
                  <h2 className='mt-5 text-2xl font-semibold text-navy dark:text-cream'>
                    {document.title}
                  </h2>
                  <p className='mt-3 text-base leading-7 text-gray-dark dark:text-tan'>
                    {document.summary}
                  </p>
                  <div className='mt-6 flex flex-wrap gap-3'>
                    <a
                      href={document.pdfUrl}
                      target='_blank'
                      rel='noreferrer'
                      className='inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-cream transition hover:bg-navy-light dark:bg-cream dark:text-navy dark:hover:bg-cream/90'
                    >
                      <Download className='h-4 w-4' />
                      PDF
                    </a>
                    <a
                      href={document.htmlUrl}
                      target='_blank'
                      rel='noreferrer'
                      className='inline-flex items-center gap-2 rounded-full border border-navy/20 px-4 py-2 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-navy/5 dark:border-cream/20 dark:text-cream dark:hover:border-cream/40 dark:hover:bg-cream/5'
                    >
                      <ExternalLink className='h-4 w-4' />
                      HTML
                    </a>
                  </div>
                </article>
              ))}
            </section>

            <section className='mt-8 flex flex-wrap items-center gap-3 text-sm text-gray-dark dark:text-tan'>
              <RefreshCw className='h-4 w-4 text-red-deep dark:text-red-soft' />
              <span>Generated {formatGeneratedAt(documents.generatedAt)}</span>
              <a
                href={documents.sourceUrl}
                target='_blank'
                rel='noreferrer'
                className='font-semibold text-navy underline decoration-red/40 underline-offset-4 hover:text-red dark:text-cream'
              >
                Manifest
              </a>
            </section>
          </>
        ) : (
          <section className='mt-10 rounded-2xl border border-red/25 bg-red/5 p-6 dark:bg-red/10'>
            <h2 className='text-2xl font-semibold text-navy dark:text-cream'>
              Documents are temporarily unavailable.
            </h2>
            <p className='mt-3 max-w-2xl text-base leading-7 text-gray-dark dark:text-tan'>
              The public manifest could not be loaded. The document generator
              may be rebuilding or GitHub Pages may not have published the new
              artifact set yet.
            </p>
            <Link
              href='/about'
              className='mt-5 inline-flex items-center rounded-full border border-navy/20 px-4 py-2 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-navy/5 dark:border-cream/20 dark:text-cream dark:hover:border-cream/40 dark:hover:bg-cream/5'
            >
              About
            </Link>
          </section>
        )}
      </div>
    </div>
  )
}
