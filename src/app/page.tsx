import Link from 'next/link'
import React from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import HeroSection from '@/components/home/HeroSection'
import ProjectsSection from '@/components/home/ProjectsSection'
import getPayload from '@/payload/getPayload'
import { toProjectUI } from '@/types/ui'
import type { Project } from '@/types/payload-types'
import projectTimeline from '../../data/projectTimeline.json'

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

const timeline = projectTimeline as TimelineEntry[]
const currentStatuses: TimelineStatus[] = [
  'active system',
  'shipped rebuild',
  'focused utility'
]
const archiveWork = timeline.filter(
  (entry) => !currentStatuses.includes(entry.status)
)

// One vocabulary of statuses, used identically everywhere. "Tool" was a
// type masquerading as a status; the Tooling section already says it.
const statusLabels: Record<TimelineStatus, string> = {
  'active system': 'Current',
  'shipped rebuild': 'Shipped',
  'focused utility': 'Maintained',
  'preserved original': 'Early',
  'historical artifact': 'Archive'
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
        <span className='rounded-full bg-red-deep/10 px-3 py-1 font-code text-xs font-semibold uppercase tracking-[0.18em] text-red-deep dark:bg-red-soft/10 dark:text-red-soft'>
          {statusLabels[entry.status]}
        </span>
        <span className='text-sm text-gray-dark dark:text-tan'>
          {entry.period}
        </span>
      </div>

      <p className='mt-5 font-code text-xs font-semibold uppercase tracking-[0.18em] text-red-deep dark:text-red-soft'>
        {work.lane}
      </p>
      <h3 className='mt-2 text-2xl font-light tracking-tight text-navy dark:text-cream'>
        {entry.displayTitle ?? entry.title}
      </h3>
      <p className='mt-3 text-sm leading-6 text-gray-dark dark:text-tan'>
        {work.readerFit}
      </p>

      <div className='mt-5 space-y-3 text-sm leading-6 text-gray-dark dark:text-tan'>
        <p>
          <span className='font-semibold text-navy dark:text-cream'>
            Focus:{' '}
          </span>
          {work.shape}
        </p>
        <p>
          <span className='font-semibold text-navy dark:text-cream'>
            Built:{' '}
          </span>
          {work.made}
        </p>
        <p>
          <span className='font-semibold text-navy dark:text-cream'>
            In the record:{' '}
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
          <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red-deep dark:text-red-soft'>
            Work
          </p>
          <h2 className='mt-3 text-3xl font-light tracking-tight text-navy dark:text-cream md:text-4xl'>
            What is being built right now.
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-dark dark:text-tan'>
            Each card links to the code, docs, or live site — the proof is one
            click away.
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
            <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red-deep dark:text-red-soft'>
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

function ArchiveSection() {
  const visibleArchive = archiveWork.slice(0, 3)

  return (
    <section className='bg-cream py-16 dark:bg-navy-darkest'>
      <div className='container mx-auto px-6'>
        <div className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
          <div className='max-w-3xl'>
            <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red-deep dark:text-red-soft'>
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
            Get in touch.
          </h2>
          <p className='mx-auto mt-4 max-w-xl text-lg leading-8 text-gray-dark dark:text-tan'>
            Email is the fastest channel; GitHub and LinkedIn work too.
          </p>
          <div className='mt-7 flex flex-col justify-center gap-3 sm:flex-row'>
            <Link
              href='/contact'
              className='inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-cream transition hover:bg-navy-light dark:bg-cream dark:text-navy dark:hover:bg-cream/90'
            >
              Contact
            </Link>
            <Link
              href='/about'
              className='inline-flex items-center justify-center gap-2 rounded-full border border-navy/20 px-6 py-3 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-navy/5 dark:border-cream/20 dark:text-cream dark:hover:border-cream/40 dark:hover:bg-cream/5'
            >
              More about me
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
    <div className='min-h-screen bg-cream dark:bg-navy-darkest'>
      <HeroSection />

      <WorkSection />
      <ToolingSection />
      <ArchiveSection />
      {projects.length > 0 && <ProjectsSection projects={projects} />}
      <ContactSection />
    </div>
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
