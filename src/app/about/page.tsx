import Link from 'next/link'
import { ArrowRight, Download, ExternalLink } from 'lucide-react'
import { fetchAboutMeDocuments } from '@/services/about-me'
import type { AboutMeResponse } from '@/types/documents'

export const metadata = {
  title: 'About',
  description:
    'Brandon Gottshall — software engineer, Marine Corps veteran, and technology instructor building learning systems and document tooling.'
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
    <div className='container mx-auto px-6 py-20'>
      <div className='mx-auto max-w-2xl'>
        <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red-deep dark:text-red-soft'>
          About
        </p>
        <h1 className='mt-3 text-4xl font-light leading-tight tracking-tight text-navy dark:text-cream sm:text-5xl'>
          Brandon Gottshall
        </h1>
        <p className='mt-6 text-xl leading-9 text-gray-dark dark:text-tan'>
          Software engineer and data science student in South Georgia. I build
          learning systems, document tooling, and interactive web experiences —
          and I keep the work public, with its status left visible.
        </p>

        <div className='mt-10 space-y-6 text-base leading-8 text-gray-dark dark:text-tan'>
          <p>
            I came to software from the Marine Corps, where I spent four years
            as an engineer electrical systems technician at MCAS Cherry Point —
            maintaining generators and power distribution, building micro-grids
            from AMMPS generators, and deploying to Incirlik Air Base in 2017,
            where another electrician and I kept the generator site, HVAC, and
            power distribution running for VMAQ-3&apos;s electronic-warfare
            operations against Da&apos;esh — carrying communications through
            live grid outages. I was later picked as a corporal to fill a
            sergeant&apos;s billet running the shop&apos;s maintenance
            scheduling, and finished my service as a quality-control NCO — which
            is where my habits around SOPs, checklists, and audit-ready work
            come from.
          </p>
          <p>
            Since then: a software engineering immersive at General Assembly,
            co-founding a small development agency in Brooklyn, teaching as an
            accredited technology instructor with Nebula Academy, and a year
            running Moons Out Labs, the systems arm of an Ohio media studio.
            Since March 2026 I run Scrutable&trade;, an independent software
            product practice — turning business data and operational reality
            into software people can actually use — while studying data science.
          </p>
          <p>
            This site is the working record of all of that — current systems,
            notes, and older traces, each marked with how finished it actually
            is. Every project links to its code, docs, or live surface.
          </p>
        </div>

        <section aria-labelledby='documents-heading' id='documents'>
          <h2
            id='documents-heading'
            className='mt-14 border-t border-navy/10 pt-10 font-code text-xs font-semibold uppercase tracking-[0.22em] text-red-deep dark:border-cream/10 dark:text-red-soft'
          >
            Resume &amp; CV
          </h2>
          {documents ? (
            <>
              <div className='mt-6 space-y-6'>
                {documents.documents.map((document) => (
                  <div
                    key={document.type}
                    className='flex flex-wrap items-center justify-between gap-4'
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
                Both are generated from the same source data and versioned with
                every change.
              </p>
            </>
          ) : (
            <p className='mt-5 text-base leading-7 text-gray-dark dark:text-tan'>
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

        <div className='mt-14 flex flex-wrap gap-3 border-t border-navy/10 pt-10 dark:border-cream/10'>
          <Link
            href='/projects'
            className='inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-cream transition hover:bg-navy-light dark:bg-cream dark:text-navy dark:hover:bg-cream/90'
          >
            See the work <ArrowRight className='h-4 w-4' />
          </Link>
          <Link
            href='/contact'
            className='inline-flex items-center gap-2 rounded-full border border-navy/20 px-5 py-3 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-navy/5 dark:border-cream/20 dark:text-cream dark:hover:border-cream/40 dark:hover:bg-cream/5'
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  )
}
