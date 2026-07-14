import type { Metadata } from 'next'
import fieldNotes from '../../../data/fieldNotes.json'

type FieldNote = {
  title: string
  status: 'active' | 'draft' | 'staged' | 'archive'
  date: string
  kind: string
  summary: string
  tags: string[]
  links: Array<{
    label: string
    href: string
  }>
}

const statusLabels: Record<FieldNote['status'], string> = {
  active: 'Active',
  draft: 'Draft',
  staged: 'Staged',
  archive: 'Archive'
}

export const metadata: Metadata = {
  title: 'Notes',
  description:
    'Field notes, research logs, blog ideas, and build reflections from Brandon Gottshall.'
}

export default function NotesPage() {
  const notes = fieldNotes as FieldNote[]

  return (
    <main className='container mx-auto px-4 py-16'>
      <section className='mx-auto max-w-4xl'>
        <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red-deep dark:text-red-soft'>
          Notes
        </p>
        <h1 className='mt-3 max-w-3xl text-4xl font-light leading-tight tracking-tight text-navy dark:text-cream sm:text-6xl'>
          Questions, build logs, and unfinished trails.
        </h1>
        <p className='mt-5 max-w-3xl text-lg leading-8 text-gray-dark dark:text-tan'>
          This is the low-polish part of the record: research questions, project
          notes, fragments, and ideas kept visible while they are still becoming
          useful.
        </p>
      </section>

      <section className='mx-auto mt-12 grid max-w-5xl gap-6'>
        {notes.map((note) => (
          <article
            key={note.title}
            className='rounded-2xl border border-navy/15 bg-white/85 p-6 dark:border-cream/20 dark:bg-navy-light/40'
          >
            <div className='flex flex-wrap items-center gap-3'>
              <span className='rounded-full bg-red-deep/10 px-3 py-1 font-code text-xs font-semibold uppercase tracking-[0.18em] text-red-deep dark:bg-red-soft/10 dark:text-red-soft'>
                {statusLabels[note.status]}
              </span>
              <span className='text-sm text-gray-dark dark:text-tan'>
                {note.date}
              </span>
              <span className='text-sm text-gray-dark dark:text-tan'>
                {note.kind}
              </span>
            </div>
            <h2 className='mt-5 text-2xl font-light tracking-tight text-navy dark:text-cream'>
              {note.title}
            </h2>
            <p className='mt-3 text-base leading-7 text-gray-dark dark:text-tan'>
              {note.summary}
            </p>
            <div className='mt-5 flex flex-wrap gap-2'>
              {note.tags.map((tag) => (
                <span
                  key={`${note.title}-${tag}`}
                  className='rounded-full bg-cream-dark px-3 py-1 text-xs text-navy dark:bg-navy/70 dark:text-cream'
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
