import Link from 'next/link'
import { ArrowRight, Download, ExternalLink } from 'lucide-react'
import { fetchAboutMeDocuments } from '@/services/about-me'
import type { AboutMeResponse } from '@/types/documents'

export const metadata = {
  title: 'About',
  description: 'A short orientation note for Brandon Gottshall’s field record.'
}

export const revalidate = 1800

async function getDocuments(): Promise<AboutMeResponse | null> {
  try {
    return await fetchAboutMeDocuments()
  } catch (error) {
    console.error('Unable to load About-Me documents:', error)
    return null
  }
}

export default async function AboutPage() {
  const documents = await getDocuments()
  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='mx-auto max-w-4xl'>
        <div className='rounded-3xl border border-navy/10 bg-cream/40 p-8 dark:border-cream/10 dark:bg-navy-light/20 sm:p-12'>
          <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red-deep dark:text-red-soft'>
            About
          </p>
          <h1 className='max-w-3xl pt-3 text-4xl font-light leading-tight tracking-tight text-navy dark:text-cream sm:text-5xl'>
            This site is a record, not a pitch.
          </h1>
          <p className='max-w-3xl pt-5 text-lg leading-8 text-gray-dark dark:text-tan'>
            Brandon Gottshall is a software engineer and data science student
            keeping track of software systems, research notes, visual studies,
            and older artifacts that still explain the direction.
          </p>
        </div>

        <section className='mt-12 grid gap-6 md:grid-cols-2'>
          <div className='rounded-2xl border border-navy/10 bg-white/70 p-6 dark:border-cream/10 dark:bg-navy/40'>
            <h2 className='font-code text-xs font-semibold uppercase tracking-[0.22em] text-red-deep dark:text-red-soft'>
              Current threads
            </h2>
            <ul className='mt-4 space-y-3 text-base leading-7 text-gray-dark dark:text-tan'>
              <li>Learning systems, study tools, and review flows.</li>
              <li>
                Structured documents, generated artifacts, and repeatable
                publishing workflows.
              </li>
              <li>
                Visual systems, interactive presentations, and object studies.
              </li>
            </ul>
          </div>

          <div className='rounded-2xl border border-navy/10 bg-white/70 p-6 dark:border-cream/10 dark:bg-navy/40'>
            <h2 className='font-code text-xs font-semibold uppercase tracking-[0.22em] text-red-deep dark:text-red-soft'>
              How to read it
            </h2>
            <ul className='mt-4 space-y-3 text-base leading-7 text-gray-dark dark:text-tan'>
              <li>
                Work can be active, staged, draft, archive, or early context.
              </li>
              <li>Unfinished areas stay marked as unfinished.</li>
              <li>
                The record should show direction without pretending every item
                has the same maturity.
              </li>
            </ul>
          </div>
        </section>

        <section className='mt-12 rounded-2xl border border-navy/10 bg-white/70 p-6 dark:border-cream/10 dark:bg-navy/40'>
          <h2 className='font-code text-xs font-semibold uppercase tracking-[0.22em] text-red-deep dark:text-red-soft'>
            Background
          </h2>
          <p className='mt-4 text-base leading-7 text-gray-dark dark:text-tan'>
            Military service and software instruction are supporting context:
            they explain the preference for clear procedures, teachable systems,
            and repeatable work. The biography stays secondary to the record.
          </p>
        </section>

        <section
          id='documents'
          aria-labelledby='documents-heading'
          className='mt-12 rounded-2xl border border-navy/10 bg-white/70 p-6 dark:border-cream/10 dark:bg-navy/40'
        >
          <h2
            id='documents-heading'
            className='font-code text-xs font-semibold uppercase tracking-[0.22em] text-red-deep dark:text-red-soft'
          >
            Resume &amp; CV
          </h2>
          {documents ? (
            <>
              <div className='mt-4 space-y-4'>
                {documents.documents.map((document) => (
                  <div
                    key={document.type}
                    className='flex flex-wrap items-center justify-between gap-3'
                  >
                    <div className='min-w-[16rem] flex-1'>
                      <p className='font-semibold text-navy dark:text-cream'>
                        {document.title}
                      </p>
                      <p className='text-sm leading-6 text-gray-dark dark:text-tan'>
                        {document.summary}
                      </p>
                    </div>
                    <div className='flex shrink-0 gap-2'>
                      <a
                        href={document.pdfUrl}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-cream transition hover:bg-navy-light dark:bg-cream dark:text-navy dark:hover:bg-cream/90'
                      >
                        <Download className='h-4 w-4' /> PDF
                      </a>
                      <a
                        href={document.htmlUrl}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex items-center gap-2 rounded-full border border-navy/20 px-4 py-2 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-navy/5 dark:border-cream/20 dark:text-cream dark:hover:border-cream/40 dark:hover:bg-cream/5'
                      >
                        <ExternalLink className='h-4 w-4' /> HTML
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              <p className='mt-5 text-sm text-gray-dark dark:text-tan'>
                Versioned artifacts generated from the About-Me repository.
              </p>
            </>
          ) : (
            <p className='mt-4 text-base leading-7 text-gray-dark dark:text-tan'>
              Documents are temporarily unavailable while a new artifact set
              publishes. They are also on{' '}
              <a
                href='https://github.com/Brandon-Gottshall/About-Me'
                target='_blank'
                rel='noreferrer'
                className='font-semibold text-navy underline underline-offset-4 dark:text-cream'
              >
                GitHub
              </a>
              .
            </p>
          )}
        </section>

        <section className='mt-12 flex flex-wrap gap-3'>
          <Link
            href='/projects'
            className='inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-cream transition hover:bg-navy-light dark:bg-cream dark:text-navy dark:hover:bg-cream/90'
          >
            Work <ArrowRight className='h-4 w-4' />
          </Link>
          <Link
            href='/notes'
            className='inline-flex items-center gap-2 rounded-full border border-navy/20 px-5 py-3 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-navy/5 dark:border-cream/20 dark:text-cream dark:hover:border-cream/40 dark:hover:bg-cream/5'
          >
            Notes
          </Link>
        </section>
      </div>
    </div>
  )
}
