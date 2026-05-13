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

const statusLabels: Record<TimelineStatus, string> = {
  'active system': 'Current',
  'shipped rebuild': 'Shipped',
  'focused utility': 'Tool',
  'preserved original': 'Early',
  'historical artifact': 'Archive'
}

const entriesByTitle = new Map(timeline.map((entry) => [entry.title, entry]))

function getEntry(title: string) {
  const entry = entriesByTitle.get(title)

  if (!entry) {
    throw new Error(`Missing homepage proof artifact: ${title}`)
  }

  return entry
}

type ProofLane = {
  lane: string
  readerFit: string
  entry: TimelineEntry
  usefulFor: string[]
  useCase: string
  built: string
  inspect: string
}

const primaryProof: ProofLane[] = [
  {
    lane: 'Concept-learning systems',
    readerFit:
      'Reusable learning engine for products that need state, pacing, recovery, and persistence.',
    entry: getEntry('review-game-core'),
    usefulFor: ['Study products', 'Training flows', 'Workflow testing'],
    useCase:
      'A team needs a repeatable way to model concepts, plan review sessions, and recover user progress.',
    built:
      'TypeScript concept primitives, guided repetition policy, session contracts, persistence boundaries, docs, and tests.',
    inspect:
      'Package surface, product-framing docs, workflow contracts, tests, and deployed docs site.'
  },
  {
    lane: 'Structured document pipelines',
    readerFit:
      'Document automation for teams that need one trusted source feeding multiple outputs.',
    entry: getEntry('About-Me'),
    usefulFor: ['Document automation', 'Structured content', 'Validation'],
    useCase:
      'A repeatable document process needs source control, privacy checks, generated PDFs, and reusable exports.',
    built:
      'YAML content model, Python generator, schemas, CLI/Make targets, validation, PDF builds, and portfolio exports.',
    inspect:
      'Content model, generator package, schemas, provenance map, tests, and generated outputs.'
  },
  {
    lane: 'Interactive web experiences',
    readerFit:
      'Interactive presentation software for content that has to work live and remain inspectable later.',
    entry: getEntry('astronomy-future-compute'),
    usefulFor: [
      'Interactive content',
      'Presentation tooling',
      'Browser workflows'
    ],
    useCase:
      'A live talk needs stage, remote, and audience views without becoming a one-off slide deck.',
    built:
      'Next.js app with presentation modes, deployment config, preserved content structures, regression checks, and WF artifacts.',
    inspect:
      'Live site, case study, provenance notes, presentation architecture, and test assets.'
  }
]

const supportingProof: ProofLane[] = [
  {
    lane: 'Focused developer tooling',
    readerFit:
      'Small CLI utility with a narrow job, readable docs, and clear filesystem effects.',
    entry: getEntry('lfx'),
    usefulFor: ['CLI tooling', 'Config workflows', 'Developer setup'],
    useCase:
      'A repeated terminal setup task needs a command surface instead of scattered manual config edits.',
    built:
      'Go CLI for managing lf themes, icons, plugins, registry files, and install paths.',
    inspect:
      'Command surface, implementation, docs, registry layout, Homebrew install path, and security notes.'
  }
]

function ProofCard({ proof }: { proof: ProofLane }) {
  const { entry } = proof

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
        {proof.lane}
      </p>
      <h3 className='mt-2 text-2xl font-light tracking-tight text-navy dark:text-cream'>
        {entry.displayTitle ?? entry.title}
      </h3>
      <p className='mt-3 text-sm leading-6 text-gray-dark dark:text-tan'>
        {proof.readerFit}
      </p>

      <div className='mt-4 flex flex-wrap gap-2'>
        {proof.usefulFor.map((item) => (
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
            Use case:{' '}
          </span>
          {proof.useCase}
        </p>
        <p>
          <span className='font-semibold text-navy dark:text-cream'>
            Built:{' '}
          </span>
          {proof.built}
        </p>
        <p>
          <span className='font-semibold text-navy dark:text-cream'>
            Inspect:{' '}
          </span>
          {proof.inspect}
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

function ProofSection() {
  return (
    <section
      id='current-work'
      className='bg-cream-dark/80 py-16 dark:bg-navy/40'
    >
      <div className='container mx-auto px-6'>
        <div className='mx-auto mb-12 max-w-3xl text-center'>
          <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red'>
            Best public evidence
          </p>
          <h2 className='mt-3 text-3xl font-light tracking-tight text-navy dark:text-cream md:text-4xl'>
            Inspectable software for real product workflows.
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-dark dark:text-tan'>
            The main evidence is a learning-system kernel, a structured document
            pipeline, and an interactive presentation app. Each one gives a
            reviewer something concrete to inspect.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {primaryProof.map((proof) => (
            <ProofCard key={proof.entry.title} proof={proof} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SupportingProofSection() {
  return (
    <section className='bg-cream py-14 dark:bg-navy-darkest'>
      <div className='container mx-auto px-6'>
        <div className='grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-start'>
          <div>
            <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red'>
              Supporting signal
            </p>
            <h2 className='mt-3 text-3xl font-light tracking-tight text-navy dark:text-cream md:text-4xl'>
              A smaller tool shows the same habit at CLI scale.
            </h2>
          </div>
          <div className='grid gap-6'>
            {supportingProof.map((proof) => (
              <ProofCard key={proof.entry.title} proof={proof} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function LearningTrailSection() {
  return (
    <section className='bg-cream-dark/80 py-16 dark:bg-navy/40'>
      <div className='container mx-auto px-6'>
        <div className='grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start'>
          <div>
            <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red'>
              Notes and learning
            </p>
            <h2 className='mt-3 text-3xl font-light tracking-tight text-navy dark:text-cream md:text-4xl'>
              Technical direction with room for proof to grow.
            </h2>
          </div>
          <div className='space-y-5 text-lg leading-8 text-gray-dark dark:text-tan'>
            <p>
              Future notes belong here when they help a reader evaluate
              judgment: data science coursework, software design decisions,
              project writeups, and experiments with a clear artifact.
            </p>
            <p>
              Private work, loose affiliations, and speculative ideas stay out
              of the main evidence path until there is something concrete to
              inspect.
            </p>
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
            <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red'>
              Older work
            </p>
            <h2 className='mt-3 text-3xl font-light tracking-tight text-navy dark:text-cream md:text-4xl'>
              Useful background, clearly separated.
            </h2>
            <p className='mt-4 text-lg leading-8 text-gray-dark dark:text-tan'>
              Earlier projects are available for context when they show range,
              foundations, or product instincts. They are not presented as the
              strongest current proof.
            </p>
          </div>
          <Link
            href='/projects'
            className='inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-cream transition hover:bg-navy-light dark:bg-cream dark:text-navy dark:hover:bg-cream/90'
          >
            Browse project record <ArrowRight className='h-4 w-4' />
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
            Need practical software work with a clear handoff?
          </h2>
          <p className='mx-auto mt-4 max-w-xl text-lg leading-8 text-gray-dark dark:text-tan'>
            Available for projects where implementation quality, communication,
            and maintainability matter.
          </p>
          <div className='mt-7 flex flex-col justify-center gap-3 sm:flex-row'>
            <Link
              href='/contact'
              className='inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-cream transition hover:bg-navy-light dark:bg-cream dark:text-navy dark:hover:bg-cream/90'
            >
              Get in touch
            </Link>
            <Link
              href='/projects'
              className='inline-flex items-center justify-center gap-2 rounded-full border border-navy/20 px-6 py-3 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-navy/5 dark:border-cream/20 dark:text-cream dark:hover:border-cream/40 dark:hover:bg-cream/5'
            >
              See the work first
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

      <ProofSection />
      <SupportingProofSection />
      <LearningTrailSection />
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
