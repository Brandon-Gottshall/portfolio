import timeline from '../../../data/projectTimeline.json'

type TimelineStatus =
  | 'active system'
  | 'shipped rebuild'
  | 'focused utility'
  | 'preserved original'
  | 'historical artifact'

type TimelineLink = {
  label: string
  href: string
}

type TimelineProject = {
  title: string
  period: string
  lane: string
  status: TimelineStatus
  summary: string
  whyItMatters: string
  intent: string
  links: TimelineLink[]
  tags: string[]
}

const statusStyles: Record<TimelineStatus, string> = {
  'active system': 'border-red-500 bg-red-500 text-white',
  'shipped rebuild':
    'border-navy bg-navy text-white dark:border-cream dark:bg-cream dark:text-navy',
  'focused utility': 'border-blue bg-blue text-white',
  'preserved original':
    'border-red-500 bg-white text-red-500 dark:bg-navy-light/30',
  'historical artifact':
    'border-gray bg-white text-gray-dark dark:bg-navy-light/30 dark:text-tan'
}

function LinkList({ links }: { links: TimelineLink[] }) {
  return (
    <div className='flex flex-wrap gap-3 pt-5'>
      {links.map((link) => (
        <a
          key={link.href}
          className='rounded-full border border-navy/10 px-4 py-2 text-sm font-semibold text-blue transition hover:border-blue hover:bg-blue hover:text-white dark:border-cream/20 dark:text-cream dark:hover:border-blue dark:hover:bg-blue'
          href={link.href}
          target='_blank'
          rel='noopener noreferrer'
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

function TimelineCard({
  project,
  index
}: {
  project: TimelineProject
  index: number
}) {
  return (
    <article className='relative overflow-hidden rounded-2xl border border-navy/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-cream/10 dark:bg-navy-light/30 sm:grid sm:grid-cols-3 sm:gap-6'>
      <div className='absolute left-0 top-0 h-full w-2 bg-red-500' />
      <div className='pl-2'>
        <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-gray dark:text-tan'>
          {project.period}
        </p>
        <h2 className='pt-3 text-3xl font-light tracking-tight text-navy dark:text-cream'>
          {project.title}
        </h2>
        <p className='pt-2 text-sm font-semibold text-gray-dark dark:text-tan'>
          {project.lane}
        </p>
        <span
          className={`mt-5 inline-flex rounded-full border px-3 py-1 font-code text-xs font-semibold uppercase tracking-[0.18em] ${statusStyles[project.status]}`}
        >
          {project.status}
        </span>
      </div>

      <div className='pt-6 sm:col-span-2 sm:pt-0'>
        <p className='text-lg leading-8 text-navy dark:text-cream'>
          {project.summary}
        </p>
        <div className='grid gap-5 pt-6 md:grid-cols-2'>
          <div>
            <h3 className='font-code text-xs font-semibold uppercase tracking-[0.22em] text-red-500'>
              Why it stays
            </h3>
            <p className='pt-2 text-sm leading-6 text-gray-dark dark:text-tan'>
              {project.whyItMatters}
            </p>
          </div>
          <div>
            <h3 className='font-code text-xs font-semibold uppercase tracking-[0.22em] text-red-500'>
              Intent
            </h3>
            <p className='pt-2 text-sm leading-6 text-gray-dark dark:text-tan'>
              {project.intent}
            </p>
          </div>
        </div>
        <div className='flex flex-wrap gap-2 pt-5'>
          {project.tags.map((tag) => (
            <span
              className='rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold text-gray-dark dark:bg-cream/10 dark:text-tan'
              key={`${project.title}-${tag}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <LinkList links={project.links} />
      </div>

      <div className='absolute -bottom-5 -right-1 font-code text-7xl font-black text-red-500/10'>
        {String(index + 1).padStart(2, '0')}
      </div>
    </article>
  )
}

export default function ChronologicalFeed() {
  const projects = timeline as TimelineProject[]

  return (
    <section className='w-full'>
      <div className='rounded-3xl border border-navy/10 bg-cream/40 p-6 dark:border-cream/10 dark:bg-navy-light/20 sm:p-10'>
        <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red-500'>
          Chronological portfolio
        </p>
        <h1 className='max-w-4xl pt-3 text-4xl font-light leading-tight tracking-tight text-navy dark:text-cream sm:text-6xl'>
          Current systems first. Historical work with context.
        </h1>
        <p className='max-w-3xl pt-5 text-lg leading-8 text-gray-dark dark:text-tan'>
          This feed is the public reading order for active systems, shipped
          rebuilds, focused utilities, and historical artifacts that still
          explain the direction.
        </p>
        <div className='grid gap-4 pt-8 text-sm text-gray-dark dark:text-tan sm:grid-cols-3'>
          <div className='rounded-2xl border border-navy/10 bg-white/70 p-4 dark:border-cream/10 dark:bg-navy/40'>
            <span className='block font-code text-2xl font-black text-red-500'>
              01
            </span>
            Lead with maintained systems and deployed work.
          </div>
          <div className='rounded-2xl border border-navy/10 bg-white/70 p-4 dark:border-cream/10 dark:bg-navy/40'>
            <span className='block font-code text-2xl font-black text-red-500'>
              02
            </span>
            Keep historical repos when they clarify the arc.
          </div>
          <div className='rounded-2xl border border-navy/10 bg-white/70 p-4 dark:border-cream/10 dark:bg-navy/40'>
            <span className='block font-code text-2xl font-black text-red-500'>
              03
            </span>
            Rebuild only when v2 improves the original vision.
          </div>
        </div>
      </div>

      <div className='grid gap-6 pt-8'>
        {projects.map((project, index) => (
          <TimelineCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}
