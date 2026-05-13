import type { Metadata } from 'next'
import objectStudies from '../../../data/objectStudies.json'

type ObjectStudy = {
  title: string
  status: 'active' | 'draft' | 'staged' | 'archive'
  medium: string
  summary: string
  progression: string
  tags: string[]
  links: Array<{
    label: string
    href: string
  }>
}

const statusLabels: Record<ObjectStudy['status'], string> = {
  active: 'Active',
  draft: 'Draft',
  staged: 'Staged',
  archive: 'Archive'
}

export const metadata: Metadata = {
  title: 'Objects',
  description:
    '3D objects, visual studies, and project-progression records from Brandon Gottshall.'
}

export default function ObjectsPage() {
  const studies = objectStudies as ObjectStudy[]

  return (
    <main className='container mx-auto px-4 py-16'>
      <section className='mx-auto max-w-4xl'>
        <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red'>
          Objects
        </p>
        <h1 className='mt-3 max-w-3xl text-4xl font-light leading-tight tracking-tight text-navy dark:text-cream sm:text-6xl'>
          Visual things, with the path left visible.
        </h1>
        <p className='mt-5 max-w-3xl text-lg leading-8 text-gray-dark dark:text-tan'>
          This area is for modeled objects, visual systems, and interactive
          artifacts. The finished shape matters, but so does the progression
          that made it.
        </p>
      </section>

      <section className='mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3'>
        {studies.map((study) => (
          <article
            key={study.title}
            className='flex min-h-[22rem] flex-col rounded-2xl border border-navy/15 bg-white/85 p-6 dark:border-cream/20 dark:bg-navy-light/40'
          >
            <div className='flex flex-wrap items-center gap-3'>
              <span className='rounded-full bg-red/10 px-3 py-1 font-code text-xs font-semibold uppercase tracking-[0.18em] text-red'>
                {statusLabels[study.status]}
              </span>
            </div>
            <p className='mt-5 font-code text-xs font-semibold uppercase tracking-[0.18em] text-red'>
              {study.medium}
            </p>
            <h2 className='mt-3 text-2xl font-light tracking-tight text-navy dark:text-cream'>
              {study.title}
            </h2>
            <p className='mt-3 text-sm leading-6 text-gray-dark dark:text-tan'>
              {study.summary}
            </p>
            <p className='mt-4 text-sm leading-6 text-gray-dark dark:text-tan'>
              <span className='font-semibold text-navy dark:text-cream'>
                Progression:{' '}
              </span>
              {study.progression}
            </p>
            <div className='mt-auto flex flex-wrap gap-2 pt-5'>
              {study.tags.map((tag) => (
                <span
                  key={`${study.title}-${tag}`}
                  className='rounded-full bg-cream-dark px-3 py-1 text-xs text-navy dark:bg-navy/70 dark:text-cream'
                >
                  {tag}
                </span>
              ))}
            </div>
            {study.links.length > 0 && (
              <div className='mt-5 flex flex-wrap gap-3'>
                {study.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='rounded-full border border-navy/20 px-4 py-2 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-navy/5 dark:border-cream/20 dark:text-cream dark:hover:border-cream/40 dark:hover:bg-cream/5'
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>
    </main>
  )
}
