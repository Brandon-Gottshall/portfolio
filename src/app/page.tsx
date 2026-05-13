import Link from 'next/link'
import React from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import HeroSection from '@/components/home/HeroSection'
import ProjectsSection from '@/components/home/ProjectsSection'
import getPayload from '@/payload/getPayload'
import { toProjectUI } from '@/types/ui'
import type { Project } from '@/types/payload-types'
import projectTimeline from '../../data/projectTimeline.json'
import fieldNotes from '../../data/fieldNotes.json'
import objectStudies from '../../data/objectStudies.json'

type TimelineStatus =
  | 'active system'
  | 'shipped rebuild'
  | 'focused utility'
  | 'preserved original'
  | 'historical artifact'

type TimelineEntry = {
  title: string
  displayTitle?: string
  period: string
  lane: string
  status: TimelineStatus
  summary: string
  whyItMatters: string
  intent: string
  links: Array<{
    label: string
    href: string
  }>
  tags: string[]
}

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

const timeline = projectTimeline as TimelineEntry[]
const notes = fieldNotes as FieldNote[]
const objects = objectStudies as ObjectStudy[]
const currentStatuses: TimelineStatus[] = [
  'active system',
  'shipped rebuild',
  'focused utility'
]
const archiveWork = timeline.filter(
  (entry) => !currentStatuses.includes(entry.status)
)

const statusLabels: Record<TimelineStatus, string> = {
  'active system': 'Current',
  'shipped rebuild': 'Shipped',
  'focused utility': 'Tool',
  'preserved original': 'Early',
  'historical artifact': 'Archive'
}

const recordStatusLabels: Record<FieldNote['status'], string> = {
  active: 'Active',
  draft: 'Draft',
  staged: 'Staged',
  archive: 'Archive'
}

const entriesByTitle = new Map(timeline.map((entry) => [entry.title, entry]))

function getEntry(title: string) {
  const entry = entriesByTitle.get(title)

  if (!entry) {
    throw new Error(`Missing homepage work artifact: ${title}`)
  }

  return entry
}

type WorkLane = {
  lane: string
  readerFit: string
  entry: TimelineEntry
  threads: string[]
  shape: string
  made: string
  record: string
}

const primaryWork: WorkLane[] = [
  {
    lane: 'Concept-learning systems',
    readerFit:
      'A learning-system kernel where concepts, timing, state, and recovery are treated as one design problem.',
    entry: getEntry('review-game-core'),
    threads: ['Study systems', 'State', 'Workflow tests'],
    shape:
      'Concepts, review timing, session state, and documentation are being shaped together instead of as separate app features.',
    made: 'TypeScript concept primitives, guided repetition policy, session contracts, persistence boundaries, docs, and tests.',
    record:
      'Package surface, product-framing docs, workflow contracts, tests, and deployed docs site.'
  },
  {
    lane: 'Structured document pipelines',
    readerFit:
      'A document-making system where source material, generated outputs, and revision trails stay connected.',
    entry: getEntry('About-Me'),
    threads: ['Documents', 'Structured content', 'Validation'],
    shape:
      'Career documents become a small publishing system: source data, privacy boundaries, generated PDFs, and reusable exports.',
    made: 'YAML content model, Python generator, schemas, CLI/Make targets, validation, PDF builds, and portfolio exports.',
    record:
      'Content model, generator package, schemas, provenance map, tests, and generated outputs.'
  },
  {
    lane: 'Interactive web experiences',
    readerFit:
      'A presentation rebuilt as a navigable object instead of a static deck.',
    entry: getEntry('astronomy-future-compute'),
    threads: ['Interactive content', 'Presentation tools', 'Browser flows'],
    shape:
      'The project keeps the live talk, audience view, and preserved artifact in the same web surface.',
    made: 'Next.js app with presentation modes, deployment config, preserved content structures, regression checks, and WF artifacts.',
    record:
      'Live site, case study, provenance notes, presentation architecture, and test assets.'
  }
]

const supportingWork: WorkLane[] = [
  {
    lane: 'Focused developer tooling',
    readerFit: 'A small terminal tool for a repeated local setup problem.',
    entry: getEntry('lfx'),
    threads: ['CLI tooling', 'Config', 'Developer setup'],
    shape:
      'A repeated terminal setup task becomes a command surface instead of scattered manual config edits.',
    made: 'Go CLI for managing lf themes, icons, plugins, registry files, and install paths.',
    record:
      'Command surface, implementation, docs, registry layout, Homebrew install path, and security notes.'
  }
]

function WorkCard({ work }: { work: WorkLane }) {
  const { entry } = work

  return (
    <article className='flex h-full flex-col rounded-2xl border border-navy/15 bg-white/85 p-6 shadow-sm dark:border-cream/20 dark:bg-navy-light/40'>
      <div className='flex flex-wrap items-center gap-3'>
        <span className='rounded-full bg-red/10 px-3 py-1 font-code text-xs font-semibold uppercase tracking-[0.18em] text-red'>
          {statusLabels[entry.status]}
        </span>
        <span className='text-sm text-gray-dark dark:text-tan'>
          {entry.period}
        </span>
      </div>

      <p className='mt-5 font-code text-xs font-semibold uppercase tracking-[0.18em] text-red'>
        {work.lane}
      </p>
      <h3 className='mt-2 text-2xl font-light tracking-tight text-navy dark:text-cream'>
        {entry.displayTitle ?? entry.title}
      </h3>
      <p className='mt-3 text-sm leading-6 text-gray-dark dark:text-tan'>
        {work.readerFit}
      </p>

      <div className='mt-4 flex flex-wrap gap-2'>
        {work.threads.map((item) => (
          <span
            key={`${entry.title}-${item}`}
            className='rounded-full bg-red/10 px-3 py-1 text-xs font-medium text-red dark:bg-red/15'
          >
            {item}
          </span>
        ))}
      </div>

      <div className='mt-5 space-y-3 text-sm leading-6 text-gray-dark dark:text-tan'>
        <p>
          <span className='font-semibold text-navy dark:text-cream'>
            Shape:{' '}
          </span>
          {work.shape}
        </p>
        <p>
          <span className='font-semibold text-navy dark:text-cream'>
            Made:{' '}
          </span>
          {work.made}
        </p>
        <p>
          <span className='font-semibold text-navy dark:text-cream'>
            Record:{' '}
          </span>
          {work.record}
        </p>
      </div>

      <div className='mt-5 flex flex-wrap gap-2'>
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className='rounded-full bg-cream-dark px-3 py-1 text-xs text-navy dark:bg-navy/70 dark:text-cream'
          >
            {tag}
          </span>
        ))}
      </div>

      {entry.links.length > 0 && (
        <div className='mt-auto flex flex-wrap gap-3 pt-6'>
          {entry.links.map((link) => (
            <a
              key={`${entry.title}-${link.href}`}
              href={link.href}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 rounded-full border border-navy/20 px-4 py-2 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-navy/5 dark:border-cream/20 dark:text-cream dark:hover:border-cream/40 dark:hover:bg-cream/5'
            >
              {link.label} <ExternalLink className='h-3.5 w-3.5' />
            </a>
          ))}
        </div>
      )}
    </article>
  )
}

function WorkSection() {
  return (
    <section
      id='current-work'
      className='bg-cream-dark/80 py-16 dark:bg-navy/40'
    >
      <div className='container mx-auto px-6'>
        <div className='mx-auto mb-12 max-w-3xl text-center'>
          <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red'>
            Work
          </p>
          <h2 className='mt-3 text-3xl font-light tracking-tight text-navy dark:text-cream md:text-4xl'>
            Working systems and shaped artifacts.
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-dark dark:text-tan'>
            Software sits here when it has enough shape to leave a record: code,
            docs, a deployed surface, a workflow, or a visible trail of
            decisions.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {primaryWork.map((work) => (
            <WorkCard key={work.entry.title} work={work} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ToolingSection() {
  return (
    <section className='bg-cream py-14 dark:bg-navy-darkest'>
      <div className='container mx-auto px-6'>
        <div className='grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-start'>
          <div>
            <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red'>
              Tooling
            </p>
            <h2 className='mt-3 text-3xl font-light tracking-tight text-navy dark:text-cream md:text-4xl'>
              Smaller tools keep their own scale.
            </h2>
          </div>
          <div className='grid gap-6'>
            {supportingWork.map((work) => (
              <WorkCard key={work.entry.title} work={work} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function LearningTrailSection() {
  const visibleNotes = notes.slice(0, 3)

  return (
    <section className='bg-cream-dark/80 py-16 dark:bg-navy/40'>
      <div className='container mx-auto px-6'>
        <div className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red'>
              Notes
            </p>
            <h2 className='mt-3 max-w-3xl text-3xl font-light tracking-tight text-navy dark:text-cream md:text-4xl'>
              Questions, research trails, and unfinished thoughts.
            </h2>
          </div>
          <Link
            href='/notes'
            className='inline-flex items-center gap-2 rounded-full border border-navy/20 px-5 py-3 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-navy/5 dark:border-cream/20 dark:text-cream dark:hover:border-cream/40 dark:hover:bg-cream/5'
          >
            Open notes <ArrowRight className='h-4 w-4' />
          </Link>
        </div>

        <div className='mt-10 grid gap-6 md:grid-cols-3'>
          {visibleNotes.map((note) => (
            <article
              key={note.title}
              className='rounded-2xl border border-navy/15 bg-white/80 p-5 dark:border-cream/20 dark:bg-navy-light/40'
            >
              <div className='flex flex-wrap items-center gap-3'>
                <span className='rounded-full bg-red/10 px-3 py-1 font-code text-xs font-semibold uppercase tracking-[0.18em] text-red'>
                  {recordStatusLabels[note.status]}
                </span>
                <span className='text-sm text-gray-dark dark:text-tan'>
                  {note.kind}
                </span>
              </div>
              <h3 className='mt-4 text-xl font-light text-navy dark:text-cream'>
                {note.title}
              </h3>
              <p className='mt-3 text-sm leading-6 text-gray-dark dark:text-tan'>
                {note.summary}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ObjectStudiesSection() {
  const visibleObjects = objects.slice(0, 3)

  return (
    <section className='bg-cream py-16 dark:bg-navy-darkest'>
      <div className='container mx-auto px-6'>
        <div className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red'>
              Objects
            </p>
            <h2 className='mt-3 max-w-3xl text-3xl font-light tracking-tight text-navy dark:text-cream md:text-4xl'>
              Visual studies with the path left visible.
            </h2>
          </div>
          <Link
            href='/objects'
            className='inline-flex items-center gap-2 rounded-full border border-navy/20 px-5 py-3 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-navy/5 dark:border-cream/20 dark:text-cream dark:hover:border-cream/40 dark:hover:bg-cream/5'
          >
            Open objects <ArrowRight className='h-4 w-4' />
          </Link>
        </div>

        <div className='mt-10 grid gap-6 md:grid-cols-3'>
          {visibleObjects.map((study) => (
            <article
              key={study.title}
              className='rounded-2xl border border-navy/15 bg-white/80 p-5 dark:border-cream/20 dark:bg-navy-light/40'
            >
              <span className='rounded-full bg-red/10 px-3 py-1 font-code text-xs font-semibold uppercase tracking-[0.18em] text-red'>
                {recordStatusLabels[study.status]}
              </span>
              <p className='mt-5 font-code text-xs font-semibold uppercase tracking-[0.18em] text-red'>
                {study.medium}
              </p>
              <h3 className='mt-3 text-xl font-light text-navy dark:text-cream'>
                {study.title}
              </h3>
              <p className='mt-3 text-sm leading-6 text-gray-dark dark:text-tan'>
                {study.progression}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ArchiveSection() {
  const visibleArchive = archiveWork.slice(0, 3)

  return (
    <section className='bg-cream py-16 dark:bg-navy-darkest'>
      <div className='container mx-auto px-6'>
        <div className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
          <div className='max-w-3xl'>
            <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red'>
              Archive
            </p>
            <h2 className='mt-3 text-3xl font-light tracking-tight text-navy dark:text-cream md:text-4xl'>
              Older traces stay in the record.
            </h2>
            <p className='mt-4 text-lg leading-8 text-gray-dark dark:text-tan'>
              Earlier projects remain visible when they show a direction,
              texture, or recurring interest that still belongs to the larger
              record.
            </p>
          </div>
          <Link
            href='/projects'
            className='inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-cream transition hover:bg-navy-light dark:bg-cream dark:text-navy dark:hover:bg-cream/90'
          >
            Open work <ArrowRight className='h-4 w-4' />
          </Link>
        </div>

        <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-3'>
          {visibleArchive.map((entry) => (
            <article
              key={entry.title}
              className='rounded-2xl border border-navy/15 bg-white/80 p-5 dark:border-cream/20 dark:bg-navy-light/40'
            >
              <div className='flex items-center justify-between gap-3'>
                <span className='rounded-full bg-cream-dark px-3 py-1 font-code text-xs uppercase tracking-[0.18em] text-navy dark:bg-navy/70 dark:text-cream'>
                  {statusLabels[entry.status]}
                </span>
                <span className='text-sm text-gray-dark dark:text-tan'>
                  {entry.period}
                </span>
              </div>
              <h3 className='mt-4 text-xl font-light text-navy dark:text-cream'>
                {entry.displayTitle ?? entry.title}
              </h3>
              <p className='mt-3 text-sm leading-6 text-gray-dark dark:text-tan'>
                {entry.intent}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className='bg-cream py-20 dark:bg-navy-darkest'>
      <div className='container mx-auto px-6'>
        <div className='mx-auto max-w-3xl rounded-2xl border border-navy/15 bg-white/80 p-8 text-center dark:border-cream/15 dark:bg-navy-light/30 md:p-12'>
          <h2 className='text-3xl font-light tracking-tight text-navy dark:text-cream md:text-4xl'>
            Channels stay simple.
          </h2>
          <p className='mx-auto mt-4 max-w-xl text-lg leading-8 text-gray-dark dark:text-tan'>
            Email, GitHub, and LinkedIn are collected in one place.
          </p>
          <div className='mt-7 flex flex-col justify-center gap-3 sm:flex-row'>
            <Link
              href='/contact'
              className='inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-cream transition hover:bg-navy-light dark:bg-cream dark:text-navy dark:hover:bg-cream/90'
            >
              Contact
            </Link>
            <Link
              href='/notes'
              className='inline-flex items-center justify-center gap-2 rounded-full border border-navy/20 px-6 py-3 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-navy/5 dark:border-cream/20 dark:text-cream dark:hover:border-cream/40 dark:hover:bg-cream/5'
            >
              Read notes
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function HomeShell({
  projects
}: {
  projects: ReturnType<typeof toProjectUI>[]
}) {
  return (
    <main className='min-h-screen bg-cream dark:bg-navy-darkest'>
      <HeroSection />

      <WorkSection />
      <ToolingSection />
      <LearningTrailSection />
      <ObjectStudiesSection />
      <ArchiveSection />
      {projects.length > 0 && <ProjectsSection projects={projects} />}
      <ContactSection />
    </main>
  )
}

export default async function Home() {
  let uiProjects: ReturnType<typeof toProjectUI>[] = []

  try {
    const payload = await getPayload()
    const { docs: projects } = await payload.find<Project>({
      collection: 'projects',
      where: {
        featured: {
          equals: true
        }
      },
      depth: 1
    })
    uiProjects = projects.map(toProjectUI)
  } catch (error) {
    console.error('Error fetching projects:', error)
  }

  return <HomeShell projects={uiProjects} />
}
