import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'About',
  description: 'A short orientation note for Brandon Gottshall’s field record.'
}

export default function AboutPage() {
  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='mx-auto max-w-4xl'>
        <div className='rounded-3xl border border-navy/10 bg-cream/40 p-8 dark:border-cream/10 dark:bg-navy-light/20 sm:p-12'>
          <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red'>
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
            <h2 className='font-code text-xs font-semibold uppercase tracking-[0.22em] text-red'>
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
            <h2 className='font-code text-xs font-semibold uppercase tracking-[0.22em] text-red'>
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
          <h2 className='font-code text-xs font-semibold uppercase tracking-[0.22em] text-red'>
            Background
          </h2>
          <p className='mt-4 text-base leading-7 text-gray-dark dark:text-tan'>
            Military service and software instruction are supporting context:
            they explain the preference for clear procedures, teachable systems,
            and repeatable work. The biography stays secondary to the record.
          </p>
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
